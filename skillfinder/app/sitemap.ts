import type { MetadataRoute } from "next";
import { artisanService } from "@/lib/services/ArtisanService";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const artisans = await artisanService.listCards().catch(() => []);
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...artisans.map((a) => ({ url: `${base}/artisans/${a.id}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
};

export default sitemap;
