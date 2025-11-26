'use client';

import { useState, useEffect } from 'react';
import { CartItem, FulfillmentType, DeliveryInfo } from '@/types';
import { cartStorage, deliveryStorage } from '@/lib/cart-storage';
import { calculateCartTotal } from '@/lib/cart-utils';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CustomerLayout } from '@/components/customer/customer-layout';
import { ContentWrapper } from '@/components/customer/content-wrapper';
import { CartBar } from '@/components/customer/cart-bar';

export default function CheckoutPage() {
  const router = useRouter();
  const [stallId, setStallId] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>('dine-in');
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: '',
    phone: '',
    address: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'digital'>('cash');
  const [submitting, setSubmitting] = useState(false);
  const [stallSettings, setStallSettings] = useState({
    enable_delivery: true,
    enable_dine_in: true,
    enable_digital_payment: false,
  });

  useEffect(() => {
    const currentStallId = localStorage.getItem('currentStallId') || '';
    setStallId(currentStallId);
    setCart(cartStorage.get());
    const savedDelivery = deliveryStorage.get();
    if (savedDelivery) {
      setDeliveryInfo(savedDelivery);
    }

    // Fetch stall settings
    const fetchSettings = async () => {
      if (!currentStallId) return;
      
      try {
        const response = await fetch(`/api/stall-settings?stallId=${currentStallId}`);
        if (response.ok) {
          const data = await response.json();
          setStallSettings(data);
        }
      } catch (error) {
        console.error('Error fetching stall settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const subtotal = calculateCartTotal(cart);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      const updated = cart.filter((item) => item.menuItemId !== itemId);
      setCart(updated);
      cartStorage.set(updated);
    } else {
      const updated = cart.map((item) =>
        item.menuItemId === itemId
          ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
          : item
      );
      setCart(updated);
      cartStorage.set(updated);
    }
  };

  const handleSubmitOrder = async () => {
    if (fulfillmentType === 'delivery' && !deliveryInfo.name) {
      alert('Please fill in delivery information');
      return;
    }

    const stallId = localStorage.getItem('currentStallId');
    if (!stallId) {
      alert('Session expired. Please go back to menu.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stallId,
          items: cart,
          fulfillmentType,
          deliveryInfo: fulfillmentType === 'delivery' ? deliveryInfo : undefined,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save delivery info if it's delivery
        if (fulfillmentType === 'delivery') {
          deliveryStorage.set(deliveryInfo);
        }

        // Clear cart
        cartStorage.clear();

        // Redirect to status page
        router.push(`/status/${data.orderId}`);
      } else {
        const errorMsg = data.error || 'Failed to place order';
        alert(errorMsg + (data.details ? `: ${data.details}` : ''));
        console.error('Order error:', data);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <CustomerLayout>
        <ContentWrapper>
          <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
            <div className="text-center">
              <p className="text-xl font-semibold mb-4">Your cart is empty</p>
              <button
                onClick={() => {
                  const stallId = localStorage.getItem('currentStallId') || '1';
                  router.push(`/menu/${stallId}`);
                }}
                className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors"
              >
                Browse Menu
              </button>
            </div>
          </div>
        </ContentWrapper>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout stallId={stallId} onMenuClick={() => {}}>
      <ContentWrapper className="pb-32">
        {/* Header with Back Button */}
        <div className="sticky top-0 bg-background border-b border-border z-40 p-4 rounded-t-[2rem]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Your Order</h1>
          </div>
        </div>

        <main className="p-4 space-y-6">
          {/* Cart Items */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Items</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.menuItemId}
                  className="bg-card rounded-xl p-4 flex gap-3 border border-border"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.selectedModifiers && Object.keys(item.selectedModifiers).length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {Object.values(item.selectedModifiers).filter(Boolean).join(', ')}
                      </p>
                    )}
                    <p className="text-orange-500 font-semibold mt-1">৳{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Fulfillment Type */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Fulfillment Type</h2>
            <div className="grid grid-cols-3 gap-3">
              {(['dine-in', 'takeaway', 'delivery'] as FulfillmentType[])
                .filter((type) => {
                  // Filter based on stall settings
                  if (type === 'delivery' && !stallSettings.enable_delivery) return false;
                  if (type === 'dine-in' && !stallSettings.enable_dine_in) return false;
                  return true;
                })
                .map((type) => (
                <button
                  key={type}
                  onClick={() => setFulfillmentType(type)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium capitalize transition-colors ${
                    fulfillmentType === type
                      ? 'border-orange-500 bg-orange-50 text-orange-500'
                      : 'border-border bg-card'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          {/* Delivery Info (only for delivery) */}
          {fulfillmentType === 'delivery' && (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Delivery Information</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={deliveryInfo.name}
                  onChange={(e) =>
                    setDeliveryInfo({ ...deliveryInfo, name: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-border bg-card"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={deliveryInfo.phone}
                  onChange={(e) =>
                    setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-border bg-card"
                />
                <textarea
                  placeholder="Delivery Address"
                  value={deliveryInfo.address}
                  onChange={(e) =>
                    setDeliveryInfo({ ...deliveryInfo, address: e.target.value })
                  }
                  rows={3}
                  className="w-full p-3 rounded-xl border border-border bg-card resize-none"
                />
              </div>
            </section>
          )}

          {/* Payment Method */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {(['cash', 'digital'] as const)
                .filter((method) => {
                  // Hide digital payment if not enabled
                  if (method === 'digital' && !stallSettings.enable_digital_payment) return false;
                  return true;
                })
                .map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium capitalize transition-colors ${
                    paymentMethod === method
                      ? 'border-orange-500 bg-orange-50 text-orange-500'
                      : 'border-border bg-card'
                  }`}
                >
                  {method === 'cash' ? 'Cash on Delivery' : 'Digital Payment'}
                </button>
              ))}
            </div>
          </section>

          {/* Order Summary */}
          <section className="bg-card rounded-xl p-4 border border-border space-y-2">
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>৳{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span>৳{tax}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>৳{total}</span>
              </div>
            </div>
          </section>
        </main>

        {/* Unified Bottom Bar */}
        <CartBar
          cart={cart}
          buttonText="Place Order"
          onButtonClick={handleSubmitOrder}
          disabled={submitting}
        />
      </ContentWrapper>
    </CustomerLayout>
  );
}
