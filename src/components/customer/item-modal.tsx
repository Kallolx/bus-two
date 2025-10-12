'use client';

import { MenuItem, Modifier } from '@/types';
import { useState } from 'react';
import Image from 'next/image';
import { calculateItemSubtotal } from '@/lib/cart-utils';

interface ItemModalProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, modifiers: any) => void;
}

export function ItemModal({ item, onClose, onAddToCart }: ItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<{
    [key: string]: any;
  }>({});

  const subtotal = calculateItemSubtotal(item, quantity, selectedModifiers);

  const handleModifierChange = (modifierId: string, value: any) => {
    setSelectedModifiers((prev) => ({
      ...prev,
      [modifierId]: value,
    }));
  };

  const handleAdd = () => {
    onAddToCart(item, quantity, selectedModifiers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center">
      <div className="bg-background rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background z-10 p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">{item.name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div className="relative w-full aspect-video mb-4">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover rounded-2xl"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          <p className="text-muted-foreground mb-4">{item.description}</p>
          <p className="text-2xl font-bold mb-6">₹{item.price}</p>

          {item.modifiers && item.modifiers.length > 0 && (
            <div className="space-y-6 mb-6">
              <h3 className="font-semibold text-lg">Customize Your Order</h3>
              {item.modifiers.map((modifier) => (
                <ModifierControl
                  key={modifier.id}
                  modifier={modifier}
                  value={selectedModifiers[modifier.id]}
                  onChange={(value) => handleModifierChange(modifier.id, value)}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="font-bold text-lg w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background p-4 border-t border-border">
          <button
            onClick={handleAdd}
            className="w-full bg-primary text-primary-foreground rounded-full py-4 font-semibold flex items-center justify-between px-6"
          >
            <span>Add to Cart</span>
            <span className="font-bold">₹{subtotal}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ModifierControl({
  modifier,
  value,
  onChange,
}: {
  modifier: Modifier;
  value: any;
  onChange: (value: any) => void;
}) {
  if (modifier.type === 'toggle') {
    return (
      <label className="flex items-center justify-between cursor-pointer">
        <div>
          <span className="font-medium">{modifier.name}</span>
          {modifier.price && modifier.price > 0 && (
            <span className="text-muted-foreground ml-2">
              +₹{modifier.price}
            </span>
          )}
        </div>
        <div
          className={`w-12 h-7 rounded-full transition-colors ${
            value ? 'bg-primary' : 'bg-muted'
          }`}
          onClick={() => onChange(!value)}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full mt-1 transition-transform ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </div>
      </label>
    );
  }

  if (modifier.type === 'radio' && modifier.options) {
    return (
      <div>
        <p className="font-medium mb-3">{modifier.name}</p>
        <div className="space-y-2">
          {modifier.options.map((option) => (
            <label
              key={option.label}
              className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    value === option.label
                      ? 'border-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {value === option.label && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <span>{option.label}</span>
              </div>
              {option.price > 0 && (
                <span className="text-muted-foreground">+₹{option.price}</span>
              )}
              <input
                type="radio"
                className="hidden"
                checked={value === option.label}
                onChange={() => onChange(option.label)}
              />
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
