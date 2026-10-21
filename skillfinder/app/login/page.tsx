"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Field } from "@/components/Field";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/lib/services/AuthService";
import { errorMessage, readForm } from "@/lib/utils";
import type { Role } from "@/lib/types";

const LoginPage = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const [signUp, setSignUp] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  // Once logged in, move on (artisans go straight to their services)
  useEffect(() => {
    if (profile) router.push("/");
  }, [profile, router]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    const { values: v } = readForm(e);
    setBusy(true);
    setMsg("");
    try {
      if (signUp) {
        const { needsConfirmation } = await authService.signUp({
          email: v.email, password: v.password, fullName: v.name, role: v.role as Role,
        });
        if (needsConfirmation) setMsg("Check your email to confirm your account, then sign in.");
      } else {
        await authService.signIn(v.email, v.password);
      }
    } catch (err) {
      setMsg(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card mx-auto max-w-sm space-y-3">
      <h1 className="text-2xl font-bold">{signUp ? "Create account" : "Sign in"}</h1>
      {signUp && (
        <>
          <Field label="Full name" name="name" required />
          <label className="block text-sm">
            <span className="mb-1 block">I am... (cannot be changed later)</span>
            <select name="role" className="input" defaultValue="customer">
              <option value="customer">Looking for an artisan</option>
              <option value="artisan">An artisan</option>
            </select>
          </label>
        </>
      )}
      <Field label="Email" name="email" type="email" required />
      <Field label="Password (6+ characters)" name="password" type="password" minLength={6} required />
      <button className="btn w-full" disabled={busy}>{busy ? "Please wait..." : signUp ? "Sign up" : "Sign in"}</button>
      {msg && <p className="text-sm text-red-700">{msg}</p>}
      <button type="button" className="text-sm underline" onClick={() => setSignUp(!signUp)}>
        {signUp ? "Already have an account? Sign in" : "New here? Create an account"}
      </button>
    </form>
  );
};

export default LoginPage;
