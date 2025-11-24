'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Category } from '@/types';

interface AddCategoryModalProps {
  existingCategory?: Category;
  onSave: (category: Partial<Category>) => void;
  onCancel: () => void;
  onDelete?: (categoryId: string) => void;
}

const colorOptions = [
  { name: 'Red-Orange', gradient: 'from-red-500 to-orange-500' },
  { name: 'Blue', gradient: 'from-blue-400 to-blue-500' },
  { name: 'Yellow', gradient: 'from-yellow-400 to-yellow-500' },
  { name: 'Green', gradient: 'from-green-400 to-green-500' },
  { name: 'Purple', gradient: 'from-purple-400 to-purple-500' },
  { name: 'Pink', gradient: 'from-pink-400 to-pink-500' },
  { name: 'Teal', gradient: 'from-teal-400 to-teal-500' },
  { name: 'Indigo', gradient: 'from-indigo-400 to-indigo-500' },
];

export default function AddCategoryModal({
  existingCategory,
  onSave,
  onCancel,
  onDelete,
}: AddCategoryModalProps) {
  const [formData, setFormData] = useState<Partial<Category>>({
    id: existingCategory?.id || '',
    name: existingCategory?.name || '',
    color: existingCategory?.color || colorOptions[0].gradient,
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-[2rem] sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-[2rem] sm:rounded-t-3xl z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {existingCategory ? 'Edit Category' : 'Add Category'}
          </h2>
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g., Hot Deals, Drinks, Rice"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category Color
            </label>
            <div className="grid grid-cols-2 gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.gradient}
                  onClick={() => setFormData({ ...formData, color: option.gradient })}
                  className={`relative px-4 py-3 rounded-2xl text-left transition-all ${
                    formData.color === option.gradient
                      ? 'ring-2 ring-orange-400 ring-offset-2'
                      : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-full h-12 bg-gradient-to-r ${option.gradient} rounded-xl mb-2`}
                  />
                  <p className="text-sm font-medium text-gray-700 text-center">
                    {option.name}
                  </p>
                  {formData.color === option.gradient && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="flex items-center justify-center py-4">
              <button
                className={`px-6 py-2.5 rounded-full font-medium bg-gradient-to-r ${formData.color} text-white shadow-lg`}
              >
                {formData.name || 'Category Name'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex items-center gap-3 z-10">
          {existingCategory && onDelete && (
            <button
              onClick={() => onDelete(existingCategory.id)}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              Delete
            </button>
          )}
          
          <button
            onClick={() => onSave(formData)}
            disabled={!formData.name}
            className="flex-1 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
