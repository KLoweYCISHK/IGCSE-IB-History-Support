import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RichTextEditor from './editor/RichTextEditor';
import ImageUploadField from './editor/ImageUploadField';

export default function ExamItemForm({ open, onOpenChange, initial, onSave }) {
  const [draft, setDraft] = useState(initial || {});
  useEffect(() => { if (open) setDraft(initial || {}); }, [open, initial]);
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">{initial?.id ? 'Edit question' : 'New exam question'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 py-2">
          <Input value={draft.question || ''} onChange={(e) => set('question', e.target.value)} placeholder="Question / question type" />
          <div className="space-y-2">
            <p className="chrono-eyebrow">How to approach it</p>
            <RichTextEditor value={draft.approach} onChange={(v) => set('approach', v)} />
          </div>
          <div className="space-y-2">
            <p className="chrono-eyebrow">Example answer</p>
            <RichTextEditor value={draft.example} onChange={(v) => set('example', v)} />
          </div>
          <div className="space-y-2">
            <p className="chrono-eyebrow">Mark scheme (optional)</p>
            <RichTextEditor value={draft.mark_scheme} onChange={(v) => set('mark_scheme', v)} />
          </div>
          <ImageUploadField value={draft.image_url} onChange={(v) => set('image_url', v)} label="Concept image (optional)" />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!draft.question} onClick={() => onSave(draft)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}