'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import OrderCard from '@/components/admin/order-card';
import { Order } from '@/types';
import { Plus } from 'lucide-react';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '138',
    token: 138,
    items: [
      {
        menuItemId: 'dynamit-chicken',
        name: 'Dynamit Chicken',
        price: 150,
        image: '',
        quantity: 3,
        selectedModifiers: { spice: 'Hot' },
        subtotal: 450,
      },
      {
        menuItemId: 'sunshine-burger',
        name: 'Sunshine Burger',
        price: 180,
        image: '',
        quantity: 2,
        selectedModifiers: {},
        subtotal: 360,
      },
      {
        menuItemId: 'dynamit-chicken',
        name: 'Dynamit Chicken',
        price: 150,
        image: '',
        quantity: 3,
        selectedModifiers: {},
        subtotal: 450,
      },
    ],
    total: 880.50,
    fulfillment: { type: 'dine-in' },
    paymentMethod: 'cash',
    status: 'waiting',
    createdAt: new Date().toISOString(),
  },
  {
    id: '139',
    token: 139,
    items: [
      {
        menuItemId: 'dynamit-chicken',
        name: 'Dynamit Chicken',
        price: 150,
        image: '',
        quantity: 3,
        selectedModifiers: {},
        subtotal: 450,
      },
      {
        menuItemId: 'sunshine-burger',
        name: 'Sunshine Burger',
        price: 180,
        image: '',
        quantity: 2,
        selectedModifiers: {},
        subtotal: 360,
      },
      {
        menuItemId: 'dynamit-chicken',
        name: 'Dynamit Chicken',
        price: 150,
        image: '',
        quantity: 3,
        selectedModifiers: {},
        subtotal: 450,
      },
    ],
    total: 880.50,
    fulfillment: { type: 'takeaway' },
    paymentMethod: 'cash',
    status: 'waiting',
    createdAt: new Date().toISOString(),
  },
  {
    id: '140',
    token: 140,
    items: [
      {
        menuItemId: 'dynamit-chicken',
        name: 'Dynamit Chicken',
        price: 150,
        image: '',
        quantity: 3,
        selectedModifiers: {},
        subtotal: 450,
      },
      {
        menuItemId: 'sunshine-burger',
        name: 'Sunshine Burger',
        price: 180,
        image: '',
        quantity: 2,
        selectedModifiers: {},
        subtotal: 360,
      },
      {
        menuItemId: 'dynamit-chicken',
        name: 'Dynamit Chicken',
        price: 150,
        image: '',
        quantity: 3,
        selectedModifiers: {},
        subtotal: 450,
      },
    ],
    total: 880.50,
    fulfillment: { type: 'dine-in' },
    paymentMethod: 'cash',
    status: 'cooking',
    createdAt: new Date().toISOString(),
  },
  {
    id: '141',
    token: 141,
    items: [
      {
        menuItemId: 'dynamit-chicken',
        name: 'Dynamit Chicken',
        price: 150,
        image: '',
        quantity: 3,
        selectedModifiers: {},
        subtotal: 450,
      },
      {
        menuItemId: 'sunshine-burger',
        name: 'Sunshine Burger',
        price: 180,
        image: '',
        quantity: 2,
        selectedModifiers: {},
        subtotal: 360,
      },
      {
        menuItemId: 'dynamit-chicken',
        name: 'Dynamit Chicken',
        price: 150,
        image: '',
        quantity: 3,
        selectedModifiers: {},
        subtotal: 450,
      },
    ],
    total: 880.50,
    fulfillment: { type: 'delivery', deliveryInfo: { name: 'John Doe', phone: '123456789', address: '123 Main St' } },
    paymentMethod: 'cash',
    status: 'cooking',
    createdAt: new Date().toISOString(),
  },
];

type OrderTab = 'incoming' | 'cooking' | 'ready';

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>('incoming');
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const tabs = [
    { id: 'incoming' as OrderTab, label: 'Incoming', color: 'from-orange-400 to-orange-500' },
    { id: 'cooking' as OrderTab, label: 'Cooking', color: 'from-blue-400 to-blue-500' },
    { id: 'ready' as OrderTab, label: 'Ready', color: 'from-gray-300 to-gray-400' },
  ];

  const handleConfirmOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'cooking' as Order['status'] } : order
    ));
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'incoming') return order.status === 'waiting';
    if (activeTab === 'cooking') return order.status === 'cooking';
    if (activeTab === 'ready') return order.status === 'ready';
    return false;
  });

  return (
    <AdminLayout>
      {/* Tabs */}
      <div className="sticky top-0 bg-background z-40 px-4 pt-6 pb-4 rounded-t-[2rem]">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg ml-2">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Order Cards Grid */}
      <div className="px-4 pt-2 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onConfirm={handleConfirmOrder}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No orders in this section</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
