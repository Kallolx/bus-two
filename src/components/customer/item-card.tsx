'use client';

import { MenuItem } from '@/types';
import Image from 'next/image';

interface ItemCardProps {
  item: MenuItem;
  onQuickAdd: (item: MenuItem) => void;
  onViewDetails: (item: MenuItem) => void;
}

export function ItemCard({ item, onQuickAdd, onViewDetails }: ItemCardProps) {
  return (
    <div
      className="bg-card rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewDetails(item)}
    >
      <div className="relative w-full aspect-square mb-3">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded-2xl"
          sizes="(max-width: 768px) 45vw, 20vw"
        />
      </div>
      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{item.name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">₹{item.price}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(item);
          }}
          className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
          aria-label="Add to cart"
        >
          <span className="text-xl leading-none">+</span>
        </button>
      </div>
    </div>
  );
}
