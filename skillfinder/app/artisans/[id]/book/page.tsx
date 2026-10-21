"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { RequireAuth } from "@/components/RequireAuth";
import { StatusMessage } from "@/components/Field";
import { useAsync } from "@/hooks/useAsync";
import { bookingService } from "@/lib/services/BookingService";
import { catalogService } from "@/lib/services/CatalogService";
import { errorMessage } from "@/lib/utils";

const BookPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, error, loading } = useAsync(() => catalogService.listByArtisan(id), [id]);
  const [msg, setMsg] = useState("");

  return (
    <RequireAuth>
      {(profile) => (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Request a booking</h1>
          <StatusMessage loading={loading} error={error || msg} />
          {data && (
            <BookingForm
              services={data}
              onSubmit={async (v) => {
                try {
                  await bookingService.create({ ...v, customer_id: profile.id });
                  router.push("/bookings");
                } catch (e) {
                  setMsg(errorMessage(e));
                }
              }}
            />
          )}
        </div>
      )}
    </RequireAuth>
  );
};

export default BookPage;
