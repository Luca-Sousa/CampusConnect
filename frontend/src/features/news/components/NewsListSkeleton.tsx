import { Skeleton } from "@/components/ui/skeleton";

export function NewsListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Featured skeleton */}
      <article className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="aspect-[21/9] bg-muted" />
        <div className="p-5 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        </div>
      </article>

      {/* List skeletons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <article
          key={i}
          className="flex flex-col sm:flex-row gap-0 rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="sm:w-48 md:w-56 shrink-0 bg-muted aspect-video sm:aspect-auto" />
          <div className="flex-1 p-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
