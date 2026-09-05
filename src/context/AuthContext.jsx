import React, { createContext, useContext, useState, useEffect } from "react";
import { authenticate, registerUser, getSession, setSession, clearSession, updateProfile as storeUpdateProfile } from "../lib/store";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Restore session on first load (e.g. after a page refresh)
  useEffect(() => {
    setUser(getSession());
    setReady(true);
  }, []);

  // Validates email + password against the stored accounts.
  // Returns { ok: true } on success, or { ok: false, error } on failure —
  // the calling page decides what to show the user.
  const login = (email, password, expectedRole) => {
    const result = authenticate(email, password, expectedRole);
    if (result.ok) {
      setSession(result.user);
      setUser(result.user);
    }
    return result;
  };

  // Creates a brand-new account and logs the person straight in.
  const register = (fields) => {
    const result = registerUser(fields);
    if (result.ok) {
      setSession(result.user);
      setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  // Persists profile / settings changes and keeps the in-memory user (and
  // therefore every page reading useAuth()) instantly in sync.
  const updateProfile = (patch) => {
    if (!user) return null;
    const updated = storeUpdateProfile(user.id, patch);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
