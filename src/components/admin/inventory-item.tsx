'use client';

import { Minus, Plus, Beef, Wheat, Milk, Fish, Egg, Carrot, Apple, Droplet, FlaskConical, Edit2, Trash2 } from 'lucide-react';

// Icon mapping for different ingredients
const getIngredientIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('rice') || lowerName.includes('flour') || lowerName.includes('wheat') || lowerName.includes('bread')) {
    return <Wheat className="w-5 h-5 text-amber-600" />;
  }
  if (lowerName.includes('chicken') || lowerName.includes('beef') || lowerName.includes('meat') || lowerName.includes('mutton')) {
    return <Beef className="w-5 h-5 text-red-600" />;
  }
  if (lowerName.includes('fish') || lowerName.includes('prawn') || lowerName.includes('seafood')) {
    return <Fish className="w-5 h-5 text-blue-600" />;
  }
  if (lowerName.includes('milk') || lowerName.includes('cream') || lowerName.includes('cheese') || lowerName.includes('butter')) {
    return <Milk className="w-5 h-5 text-blue-400" />;
  }
  if (lowerName.includes('egg')) {
    return <Egg className="w-5 h-5 text-yellow-600" />;
  }
  if (lowerName.includes('oil') || lowerName.includes('ghee')) {
    return <Droplet className="w-5 h-5 text-yellow-500" />;
  }
  if (lowerName.includes('vegetable') || lowerName.includes('onion') || lowerName.includes('tomato') || lowerName.includes('potato') || lowerName.includes('carrot')) {
    return <Carrot className="w-5 h-5 text-orange-600" />;
  }
  if (lowerName.includes('spice') || lowerName.includes('salt') || lowerName.includes('pepper') || lowerName.includes('masala')) {
    return <FlaskConical className="w-5 h-5 text-purple-600" />;
  }
  
  // Default icon
  return <Apple className="w-5 h-5 text-green-600" />;
};

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
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: string) => void;
}

export default function InventoryItemCard({ item, onUpdate, onEdit, onDelete }: InventoryItemCardProps) {
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
    <div className="flex items-center justify-between py-4 gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          {getIngredientIcon(item.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Edit & Delete Buttons */}
        <button
          onClick={() => onEdit?.(item)}
          className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center hover:bg-blue-100 active:scale-95 transition-all"
          aria-label="Edit item"
        >
          <Edit2 className="w-4 h-4 text-blue-600" />
        </button>
        <button
          onClick={() => onDelete?.(item.id)}
          className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 active:scale-95 transition-all"
          aria-label="Delete item"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>

        {/* Quantity Controls */}
        <button
          onClick={handleDecrease}
          className="w-7 h-7 rounded-full border-2 border-orange-300 flex items-center justify-center hover:bg-orange-50 active:scale-90 transition-all"
        >
          <Minus className="w-3 h-3 text-orange-600" />
        </button>
        
        <div className="min-w-[70px] text-center">
          <span className={`font-bold text-sm ${isLowStock ? 'text-red-500' : 'text-gray-900'}`}>
            {item.quantity} {item.unit}
          </span>
        </div>

        <button
          onClick={handleIncrease}
          className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 active:scale-90 transition-all shadow-sm"
        >
          <Plus className="w-3 h-3 text-white" />
        </button>
      </div>
    </div>
  );
}
