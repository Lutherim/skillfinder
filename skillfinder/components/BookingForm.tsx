import { Field, TextArea } from "@/components/Field";
import { formatPrice, readForm } from "@/lib/utils";
import type { NewBooking, Service } from "@/lib/types";

type Values = Omit<NewBooking, "customer_id">;

export const BookingForm = ({ services, onSubmit }: { services: Service[]; onSubmit: (v: Values) => Promise<void> }) => (
  <form
    className="card space-y-3"
    onSubmit={(e) => {
      const { values: v } = readForm(e);
      onSubmit({ service_id: v.service, preferred_date: v.date, customer_phone: v.phone, message: v.message });
    }}
  >
    <label className="block text-sm">
      <span className="mb-1 block">Service</span>
      <select name="service" className="input" required>
        {services.map((s) => <option key={s.id} value={s.id}>{s.title} ({formatPrice(s.price)})</option>)}
      </select>
    </label>
    <Field label="Preferred date" name="date" type="date" required />
    <Field label="Your phone number" name="phone" required />
    <TextArea label="Describe the job" name="message" />
    <button className="btn">Send request</button>
  </form>
);
