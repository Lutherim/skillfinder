import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/", disallow: ["/bookings", "/profile", "/services", "/login"] },
  sitemap: `${base}/sitemap.xml`,
});

export default robots;
