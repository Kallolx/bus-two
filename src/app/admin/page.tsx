'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/admin-layout';
import OrderCard from '@/components/admin/order-card';
import { Order } from '@/types';
import { ShoppingBag, Clock, ChefHat, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { OrderCardSkeleton } from '@/components/ui/skeleton';

type OrderTab = 'incoming' | 'cooking' | 'ready';

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>('incoming');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stallName, setStallName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (userId) {
      loadOrders();
    }
  }, [userId]);

  async function loadUserProfile() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setUserId(user.id);
      const { data: profile } = await supabase
        .from('users')
        .select('stall_name')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setStallName(profile.stall_name);
      }
    }
  }

  async function loadOrders() {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const transformedOrders: Order[] = data.map((order: any) => ({
        id: order.id,
        token: order.token,
        items: order.order_items.map((item: any) => ({
          menuItemId: item.menu_item_id,
          name: item.menu_item_name,
          price: item.menu_item_price,
          image: '/placeholder-food.jpg',
          quantity: item.quantity,
          selectedModifiers: item.selected_modifiers || {},
          subtotal: item.subtotal,
        })),
        total: order.total,
        fulfillment: {
          type: order.fulfillment_type,
          deliveryInfo: order.customer_name ? {
            name: order.customer_name,
            phone: order.customer_phone,
            address: order.delivery_address,
          } : undefined,
        },
        paymentMethod: order.payment_method,
        status: order.status,
        createdAt: order.created_at,
      }));
      setOrders(transformedOrders);
    }
    setLoading(false);
  }

  const tabs = [
    { id: 'incoming' as OrderTab, label: 'Incoming', color: 'from-orange-400 to-orange-500' },
    { id: 'cooking' as OrderTab, label: 'Cooking', color: 'from-blue-400 to-blue-500' },
    { id: 'ready' as OrderTab, label: 'Ready', color: 'from-gray-300 to-gray-400' },
  ];

  async function handleConfirmOrder(orderId: string) {
    const supabase = createClient();
    await supabase
      .from('orders')
      .update({ status: 'cooking' })
      .eq('id', orderId);
    
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'cooking' as Order['status'] } : order
    ));
  }

  async function handleStatusChange(orderId: string, status: Order['status']) {
    const supabase = createClient();
    await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'incoming') return order.status === 'waiting';
    if (activeTab === 'cooking') return order.status === 'cooking';
    if (activeTab === 'ready') return order.status === 'ready';
    return false;
  });

  if (loading) {
    return (
      <AdminLayout stallName={stallName}>
        <div className="sticky top-0 bg-background z-40 px-4 pt-6 pb-4 rounded-t-[2rem]">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <div key={tab.id} className="animate-pulse bg-gray-200 h-10 w-24 rounded-full" />
            ))}
          </div>
        </div>
        <div className="px-4 pt-2 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout stallName={stallName}>
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
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mb-6">
              {activeTab === 'incoming' && <ShoppingBag className="w-12 h-12 text-orange-500" />}
              {activeTab === 'cooking' && <ChefHat className="w-12 h-12 text-blue-500" />}
              {activeTab === 'ready' && <CheckCircle className="w-12 h-12 text-gray-500" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeTab === 'incoming' && 'No incoming orders'}
              {activeTab === 'cooking' && 'No orders being prepared'}
              {activeTab === 'ready' && 'No ready orders'}
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">
              {activeTab === 'incoming' && "You're all caught up! New orders will appear here when customers place them."}
              {activeTab === 'cooking' && "Start cooking to see orders here. Move orders from incoming when you begin preparation."}
              {activeTab === 'ready' && "Mark orders as ready when they're complete. Customers will be notified!"}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Checking for new orders...</span>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
