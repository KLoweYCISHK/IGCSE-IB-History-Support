import React, { createContext, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const AdminContext = createContext({ isAdmin: false, editMode: false });

export function AdminProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const me = await base44.auth.me();
        if (active) setUser(me);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AdminContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        editMode: isAdmin && editMode,
        setEditMode,
        login: () => base44.auth.redirectToLogin(window.location.pathname),
        logout: () => base44.auth.logout(window.location.origin),
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);