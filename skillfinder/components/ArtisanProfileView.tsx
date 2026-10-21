import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { EducationIcon, ExperienceIcon, LocationIcon, MessageIcon, StarIcon, WorkIcon } from "@/components/icons";
import { formatPrice } from "@/lib/utils";
import type { ArtisanFull, WorkItem } from "@/lib/types";

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="flex items-center gap-2 text-xl font-medium sm:text-2xl">{icon}{title}</h2>
    {children}
  </section>
);

const WorkGrid = ({ items }: { items: WorkItem[] }) =>
  items.length === 0 ? <p className="text-sm text-muted">Nothing added yet.</p> : (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((w) => (
        <figure key={w.id} className="overflow-hidden rounded-xl border border-sage/20 bg-linen">
          {w.image_url ? <img src={w.image_url} alt={w.title} loading="lazy" className="aspect-square w-full object-cover" /> : <div className="aspect-square" />}
          <figcaption className="p-2 text-sm font-medium text-clay">{w.title}</figcaption>
        </figure>
      ))}
    </div>
  );

export const ArtisanProfileView = ({ data }: { data: ArtisanFull }) => {
  const { profile: p, services, work, experiences, educations, reviews } = data;
  const rating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <article className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar name={p.full_name} src={p.avatar_url} size={96} />
        <div className="flex-1 space-y-1">
          <h1 className="text-[1.75rem] font-semibold sm:text-4xl">{p.full_name}</h1>
          <p className="badge">{p.trade ?? "Artisan"}</p>
          <p className="flex flex-wrap items-center gap-3 text-sm text-muted">
            {p.city && <span className="flex items-center gap-1"><LocationIcon size={14} />{p.city}</span>}
            <span className="flex items-center gap-1"><StarIcon size={14} className="fill-ochre text-ochre" />{rating ? rating.toFixed(1) : "New"} ({reviews.length} reviews)</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/artisans/${p.id}/book`} className="btn">Book now</Link>
          <Link href="/bookings" className="btn-ghost flex items-center gap-1"><MessageIcon size={16} />Messages</Link>
        </div>
      </header>

      {p.bio && <p className="max-w-2xl">{p.bio}</p>}

      <Section title="Services and starting prices" icon={null}>
        {services.length === 0 ? <p className="text-sm text-muted">Quote on request.</p> : services.map((s) => (
          <div key={s.id} className="card flex items-start justify-between gap-3">
            <div><h3 className="font-sans text-[1.125rem] font-bold">{s.title}</h3>{s.description && <p className="text-sm">{s.description}</p>}</div>
            <span className="whitespace-nowrap font-bold text-clay">From {formatPrice(s.price)}</span>
          </div>
        ))}
      </Section>

      <Section title="Past work" icon={<WorkIcon size={20} className="text-sage-dark" />}><WorkGrid items={work.filter((w) => w.kind === "past")} /></Section>
      <Section title="New work" icon={<WorkIcon size={20} className="text-ochre" />}><WorkGrid items={work.filter((w) => w.kind === "new")} /></Section>

      <Section title="Experience" icon={<ExperienceIcon size={20} className="text-sage-dark" />}>
        {experiences.length === 0 ? <p className="text-sm text-muted">Nothing added yet.</p> : experiences.map((e) => (
          <p key={e.id}><strong className="text-clay">{e.title}</strong>{e.company && `, ${e.company}`}{e.years && <span className="text-muted"> ({e.years})</span>}</p>
        ))}
      </Section>

      <Section title="Education" icon={<EducationIcon size={20} className="text-sage-dark" />}>
        {educations.length === 0 ? <p className="text-sm text-muted">Nothing added yet.</p> : educations.map((e) => (
          <p key={e.id}><strong className="text-clay">{e.qualification ?? "Qualification"}</strong>, {e.school}{e.year && <span className="text-muted"> ({e.year})</span>}</p>
        ))}
      </Section>

      <Section title="Reviews" icon={<StarIcon size={20} className="text-ochre" />}>
        {reviews.length === 0 ? <p className="text-sm text-muted">No reviews yet. Only customers with an accepted booking can review.</p> : reviews.map((r) => (
          <div key={r.id} className="card space-y-1">
            <p className="flex items-center gap-1 text-sm font-medium text-clay">
              {Array.from({ length: r.rating }, (_, i) => <StarIcon key={i} size={14} className="fill-ochre text-ochre" />)}
              <span className="ml-2">{r.customer?.full_name ?? "Customer"}</span>
            </p>
            {r.comment && <p>{r.comment}</p>}
          </div>
        ))}
      </Section>
    </article>
  );
};
