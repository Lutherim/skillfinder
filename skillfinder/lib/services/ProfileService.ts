import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { unwrap } from "@/lib/utils";
import type { Profile, ProfileUpdate } from "@/lib/types";

export class ProfileService {
  constructor(private db: SupabaseClient) {}

  get = async (id: string) =>
    unwrap(await this.db.from("profiles").select("*").eq("id", id).single()) as Profile;

  update = async (id: string, changes: ProfileUpdate) =>
    unwrap(await this.db.from("profiles").update(changes).eq("id", id).select().single()) as Profile;
}

export const profileService = new ProfileService(supabase);
