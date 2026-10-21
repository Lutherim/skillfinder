import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtisanProfileView } from "@/components/ArtisanProfileView";
import { artisanService } from "@/lib/services/ArtisanService";

type Props = { params: Promise<{ id: string }> };

// Runs on the server, so Google sees the full page and a unique title per artisan
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { id } = await params;
  const data = await artisanService.getFull(id).catch(() => null);
  if (!data) return { title: "Artisan not found", robots: { index: false } };
  const { profile: p } = data;
  const title = `${p.full_name}: ${p.trade ?? "Artisan"}${p.city ? ` in ${p.city}` : ""}`;
  const description = p.bio?.slice(0, 155) ?? `Book ${p.full_name} on SkillFinder. See reviews and past work.`;
  return { title, description, alternates: { canonical: `/artisans/${id}` }, openGraph: { title, description, type: "profile" } };
};

const ArtisanPage = async ({ params }: Props) => {
  const { id } = await params;
  const data = await artisanService.getFull(id).catch(() => null);
  if (!data) notFound();

  const { profile: p, reviews } = data;
  const jsonLd = {
    "@context": "https://schema.org", "@type": "LocalBusiness", name: p.full_name,
    description: p.bio ?? undefined, areaServed: p.city ?? undefined, image: p.avatar_url ?? undefined,
    ...(reviews.length && {
      aggregateRating: { "@type": "AggregateRating", reviewCount: reviews.length,
        ratingValue: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <ArtisanProfileView data={data} />
    </>
  );
};

export default ArtisanPage;
