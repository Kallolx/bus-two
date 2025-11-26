'use client';

import { MenuItem } from '@/types';
import Image from 'next/image';

interface ItemCardProps {
  item: MenuItem;
  onQuickAdd: (item: MenuItem) => void;
  onViewDetails: (item: MenuItem) => void;
}

const vibrantColors = [
  'from-pink-300 to-red-300',      // Pink-Red
  'from-blue-300 to-cyan-300',     // Blue-Cyan
  'from-emerald-300 to-green-300', // Emerald-Green
  'from-amber-300 to-orange-300',  // Amber-Orange
  'from-purple-300 to-pink-300',   // Purple-Pink
];

export function ItemCard({ item, onQuickAdd, onViewDetails }: ItemCardProps) {
  // Use item ID hash to consistently assign the same color to each item
  const colorIndex = item.id.charCodeAt(0) % vibrantColors.length;
  const bgGradient = vibrantColors[colorIndex];

  return (
    <div
      className={`bg-gradient-to-br ${bgGradient} rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => onViewDetails(item)}
    >
      <div className="relative w-full aspect-square mb-3">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-contain rounded-2xl"
          sizes="(max-width: 768px) 45vw, 20vw"
        />
      </div>
      <h3 className="font-semibold text-2xl mb-3 tracking-tighter text-gray-900 h-16 line-clamp-2 flex items-center">{item.name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold py-1 px-4 rounded-full bg-white text-black backdrop-blur-sm">৳{item.price}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickAdd(item);
          }}
          className="bg-white text-orange-500 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity font-bold shadow-md"
          aria-label="Add to cart"
        >
          +
        </button>
      </div>
    </div>
  );
}
