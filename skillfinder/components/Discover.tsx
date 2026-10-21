"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArtisanCard } from "@/components/ArtisanCard";
import { StatusMessage } from "@/components/Field";
import { RequestsPanel } from "@/components/RequestsPanel";
import { CardsSkeleton } from "@/components/Skeleton";
import { TopArtisansCarousel } from "@/components/TopArtisansCarousel";
import { useAsync } from "@/hooks/useAsync";
import { useAuth } from "@/hooks/useAuth";
import { artisanService } from "@/lib/services/ArtisanService";

const unique = (items: (string | null)[]) => Array.from(new Set(items.filter((x): x is string => !!x)));

export const Discover = () => {
  const { profile, loading: authLoading } = useAuth();
  const q = (useSearchParams().get("q") ?? "").toLowerCase();
  const { data, error, loading } = useAsync(artisanService.listCards);
  const [trade, setTrade] = useState("All");
  const [city, setCity] = useState("");

  if (profile?.role === "artisan") {
    return (
      <div className="space-y-4">
        <h1 className="text-[1.75rem] font-semibold sm:text-4xl">Customers who requested you</h1>
        <RequestsPanel isArtisan />
      </div>
    );
  }

  const list = data ?? [];
  const activeCity = city || profile?.city || ""; // customers see their own area first
  const shown = list.filter((a) =>
    (trade === "All" || a.trade === trade) &&
    (!activeCity || a.city === activeCity) &&
    [a.full_name, a.trade, a.city].join(" ").toLowerCase().includes(q));

  return (
    <div className="space-y-6">
      <h1 className="text-[1.75rem] font-semibold sm:text-4xl">Find Trusted Artisans Near You</h1>
      {!profile && !authLoading && !loading && <TopArtisansCarousel artisans={list.slice(0, 10)} />}

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Trades">
        {["All", ...unique(list.map((a) => a.trade))].map((t) => (
          <button key={t} onClick={() => setTrade(t)} aria-pressed={trade === t}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium ${trade === t ? "border-sage bg-sage text-cream" : "border-sage/40 text-clay hover:bg-linen"}`}>{t}</button>
        ))}
      </div>
      <select aria-label="Location" value={city} onChange={(e) => setCity(e.target.value)} className="input sm:max-w-xs">
        <option value="">{profile?.city ? `My area (${profile.city})` : "All locations"}</option>
        {unique(list.map((a) => a.city)).map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <StatusMessage error={error} />
      {loading ? <CardsSkeleton /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {shown.map((a) => <ArtisanCard key={a.id} artisan={a} />)}
        </div>
      )}
      {!loading && !error && shown.length === 0 && <p>No artisans match yet. Try another trade or location.</p>}
    </div>
  );
};
