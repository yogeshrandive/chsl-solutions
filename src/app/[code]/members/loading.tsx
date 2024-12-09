import { Skeleton } from '@/components/ui/skeleton';

export default function MembersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-x-2">
          <Skeleton className="h-10 w-32 inline-block" />
          <Skeleton className="h-10 w-32 inline-block" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
