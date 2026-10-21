import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { Nav } from "@/components/Nav";
import { AuthProvider } from "@/hooks/useAuth";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "SkillFinder", template: "%s | SkillFinder" },
  description: "Find and book trusted local artisans.",
  openGraph: { siteName: "SkillFinder", type: "website" },
};
export const viewport: Viewport = { themeColor: "#FBF9F5", width: "device-width", initialScale: 1 };

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en" className={`${display.variable} ${sans.variable}`}>
    <body>
      <AuthProvider>
        <Nav />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </AuthProvider>
    </body>
  </html>
);

export default RootLayout;
