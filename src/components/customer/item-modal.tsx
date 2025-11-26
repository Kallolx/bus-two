"use client";

import { MenuItem, Modifier } from "@/types";
import { useState } from "react";
import Image from "next/image";
import { calculateItemSubtotal } from "@/lib/cart-utils";

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
  const [specialNote, setSpecialNote] = useState("");

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
        {/* Header with centered title and Close Button */}
        <div className="sticky top-0 bg-background z-10 p-4 relative">
          {/* Centered title */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-sm font-medium text-muted-foreground">Description</span>
          </div>

          {/* Close button on the right */}
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-4 pb-4">
          {/* Image */}
          <div className="relative w-full aspect-video mb-6 rounded-2xl overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>

          {/* Text Section with Light Gray Background */}
          <div className="bg-gray-100 rounded-3xl p-4 mb-6">
            <h2 className="text-2xl tracking-tighter font-bold mb-2">{item.name}</h2>
            <p className="text-muted-foreground text-sm mb-3">
              {item.description}
            </p>
            <p className="text-lg font-semibold">Customize Your Order</p>
            {/* Modifiers - Toggle Switches */}
            {item.modifiers && item.modifiers.length > 0 && (
              <div className="space-y-3 mb-4">
                {item.modifiers
                  .filter((modifier) => modifier.enabled !== false)
                  .map((modifier) => (
                  <ModifierControl
                    key={modifier.id}
                    modifier={modifier}
                    value={selectedModifiers[modifier.id]}
                    onChange={(value) =>
                      handleModifierChange(modifier.id, value)
                    }
                  />
                ))}
              </div>
            )}
            
          {/* Special Note Section */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Special request..."
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              className="w-full bg-white rounded-full px-5 py-3 border-none outline-none placeholder:text-gray-400 shadow-sm"
            />
          </div>
          </div>

        </div>

        {/* Bottom Bar - Consistent with Main Bottom Bar */}
        <div className="sticky bottom-0 p-4">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-full py-4 px-6 flex items-center justify-between shadow-[0_4px_20px_rgba(249,115,22,0.4)]">
            {/* Left: Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold hover:bg-white/30 transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="text-white font-bold w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-bold hover:bg-white/30 transition-colors"
              >
                +
              </button>
            </div>

            {/* Middle: Price with VAT */}
            <div className="text-white font-bold">BDT {subtotal} + vat</div>

            {/* Right: Add Button */}
            <button
              onClick={handleAdd}
              className="bg-white text-orange-500 px-6 py-2 rounded-full font-semibold hover:bg-white/90 transition-colors"
            >
              Add
            </button>
          </div>
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
  if (modifier.type === "toggle") {
    return (
      <label className="flex items-center justify-between cursor-pointer bg-white rounded-full px-5 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Light Gray Circle Icon */}
          <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
          <span className="font-medium">{modifier.name}</span>
        </div>
        {modifier.price && modifier.price > 0 && (
          <span className="text-muted-foreground text-sm">
            +৳{modifier.price}
          </span>
        )}
        {/* Toggle Switch */}
        <div
          className={`w-12 h-7 rounded-full transition-colors ${
            value ? "bg-orange-500" : "bg-gray-300"
          }`}
          onClick={() => onChange(!value)}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full mt-1 transition-transform ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </div>
      </label>
    );
  }

  if (modifier.type === "radio" && modifier.options) {
    return (
      <div className="space-y-2">
        <p className="font-medium text-sm px-2 text-muted-foreground">
          {modifier.name}
        </p>
        {modifier.options.map((option) => (
          <label
            key={option.label}
            className="flex items-center justify-between cursor-pointer bg-white rounded-full px-5 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {/* Light Gray Circle Icon */}
              <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
              <span className="font-medium">{option.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {option.price > 0 && (
                <span className="text-muted-foreground text-sm">
                  +৳{option.price}
                </span>
              )}
              {/* Radio Button */}
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  value === option.label
                    ? "border-orange-500"
                    : "border-gray-300"
                }`}
              >
                {value === option.label && (
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                )}
              </div>
            </div>
            <input
              type="radio"
              className="hidden"
              checked={value === option.label}
              onChange={() => onChange(option.label)}
            />
          </label>
        ))}
      </div>
    );
  }

  return null;
}
