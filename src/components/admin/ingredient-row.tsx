'use client';

import { Trash2 } from 'lucide-react';
import { InventoryItem } from '@/types';

interface IngredientRowProps {
  inventoryItem: InventoryItem;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function IngredientRow({
  inventoryItem,
  quantity,
  onQuantityChange,
  onRemove,
}: IngredientRowProps) {
  return (
    <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
        <span className="font-medium text-gray-900">{inventoryItem.name}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(parseFloat(e.target.value) || 0)}
          className="w-16 px-2 py-1 text-center bg-white border border-gray-200 rounded-lg text-gray-900 font-medium"
          step="0.1"
          min="0"
        />
        
        <span className="px-3 py-1 bg-gray-300 rounded-full text-sm font-medium text-gray-600 min-w-[3rem] text-center">
          {inventoryItem.unit}
        </span>
        
        <button
          onClick={onRemove}
          className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
          aria-label="Remove ingredient"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
}
