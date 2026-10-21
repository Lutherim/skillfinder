"use client";
import { RequestsPanel } from "@/components/RequestsPanel";
import { RequireAuth } from "@/components/RequireAuth";

const BookingsPage = () => (
  <RequireAuth>
    {(profile) => (
      <div className="space-y-4">
        <h1 className="text-[1.75rem] font-semibold sm:text-4xl">{profile.role === "artisan" ? "Booking requests" : "My booking requests"}</h1>
        <RequestsPanel isArtisan={profile.role === "artisan"} />
      </div>
    )}
  </RequireAuth>
);

export default BookingsPage;
