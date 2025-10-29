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
import { CustomerLayout } from '@/components/customer/customer-layout';
import { ContentWrapper } from '@/components/customer/content-wrapper';

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
      <CustomerLayout stallId={stallId} onRefresh={handleRefresh}>
        <ContentWrapper>
          <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading menu...</p>
            </div>
          </div>
        </ContentWrapper>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout stallId={stallId} onRefresh={handleRefresh} onMenuClick={() => {}}>
      <ContentWrapper className="pb-24">
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
      </ContentWrapper>

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
    </CustomerLayout>
  );
}
