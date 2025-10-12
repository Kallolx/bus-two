'use client';

import { useState, useEffect } from 'react';
import { Order } from '@/types';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { CustomerLayout } from '@/components/customer/customer-layout';
import { ContentWrapper } from '@/components/customer/content-wrapper';

export default function StatusPage({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial order status
    fetch(`/api/orders/${orderId}/status`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });

    // Connect to SSE for real-time updates
    const eventSource = new EventSource(
      `/api/orders/${orderId}/stream`
    );

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setOrder((prev) => (prev ? { ...prev, status: update.status } : null));
    };

    return () => {
      eventSource.close();
    };
  }, [orderId]);

  if (loading || !order) {
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

  const steps = [
    { id: 'waiting', label: 'Waiting for Payment', icon: '⏳' },
    { id: 'cooking', label: 'Food is Cooking', icon: '🔥' },
    { id: 'ready', label: 'Ready for Pickup!', icon: '✅' },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === order.status);

  return (
    <CustomerLayout onRefresh={() => window.location.reload()}>
      <ContentWrapper className="p-4 pb-8">
        {/* Token Display */}
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-3xl p-8 text-center mb-8 mt-4">
        <p className="text-muted-foreground mb-2">Your Token</p>
        <h1 className="text-7xl font-bold text-orange-500 mb-4">#{order.token}</h1>
        <p className="text-sm text-muted-foreground">
          Order ID: {order.id.slice(0, 8)}
        </p>
      </div>

      {/* Progress Timeline */}
      <div className="bg-card rounded-3xl p-6 mb-8">
        <h2 className="font-semibold text-lg mb-6">Progress</h2>
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div key={step.id} className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-orange-500 text-white'
                      : isCurrent
                      ? 'bg-orange-500/20 text-orange-500 border-2 border-orange-500'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? '✓' : step.icon}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      isCurrent ? 'text-orange-500' : ''
                    } ${isPending ? 'text-muted-foreground' : ''}`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-sm text-muted-foreground">
                      {step.id === 'waiting' && 'Please confirm payment with staff'}
                      {step.id === 'cooking' && 'Your food is being prepared...'}
                      {step.id === 'ready' && 'Come pick up your order!'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-card rounded-3xl p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">Your Order</h2>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span className="font-semibold">₹{item.subtotal}</span>
            </div>
          ))}
          <div className="border-t border-border pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {order.status === 'ready' && (
          <div className="bg-orange-500/10 border-2 border-orange-500 rounded-2xl p-4 text-center">
            <p className="text-orange-500 font-semibold mb-2">
              🎉 Your order is ready!
            </p>
            <p className="text-sm text-muted-foreground">
              Please collect from the counter
            </p>
          </div>
        )}

        <button
          onClick={() => router.push('/menu/1')}
          className="w-full bg-orange-500 text-white rounded-full py-3 font-semibold hover:bg-orange-600 transition-colors"
        >
          Order More
        </button>
      </div>
      </ContentWrapper>
    </CustomerLayout>
  );
}
