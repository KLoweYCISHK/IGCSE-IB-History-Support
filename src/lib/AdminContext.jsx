import React, { createContext, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { checkEditPassword, getEditPassword, setEditPassword } from '@/api/editor';

const AdminContext = createContext({ isAdmin: false, editMode: false });

// "isAdmin" means this browser has unlocked editing with the edit password
// (checked on the server). No Base44 account is needed.
export function AdminProvider({ children }) {
  const [user, setUser] = useState(null);
  const [unlocked, setUnlocked] = useState(!!getEditPassword());
  const [editMode, setEditMode] = useState(!!getEditPassword());

  useEffect(() => {
    let active = true;
    base44.auth.me().then((me) => active && setUser(me)).catch(() => active && setUser(null));
    return () => { active = false; };
  }, []);

  const unlock = async (password) => {
    const ok = await checkEditPassword(password);
    if (ok) { setEditPassword(password); setUnlocked(true); setEditMode(true); }
    return ok;
  };

  const lock = () => { setEditPassword(''); setUnlocked(false); setEditMode(false); };

  return (
    <AdminContext.Provider
      value={{
        user,
        loading: false,
        isAdmin: unlocked,
        editMode: unlocked && editMode,
        setEditMode,
        unlock,
        lock,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
