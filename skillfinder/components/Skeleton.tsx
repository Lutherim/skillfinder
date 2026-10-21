export const Skeleton = ({ className = "" }: { className?: string }) => <div className={`skeleton ${className}`} />;

// Looks like an ArtisanCard while data loads
export const CardSkeleton = () => (
  <div className="card flex items-center gap-3">
    <Skeleton className="h-14 w-14 shrink-0 !rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-10" />
  </div>
);

export const CardsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-3 sm:grid-cols-2">
    {Array.from({ length: count }, (_, i) => <CardSkeleton key={i} />)}
  </div>
);
