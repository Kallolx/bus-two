'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/admin-layout';
import InventoryItemCard, { InventoryItem } from '@/components/admin/inventory-item';
import { Plus, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { InventoryItemSkeleton } from '@/components/ui/skeleton';

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<InventoryItem, 'id'>) => void;
  editingItem?: InventoryItem | null;
  onUpdate?: (item: InventoryItem) => void;
}

function AddInventoryModal({ isOpen, onClose, onAdd, editingItem, onUpdate }: AddInventoryModalProps) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || '',
    quantity: editingItem?.quantity || 0,
    unit: (editingItem?.unit || 'kg') as 'kg' | 'pc' | 'ltr' | 'gm',
    lowStockThreshold: editingItem?.lowStockThreshold || 10,
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        quantity: editingItem.quantity,
        unit: editingItem.unit as 'kg' | 'pc' | 'ltr' | 'gm',
        lowStockThreshold: editingItem.lowStockThreshold,
      });
    } else {
      setFormData({ name: '', quantity: 0, unit: 'kg', lowStockThreshold: 10 });
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && onUpdate) {
      onUpdate({ ...editingItem, ...formData });
    } else {
      onAdd(formData);
    }
    setFormData({ name: '', quantity: 0, unit: 'kg', lowStockThreshold: 10 });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="e.g., Rice (Basmati)"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="kg">KG</option>
                <option value="pc">PC</option>
                <option value="ltr">LTR</option>
                <option value="gm">GM</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert</label>
            <input
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg active:scale-95 transition-all"
            >
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stallName, setStallName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
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

      // Load inventory items
      const { data: items } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (items) {
        setInventory(items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: parseFloat(item.quantity),
          unit: item.unit.toUpperCase() as 'KG' | 'PC' | 'LTR' | 'GM',
          lowStockThreshold: parseFloat(item.low_stock_threshold),
        })));
      }
    }
    setLoading(false);
  }

  async function handleUpdateQuantity(id: string, quantity: number) {
    const supabase = createClient();
    const { error } = await supabase
      .from('inventory_items')
      .update({ quantity })
      .eq('id', id);

    if (!error) {
      setInventory(inventory.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  }

  async function handleAddItem(item: Omit<InventoryItem, 'id'>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert({
          user_id: user.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit.toLowerCase(),
          low_stock_threshold: item.lowStockThreshold,
        })
        .select()
        .single();

      if (!error && data) {
        setInventory([...inventory, {
          id: data.id,
          name: data.name,
          quantity: parseFloat(data.quantity),
          unit: data.unit.toUpperCase() as 'KG' | 'PC' | 'LTR' | 'GM',
          lowStockThreshold: parseFloat(data.low_stock_threshold),
        }]);
      }
    }
  }

  async function handleEditItem(item: InventoryItem) {
    const supabase = createClient();
    const { error } = await supabase
      .from('inventory_items')
      .update({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit.toLowerCase(),
        low_stock_threshold: item.lowStockThreshold,
      })
      .eq('id', item.id);

    if (!error) {
      setInventory(inventory.map(i => i.id === item.id ? item : i));
      setEditingItem(null);
      setIsModalOpen(false);
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;
    
    const supabase = createClient();
    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', id);

    if (!error) {
      setInventory(inventory.filter(item => item.id !== id));
    }
  }

  function handleOpenEditModal(item: InventoryItem) {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingItem(null);
  }

  const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);
  const allItems = inventory.filter(item => item.quantity > item.lowStockThreshold);

  return (
    <AdminLayout stallName={stallName}>
      <AddInventoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddItem}
        editingItem={editingItem}
        onUpdate={handleEditItem}
      />
      <div className="px-4 pt-6 pb-8">
        {loading ? (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="animate-pulse bg-gray-200 h-6 w-32 rounded mb-4" />
              <div className="divide-y divide-gray-100">
                <InventoryItemSkeleton />
                <InventoryItemSkeleton />
                <InventoryItemSkeleton />
                <InventoryItemSkeleton />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Low Stock Alerts */}
            {lowStockItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-md font-semibold tracking-tighter text-black mb-4 flex items-center gap-2">
              Low Stock Alerts
            </h2>
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-red-600 rounded-2xl px-5 py-4 shadow-lg flex items-center justify-between border border-red-700 hover:bg-red-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src="/images/alert.png"
                      alt="Low stock alert"
                      className="w-6 h-6 flex-shrink-0"
                    />
                    <span className="font-bold text-md tracking-tighter text-white">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <span className="font-bold text-lg">{item.quantity} {item.unit}</span>
                    <span className="text-xs opacity-90">Left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Items Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">All items</h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {allItems.length > 0 ? (
              allItems.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdateQuantity}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteItem}
                />
              ))
            ) : (
              <p className="text-center py-8 text-gray-400">No items yet. Click "Add New" to start.</p>
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
