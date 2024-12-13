import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function InfoStep3Loading() {
  return (
    <div>
      <div className="pb-4">
        <Skeleton className="h-8 w-[200px]" />
      </div>

      <Card>
        <CardHeader className="pt-1">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-w-[1050px] mx-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-[150px]" />
            </div>

            <div className="rounded-md border">
              <div className="p-4">
                <div className="grid gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-7 gap-4">
                      <Skeleton className="h-10 col-span-1" />
                      <Skeleton className="h-10 col-span-2" />
                      <Skeleton className="h-10 col-span-1" />
                      <Skeleton className="h-10 col-span-1" />
                      <Skeleton className="h-10 col-span-1" />
                      <Skeleton className="h-10 col-span-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
