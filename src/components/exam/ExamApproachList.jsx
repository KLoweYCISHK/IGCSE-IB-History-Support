import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export default function ExamApproachList({ items, editMode, onEdit, onDelete }) {
  if (items.length === 0) return <p className="text-foreground/40 italic">No approach guidance added yet.</p>;
  return (
    <Accordion type="single" collapsible className="border-t border-border">
      {items.map((item, i) => (
        <AccordionItem key={item.id} value={item.id} className="border-b border-border">
          <AccordionTrigger className="text-left hover:no-underline py-6">
            <span className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-[#6F551A]">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-2xl leading-snug">{item.question}</span>
              {item.time_minutes != null && (
                <span className="shrink-0 self-center whitespace-nowrap rounded-full border border-[#6F551A]/30 bg-[#6F551A]/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[#6F551A]">{item.time_minutes} min</span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <p className="chrono-eyebrow mb-3">How to approach it</p>
                <div className="prose-archive" dangerouslySetInnerHTML={{ __html: item.approach || '<p>—</p>' }} />
              </div>
              <div className="md:border-l md:border-border md:pl-10">
                <p className="chrono-eyebrow mb-3">Annotated example</p>
                <div className="prose-archive" dangerouslySetInnerHTML={{ __html: item.example || '<p>—</p>' }} />
              </div>
            </div>
            {editMode && (
              <div className="mt-6 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(item)}><Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(item.id)}><Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete</Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}