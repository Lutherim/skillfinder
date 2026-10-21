import { Field } from "@/components/Field";
import { readForm } from "@/lib/utils";

type Values = { title: string; description: string; price: number };

export const ServiceForm = ({ onAdd }: { onAdd: (v: Values) => Promise<void> }) => (
  <form
    className="card space-y-3"
    onSubmit={async (e) => {
      const { form, values: v } = readForm(e);
      await onAdd({ title: v.title, description: v.description, price: Number(v.price) });
      form.reset();
    }}
  >
    <Field label="Service title" name="title" required />
    <Field label="Short description" name="description" />
    <Field label="Price (R)" name="price" type="number" min="0" step="0.01" required />
    <button className="btn">Add service</button>
  </form>
);
