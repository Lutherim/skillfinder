"use client";
import { useEffect, useState } from "react";
import { ArtisanCard } from "@/components/ArtisanCard";
import type { ArtisanCard as Data } from "@/lib/types";

const STEP = 300; // card width (288px) + gap (12px)

// Cards slide left one step every 2 seconds, then loop forever
export const TopArtisansCarousel = ({ artisans }: { artisans: Data[] }) => {
  const n = artisans.length;
  const [i, setI] = useState(0);
  const [snap, setSnap] = useState(false); // true = jump back without animating

  useEffect(() => {
    if (n < 2) return;
    const id = setInterval(() => setI((v) => v + 1), 2000);
    return () => clearInterval(id);
  }, [n]);

  useEffect(() => {
    if (!snap) return;
    const f = requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)));
    return () => cancelAnimationFrame(f);
  }, [snap]);

  if (n === 0) return null;
  const track = [...artisans, ...artisans, ...artisans]; // repeated so there is always a next card

  return (
    <section aria-label="Top artisans" className="overflow-hidden">
      <div
        className={`flex ${snap ? "" : "transition-transform duration-500 ease-in-out"}`}
        style={{ transform: `translateX(-${i * STEP}px)` }}
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && i >= n) { setSnap(true); setI(0); }
        }}
      >
        {track.map((a, k) => (
          <div key={k} className="mr-3 w-72 shrink-0"><ArtisanCard artisan={a} /></div>
        ))}
      </div>
    </section>
  );
};
