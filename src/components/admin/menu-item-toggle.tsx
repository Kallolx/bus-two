'use client';

import { Edit2, UtensilsCrossed } from 'lucide-react';

interface MenuItemToggleProps {
  id: string;
  name: string;
  image?: string;
  color: string;
  isPublic: boolean;
  onToggle: (id: string, isPublic: boolean) => void;
  onEdit: (id: string) => void;
}

export default function MenuItemToggle({ 
  id, 
  name, 
  image,
  color, 
  isPublic, 
  onToggle, 
  onEdit 
}: MenuItemToggleProps) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div 
          className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200" 
          style={{ borderColor: color, borderWidth: '2px' }}
        >
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
              <UtensilsCrossed className="w-5 h-5" style={{ color }} />
            </div>
          )}
        </div>
        <span className="font-medium text-gray-900 truncate">{name}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => onEdit(id)}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all"
          aria-label={`Edit ${name}`}
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
        
        <button
          onClick={() => onToggle(id, !isPublic)}
          className={`relative w-12 h-7 rounded-full transition-colors active:scale-95 ${
            isPublic ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gray-300'
          }`}
          aria-label={`Toggle ${name} visibility`}
        >
          <div
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
              isPublic ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
