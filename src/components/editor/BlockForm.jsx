import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RichTextEditor from './RichTextEditor';
import TableEditor from './TableEditor';
import ImageUploadField from './ImageUploadField';

export default function BlockForm({ open, onOpenChange, initial, onSave }) {
  const [draft, setDraft] = useState(initial || {});

  useEffect(() => { if (open) setDraft(initial || {}); }, [open, initial]);

  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">
            {initial?.id ? 'Edit block' : `New ${draft.kind || 'text'} block`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <p className="chrono-eyebrow">Title (optional)</p>
            <Input value={draft.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Unit 1 — Authoritarian States" />
          </div>

          {draft.kind === 'table' && <TableEditor rows={draft.rows} onChange={(rows) => set('rows', rows)} />}

          {draft.kind === 'image' && (
            <>
              <ImageUploadField value={draft.image_url} onChange={(v) => set('image_url', v)} />
              <Input value={draft.caption || ''} onChange={(e) => set('caption', e.target.value)} placeholder="Caption" />
            </>
          )}

          {(!draft.kind || draft.kind === 'text') && (
            <div className="space-y-2">
              <p className="chrono-eyebrow">Content</p>
              <RichTextEditor value={draft.html} onChange={(v) => set('html', v)} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => onSave(draft)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}