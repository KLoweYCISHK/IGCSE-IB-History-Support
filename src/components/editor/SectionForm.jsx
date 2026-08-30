import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const slugify = (s) =>
  (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

export default function SectionForm({ open, onOpenChange, initial, onSave }) {
  const [draft, setDraft] = useState(initial || {});
  useEffect(() => { if (open) setDraft(initial || {}); }, [open, initial]);
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  const handleSave = () => {
    const out = { ...draft };
    if (!out.slug) out.slug = slugify(out.title) || `section_${Date.now()}`;
    onSave(out);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">{initial?.id ? 'Edit section' : 'New section'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <p className="chrono-eyebrow">Title</p>
            <Input value={draft.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="e.g. The Course" />
          </div>
          <div className="space-y-2">
            <p className="chrono-eyebrow">Eyebrow (optional)</p>
            <Input value={draft.eyebrow || ''} onChange={(e) => set('eyebrow', e.target.value)} placeholder="e.g. What we study" />
          </div>
          {!initial?.id && (
            <div className="space-y-2">
              <p className="chrono-eyebrow">Slug (auto from title)</p>
              <Input value={draft.slug || ''} onChange={(e) => set('slug', slugify(e.target.value))} placeholder="the_course" />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!draft.title?.trim()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}