import Link from "next/link";
import { LogoIcon } from "@/components/icons";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2" aria-label="SkillFinder home">
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage text-cream">
      <LogoIcon size={18} />
    </span>
    <span className="bg-gradient-to-r from-sage via-ochre to-clay bg-clip-text font-display text-2xl font-semibold text-transparent">
      SkillFinder
    </span>
  </Link>
);
