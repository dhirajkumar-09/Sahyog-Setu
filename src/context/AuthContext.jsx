import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const loadProfile = async (authUser) => {
    if (!authUser) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();
    if (error) {
      console.error("Failed to load profile:", error);
      return null;
    }
    return { ...data, email: authUser.email };
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await loadProfile(session.user);
        setUser(profile);
      }
      setReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await loadProfile(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email, password, expectedRole) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: error.message };

    const profile = await loadProfile(data.user);
    if (expectedRole && profile?.role !== expectedRole) {
      await supabase.auth.signOut();
      return { ok: false, error: `This account is not registered as a ${expectedRole}.` };
    }
    setUser(profile);
    return { ok: true, user: profile };
  };

  const register = async (fields) => {
    const { email, password, role, name, company, sector, dpiit, department, designation, expertise, organization } = fields;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { ok: false, error: error.message };

    const profileData = { id: data.user.id, email, role, name };
    if (company) profileData.company = company;
    if (sector) profileData.sector = sector;
    if (dpiit) profileData.dpiit_number = dpiit;
    if (department) profileData.department = department;
    if (designation) profileData.designation = designation;
    if (expertise) profileData.expertise = expertise;
    if (organization) profileData.organization = organization;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert(profileData)
      .select()
      .single();
    if (profileError) return { ok: false, error: profileError.message };

    setUser({ ...profile, email });
    return { ok: true, user: profile };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (patch) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", user.id)
      .select()
      .single();
    if (error) {
      console.error("Failed to update profile:", error);
      return null;
    }
    setUser({ ...data, email: user.email });
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);