import { createClient } from "@supabase/supabase-js";

// The ONE place the Supabase client is created. Only lib/services/* import it.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
