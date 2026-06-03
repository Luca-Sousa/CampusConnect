import { Skeleton } from "@/components/ui/skeleton";

export function EventListSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <article
          key={i}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          {/* Image skeleton */}
          <div className="relative aspect-video bg-muted">
            <Skeleton className="absolute top-3 left-3 h-12 w-10 rounded-xl" />
          </div>

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-2.5 w-8" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
