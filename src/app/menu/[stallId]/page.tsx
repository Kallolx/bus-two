'use client';

import { useState, useEffect } from 'react';
import { MenuItem, CartItem, Category } from '@/types';
import { ItemCard } from '@/components/customer/item-card';
import { CartBar } from '@/components/customer/cart-bar';
import { ItemModal } from '@/components/customer/item-modal';
import { cartStorage } from '@/lib/cart-storage';
import { createCartItem } from '@/lib/cart-utils';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { RefreshCw, Menu } from 'lucide-react';

export default function MenuPage({ params }: { params: Promise<{ stallId: string }> }) {
  const router = useRouter();
  const { stallId } = use(params);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load menu from API
    fetch(`/api/menu?stallId=${stallId}`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setMenuItems(data.items);
        setSelectedCategory(data.categories[0]?.id || null);
        setLoading(false);
      });

    // Load cart from localStorage
    setCart(cartStorage.get());
  }, [stallId]);

  const handleQuickAdd = (item: MenuItem) => {
    const cartItem = createCartItem(item, 1, {});
    const updatedCart = [...cart, cartItem];
    setCart(updatedCart);
    cartStorage.set(updatedCart);
  };

  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    modifiers: any
  ) => {
    const cartItem = createCartItem(item, quantity, modifiers);
    const updatedCart = [...cart, cartItem];
    setCart(updatedCart);
    cartStorage.set(updatedCart);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetch(`/api/menu?stallId=${stallId}`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
        setMenuItems(data.items);
        setLoading(false);
      });
  };

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.categoryId === selectedCategory)
    : menuItems;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-600 relative">
      {/* Header - Transparent on colored background */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Shop Logo and Name */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
            </div>
            <div className="text-white">
              <h1 className="font-bold text-lg leading-tight">XFoodCourt</h1>
              <p className="text-xs opacity-90">Ordering for table {stallId}</p>
            </div>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - White rounded-top container */}
      <div className="relative pt-20">
        <div className="bg-background rounded-t-[2rem] min-h-[calc(100vh-5rem)] pb-24">
          {/* Category Tabs - Inside white container */}
          <div className="sticky top-0 bg-background z-40 px-4 pt-6 pb-4 rounded-t-[2rem]">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2.5 scrollbar-hide rounded-full whitespace-nowrap transition-all font-medium ${
                    selectedCategory === category.id
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <main className="px-4 pt-2 pb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onQuickAdd={handleQuickAdd}
                  onViewDetails={setSelectedItem}
                />
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Cart Bar */}
      <CartBar 
        cart={cart} 
        buttonText="Confirm"
        onButtonClick={() => router.push('/checkout')} 
      />

      {/* Item Modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}
