import type { Booking, BookingStatus } from "@/lib/types";

type Props = { booking: Booking; showCustomer?: boolean; onStatus?: (status: BookingStatus) => void };

export const BookingCard = ({ booking, showCustomer, onStatus }: Props) => (
  <div className="card space-y-1">
    <div className="flex justify-between">
      <strong>{booking.services?.title}</strong>
      <span className="text-sm capitalize">{booking.status}</span>
    </div>
    <p className="text-sm">
      {showCustomer && `${booking.customer?.full_name} · ${booking.customer_phone} · `}For {booking.preferred_date}
    </p>
    {booking.message && <p className="text-sm">{booking.message}</p>}
    {onStatus && booking.status === "pending" && (
      <div className="flex gap-2 pt-1">
        <button className="btn" onClick={() => onStatus("accepted")}>Accept</button>
        <button className="btn-ghost" onClick={() => onStatus("declined")}>Decline</button>
      </div>
    )}
  </div>
);
