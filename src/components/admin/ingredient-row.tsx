'use client';

import { Trash2, Beef, Wheat, Milk, Fish, Egg, Carrot, Apple, Droplet, FlaskConical } from 'lucide-react';
import { InventoryItem } from '@/types';

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
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          {getIngredientIcon(inventoryItem.name)}
        </div>
        <span className="font-medium text-gray-900 truncate">{inventoryItem.name}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={quantity}
          onChange={(e) => onQuantityChange(parseFloat(e.target.value) || 0)}
          className="w-16 px-2 py-1 text-center bg-white border border-gray-200 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
          step="0.1"
          min="0"
        />
        
        <span className="px-3 py-1 bg-gray-300 rounded-full text-sm font-medium text-gray-600 min-w-[3rem] text-center">
          {inventoryItem.unit}
        </span>
        
        <button
          onClick={onRemove}
          className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 active:scale-90 transition-all"
          aria-label="Remove ingredient"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
}
