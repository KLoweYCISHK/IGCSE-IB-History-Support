import React, { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ExamItemForm from './ExamItemForm';
import ExamApproachList from './exam/ExamApproachList';
import ExamMarkSchemeList from './exam/ExamMarkSchemeList';
import ExamQuestionBank from './exam/ExamQuestionBank';

const TABS = [
  { key: 'approach', label: 'How to Approach' },
  { key: 'mark_scheme', label: 'Mark Schemes' },
  { key: 'question', label: 'Question Bank' },
];

export default function ExamVault({ section, caseStudy, title = 'The Exam Vault', description }) {
  const { editMode } = useAdmin();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [tab, setTab] = useState('approach');

  const load = useCallback(async () => {
    const query = { section };
    if (caseStudy) query.case_study = caseStudy;
    setItems(await base44.entities.ExamItem.filter(query, 'order'));
  }, [section, caseStudy]);

  useEffect(() => { load(); }, [load]);

  const save = async (draft) => {
    const { id, ...data } = draft;
    if (id) await base44.entities.ExamItem.update(id, data);
    else await base44.entities.ExamItem.create({ ...data, section, case_study: caseStudy || 'all', category: data.category || 'question', order: items.length });
    setEditing(null);
    load();
  };

  const del = async (id) => { await base44.entities.ExamItem.delete(id); load(); };
  const byCat = (c) => items.filter((i) => (i.category || 'question') === c);

  return (
    <section className="py-16 md:py-24 border-t border-border">
      <SectionHeading
        eyebrow="Examination"
        title={title}
        description={description || 'How to approach each question, mark schemes, and a bank of practice questions.'}
        right={editMode ? (
          <Button variant="outline" onClick={() => setEditing({ category: tab })}>
            <Plus className="w-4 h-4 mr-1.5" /> Add {TABS.find((t) => t.key === tab)?.label.toLowerCase().replace('the ', '')}
          </Button>
        ) : null}
      />

      <div className="inline-flex flex-wrap border border-border rounded-sm overflow-hidden mb-10">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${i === TABS.length - 1 ? '' : 'border-r border-border'} ${tab === t.key ? 'bg-[#6F551A] text-[#F4EFE3]' : 'text-foreground/60 hover:bg-black/[0.04]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'approach' && <ExamApproachList items={byCat('approach')} editMode={editMode} onEdit={setEditing} onDelete={del} />}
      {tab === 'mark_scheme' && <ExamMarkSchemeList items={byCat('mark_scheme')} editMode={editMode} onEdit={setEditing} onDelete={del} />}
      {tab === 'question' && <ExamQuestionBank items={byCat('question')} section={section} editMode={editMode} onEdit={setEditing} onDelete={del} />}

      <ExamItemForm open={!!editing} onOpenChange={(o) => !o && setEditing(null)} initial={editing} onSave={save} section={section} />
    </section>
  );
}