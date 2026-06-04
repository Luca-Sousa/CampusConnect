import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function PostHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 pt-4 pb-2">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="space-y-1.5 flex-1">
        <Skeleton className="h-3.5 w-32 sm:w-40" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

function ActionBarSkeleton() {
  return (
    <div className="flex px-2 py-1.5 border-t">
      <div className="flex-1 flex items-center justify-center">
        <Skeleton className="h-9 w-full max-w-[120px]" />
      </div>
      <Separator orientation="vertical" className="h-5 my-auto" />
      <div className="flex-1 flex items-center justify-center">
        <Skeleton className="h-9 w-full max-w-[120px]" />
      </div>
      <Separator orientation="vertical" className="h-5 my-auto" />
      <div className="flex-1 flex items-center justify-center">
        <Skeleton className="h-9 w-full max-w-[120px]" />
      </div>
    </div>
  );
}

function TextPostSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <PostHeaderSkeleton />
      <div className="px-4 pb-3 space-y-2">
        <Skeleton className="h-4 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] xl:w-[600px] 2xl:w-[680px]" />
        <Skeleton className="h-4 w-[250px] sm:w-[320px] md:w-[400px] lg:w-[480px] xl:w-[560px] 2xl:w-[640px]" />
        <Skeleton className="h-4 w-[220px] sm:w-[280px] md:w-[350px] lg:w-[420px] xl:w-[490px] 2xl:w-[560px]" />
        <Skeleton className="h-4 w-[180px] sm:w-[230px] md:w-[290px] lg:w-[350px] xl:w-[410px] 2xl:w-[470px]" />
      </div>
      <ActionBarSkeleton />
    </div>
  );
}

function ImagePostSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <PostHeaderSkeleton />
      <div className="px-4 pb-3 space-y-2">
        <Skeleton className="h-4 w-[250px] sm:w-[320px] md:w-[400px] lg:w-[480px] xl:w-[560px] 2xl:w-[640px]" />
        <Skeleton className="h-4 w-[200px] sm:w-[260px] md:w-[320px] lg:w-[380px] xl:w-[440px] 2xl:w-[500px]" />
      </div>
      <Skeleton className="w-full h-48 sm:h-56 md:h-64" />
      <ActionBarSkeleton />
    </div>
  );
}

function EventPostSkeleton() {
  return (
    <article className="rounded-xl border border-violet-200/60 dark:border-violet-800/40 bg-card shadow-sm overflow-hidden">
      {/* Header gradiente violeta */}
      <div className="bg-muted px-4 pt-4 pb-5">
        <div className="flex items-center gap-2.5 mb-3">
          <Skeleton className="h-9 w-9 rounded-full ring-2 ring-white/25" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-5 w-3/4" />
      </div>

      {/* Badges de evento */}
      <div className="px-4 py-3 flex flex-wrap gap-2 border-b">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
        <Skeleton className="h-7 w-32 rounded-full" />
      </div>

      {/* Conteúdo */}
      <div className="px-4 pt-3 pb-1 space-y-2">
        <Skeleton className="h-4 w-[250px] sm:w-[320px] md:w-[400px] lg:w-[480px] xl:w-[560px] 2xl:w-[640px]" />
        <Skeleton className="h-4 w-[200px] sm:w-[260px] md:w-[320px] lg:w-[380px] xl:w-[440px] 2xl:w-[500px]" />
      </div>

      {/* Confirmações */}
      <div className="px-4 py-3 flex items-center justify-between border-t">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-8 w-36 rounded-md" />
      </div>

      <ActionBarSkeleton />
    </article>
  );
}

const SKELETON_MAP = {
  text: TextPostSkeleton,
  image: ImagePostSkeleton,
  event: EventPostSkeleton,
} as const;

type SkeletonType = keyof typeof SKELETON_MAP;

const FEED_SKELETONS: SkeletonType[] = [
  "text",
  "image",
  "text",
  "text",
  "event",
  "text",
  "image",
  "text",
  "text",
];

export function FeedSkeleton() {
  return (
    <>
      {FEED_SKELETONS.map((type, i) => {
        const Component = SKELETON_MAP[type];
        return <Component key={i} />;
      })}
    </>
  );
}
