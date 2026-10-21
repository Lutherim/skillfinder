import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { unwrap } from "@/lib/utils";
import type { ArtisanCard, ArtisanFull, Profile } from "@/lib/types";

export class ArtisanService {
  constructor(private db: SupabaseClient) {}

  // Best-rated first: used for the home carousel and the artisan list
  listCards = async () =>
    unwrap(await this.db.from("artisan_cards").select("*")
      .order("rating", { ascending: false })
      .order("review_count", { ascending: false })) as ArtisanCard[];

  // Everything for one profile page, fetched in parallel. Returns null if not found.
  getFull = async (id: string): Promise<ArtisanFull | null> => {
    const own = (table: string) => this.db.from(table).select("*").eq("artisan_id", id);
    const [p, services, work, experiences, educations, reviews] = await Promise.all([
      this.db.from("profiles").select("*").eq("id", id).eq("role", "artisan").maybeSingle(),
      own("services"),
      own("work_items").order("created_at", { ascending: false }),
      own("experiences"),
      own("educations"),
      this.db.from("reviews").select("id, rating, comment, created_at, customer:profiles!customer_id(full_name)")
        .eq("artisan_id", id).order("created_at", { ascending: false }),
    ]);
    const profile = unwrap(p) as Profile | null;
    if (!profile) return null;
    return {
      profile,
      services: unwrap(services),
      work: unwrap(work),
      experiences: unwrap(experiences),
      educations: unwrap(educations),
      reviews: unwrap(reviews) as unknown as ArtisanFull["reviews"],
    };
  };
}

export const artisanService = new ArtisanService(supabase);
