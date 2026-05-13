import { Skeleton } from "../ui/skeleton";

export function LoadingState() {
  return (
    <div className="grid gap-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
