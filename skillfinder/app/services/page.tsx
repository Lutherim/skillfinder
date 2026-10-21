"use client";
import { useState } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { ServiceForm } from "@/components/ServiceForm";
import { RequireAuth } from "@/components/RequireAuth";
import { StatusMessage } from "@/components/Field";
import { useAsync } from "@/hooks/useAsync";
import { catalogService } from "@/lib/services/CatalogService";
import { errorMessage } from "@/lib/utils";

const ServicesManager = ({ artisanId }: { artisanId: string }) => {
  const { data, error, reload } = useAsync(() => catalogService.listByArtisan(artisanId), [artisanId]);
  const [msg, setMsg] = useState("");

  // Runs a change, then refreshes the list. Shows any error.
  const run = async (task: () => Promise<unknown>) => {
    try {
      await task();
      setMsg("");
      await reload();
    } catch (e) {
      setMsg(errorMessage(e));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">My services</h1>
      {(data ?? []).map((s) => (
        <ServiceCard key={s.id} service={s}>
          <button className="btn-ghost" onClick={() => run(() => catalogService.remove(s.id))}>Delete</button>
        </ServiceCard>
      ))}
      <ServiceForm onAdd={(v) => run(() => catalogService.add({ artisan_id: artisanId, ...v }))} />
      <StatusMessage error={error || msg} />
    </div>
  );
};

const ServicesPage = () => (
  <RequireAuth role="artisan">{(profile) => <ServicesManager artisanId={profile.id} />}</RequireAuth>
);

export default ServicesPage;
