'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { CustomerLayout } from '@/components/customer/customer-layout';
import { ContentWrapper } from '@/components/customer/content-wrapper';
import Image from 'next/image';
import { Copy, ShoppingCart, Home, DollarSign, Phone, MapPin } from 'lucide-react';

export default function StatusPage({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const { orderId } = use(params);
  const [stallId, setStallId] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get stallId from localStorage
    const currentStallId = localStorage.getItem('currentStallId') || '';
    setStallId(currentStallId);
    
    // Fetch initial order status
    fetch(`/api/orders/${orderId}/status`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch order: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching order:', error);
        setLoading(false);
        // Keep order as null to show error state
      });

    // Connect to SSE for real-time updates
    const eventSource = new EventSource(
      `/api/orders/${orderId}/stream`
    );

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setOrder((prev) => (prev ? { ...prev, status: update.status } : null));
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [orderId]);

  const copyToken = () => {
    if (order?.token) {
      navigator.clipboard.writeText(order.token.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <ContentWrapper>
          <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading order status...</p>
            </div>
          </div>
        </ContentWrapper>
      </CustomerLayout>
    );
  }

  if (!order) {
    return (
      <CustomerLayout>
        <ContentWrapper>
          <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">❌</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
              <p className="text-gray-600 mb-6">
                We couldn't find an order with this ID.
              </p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </ContentWrapper>
      </CustomerLayout>
    );
  }

  const steps = [
    { id: 'waiting', label: 'Confirming Order', img: '/images/confirm.svg' },
    { id: 'cooking', label: 'Cooking', img: '/images/cooking.svg' },
    { id: 'ready', label: 'Ready!', img: '/images/ready.svg' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === order.status);

  const getFulfillmentDisplay = () => {
    if (!order?.fulfillment?.type) {
      return { label: 'Standard', icon: Home };
    }
    
    switch (order.fulfillment.type) {
      case 'dine-in':
        return { label: 'Dine In', icon: Home };
      case 'takeaway':
        return { label: 'Takeaway', icon: ShoppingCart };
      case 'delivery':
        return { label: 'Delivery', icon: MapPin };
      default:
        return { label: order.fulfillment.type, icon: Home };
    }
  };

  const fulfillmentDisplay = getFulfillmentDisplay();
  const FulfillmentIcon = fulfillmentDisplay.icon;

  return (
    <CustomerLayout stallId={stallId} onRefresh={() => window.location.reload()}>
      <ContentWrapper className="pb-24">
        <main className="p-4 space-y-3">
          {/* Token Display Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-400 to-red-500 p-8 shadow-lg">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
            
            <div className="relative z-10">
              <p className="text-white/80 text-sm font-medium mb-2 uppercase tracking-wider">Your Token Number</p>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-6xl font-bold text-white">#{order.token}</h1>
                <button
                  onClick={copyToken}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                  title="Copy token"
                >
                  <Copy className="w-5 h-5 text-white" />
                </button>
              </div>
              {copied && <p className="text-white text-xs font-medium">Copied!</p>}
              <p className="text-white/60 text-xs">Show this to collect your order</p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg mb-6 text-gray-900">Order Status</h2>
            
            <div className="space-y-4">
              {steps.map((step, index) => { 
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isPending = index > currentStepIndex;
                const iconSrc = (step as any).img as string;

                return (
                  <div key={step.id} className="flex gap-4 items-center">
                    {/* Icon Container - Fixed size and alignment */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-green-100'
                            : isCurrent
                            ? 'bg-orange-100 ring-2 ring-orange-400 ring-offset-2'
                            : 'bg-gray-100'
                        }`}
                      >
                        <Image src={iconSrc} alt={step.label} width={30} height={30} className="object-contain" />
                      </div>
                    </div>

                    {/* Text Container */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-lg tracking-tighter transition-colors ${
                          isCurrent
                            ? 'text-orange-600'
                            : isCompleted
                            ? 'text-gray-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {step.id === 'waiting' && 'Payment confirmed, preparing your order...'}
                          {step.id === 'cooking' && 'Your food is being prepared with care!'}
                          {step.id === 'ready' && 'Ready to go! Show your token at the counter 🎉'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unified Order Details & Items Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-lg mb-6 text-gray-900">Order Summary</h2>
            
            {/* Order Info Row - Fulfillment & Payment */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Fulfillment Type */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl">
                <div className="p-2 bg-orange-200 rounded-lg">
                  <FulfillmentIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 uppercase font-medium">Type</p>
                  <p className="font-semibold text-gray-900 text-sm truncate">{fulfillmentDisplay.label}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl">
                <div className="p-2 bg-green-200 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-600 uppercase font-medium">Payment</p>
                  <p className="font-semibold text-gray-900 text-sm capitalize">{order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Delivery Info if applicable */}
            {order.fulfillment?.deliveryInfo && (
              <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <p className="text-xs text-blue-600 uppercase font-bold mb-3">📍 Delivery Address</p>
                <p className="font-semibold text-gray-900 text-sm mb-2">{order.fulfillment.deliveryInfo.name}</p>
                {order.fulfillment.deliveryInfo.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-1.5">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{order.fulfillment.deliveryInfo.phone}</span>
                  </div>
                )}
                {order.fulfillment.deliveryInfo.address && (
                  <div className="flex items-start gap-2 text-xs text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{order.fulfillment.deliveryInfo.address}</span>
                  </div>
                )}
              </div>
            )}

            {/* Items Section */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-bold text-gray-900 mb-4">Items Ordered</p>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Qty: <span className="font-medium text-gray-700">{item.quantity}</span></span>
                        {Object.keys(item.selectedModifiers).length > 0 && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">+ Mods</span>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-gray-900 text-sm ml-2 flex-shrink-0">৳{item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="border-t border-gray-200 mt-6 pt-6 flex items-center justify-between">
              <span className="font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-orange-600">৳{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-col">
            {order.status === 'ready' && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-400 rounded-2xl p-5 text-center">
                <p className="text-emerald-700 font-bold text-lg">🎉 Ready for Pickup!</p>
                <p className="text-sm text-emerald-600 mt-2">Show your token at the counter</p>
              </div>
            )}

            <div className="flex mt-6 gap-3 flex-col md:flex-row">
              <button
                onClick={() => {
                  const stallId = localStorage.getItem('currentStallId') || '1';
                  router.push(`/menu/${stallId}`);
                }}
                className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl py-4 font-bold hover:shadow-lg hover:from-amber-500 hover:to-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Order More
              </button>
            </div>
          </div>
        </main>
      </ContentWrapper>
    </CustomerLayout>
  );
}
