import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { LocationIcon, StarIcon } from "@/components/icons";
import type { ArtisanCard as Data } from "@/lib/types";

// Round photo on the left, name + trade in the middle, reviews on the right
export const ArtisanCard = ({ artisan: a }: { artisan: Data }) => (
  <Link href={`/artisans/${a.id}`} className="card flex items-center gap-3 transition hover:border-ochre">
    <Avatar name={a.full_name} src={a.avatar_url} />
    <div className="min-w-0 flex-1">
      <h3 className="truncate font-sans text-[1.125rem] font-bold">{a.full_name}</h3>
      <p className="badge truncate">{a.trade ?? "Artisan"}</p>
      {a.city && <p className="flex items-center gap-1 text-xs text-muted"><LocationIcon size={12} />{a.city}</p>}
    </div>
    <div className="text-right text-sm font-medium text-clay">
      <span className="flex items-center justify-end gap-1"><StarIcon size={14} className="fill-ochre text-ochre" />{a.rating ? a.rating.toFixed(1) : "New"}</span>
      <span className="text-xs text-muted">({a.review_count})</span>
    </div>
  </Link>
);
