import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Role } from "@/lib/types";

// A class because it holds a dependency (the client). Arrow-function properties keep `this`
// bound, so you can pass `authService.signOut` straight into onClick without losing it.
export class AuthService {
  constructor(private db: SupabaseClient) {}

  signIn = async (email: string, password: string) => {
    const { error } = await this.db.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  signUp = async (i: { email: string; password: string; fullName: string; role: Role }) => {
    const { data, error } = await this.db.auth.signUp({
      email: i.email,
      password: i.password,
      options: { data: { full_name: i.fullName, role: i.role } },
    });
    if (error) throw new Error(error.message);
    return { needsConfirmation: !data.session };
  };

  signOut = () => this.db.auth.signOut();

  // Calls back with the user id (or null). Deferred, because awaiting Supabase calls
  // directly inside this listener can freeze it.
  onChange = (callback: (userId: string | null) => void) => {
    const { data } = this.db.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => callback(session?.user.id ?? null), 0);
    });
    return () => data.subscription.unsubscribe();
  };
}

export const authService = new AuthService(supabase);
