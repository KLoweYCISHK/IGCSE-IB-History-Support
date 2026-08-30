import React, { useCallback, useEffect, useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { base44 } from '@/api/base44Client';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Pencil, Trash2, Plus, Type, Table2, ImageIcon, Link2, ExternalLink, GripVertical } from 'lucide-react';
import ArchiveTable from './ArchiveTable';
import BlockForm from './editor/BlockForm';
import { makeDroppableId } from '@/lib/blockDnd';
import { stripPasteArtifacts } from '@/lib/sanitizeHtml';

function ImageBlock({ b }) {
  const layout = b.image_layout || 'full';
  const hasText = !!b.html && b.html.replace(/<[^>]*>/g, '').trim().length > 0;

  if (layout === 'top' && hasText) {
    return (
      <div className="space-y-8 md:space-y-10">
        <figure className="glassine overflow-hidden rounded-sm border border-border">
          <Image
            src={b.image_url}
            alt={b.caption || b.title || ''}
            className="w-full h-[300px] md:h-[460px]"
            fittingType="fit"
          />
          {b.caption && <figcaption className="mt-2 font-mono text-xs text-muted-foreground">{b.caption}</figcaption>}
        </figure>
        <div className="prose-archive min-w-0" dangerouslySetInnerHTML={{ __html: stripPasteArtifacts(b.html) }} />
      </div>
    );
  }

  if (layout === 'full' || !hasText) {
    return (
      <figure className="glassine">
        <Image
          src={b.image_url}
          alt={b.caption || b.title || ''}
          className="w-full h-[300px] md:h-[460px] rounded-sm border border-border"
          fittingType="fit"
        />
        {b.caption && <figcaption className="mt-2 font-mono text-xs text-muted-foreground">{b.caption}</figcaption>}
      </figure>
    );
  }

  const imageEl = (
    <figure className="glassine overflow-hidden rounded-sm border border-border">
      <Image
        src={b.image_url}
        alt={b.caption || b.title || ''}
        className="w-full h-full min-h-[260px]"
        fittingType="fit"
      />
      {b.caption && <figcaption className="mt-2 font-mono text-xs text-muted-foreground">{b.caption}</figcaption>}
    </figure>
  );
  const textEl = <div className="prose-archive min-w-0" dangerouslySetInnerHTML={{ __html: stripPasteArtifacts(b.html) }} />;

  return (
    <div className={`grid gap-8 md:gap-10 items-start overflow-hidden ${layout === 'left' ? 'md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]' : 'md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]'}`}>
      {layout === 'left' ? (
        <>
          {imageEl}
          {textEl}
        </>
      ) : (
        <>
          {textEl}
          {imageEl}
        </>
      )}
    </div>
  );
}

export default function BlockCanvas({ section, sub, caseStudy, module, emptyLabel = 'Nothing here yet.' }) {
  const { editMode } = useAdmin();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const query = { section, sub };
    if (caseStudy) query.case_study = caseStudy;
    const list = await base44.entities.ContentBlock.filter(query, 'order');
    const visible = module
      ? list.filter((b) => !b.is_deleted && b.module === module)
      : list.filter((b) => !b.is_deleted);
    setBlocks(visible);
    setLoading(false);
  }, [section, sub, caseStudy, module]);

  useEffect(() => {
    setLoading(true); load();
    const handler = () => load();
    window.addEventListener('archive:reload', handler);
    return () => window.removeEventListener('archive:reload', handler);
  }, [load]);

  const save = async (draft) => {
    const { id, ...data } = draft;
    if (id) await base44.entities.ContentBlock.update(id, data);
    else await base44.entities.ContentBlock.create({ ...data, section, sub, case_study: caseStudy || 'all', module: module || 'all', order: blocks.length });
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await base44.entities.ContentBlock.update(id, { is_deleted: true });
    load();
  };

  if (loading) return <div className="h-24 animate-pulse bg-black/[0.04] rounded" />;

  const droppableId = makeDroppableId(section, sub, caseStudy, module);

  return (
    <Droppable droppableId={droppableId} isDropDisabled={!editMode}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-10">
          {blocks.length === 0 && !editMode && (
            <p className="text-foreground/40 italic">{emptyLabel}</p>
          )}

          {blocks.map((b, i) => (
            <Draggable key={b.id} draggableId={b.id} index={i} isDragDisabled={!editMode}>
              {(prov) => (
                <article
                  ref={prov.innerRef}
                  {...prov.draggableProps}
                  className="relative group"
                >
                  {editMode && (
                    <div className="absolute -top-3 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-card border border-border rounded px-1 py-1">
                      <span
                        {...prov.dragHandleProps}
                        title="Drag to reorder or move section"
                        className="p-1.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-[#6F551A]"
                      >
                        <GripVertical className="w-4 h-4" />
                      </span>
                      <button onClick={() => setEditing(b)} className="p-1.5 hover:text-[#6F551A]"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => remove(b.id)} className="p-1.5 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}

                  {b.title && b.kind !== 'link' && <h3 className="font-display text-2xl md:text-3xl mb-4">{b.title}</h3>}

                  {b.kind === 'table' && <ArchiveTable rows={b.rows} />}

                  {b.kind === 'image' && b.image_url && <ImageBlock b={b} />}

                  {b.kind === 'link' && b.link_url && (
                    <div className="space-y-3">
                      {b.caption && <p className="text-foreground/70">{b.caption}</p>}
                      <a
                        href={b.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/10 hover:border-accent/40"
                      >
                        <Link2 className="w-4 h-4 text-muted-foreground" />
                        {b.title || b.link_url}
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                      </a>
                    </div>
                  )}

                  {(!b.kind || b.kind === 'text') && (
                    <div className="prose-archive" dangerouslySetInnerHTML={{ __html: stripPasteArtifacts(b.html || '') }} />
                  )}
                </article>
              )}
            </Draggable>
          ))}

          {provided.placeholder}

          {editMode && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-border">
              <Button variant="outline" size="sm" onClick={() => setEditing({ kind: 'text' })}>
                <Type className="w-3.5 h-3.5 mr-1.5" /> Text
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing({ kind: 'table', rows: [['Column A', 'Column B'], ['', '']] })}>
                <Table2 className="w-3.5 h-3.5 mr-1.5" /> Table
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing({ kind: 'image', image_layout: 'full' })}>
                <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Image
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing({ kind: 'link' })}>
                <Link2 className="w-3.5 h-3.5 mr-1.5" /> Link
              </Button>
              <span className="chrono-eyebrow self-center ml-2 flex items-center gap-1"><Plus className="w-3 h-3" /> add a block · drag the handle to place it</span>
            </div>
          )}

          <BlockForm open={!!editing} onOpenChange={(o) => !o && setEditing(null)} initial={editing} onSave={save} />
        </div>
      )}
    </Droppable>
  );
}