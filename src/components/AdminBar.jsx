import React from 'react';
import { useAdmin } from '@/lib/AdminContext';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, LogOut } from 'lucide-react';

export default function AdminBar() {
  const { isAdmin, editMode, setEditMode, login, logout, loading } = useAdmin();
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

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 border border-border bg-[#FBF7EE]/95 backdrop-blur px-3 py-2 rounded-full shadow-2xl">
      <Button
        size="sm"
        onClick={() => setEditMode(!editMode)}
        className={editMode ? 'bg-[#6F551A] hover:bg-[#5A4514] text-[#F4EFE3]' : ''}
        variant={editMode ? 'default' : 'outline'}
      >
        {editMode ? <Unlock className="w-3.5 h-3.5 mr-1.5" /> : <Lock className="w-3.5 h-3.5 mr-1.5" />}
        {editMode ? 'Editing' : 'Edit mode'}
      </Button>
      <button onClick={logout} className="p-2 text-muted-foreground hover:text-[#6F551A]" title="Sign out">
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}