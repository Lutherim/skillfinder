"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Profile, Role } from "@/lib/types";

// Guards a page: sends visitors to /login, and can limit a page to one role
export const RequireAuth = ({ role, children }: { role?: Role; children: (profile: Profile) => React.ReactNode }) => {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile) router.push("/login");
  }, [loading, profile, router]);

  if (loading || !profile) return <p>Loading...</p>;
  if (role && profile.role !== role) return <p>This page is only for {role}s.</p>;
  return <>{children(profile)}</>;
};
