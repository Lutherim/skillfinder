import type { Metadata } from "next";
import { Suspense } from "react";
import { Discover } from "@/components/Discover";
import { CardsSkeleton } from "@/components/Skeleton";

export const metadata: Metadata = {
  title: "Find Trusted Local Artisans",
  description: "Browse verified plumbers, electricians, carpenters and more. Compare reviews and past work, then book directly on SkillFinder.",
  alternates: { canonical: "/" },
};

const HomePage = () => (
  <Suspense fallback={<CardsSkeleton />}>
    <Discover />
  </Suspense>
);

export default HomePage;
