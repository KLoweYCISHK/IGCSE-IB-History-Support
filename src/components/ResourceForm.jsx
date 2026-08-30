import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/lib/AdminContext';
import { UNITS } from '@/lib/perspectiveTopics';
const MODULE_OPTIONS = [
  { value: 'russian_revolution', label: UNITS.russian_revolution.label },
  { value: 'cold_war', label: UNITS.cold_war.label },
  { value: 'all', label: 'Both modules' },
];

export default function ResourceForm({ open, onOpenChange, initial, onSave, module }) {
  const { isAdmin } = useAdmin();
  const [draft, setDraft] = useState(initial || {});
  useEffect(() => { if (open) setDraft({ ...(initial || {}), module: module ? (initial?.module || module) : initial?.module }); }, [open, initial, module]);
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
          {module && (
            <div className="space-y-1.5">
              <p className="chrono-eyebrow">Module</p>
              <Select value={draft.module || 'all'} onValueChange={(v) => set('module', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MODULE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          {isAdmin && (
            <div className="rounded-sm border border-dashed border-border p-3 space-y-3">
              <p className="chrono-eyebrow">Website login (optional)</p>
              <Input value={draft.link_username || ''} onChange={(e) => set('link_username', e.target.value)} placeholder="Username" />
              <Input value={draft.link_password || ''} onChange={(e) => set('link_password', e.target.value)} placeholder="Password" />
              <p className="font-mono text-[11px] text-muted-foreground/70">For books on subscription sites — students reveal it with the eye icon.</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!draft.title} onClick={() => onSave(draft)} className="bg-[#6F551A] hover:bg-[#5A4514] text-[#F4EFE3]">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}