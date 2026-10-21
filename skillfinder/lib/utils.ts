import type { FormEvent } from "react";

// Turns a Supabase response into data, or throws an Error with a readable message
export const unwrap = <T>(res: { data: T | null; error: { message: string } | null }): T => {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
};

export const errorMessage = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

export const formatPrice = (n: number) => `R${Number(n).toFixed(2)}`;

// Reads a submitted form into a plain object (reused by every form)
export const readForm = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  return { form, values: Object.fromEntries(new FormData(form)) as Record<string, string> };
};
