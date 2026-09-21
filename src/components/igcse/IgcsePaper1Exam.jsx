import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import ExamApproachList from '@/components/exam/ExamApproachList';
import ArchiveTable from '@/components/ArchiveTable';
import IgcseExamForm from './IgcseExamForm';
import IgcseMarkSchemeTemplates from './IgcseMarkSchemeTemplates';
import { QUESTION_TYPES, genericLevels } from '@/lib/igcseMarkSchemes';

function QuestionCard({ q, i, editMode, onEdit, onDelete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="border border-border rounded-sm p-6 bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs text-[#6F551A]">{String(i + 1).padStart(2, '0')}</span>
          <h4 className="font-display text-xl leading-snug">{q.question}</h4>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0 justify-end items-center">
          {q.topic && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border rounded px-2 py-1">{q.topic}</span>
          )}
          <button
            onClick={() => setShow((s) => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-sm font-mono text-[10px] uppercase tracking-wider text-foreground/70 hover:text-[#6F551A] hover:border-[#6F551A] transition-colors"
          >
            {show ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Mark scheme</>}
          </button>
        </div>
      </div>
      {show && (
        <div className="mt-5">
          {q.mark_scheme_rows?.length
            ? <ArchiveTable rows={q.mark_scheme_rows} />
            : <p className="text-foreground/40 italic">No mark scheme yet.</p>}
        </div>
      )}
      {editMode && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(q)}><Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit</Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(q.id)}><Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete</Button>
        </div>
      )}
    </div>
  );
}

export default function IgcsePaper1Exam({ section = 'igcse_paper1', title = 'Paper 1', description }) {
  const { editMode } = useAdmin();
  const [items, setItems] = useState([]);
  const [templates, setTemplates] = useState({});
  const [qType, setQType] = useState('6_marker');
  const [topic, setTopic] = useState('all');
  const [editing, setEditing] = useState(null);

  const [focusUnits, setFocusUnits] = useState([]);
  const load = useCallback(async () => {
    setItems(await base44.entities.ExamItem.filter({ section }, 'order'));
    try {
      const list = await base44.entities.IgcseFocusUnit.list('order');
      setFocusUnits(list);
    } catch { setFocusUnits([]); }
    try {
      const list = await base44.entities.IgcseMarkSchemeTemplate.list();
      const t = {};
      list.forEach((r) => { if (r.rows?.length) t[r.question_type] = r.rows; });
      setTemplates(t);
    } catch { /* no templates yet */ }
  }, [section]);

  const genericFor = (type) => templates[type] || genericLevels(type);

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener('archive:reload', h);
    return () => window.removeEventListener('archive:reload', h);
  }, [load]);

  const approaches = items.filter((i) => i.category === 'approach' && (i.question_type || '') === qType);
  const questions = items.filter((i) => i.category === 'question' && (i.question_type || '') === qType);
  const topics = useMemo(() => focusUnits.map((u) => u.focus_unit).filter(Boolean), [focusUnits]);
  const filtered = topic === 'all' ? questions : questions.filter((q) => q.topic === topic);

  const save = async (draft) => {
    const { id, ...data } = draft;
    if (id) await base44.entities.ExamItem.update(id, data);
    else await base44.entities.ExamItem.create({ ...data, section, category: data.category || 'question', order: items.length });
    setEditing(null);
    load();
  };
  const del = async (id) => { await base44.entities.ExamItem.delete(id); load(); };

  return (
    <section className="py-16 md:py-24 border-t border-border">
      <SectionHeading
        eyebrow="Examination"
        title={title}
        description={description || 'The knowledge-based paper — how to approach each question type, a bank of practice questions, and reveal-the-mark-scheme study.'}
        right={editMode ? (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing({ category: 'approach', question_type: qType })}>
              <Plus className="w-4 h-4 mr-1.5" /> Add how-to
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEditing({ category: 'question', question_type: qType, mark_scheme_rows: genericFor(qType) })}>
              <Plus className="w-4 h-4 mr-1.5" /> Add question
            </Button>
          </div>
        ) : null}
      />

      <div className="inline-flex flex-wrap border border-border rounded-sm overflow-hidden mb-12">
        {QUESTION_TYPES.map((t, i) => (
          <button
            key={t.value}
            onClick={() => { setQType(t.value); setTopic('all'); }}
            className={`px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${i === QUESTION_TYPES.length - 1 ? '' : 'border-r border-border'} ${qType === t.value ? 'bg-[#6F551A] text-[#F4EFE3]' : 'text-foreground/60 hover:bg-black/[0.04]'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-14">
        <p className="chrono-eyebrow mb-4">How to approach</p>
        <ExamApproachList items={approaches} editMode={editMode} onEdit={setEditing} onDelete={del} />
      </div>

      <div>
        <p className="chrono-eyebrow mb-4">Question bank</p>
        {topics.length > 0 && (
          <div className="inline-flex flex-wrap border border-border rounded-sm overflow-hidden mb-8">
            <button
              onClick={() => setTopic('all')}
              className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] ${topic === 'all' ? 'bg-foreground text-background' : 'hover:bg-black/[0.04]'}`}
            >
              All topics
            </button>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] border-l border-border ${topic === t ? 'bg-foreground text-background' : 'hover:bg-black/[0.04]'}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
        {filtered.length === 0 ? (
          <p className="text-foreground/40 italic">No questions added yet.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((q, i) => (
              <QuestionCard key={q.id} q={q} i={i} editMode={editMode} onEdit={setEditing} onDelete={del} />
            ))}
          </div>
        )}
      </div>

      {editMode && <IgcseMarkSchemeTemplates />}

      <IgcseExamForm key={editing ? (editing.id || `${editing.category}-${editing.question_type}`) : 'none'} open={!!editing} onOpenChange={(o) => !o && setEditing(null)} initial={editing} onSave={save} genericLevelsFor={genericFor} topics={topics} />
    </section>
  );
}