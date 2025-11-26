export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-16 h-8" />
        <Skeleton className="w-24 h-6 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="w-full h-12" />
        <Skeleton className="w-3/4 h-12" />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Skeleton className="w-32 h-6" />
      </div>
    </div>
  );
}

export function InventoryItemSkeleton() {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-32 h-5 mb-2" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>
      <Skeleton className="w-24 h-8 rounded-full" />
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <Skeleton className="w-full h-32 rounded-xl mb-3" />
      <Skeleton className="w-3/4 h-5 mb-2" />
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-1/2 h-6" />
    </div>
  );
}
