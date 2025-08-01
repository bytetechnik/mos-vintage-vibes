import { Skeleton } from '@/components/ui/skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-card-custom w-full">
      {/* Image skeleton */}
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="w-full h-full" />
        
        {/* Badge skeletons */}
        <div className="absolute top-2 left-2 flex flex-col space-y-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-8" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-2 md:p-2">
        <div className="mb-1">
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>

        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-3 w-8" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton; 