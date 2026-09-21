import React, { useState } from 'react';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Lock, Unlock, LogOut, Trash2 } from 'lucide-react';
import TrashDialog from './TrashDialog';

const EDIT_PASSWORD = 'History2026';

export default function AdminBar() {
  const { isAdmin, editMode, setEditMode, login, logout, loading } = useAdmin();
  const [trashOpen, setTrashOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(false);
  if (loading) return null;

  if (!isAdmin) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <button onClick={login} className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-[#6F551A] border border-border bg-[#FBF7EE]/90 backdrop-blur px-4 py-2.5 rounded-full">
          Ms Lowe — sign in
        </button>
      </div>
    );
  }

  const requestEdit = () => {
    if (editMode) { setEditMode(false); return; }
    setEntry(''); setError(false); setPromptOpen(true);
  };

  const submit = () => {
    if (entry === EDIT_PASSWORD) { setEditMode(true); setPromptOpen(false); }
    else setError(true);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 border border-border bg-[#FBF7EE]/95 backdrop-blur px-3 py-2 rounded-full shadow-2xl">
        <Button
          size="sm"
          onClick={requestEdit}
          className={editMode ? 'bg-[#6F551A] hover:bg-[#5A4514] text-[#F4EFE3]' : ''}
          variant={editMode ? 'default' : 'outline'}
        >
          {editMode ? <Unlock className="w-3.5 h-3.5 mr-1.5" /> : <Lock className="w-3.5 h-3.5 mr-1.5" />}
          {editMode ? 'Editing' : 'Edit mode'}
        </Button>
        <button onClick={() => setTrashOpen(true)} className="p-2 text-muted-foreground hover:text-[#6F551A]" title="Trash">
          <Trash2 className="w-4 h-4" />
        </button>
        <button onClick={logout} className="p-2 text-muted-foreground hover:text-[#6F551A]" title="Sign out">
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <Dialog open={promptOpen} onOpenChange={setPromptOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Enter edit password</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              type="password"
              autoFocus
              value={entry}
              onChange={(e) => { setEntry(e.target.value); setError(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              placeholder="Password"
            />
            {error && <p className="mt-2 text-sm text-destructive">Incorrect password — try again.</p>}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPromptOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Unlock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TrashDialog open={trashOpen} onOpenChange={setTrashOpen} onChanged={() => window.dispatchEvent(new Event('archive:reload'))} />
    </>
  );
}