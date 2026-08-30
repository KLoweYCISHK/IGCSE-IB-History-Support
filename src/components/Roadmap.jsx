import React, { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import BlockCanvas from './BlockCanvas';
import StepForm from './editor/StepForm';

const slugify = (t) => (t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'step';

export default function Roadmap({ section, stages }) {
  const { editMode } = useAdmin();
  const [allSteps, setAllSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStage, setActiveStage] = useState(stages[0]?.key);
  const [activeStepId, setActiveStepId] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const list = await base44.entities.RoadmapStep.filter({ page: section }, 'order');
    setAllSteps(list.filter((s) => !s.is_deleted));
    setLoading(false);
  }, [section]);

  useEffect(() => {
    setLoading(true); load();
    const handler = () => load();
    window.addEventListener('archive:reload', handler);
    return () => window.removeEventListener('archive:reload', handler);
  }, [load]);

  const stageSteps = allSteps.filter((s) => s.stage === activeStage);

  useEffect(() => {
    if (stageSteps.length && !stageSteps.find((s) => s.id === activeStepId)) {
      setActiveStepId(stageSteps[0].id);
    }
    if (!stageSteps.length && activeStepId) setActiveStepId(null);
  }, [activeStage, stageSteps.length, activeStepId]);

  const save = async (draft) => {
    const { id, ...data } = draft;
    if (id) {
      await base44.entities.RoadmapStep.update(id, data);
    } else {
      let slug = data.slug || slugify(data.title);
      if (allSteps.some((s) => s.slug === slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      await base44.entities.RoadmapStep.create({ ...data, page: section, stage: activeStage, slug, order: stageSteps.length });
    }
    setEditing(null);
    load();
  };

  const move = async (index, dir) => {
    const target = stageSteps[index + dir];
    if (!target) return;
    const current = stageSteps[index];
    await base44.entities.RoadmapStep.bulkUpdate([
      { id: current.id, order: index + dir },
      { id: target.id, order: index },
    ]);
    load();
  };

  const remove = async (s) => {
    await base44.entities.RoadmapStep.update(s.id, { is_deleted: true });
    load();
  };

  if (loading) return <div className="h-24 animate-pulse bg-black/[0.04] rounded" />;

  const stepIndex = stageSteps.findIndex((s) => s.id === activeStepId);
  const current = stageSteps[stepIndex];

  return (
    <div className="py-8">
      <div className="inline-flex flex-wrap border border-border rounded-sm overflow-hidden mb-10">
        {stages.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActiveStage(s.key)}
            className={`px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${i === stages.length - 1 ? '' : 'border-r border-border'} ${activeStage === s.key ? 'bg-[#6F551A] text-[#F4EFE3]' : 'text-foreground/60 hover:bg-black/[0.04]'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-10">
        {stageSteps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveStepId(s.id)}
            className={`px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] border border-border rounded-sm transition-colors ${activeStepId === s.id ? 'bg-[#6F551A] text-[#F4EFE3]' : 'text-foreground/60 hover:bg-black/[0.04]'}`}
          >
            Step {i + 1}
          </button>
        ))}
        {editMode && (
          <Button variant="outline" size="sm" onClick={() => setEditing({})} className="ml-1">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add step
          </Button>
        )}
      </div>

      {current && (
        <div className="relative group">
          {editMode && (
            <div className="absolute -top-3 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-card border border-border rounded px-1 py-1">
              <button onClick={() => move(stepIndex, -1)} className="p-1.5 hover:text-[#6F551A]"><ArrowUp className="w-4 h-4" /></button>
              <button onClick={() => move(stepIndex, 1)} className="p-1.5 hover:text-[#6F551A]"><ArrowDown className="w-4 h-4" /></button>
              <button onClick={() => setEditing(current)} className="p-1.5 hover:text-[#6F551A]"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(current)} className="p-1.5 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
          {current.subtitle && <p className="max-w-2xl text-foreground/60 leading-relaxed mb-3">{current.subtitle}</p>}
          <h2 className="font-display text-3xl md:text-4xl mb-8">Step {stepIndex + 1} – {current.title}</h2>
          <BlockCanvas section={section} sub={current.slug} emptyLabel="Ms Lowe hasn't added guidance to this step yet." />
        </div>
      )}

      {stageSteps.length === 0 && !editMode && (
        <p className="py-10 text-foreground/40 italic">Steps for this section coming soon.</p>
      )}

      <StepForm open={!!editing} onOpenChange={(o) => !o && setEditing(null)} initial={editing} onSave={save} />
    </div>
  );
}