'use client';

import { Minus, Plus } from 'lucide-react';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}

interface InventoryItemCardProps {
  item: InventoryItem;
  onUpdate?: (id: string, quantity: number) => void;
}

export default function InventoryItemCard({ item, onUpdate }: InventoryItemCardProps) {
  const isLowStock = item.quantity <= item.lowStockThreshold;

  const handleIncrease = () => {
    if (onUpdate) {
      onUpdate(item.id, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (onUpdate && item.quantity > 0) {
      onUpdate(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div>
          <h4 className="font-medium text-gray-900">{item.name}</h4>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrease}
          className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Minus className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="min-w-[80px] text-center">
          <span className={`font-bold text-lg ${isLowStock ? 'text-red-500' : 'text-gray-900'}`}>
            {item.quantity} {item.unit}
          </span>
        </div>

        <button
          onClick={handleIncrease}
          className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
