'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/admin-layout';
import OrderCard from '@/components/admin/order-card';
import { Order } from '@/types';
import { Clock, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { OrderCardSkeleton } from '@/components/ui/skeleton';

type OrderTab = 'incoming' | 'cooking' | 'ready';

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>('incoming');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stallName, setStallName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
          *,
          menu_items (
            image_url,
            modifiers (
              id,
              name,
              type
            )
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const transformedOrders: Order[] = data.map((order: any) => ({
        id: order.id,
        token: order.token,
        items: order.order_items.map((item: any) => {
          // Transform selected modifiers to show readable names
          const selectedModifiers = item.selected_modifiers || {};
          const modifiers = item.menu_items?.modifiers || [];
          const readableModifiers: { [key: string]: any } = {};
          
          Object.entries(selectedModifiers).forEach(([modifierId, value]: [string, any]) => {
            const modifier = modifiers.find((m: any) => m.id === modifierId);
            if (modifier) {
              if (modifier.type === 'toggle' && value === true) {
                readableModifiers[modifier.name] = modifier.name;
              } else if (modifier.type === 'radio' && value) {
                readableModifiers[modifier.name] = value;
              }
            }
          });

          return {
            menuItemId: item.menu_item_id,
            name: item.menu_item_name,
            price: item.menu_item_price,
            image: item.menu_items?.image_url || '/images/pizza.png',
            quantity: item.quantity,
            selectedModifiers: readableModifiers,
            subtotal: item.subtotal,
          };
        }),
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
            <div key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer">
              <OrderCard
                order={order}
                onConfirm={handleConfirmOrder}
                onStatusChange={handleStatusChange}
              />
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="w-40 h-40 mb-8">
              <Image
                src="/images/empty.png"
                alt="No orders"
                width={160}
                height={160}
                className="object-contain"
              />
            </div>
            <h3 className="text-2xl font-semibold tracking-tighter text-gray-900 mb-2">
              {activeTab === 'incoming' && 'No incoming orders'}
              {activeTab === 'cooking' && 'No orders being prepared'}
              {activeTab === 'ready' && 'No ready orders'}
            </h3>
            <p className="text-gray-500 text-center max-w-sm mb-6">
              {activeTab === 'incoming' && "New orders will appear here."}
              {activeTab === 'cooking' && "Start cooking to see orders here."}
              {activeTab === 'ready' && "Mark orders as ready when they're complete."}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Bottom Sheet */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-[2rem] sm:rounded-3xl w-full sm:max-w-2xl max-h-[85vh] overflow-y-auto pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-[2rem] sm:rounded-t-3xl z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tighter">Order Details</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Order Token Card */}
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-5 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-90 mb-1">Order Token</p>
                    <p className="text-5xl font-black tracking-tighter">{selectedOrder.token}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-90 mb-1">Status</p>
                    <div className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                      <p className="text-lg font-bold capitalize">{selectedOrder.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex gap-3 mb-2">
                        <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <p className="font-bold text-orange-500 ml-2">×{item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-600">
                            ৳{item.price} × {item.quantity} = <span className="text-gray-900 font-bold">৳{item.subtotal}</span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Modifiers */}
                      {Object.keys(item.selectedModifiers).length > 0 && (
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Customizations:</p>
                          <p className="text-sm text-gray-600">
                            {Object.values(item.selectedModifiers)
                              .filter(value => value !== false && value !== null && value !== undefined)
                              .join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fulfillment Details */}
              {(selectedOrder.fulfillment.type !== 'dine-in' || selectedOrder.fulfillment.deliveryInfo) && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">Fulfillment Details</h3>
                  <div className="bg-gray-100 rounded-2xl p-4 space-y-3">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">TYPE</p>
                      <p className="text-sm font-bold text-gray-900 capitalize">{selectedOrder.fulfillment.type}</p>
                    </div>
                    {selectedOrder.fulfillment.deliveryInfo && (
                      <>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">CUSTOMER NAME</p>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.fulfillment.deliveryInfo.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">PHONE NUMBER</p>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.fulfillment.deliveryInfo.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">DELIVERY ADDRESS</p>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.fulfillment.deliveryInfo.address}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="pb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">Payment</h3>
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium opacity-90 mb-1">Payment Method</p>
                      <p className="text-lg font-bold capitalize">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium opacity-90 mb-1">Total Amount</p>
                      <p className="text-4xl font-black tracking-tighter">৳{selectedOrder.total}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
