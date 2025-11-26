'use client';

import { ReactNode } from 'react';
import { Home, Package, Menu, Bike, Settings, RefreshCw, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ContentWrapper } from '@/components/customer/content-wrapper';
import { createClient } from '@/lib/supabase/client';

interface AdminLayoutProps {
  children: ReactNode;
  stallName?: string;
}

const navItems = [
  { id: 'orders', label: 'Orders', icon: Home, href: '/admin' },
  { id: 'inventory', label: 'Inventory', icon: Package, href: '/admin/inventory' },
  { id: 'menu', label: 'Menu', icon: Menu, href: '/admin/menu' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminLayout({ children, stallName }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-red-600">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              🍜
            </div>
            <div className="text-white">
              <h1 className="font-bold">{stallName || 'Loading...'}</h1>
              <p className="text-sm opacity-90">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <RefreshCw className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Content Area with Top Padding */}
      <div className="fixed top-20 left-0 right-0 bottom-0">
        <ContentWrapper className="pb-32 h-full">
          {children}
        </ContentWrapper>
      </div>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
        <div className="bg-orange-500 rounded-full py-3 px-4 flex items-center justify-around shadow-lg pointer-events-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center rounded-full p-2 transition-all ${
                  isActive
                    ? 'bg-white text-black w-12 h-12'
                    : 'text-white hover:bg-gray-100 w-12 h-12'
                }`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
