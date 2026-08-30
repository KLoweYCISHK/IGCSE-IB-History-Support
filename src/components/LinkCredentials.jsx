import React, { useState } from 'react';
import { Eye, EyeOff, User, KeyRound } from 'lucide-react';

export default function LinkCredentials({ username, password }) {
  const [show, setShow] = useState(false);

  if (!username && !password) return null;

  return (
    <div className="mt-3 rounded-sm border border-dashed border-border bg-secondary/40 p-3 space-y-1.5">
      {username && (
        <div className="flex items-center gap-2 font-mono text-xs">
          <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Username:</span>
          <span className="text-foreground break-all">{show ? username : '••••••••'}</span>
        </div>
      )}
      {password && (
        <div className="flex items-center gap-2 font-mono text-xs">
          <KeyRound className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Password:</span>
          <span className="text-foreground break-all">{show ? password : '••••••••'}</span>
        </div>
      )}
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-[#6F551A]"
      >
        {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}