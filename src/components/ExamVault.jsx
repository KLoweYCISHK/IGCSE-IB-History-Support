import React, { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Image } from '@/components/ui/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ExamItemForm from './ExamItemForm';

export default function ExamVault({ section, caseStudy, title = 'The Exam Vault', description }) {
  const { editMode } = useAdmin();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const query = { section };
    if (caseStudy) query.case_study = caseStudy;
    setItems(await base44.entities.ExamItem.filter(query, 'order'));
  }, [section, caseStudy]);

  useEffect(() => { load(); }, [load]);

  const save = async (draft) => {
    const { id, ...data } = draft;
    if (id) await base44.entities.ExamItem.update(id, data);
    else await base44.entities.ExamItem.create({ ...data, section, case_study: caseStudy || 'all', order: items.length });
    setEditing(null);
    load();
  };

  return (
    <section className="py-16 md:py-24 border-t border-border">
      <SectionHeading
        eyebrow="Examination"
        title={title}
        description={description || 'How to approach each question, with worked examples and mark schemes.'}
        right={editMode ? (
          <Button variant="outline" onClick={() => setEditing({})}><Plus className="w-4 h-4 mr-1.5" /> Add question</Button>
        ) : null}
      />

      {items.length === 0 ? (
        <p className="text-foreground/40 italic">No exam guidance added yet.</p>
      ) : (
        <Accordion type="single" collapsible className="border-t border-border">
          {items.map((item, i) => (
            <AccordionItem key={item.id} value={item.id} className="border-b border-border">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-[#c9564a]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-2xl leading-snug">{item.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-10">
                <div className="grid md:grid-cols-2 gap-10">
                  <div>
                    <p className="chrono-eyebrow mb-3">The approach</p>
                    <div className="prose-archive" dangerouslySetInnerHTML={{ __html: item.approach || '<p>—</p>' }} />
                  </div>
                  <div className="md:border-l md:border-border md:pl-10">
                    <p className="chrono-eyebrow mb-3">Annotated example</p>
                    <div className="prose-archive" dangerouslySetInnerHTML={{ __html: item.example || '<p>—</p>' }} />
                    {item.mark_scheme && (
                      <>
                        <p className="chrono-eyebrow mt-8 mb-3">Mark scheme</p>
                        <div className="prose-archive" dangerouslySetInnerHTML={{ __html: item.mark_scheme }} />
                      </>
                    )}
                  </div>
                </div>
                {item.image_url && (
                  <Image src={item.image_url} alt="" className="mt-8 w-full h-[280px] md:h-[420px] rounded-sm border border-border" fittingType="fit" />
                )}
                {editMode && (
                  <div className="mt-6 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditing(item)}><Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
                    <Button size="sm" variant="ghost" onClick={async () => { await base44.entities.ExamItem.delete(item.id); load(); }}>
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <ExamItemForm open={!!editing} onOpenChange={(o) => !o && setEditing(null)} initial={editing} onSave={save} />
    </section>
  );
}