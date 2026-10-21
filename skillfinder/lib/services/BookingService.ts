import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { unwrap } from "@/lib/utils";
import type { Booking, BookingStatus, NewBooking } from "@/lib/types";

const COLUMNS = "id, preferred_date, message, customer_phone, status, services(title), customer:profiles(full_name)";

export class BookingService {
  constructor(private db: SupabaseClient) {}

  // Row Level Security means this only returns bookings the signed-in user may see
  listMine = async () =>
    unwrap(await this.db.from("bookings").select(COLUMNS)
      .order("created_at", { ascending: false })) as unknown as Booking[];

  create = async (input: NewBooking) =>
    unwrap(await this.db.from("bookings").insert(input).select("id").single());

  setStatus = async (id: string, status: BookingStatus) =>
    unwrap(await this.db.from("bookings").update({ status }).eq("id", id).select("id").single());
}

export const bookingService = new BookingService(supabase);
