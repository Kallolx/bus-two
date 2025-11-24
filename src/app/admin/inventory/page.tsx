'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import InventoryItemCard, { InventoryItem } from '@/components/admin/inventory-item';
import { Plus } from 'lucide-react';

// Mock inventory data
const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Rice (Basmati)', quantity: 10, unit: 'KG', lowStockThreshold: 15 },
  { id: '2', name: 'Milk', quantity: 29, unit: 'PC', lowStockThreshold: 10 },
  { id: '3', name: 'Chicken Legs', quantity: 38, unit: 'PC', lowStockThreshold: 20 },
  { id: '4', name: 'Chicken Breast', quantity: 17, unit: 'PC', lowStockThreshold: 15 },
  { id: '5', name: 'Burger Bread', quantity: 60, unit: 'PC', lowStockThreshold: 30 },
  { id: '6', name: 'Tomato Sauce', quantity: 3, unit: 'PC', lowStockThreshold: 5 },
  { id: '7', name: 'Chicken Leg', quantity: 7, unit: 'PC', lowStockThreshold: 10 },
  { id: '8', name: 'Cheese Slices', quantity: 45, unit: 'PC', lowStockThreshold: 20 },
  { id: '9', name: 'Lettuce', quantity: 25, unit: 'PC', lowStockThreshold: 15 },
  { id: '10', name: 'Onions', quantity: 50, unit: 'KG', lowStockThreshold: 20 },
];

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);
  const allItems = inventory.filter(item => item.quantity > item.lowStockThreshold);

  return (
    <AdminLayout>
      <div className="px-4 pt-6 pb-8">
        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Inventory</h2>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-full px-6 py-3 shadow-sm border-2 border-red-300 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-500 font-bold text-sm">!</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-red-500">{item.quantity} {item.unit}</span>
                    <span className="text-xs text-gray-400">Left</span>
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
            <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {allItems.map((item) => (
              <InventoryItemCard
                key={item.id}
                item={item}
                onUpdate={handleUpdateQuantity}
              />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
