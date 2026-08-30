import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/lib/AdminContext';
import ImageUploadField from './editor/ImageUploadField';

export default function ResourceForm({ open, onOpenChange, initial, onSave }) {
  const { isAdmin } = useAdmin();
  const [draft, setDraft] = useState(initial || {});
  useEffect(() => { if (open) setDraft(initial || {}); }, [open, initial]);
  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl">{initial?.id ? 'Edit resource' : 'Add a resource'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input value={draft.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="Title" />
          <Input value={draft.url || ''} onChange={(e) => set('url', e.target.value)} placeholder="https://…" />
          <Textarea value={draft.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Why is this useful?" rows={3} />
          {!isAdmin && (
            <Input value={draft.submitted_by || ''} onChange={(e) => set('submitted_by', e.target.value)} placeholder="Your name" />
          )}
          <ImageUploadField value={draft.image_url} onChange={(v) => set('image_url', v)} label="Image (optional)" />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!draft.title} onClick={() => onSave(draft)} className="bg-[#6F551A] hover:bg-[#5A4514] text-[#F4EFE3]">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}