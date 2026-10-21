import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export const Field = ({ label, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) => (
  <label className="block text-sm">
    <span className="mb-1 block">{label}</span>
    <input className="input" {...props} />
  </label>
);

export const TextArea = ({ label, ...props }: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <label className="block text-sm">
    <span className="mb-1 block">{label}</span>
    <textarea className="input" rows={3} {...props} />
  </label>
);

export const StatusMessage = ({ loading, error }: { loading?: boolean; error?: string }) =>
  loading ? <p>Loading...</p> : error ? <p className="text-sm text-red-700">{error}</p> : null;
