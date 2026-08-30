import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CardRiwayatSkeleton = () => {
  return (
    <Card className="rounded-xl py-2">
      <CardContent className="flex items-center gap-3 p-3 md:px-5">
        <Skeleton className="size-10 shrink-0 rounded-full" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>

        <Skeleton className="h-5 w-16" />
      </CardContent>
    </Card>
  );
};

export const CardKatalogSkeleton = () => {
  return (
    <Card className="overflow-hidden rounded-xl py-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square w-full bg-muted">
        <Skeleton className="size-10 shrink-0 rounded-full" />
      </div>

      <CardContent className="flex flex-col gap-1 px-3 py-3">
        <Skeleton className="h-4 w-20" />

        <Skeleton className="h-5 w-16 text-sm md:text-lg font-semibold text-orange-500" />
      </CardContent>
    </Card>
  );
};
