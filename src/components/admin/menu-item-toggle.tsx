'use client';

import { Edit2 } from 'lucide-react';

interface MenuItemToggleProps {
  id: string;
  name: string;
  color: string;
  isPublic: boolean;
  onToggle: (id: string, isPublic: boolean) => void;
  onEdit: (id: string) => void;
}

export default function MenuItemToggle({ 
  id, 
  name, 
  color, 
  isPublic, 
  onToggle, 
  onEdit 
}: MenuItemToggleProps) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div 
          className={`w-10 h-10 rounded-full flex-shrink-0`} 
          style={{ background: color }}
        />
        <span className="font-medium text-gray-900">{name}</span>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          onClick={() => onEdit(id)}
          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          aria-label={`Edit ${name}`}
        >
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
        
        <button
          onClick={() => onToggle(id, !isPublic)}
          className={`relative w-12 h-7 rounded-full transition-colors ${
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
