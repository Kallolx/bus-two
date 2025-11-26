'use client';

import { Edit2, Trash2 } from 'lucide-react';

interface CategoryPillProps {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function CategoryPill({ 
  id, 
  name, 
  color, 
  isActive, 
  onClick,
  onEdit,
  onDelete
}: CategoryPillProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete category "${name}"? This will also delete all items in this category.`)) {
      onDelete?.(id);
    }
  };

  return (
    <div className="relative inline-flex items-center gap-1">
      <button
        onClick={onClick}
        className={`px-5 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
          isActive
            ? `bg-gradient-to-r ${color} text-white shadow-md`
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
      >
        {name}
      </button>
      {isActive && (onEdit || onDelete) && (
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={handleEdit}
              className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              title="Edit category"
            >
              <Edit2 className="w-3.5 h-3.5 text-gray-600" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
              title="Delete category"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
