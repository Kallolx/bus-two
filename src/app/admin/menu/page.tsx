'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import CategoryPill from '@/components/admin/category-pill';
import MenuItemToggle from '@/components/admin/menu-item-toggle';
import AddMenuItemForm from '@/components/admin/add-menu-item-form';
import AddCategoryModal from '@/components/admin/add-category-modal';
import { Category, MenuItemRecipe, InventoryItem } from '@/types';
import { Plus } from 'lucide-react';

// Mock data
const mockCategories: Category[] = [
  { id: 'hot-deals', name: 'Hot Deals', color: 'from-red-500 to-orange-500' },
  { id: 'drinks', name: 'Drinks', color: 'from-blue-400 to-blue-500' },
  { id: 'rice', name: 'Rice', color: 'from-yellow-400 to-yellow-500' },
];

const mockMenuItems: MenuItemRecipe[] = [
  {
    id: 'dynamit-chicken',
    name: 'Dynamit Chicken',
    description: 'Spicy grilled chicken',
    price: 150,
    categoryId: 'hot-deals',
    image: '',
    ingredients: [
      { inventoryItemId: 'chicken-breast', name: 'Chicken Breasts', quantity: 2, unit: 'pc' },
      { inventoryItemId: 'rice', name: 'Rice', quantity: 0.2, unit: 'kg' },
    ],
    customizations: [
      { id: 'spice', name: 'Extra Spiciness', type: 'toggle', price: 0 },
    ],
    isPublic: true,
  },
  {
    id: 'sunshine-burger',
    name: 'Sunshine Burger',
    description: 'Classic beef burger',
    price: 180,
    categoryId: 'hot-deals',
    image: '',
    ingredients: [
      { inventoryItemId: 'eggs', name: 'Eggs', quantity: 2, unit: 'pc' },
    ],
    customizations: [
      { id: 'cheese', name: 'Extra Cheese', type: 'toggle', price: 20 },
    ],
    isPublic: true,
  },
];

const mockInventory: InventoryItem[] = [
  { id: 'chicken-breast', name: 'Chicken Breasts', quantity: 50, unit: 'pc', lowStockThreshold: 10 },
  { id: 'rice', name: 'Rice', quantity: 15, unit: 'kg', lowStockThreshold: 5 },
  { id: 'eggs', name: 'Eggs', quantity: 100, unit: 'pc', lowStockThreshold: 20 },
];

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [activeCategory, setActiveCategory] = useState<string>(mockCategories[0].id);
  const [menuItems, setMenuItems] = useState<MenuItemRecipe[]>(mockMenuItems);
  const [inventoryItems] = useState<InventoryItem[]>(mockInventory);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemRecipe | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const activeCategoryItems = menuItems.filter(item => item.categoryId === activeCategory);
  const activeCategoryData = categories.find(cat => cat.id === activeCategory);

  const handleToggleItem = (itemId: string, isPublic: boolean) => {
    setMenuItems(menuItems.map(item => 
      item.id === itemId ? { ...item, isPublic } : item
    ));
  };

  const handleSaveItem = (itemData: Partial<MenuItemRecipe>) => {
    if (editingItem) {
      // Update existing
      setMenuItems(menuItems.map(item =>
        item.id === editingItem.id ? { ...item, ...itemData } as MenuItemRecipe : item
      ));
      setEditingItem(null);
    } else {
      // Add new
      const newItem: MenuItemRecipe = {
        ...itemData,
        id: `item-${Date.now()}`,
        categoryId: activeCategory,
      } as MenuItemRecipe;
      setMenuItems([...menuItems, newItem]);
      setIsAddingItem(false);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(menuItems.filter(item => item.id !== itemId));
    setEditingItem(null);
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      // Update existing
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id ? { ...cat, ...categoryData } as Category : cat
      ));
      setEditingCategory(null);
    } else {
      // Add new
      const newCategory: Category = {
        ...categoryData,
        id: `cat-${Date.now()}`,
      } as Category;
      setCategories([...categories, newCategory]);
      setActiveCategory(newCategory.id);
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Delete all items in this category
    setMenuItems(menuItems.filter(item => item.categoryId !== categoryId));
    // Delete category
    setCategories(categories.filter(cat => cat.id !== categoryId));
    // Switch to first category
    if (categories.length > 1) {
      setActiveCategory(categories.find(cat => cat.id !== categoryId)?.id || categories[0].id);
    }
    setEditingCategory(null);
  };

  return (
    <AdminLayout>
      {/* Categories */}
      <div className="sticky top-0 bg-background z-40 px-4 pt-6 pb-4 rounded-t-[2rem]">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              id={category.id}
              name={category.name}
              color={category.color}
              isActive={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
          <button
            onClick={() => setIsAddingCategory(true)}
            className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0 hover:shadow-xl transition-shadow"
            aria-label="Add category"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="px-4 pt-2 pb-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Add {activeCategoryData?.name} items
          </h2>
          <button
            onClick={() => setIsAddingItem(true)}
            className="px-5 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all"
          >
            + Add
          </button>
        </div>

        {/* Menu Items List */}
        <div className="space-y-3">
          {activeCategoryItems.map((item) => (
            <MenuItemToggle
              key={item.id}
              id={item.id}
              name={item.name}
              color={activeCategoryData?.color.replace('from-', '').replace('to-', '').split(' ')[0] || '#ff6b6b'}
              isPublic={item.isPublic}
              onToggle={handleToggleItem}
              onEdit={(id) => {
                const item = menuItems.find(i => i.id === id);
                if (item) setEditingItem(item);
              }}
            />
          ))}
        </div>

        {activeCategoryItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No items in this category</p>
            <button
              onClick={() => setIsAddingItem(true)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
            >
              Add First Item
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {(isAddingItem || editingItem) && (
        <AddMenuItemForm
          categoryId={activeCategory}
          existingItem={editingItem || undefined}
          inventoryItems={inventoryItems}
          onSave={handleSaveItem}
          onCancel={() => {
            setIsAddingItem(false);
            setEditingItem(null);
          }}
          onDelete={editingItem ? handleDeleteItem : undefined}
        />
      )}

      {/* Add/Edit Category Modal */}
      {(isAddingCategory || editingCategory) && (
        <AddCategoryModal
          existingCategory={editingCategory || undefined}
          onSave={handleSaveCategory}
          onCancel={() => {
            setIsAddingCategory(false);
            setEditingCategory(null);
          }}
          onDelete={editingCategory ? handleDeleteCategory : undefined}
        />
      )}
    </AdminLayout>
  );
}
