"use client";
import { useState } from "react";
import { BookingCard } from "@/components/BookingCard";
import { StatusMessage } from "@/components/Field";
import { CardsSkeleton } from "@/components/Skeleton";
import { useAsync } from "@/hooks/useAsync";
import { bookingService } from "@/lib/services/BookingService";
import { errorMessage } from "@/lib/utils";
import type { BookingStatus } from "@/lib/types";

// Artisans: customers who requested them (accept / decline). Customers: their own requests.
export const RequestsPanel = ({ isArtisan }: { isArtisan: boolean }) => {
  const { data, error, loading, reload } = useAsync(bookingService.listMine);
  const [msg, setMsg] = useState("");

  const changeStatus = async (id: string, status: BookingStatus) => {
    try {
      await bookingService.setStatus(id, status);
      await reload();
    } catch (e) {
      setMsg(errorMessage(e));
    }
  };

  if (loading) return <CardsSkeleton count={3} />;
  return (
    <div className="space-y-3">
      <StatusMessage error={error || msg} />
      {data?.length === 0 && <p>{isArtisan ? "No customer requests yet. Complete your profile so customers can find you." : "You have not requested anyone yet."}</p>}
      {(data ?? []).map((b) => (
        <BookingCard key={b.id} booking={b} showCustomer={isArtisan}
          onStatus={isArtisan ? (s) => changeStatus(b.id, s) : undefined} />
      ))}
    </div>
  );
};
