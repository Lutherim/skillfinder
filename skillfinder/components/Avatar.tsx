type Props = { name: string; src?: string | null; size?: number };

export const Avatar = ({ name, src, size = 56 }: Props) => {
  const box = { width: size, height: size };
  if (src) return <img src={src} alt={`Photo of ${name}`} style={box} className="shrink-0 rounded-full object-cover" />;
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span aria-hidden style={box} className="inline-flex shrink-0 items-center justify-center rounded-full bg-sage font-bold text-cream">
      {initials}
    </span>
  );
};
