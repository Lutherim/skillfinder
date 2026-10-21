"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/lib/services/AuthService";
import { profileService } from "@/lib/services/ProfileService";
import type { Profile } from "@/lib/types";

type AuthState = { profile: Profile | null; loading: boolean; setProfile: (p: Profile | null) => void };
const AuthContext = createContext<AuthState | null>(null);

// One shared login state for the whole app (wrapped around everything in app/layout.tsx)
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      authService.onChange(async (userId) => {
        setLoading(true);
        setProfile(userId ? await profileService.get(userId).catch(() => null) : null);
        setLoading(false);
      }),
    []
  );

  return <AuthContext.Provider value={{ profile, loading, setProfile }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
