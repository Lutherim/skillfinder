import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { unwrap } from "@/lib/utils";
import type { NewService, Service } from "@/lib/types";

export class CatalogService {
  constructor(private db: SupabaseClient) {}

  listAll = async () =>
    unwrap(await this.db.from("services")
      .select("id, artisan_id, title, description, price, profiles(full_name, trade, city)")
      .order("created_at", { ascending: false })) as unknown as Service[];

  listByArtisan = async (artisanId: string) =>
    unwrap(await this.db.from("services").select("*").eq("artisan_id", artisanId)
      .order("created_at", { ascending: false })) as Service[];

  add = async (input: NewService) =>
    unwrap(await this.db.from("services").insert(input).select().single()) as Service;

  remove = async (id: string) => {
    unwrap(await this.db.from("services").delete().eq("id", id));
  };
}

export const catalogService = new CatalogService(supabase);
