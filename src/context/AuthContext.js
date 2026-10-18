'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext(null);
const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || '').toLowerCase();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const isAdmin = !!user && (!ADMIN_EMAIL || (user.email || '').toLowerCase() === ADMIN_EMAIL);

  const login = async (email, password) => {
    if (!auth) throw new Error('Firebase Auth not configured');
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (auth) await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

