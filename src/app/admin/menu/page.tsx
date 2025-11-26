'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import CategoryPill from '@/components/admin/category-pill';
import MenuItemToggle from '@/components/admin/menu-item-toggle';
import AddMenuItemForm from '@/components/admin/add-menu-item-form';
import AddCategoryModal from '@/components/admin/add-category-modal';
import { Category, MenuItemRecipe, InventoryItem } from '@/types';
import { Plus, Loader2, UtensilsCrossed } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { MenuItemSkeleton } from '@/components/ui/skeleton';

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [menuItems, setMenuItems] = useState<MenuItemRecipe[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [stallName, setStallName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemRecipe | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Load user profile
      const { data: profile } = await supabase
        .from('users')
        .select('stall_name')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setStallName(profile.stall_name);
      }

      // Load categories
      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order');

      if (cats && cats.length > 0) {
        const categoriesData = cats.map(cat => ({
          id: cat.id,
          name: cat.name,
          color: cat.color,
        }));
        setCategories(categoriesData);
        setActiveCategory(categoriesData[0].id);
        
        // Load menu items
        await loadMenuItems(user.id);
      }

      // Load inventory
      const { data: inv } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (inv) {
        setInventoryItems(inv.map(item => ({
          id: item.id,
          name: item.name,
          quantity: parseFloat(item.quantity),
          unit: item.unit.toLowerCase() as 'kg' | 'pc' | 'ltr' | 'gm',
          lowStockThreshold: parseFloat(item.low_stock_threshold),
        })));
      }
    }
    setLoading(false);
  }

  async function loadMenuItems(userId: string) {
    const supabase = createClient();
    
    // Load menu items with ingredients
    const { data: items } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_item_ingredients (
          quantity,
          inventory_item_id,
          inventory_items (
            id,
            name,
            unit
          )
        ),
        modifiers (
          id,
          name,
          type,
          price,
          enabled
        )
      `)
      .eq('user_id', userId)
      .order('sort_order');

    if (items) {
      setMenuItems(items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: parseFloat(item.price),
        categoryId: item.category_id,
        image: item.image_url || '',
        ingredients: (item.menu_item_ingredients || []).map((ing: any) => ({
          inventoryItemId: ing.inventory_item_id,
          name: ing.inventory_items.name,
          quantity: parseFloat(ing.quantity),
          unit: ing.inventory_items.unit,
        })),
        customizations: (item.modifiers || []).map((mod: any) => ({
          id: mod.id,
          name: mod.name,
          type: mod.type,
          price: parseFloat(mod.price || 0),
          enabled: mod.enabled ?? true,
        })),
        isPublic: item.is_public,
      })));
    }
  }

  const activeCategoryItems = menuItems.filter(item => item.categoryId === activeCategory);
  const activeCategoryData = categories.find(cat => cat.id === activeCategory);

  async function handleToggleItem(itemId: string, isPublic: boolean) {
    const supabase = createClient();
    const { error } = await supabase
      .from('menu_items')
      .update({ is_public: isPublic })
      .eq('id', itemId);

    if (!error) {
      setMenuItems(menuItems.map(item => 
        item.id === itemId ? { ...item, isPublic } : item
      ));
    }
  }

  async function handleSaveItem(itemData: Partial<MenuItemRecipe>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    if (editingItem) {
      // Update existing item
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          image_url: itemData.image,
          is_public: itemData.isPublic,
        })
        .eq('id', editingItem.id);

      if (!error) {
        // Delete old ingredients and modifiers
        await supabase.from('menu_item_ingredients').delete().eq('menu_item_id', editingItem.id);
        await supabase.from('modifiers').delete().eq('menu_item_id', editingItem.id);
        
        // Add new ingredients
        if (itemData.ingredients && itemData.ingredients.length > 0) {
          await supabase.from('menu_item_ingredients').insert(
            itemData.ingredients.map(ing => ({
              menu_item_id: editingItem.id,
              inventory_item_id: ing.inventoryItemId,
              quantity: ing.quantity,
            }))
          );
        }

        // Add new modifiers
        if (itemData.customizations && itemData.customizations.length > 0) {
          await supabase.from('modifiers').insert(
            itemData.customizations.map(mod => ({
              menu_item_id: editingItem.id,
              name: mod.name,
              type: mod.type,
              price: mod.price || 0,
              enabled: mod.enabled ?? true,
            }))
          );
        }

        await loadMenuItems(user.id);
        setEditingItem(null);
      }
    } else {
      // Add new item
      const { data: newItem, error } = await supabase
        .from('menu_items')
        .insert({
          user_id: user.id,
          category_id: activeCategory,
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          image_url: itemData.image,
          is_public: itemData.isPublic || false,
        })
        .select()
        .single();

      if (!error && newItem) {
        // Add ingredients
        if (itemData.ingredients && itemData.ingredients.length > 0) {
          await supabase.from('menu_item_ingredients').insert(
            itemData.ingredients.map(ing => ({
              menu_item_id: newItem.id,
              inventory_item_id: ing.inventoryItemId,
              quantity: ing.quantity,
            }))
          );
        }

        // Add modifiers
        if (itemData.customizations && itemData.customizations.length > 0) {
          await supabase.from('modifiers').insert(
            itemData.customizations.map(mod => ({
              menu_item_id: newItem.id,
              name: mod.name,
              type: mod.type,
              price: mod.price || 0,
              enabled: mod.enabled ?? true,
            }))
          );
        }

        await loadMenuItems(user.id);
        setIsAddingItem(false);
      }
    }
  }

  async function handleDeleteItem(itemId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', itemId);

    if (!error) {
      setMenuItems(menuItems.filter(item => item.id !== itemId));
      setEditingItem(null);
    }
  }

  async function handleSaveCategory(categoryData: Partial<Category>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    if (editingCategory) {
      // Update existing
      const { error } = await supabase
        .from('categories')
        .update({
          name: categoryData.name,
          color: categoryData.color,
        })
        .eq('id', editingCategory.id);

      if (!error) {
        setCategories(categories.map(cat =>
          cat.id === editingCategory.id ? { ...cat, ...categoryData } as Category : cat
        ));
        setEditingCategory(null);
      }
    } else {
      // Add new
      const { data: newCat, error } = await supabase
        .from('categories')
        .insert({
          user_id: user.id,
          name: categoryData.name,
          color: categoryData.color,
          sort_order: categories.length,
        })
        .select()
        .single();

      if (!error && newCat) {
        const newCategory: Category = {
          id: newCat.id,
          name: newCat.name,
          color: newCat.color,
        };
        setCategories([...categories, newCategory]);
        setActiveCategory(newCategory.id);
        setIsAddingCategory(false);
      }
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (!error) {
      setMenuItems(menuItems.filter(item => item.categoryId !== categoryId));
      setCategories(categories.filter(cat => cat.id !== categoryId));
      if (categories.length > 1) {
        setActiveCategory(categories.find(cat => cat.id !== categoryId)?.id || categories[0].id);
      }
      setEditingCategory(null);
    }
  }

  if (loading) {
    return (
      <AdminLayout stallName={stallName}>
        <div className="sticky top-0 bg-background z-40 px-4 pt-6 pb-4 rounded-t-[2rem]">
          <div className="flex items-center gap-2">
            <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-full" />
            <div className="animate-pulse bg-gray-200 h-10 w-28 rounded-full" />
            <div className="animate-pulse bg-gray-200 h-10 w-20 rounded-full" />
          </div>
        </div>
        <div className="px-4 pt-6 pb-8">
          <div className="space-y-3">
            <MenuItemSkeleton />
            <MenuItemSkeleton />
            <MenuItemSkeleton />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (categories.length === 0) {
    return (
      <AdminLayout stallName={stallName}>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Categories Yet</h2>
            <p className="text-gray-600 mb-6">Create your first category to start adding menu items</p>
            <button
              onClick={() => setIsAddingCategory(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create First Category
            </button>
          </div>
        </div>
        {isAddingCategory && (
          <AddCategoryModal
            onSave={handleSaveCategory}
            onCancel={() => setIsAddingCategory(false)}
          />
        )}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout stallName={stallName}>
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
              onEdit={(id) => {
                const cat = categories.find(c => c.id === id);
                if (cat) setEditingCategory(cat);
                setIsAddingCategory(true);
              }}
              onDelete={handleDeleteCategory}
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

        <div className="space-y-3">
          {activeCategoryItems.map((item) => (
            <MenuItemToggle
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.image}
              color={activeCategoryData?.color || '#ff6b6b'}
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
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mb-6">
              <UtensilsCrossed className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No items in this category</h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">
              Start building your menu by adding delicious items to this category
            </p>
            <button
              onClick={() => setIsAddingItem(true)}
              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add First Item
            </button>
          </div>
        )}
      </div>

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
