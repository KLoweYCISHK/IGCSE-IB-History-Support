import React, { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';
import { ExternalLink, Pencil, Trash2, Plus } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ResourceForm from './ResourceForm';

export default function ResourceLibrary({ section, caseStudy, module }) {
  const { editMode, isAdmin } = useAdmin();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const query = { section };
    if (caseStudy) query.case_study = caseStudy;
    const list = await base44.entities.Resource.filter(query, '-created_date');
    setItems(module ? list.filter((r) => !r.module || r.module === 'all' || r.module === module) : list);
  }, [section, caseStudy, module]);

  useEffect(() => { load(); }, [load]);

  const save = async (draft) => {
    const { id, ...data } = draft;
    if (id) await base44.entities.Resource.update(id, data);
    else {
      const payload = { ...data, section, case_study: caseStudy || 'all', is_student_submission: !isAdmin };
      if (module) payload.module = data.module || module;
      await base44.entities.Resource.create(payload);
    }
    setEditing(null);
    load();
  };

  return (
    <section className="py-16 md:py-24">
      <SectionHeading
        eyebrow="Useful resources"
        title="The Resource Vault"
        description="Curated documents, archives, videos and readings. Students may add a link they've found."
        right={
          <Button onClick={() => setEditing({})} className="bg-[#6F551A] hover:bg-[#5A4514] text-[#F4EFE3]">
            <Plus className="w-4 h-4 mr-1.5" /> Add a resource
          </Button>
        }
      />

      {items.length === 0 ? (
        <p className="text-foreground/40 italic">No resources yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((r) => (
            <div key={r.id} className="glassine group relative border border-border rounded-sm overflow-hidden bg-card">
              {r.image_url && (
                <Image src={r.image_url} alt={r.title} className="w-full h-40" />
              )}
              <div className="p-5">
                <h4 className="font-display text-xl leading-snug">{r.title}</h4>
                {r.description && <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{r.description}</p>}
                <div className="mt-4 flex items-center justify-between">
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6F551A] inline-flex items-center gap-1.5">
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <span />}
                  {r.is_student_submission && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      added by {r.submitted_by || 'a student'}
                    </span>
                  )}
                </div>
              </div>
              {editMode && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition bg-card/90 border border-border rounded">
                  <button onClick={() => setEditing(r)} className="p-1.5 hover:text-[#6F551A]"><Pencil className="w-4 h-4" /></button>
                  <button onClick={async () => { await base44.entities.Resource.delete(r.id); load(); }} className="p-1.5 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ResourceForm open={!!editing} onOpenChange={(o) => !o && setEditing(null)} initial={editing} onSave={save} module={module} />
    </section>
  );
}