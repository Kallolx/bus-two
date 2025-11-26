'use client';

import { useState, useRef, useEffect } from 'react';
import { Minus, Plus, Beef, Wheat, Milk, Fish, Egg, Carrot, Apple, Droplet, FlaskConical, MoreVertical, Edit2, Trash2 } from 'lucide-react';

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
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLowStock = item.quantity <= item.lowStockThreshold;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleEdit = () => {
    onEdit?.(item);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete?.(item.id);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between py-3 gap-2 sm:gap-4">
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          {getIngredientIcon(item.name)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base">{item.name}</h4>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Quantity Controls */}
        <button
          onClick={handleDecrease}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-orange-300 flex items-center justify-center hover:bg-orange-50 active:scale-90 transition-all flex-shrink-0"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3 h-3 text-orange-600" />
        </button>
        
        <div className="w-12 sm:w-16 text-center flex-shrink-0">
          <span className={`font-bold text-xs sm:text-sm ${isLowStock ? 'text-red-500' : 'text-gray-900'}`}>
            {item.quantity}<span className="hidden sm:inline"> {item.unit}</span>
          </span>
        </div>

        <button
          onClick={handleIncrease}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 active:scale-90 transition-all shadow-sm flex-shrink-0"
          aria-label="Increase quantity"
        >
          <Plus className="w-3 h-3 text-white" />
        </button>

        {/* 3-Dot Menu Dropdown */}
        <div className="relative ml-1 sm:ml-2 flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
            aria-label="Menu"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-gray-100"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
