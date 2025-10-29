'use client';

import { CartItem } from '@/types';
import { calculateCartTotal } from '@/lib/cart-utils';

interface CartBarProps {
  cart: CartItem[];
  buttonText: 'Confirm' | 'Place Order';
  onButtonClick: () => void;
  disabled?: boolean;
}

export function CartBar({ cart, buttonText, onButtonClick, disabled = false }: CartBarProps) {
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
  const total = calculateCartTotal(cart);

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full py-4 px-6 flex items-center justify-between shadow-[0_4px_20px_rgba(249,115,22,0.4)]">
        <div className="flex items-center gap-3 text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white text-orange-500 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">
              {itemCount}
            </div>
            <span className="">items</span>
          </div>
          <span className="text-white/60">|</span>
          <span className="font-normal text-lg">BDT {total}</span>
        </div>
        <button
          onClick={onButtonClick}
          disabled={disabled}
          className="bg-white text-orange-500 px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
