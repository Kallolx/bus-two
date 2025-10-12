import { CartItem, DeliveryInfo } from '@/types';

const CART_KEY = 'xfoodcourt_cart';
const DELIVERY_KEY = 'xfoodcourt_delivery';

export const cartStorage = {
  get(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  set(cart: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CART_KEY);
  },
};

export const deliveryStorage = {
  get(): DeliveryInfo | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(DELIVERY_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  set(info: DeliveryInfo): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DELIVERY_KEY, JSON.stringify(info));
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(DELIVERY_KEY);
  },
};
