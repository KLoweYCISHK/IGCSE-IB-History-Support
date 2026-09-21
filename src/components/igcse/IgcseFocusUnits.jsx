import React, { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import IgcseFocusUnitForm from './IgcseFocusUnitForm';

export default function IgcseFocusUnits({ page, title = 'Focus units', description }) {
  const { editMode } = useAdmin();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await base44.entities.IgcseFocusUnit.filter({ page }, 'order');
      setUnits(list);
    } catch (e) {
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener('archive:reload', h);
    return () => window.removeEventListener('archive:reload', h);
  }, [load]);

  const save = async (draft) => {
    const { id, ...data } = draft;
    const cleanBullets = (Array.isArray(data.bullet_points) ? data.bullet_points : []).map((s) => s.trim()).filter(Boolean);
    const cleanContent = (Array.isArray(data.specified_content) ? data.specified_content : []).map((s) => s.trim()).filter(Boolean);
    const payload = { ...data, bullet_points: cleanBullets, specified_content: cleanContent, page };
    if (id) await base44.entities.IgcseFocusUnit.update(id, payload);
    else await base44.entities.IgcseFocusUnit.create({ ...payload, order: units.length });
    setEditing(null);
    load();
    window.dispatchEvent(new Event('archive:reload'));
  };

  const move = async (index, dir) => {
    const target = units[index + dir];
    if (!target) return;
    const current = units[index];
    await base44.entities.IgcseFocusUnit.bulkUpdate([
      { id: current.id, order: index + dir },
      { id: target.id, order: index },
    ]);
    load();
  };

  const remove = async (id) => {
    await base44.entities.IgcseFocusUnit.delete(id);
    load();
    window.dispatchEvent(new Event('archive:reload'));
  };

  return (
    <section className="py-16 md:py-20 border-t border-border">
      <SectionHeading
        eyebrow="Case studies"
        title={title}
        description={description}
        right={editMode ? (
          <Button variant="outline" size="sm" onClick={() => setEditing({})}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add focus unit
          </Button>
        ) : null}
      />

      {loading ? (
        <div className="h-24 animate-pulse bg-black/[0.04] rounded" />
      ) : units.length === 0 ? (
        editMode ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60">Add your first focus unit — it will also appear as a topic in the Paper 1 question bank.</p>
        ) : null
      ) : (
        <div className="border border-border rounded-sm overflow-hidden bg-card divide-y divide-border">
          {units.map((u, i) => (
            <div key={u.id} className="group relative px-6 py-5">
              {editMode && (
                <div className="absolute top-1/2 -translate-y-1/2 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-card border border-border rounded px-1 py-1">
                  <button onClick={() => move(i, -1)} className="p-1.5 hover:text-[#6F551A]"><ArrowUp className="w-4 h-4" /></button>
                  <button onClick={() => move(i, 1)} className="p-1.5 hover:text-[#6F551A]"><ArrowDown className="w-4 h-4" /></button>
                  <button onClick={() => setEditing(u)} className="p-1.5 hover:text-[#6F551A]"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(u.id)} className="p-1.5 hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
              <p className="font-display text-xl leading-snug pr-24">{u.focus_unit}</p>
            </div>
          ))}
        </div>
      )}

      <IgcseFocusUnitForm open={!!editing} onOpenChange={(o) => !o && setEditing(null)} initial={editing} onSave={save} />
    </section>
  );
}