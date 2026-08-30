import React, { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown, Type, Table2, ImageIcon } from 'lucide-react';
import ArchiveTable from './ArchiveTable';
import BlockForm from './editor/BlockForm';

export default function BlockCanvas({ section, sub, caseStudy, emptyLabel = 'Nothing here yet.' }) {
  const { editMode } = useAdmin();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const query = { section, sub };
    if (caseStudy) query.case_study = caseStudy;
    const list = await base44.entities.ContentBlock.filter(query, 'order');
    setBlocks(list.filter((b) => !b.is_deleted));
    setLoading(false);
  }, [section, sub, caseStudy]);

  useEffect(() => {
    setLoading(true); load();
    const handler = () => load();
    window.addEventListener('archive:reload', handler);
    return () => window.removeEventListener('archive:reload', handler);
  }, [load]);

  const save = async (draft) => {
    const { id, ...data } = draft;
    if (id) await base44.entities.ContentBlock.update(id, data);
    else await base44.entities.ContentBlock.create({ ...data, section, sub, case_study: caseStudy || 'all', order: blocks.length });
    setEditing(null);
    load();
  };

  const move = async (index, dir) => {
    const target = blocks[index + dir];
    if (!target) return;
    const current = blocks[index];
    await base44.entities.ContentBlock.bulkUpdate([
      { id: current.id, order: index + dir },
      { id: target.id, order: index },
    ]);
    load();
  };

  const remove = async (id) => {
    await base44.entities.ContentBlock.update(id, { is_deleted: true });
    load();
  };

  if (loading) return <div className="h-24 animate-pulse bg-black/[0.04] rounded" />;

  return (
    <div className="space-y-10">
      {blocks.length === 0 && !editMode && (
        <p className="text-foreground/40 italic">{emptyLabel}</p>
      )}

      {blocks.map((b, i) => (
        <article key={b.id} className="relative group">
          {editMode && (
            <div className="absolute -top-3 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-card border border-border rounded px-1 py-1">
              <button onClick={() => move(i, -1)} className="p-1.5 hover:text-[#6F551A]"><ArrowUp className="w-4 h-4" /></button>
              <button onClick={() => move(i, 1)} className="p-1.5 hover:text-[#6F551A]"><ArrowDown className="w-4 h-4" /></button>
              <button onClick={() => setEditing(b)} className="p-1.5 hover:text-[#6F551A]"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(b.id)} className="p-1.5 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}

          {b.title && <h3 className="font-display text-2xl md:text-3xl mb-4">{b.title}</h3>}

          {b.kind === 'table' && <ArchiveTable rows={b.rows} />}

          {b.kind === 'image' && b.image_url && (
            <figure className="glassine">
              <Image src={b.image_url} alt={b.caption || b.title || ''} className="w-full h-[300px] md:h-[460px] rounded-sm border border-border" fittingType="fit" />
              {b.caption && <figcaption className="mt-2 font-mono text-xs text-muted-foreground">{b.caption}</figcaption>}
            </figure>
          )}

          {(!b.kind || b.kind === 'text') && (
            <div className="prose-archive" dangerouslySetInnerHTML={{ __html: b.html || '' }} />
          )}
        </article>
      ))}

      {editMode && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-border">
          <Button variant="outline" size="sm" onClick={() => setEditing({ kind: 'text' })}>
            <Type className="w-3.5 h-3.5 mr-1.5" /> Text
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditing({ kind: 'table', rows: [['Column A', 'Column B'], ['', '']] })}>
            <Table2 className="w-3.5 h-3.5 mr-1.5" /> Table
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditing({ kind: 'image' })}>
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" /> Image
          </Button>
          <span className="chrono-eyebrow self-center ml-2 flex items-center gap-1"><Plus className="w-3 h-3" /> add a block</span>
        </div>
      )}

      <BlockForm open={!!editing} onOpenChange={(o) => !o && setEditing(null)} initial={editing} onSave={save} />
    </div>
  );
}