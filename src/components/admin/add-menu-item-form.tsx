'use client';

import { useState } from 'react';
import { X, Plus, Upload } from 'lucide-react';
import { MenuItemRecipe, Ingredient, Modifier, InventoryItem } from '@/types';
import IngredientRow from './ingredient-row';

interface AddMenuItemFormProps {
  categoryId: string;
  existingItem?: MenuItemRecipe;
  inventoryItems: InventoryItem[];
  onSave: (item: Partial<MenuItemRecipe>) => void;
  onCancel: () => void;
  onDelete?: (itemId: string) => void;
}

export default function AddMenuItemForm({
  categoryId,
  existingItem,
  inventoryItems,
  onSave,
  onCancel,
  onDelete,
}: AddMenuItemFormProps) {
  const [formData, setFormData] = useState<Partial<MenuItemRecipe>>({
    id: existingItem?.id || '',
    name: existingItem?.name || '',
    description: existingItem?.description || '',
    price: existingItem?.price || 0,
    categoryId: existingItem?.categoryId || categoryId,
    image: existingItem?.image || '',
    ingredients: existingItem?.ingredients || [],
    customizations: existingItem?.customizations || [],
    isPublic: existingItem?.isPublic ?? true,
  });

  const [selectedInventoryId, setSelectedInventoryId] = useState<string>('');

  const handleAddIngredient = () => {
    if (!selectedInventoryId) return;
    
    const inventoryItem = inventoryItems.find(item => item.id === selectedInventoryId);
    if (!inventoryItem) return;

    const newIngredient: Ingredient = {
      inventoryItemId: inventoryItem.id,
      name: inventoryItem.name,
      quantity: 1,
      unit: inventoryItem.unit,
    };

    setFormData({
      ...formData,
      ingredients: [...(formData.ingredients || []), newIngredient],
    });
    setSelectedInventoryId('');
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients?.filter((_, i) => i !== index) || [],
    });
  };

  const handleIngredientQuantityChange = (index: number, quantity: number) => {
    const updatedIngredients = [...(formData.ingredients || [])];
    updatedIngredients[index] = { ...updatedIngredients[index], quantity };
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const handleAddCustomization = () => {
    const newCustomization: Modifier = {
      id: `custom-${Date.now()}`,
      name: '',
      type: 'toggle',
      price: 0,
    };
    setFormData({
      ...formData,
      customizations: [...(formData.customizations || []), newCustomization],
    });
  };

  const handleUpdateCustomization = (index: number, field: keyof Modifier, value: any) => {
    const updatedCustomizations = [...(formData.customizations || [])];
    updatedCustomizations[index] = { ...updatedCustomizations[index], [field]: value };
    setFormData({ ...formData, customizations: updatedCustomizations });
  };

  const handleRemoveCustomization = (index: number) => {
    setFormData({
      ...formData,
      customizations: formData.customizations?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-[2rem] sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-[2rem] sm:rounded-t-3xl z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {existingItem ? 'Edit Menu Item' : 'Add Menu Item'}
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
          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  // Handle image upload
                  const file = e.target.files?.[0];
                  if (file) {
                    // In production, upload to cloud storage
                    setFormData({ ...formData, image: URL.createObjectURL(file) });
                  }
                }}
              />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </label>
          </div>

          {/* Basic Details */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Basic Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                <input
                  type="number"
                  placeholder="Enter product price"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <span className="text-sm font-medium text-gray-500 pr-2">BDT</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          {/* Order Customizations */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Order Customizations</h3>
            <div className="space-y-3">
              {formData.customizations?.map((custom, index) => (
                <div key={custom.id} className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Customization name"
                      value={custom.name}
                      onChange={(e) => handleUpdateCustomization(index, 'name', e.target.value)}
                      className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRemoveCustomization(index)}
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                    <button
                      className={`relative w-12 h-7 rounded-full transition-colors bg-gradient-to-r from-yellow-400 to-yellow-500`}
                    >
                      <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={handleAddCustomization}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                Add +
              </button>
            </div>
          </div>

          {/* Add Ingredients */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Add Ingredients</h3>
            <div className="space-y-3">
              {formData.ingredients?.map((ingredient, index) => {
                const inventoryItem = inventoryItems.find(item => item.id === ingredient.inventoryItemId);
                if (!inventoryItem) return null;
                
                return (
                  <IngredientRow
                    key={ingredient.inventoryItemId}
                    inventoryItem={inventoryItem}
                    quantity={ingredient.quantity}
                    onQuantityChange={(qty) => handleIngredientQuantityChange(index, qty)}
                    onRemove={() => handleRemoveIngredient(index)}
                  />
                );
              })}
              
              {/* Add Ingredient Selector */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedInventoryId}
                  onChange={(e) => setSelectedInventoryId(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">Select ingredient...</option>
                  {inventoryItems
                    .filter(item => !formData.ingredients?.some(ing => ing.inventoryItemId === item.id))
                    .map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.quantity} {item.unit})
                      </option>
                    ))}
                </select>
                <button
                  onClick={handleAddIngredient}
                  disabled={!selectedInventoryId}
                  className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Add
                </button>
              </div>
              
              <button
                onClick={handleAddIngredient}
                disabled={!selectedInventoryId}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add +
              </button>
            </div>
          </div>

          {/* Inventory Tracking Toggle */}
          <div className="bg-gray-50 rounded-2xl px-4 py-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Enable inventory tracking for this item</p>
                  <p className="text-sm text-gray-500 mt-0.5">Auto deducts items and removes form inventory</p>
                </div>
              </div>
              
              <button
                onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                  formData.isPublic ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    formData.isPublic ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          {existingItem && onDelete && (
            <button
              onClick={() => onDelete(existingItem.id)}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              Delete
            </button>
          )}
          
          <button
            onClick={() => onSave(formData)}
            className="flex-1 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
