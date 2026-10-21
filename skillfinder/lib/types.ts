export type Role = "artisan" | "customer";
export type BookingStatus = "pending" | "accepted" | "declined";

export type Profile = { id: string; avatar_url: string | null; full_name: string; role: Role; trade: string | null; city: string | null; bio: string | null };
export type ProfileUpdate = Partial<Pick<Profile, "full_name" | "trade" | "city" | "bio">>;

export type Service = { id: string; artisan_id: string; title: string; description: string | null; price: number; profiles?: { full_name: string; trade: string | null; city: string | null } | null };
export type NewService = { artisan_id: string; title: string; description: string; price: number };

export type Booking = { id: string; preferred_date: string; message: string | null; customer_phone: string | null; status: BookingStatus; services?: { title: string } | null; customer?: { full_name: string } | null };
export type NewBooking = { service_id: string; customer_id: string; preferred_date: string; customer_phone: string; message: string };

export type ArtisanCard = { id: string; full_name: string; trade: string | null; city: string | null; avatar_url: string | null; rating: number; review_count: number };
export type WorkItem = { id: string; title: string; image_url: string | null; kind: "past" | "new" };
export type Experience = { id: string; title: string; company: string | null; years: string | null };
export type Education = { id: string; school: string; qualification: string | null; year: string | null };
export type Review = { id: string; rating: number; comment: string | null; created_at: string; customer?: { full_name: string } | null };
export type ArtisanFull = { profile: Profile; services: Service[]; work: WorkItem[]; experiences: Experience[]; educations: Education[]; reviews: Review[] };
