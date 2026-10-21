"use client";
import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "@/lib/utils";

// Runs an async function on mount and gives back { data, error, loading, reload }
export const useAsync = <T>(task: () => Promise<T>, deps: unknown[] = []) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await task());
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { reload(); }, [reload]);
  return { data, error, loading, reload };
};
