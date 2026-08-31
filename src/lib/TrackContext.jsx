import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import TrackGate from '@/components/TrackGate';

const TrackContext = createContext({ track: null, setTrack: () => {}, clearTrack: () => {} });
const KEY = 'history-track';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export function TrackProvider({ children }) {
  const [track, setTrackState] = useState(() => {
    try { return localStorage.getItem(KEY); } catch { return null; }
  });
  const { pathname } = useLocation();

  const setTrack = useCallback((t) => {
    setTrackState(t);
    try { localStorage.setItem(KEY, t); } catch {}
  }, []);

  const clearTrack = useCallback(() => {
    setTrackState(null);
    try { localStorage.removeItem(KEY); } catch {}
  }, []);

  const showGate = !track && !AUTH_ROUTES.some((r) => pathname.startsWith(r));

  return (
    <TrackContext.Provider value={{ track, setTrack, clearTrack }}>
      {children}
      {showGate && <TrackGate onChoose={setTrack} />}
    </TrackContext.Provider>
  );
}

export const useTrack = () => useContext(TrackContext);