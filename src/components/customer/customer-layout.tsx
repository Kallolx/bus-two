'use client';

import { RefreshCw, Menu, UtensilsCrossed } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface CustomerLayoutProps {
  children: React.ReactNode;
  stallId?: string;
  onRefresh?: () => void;
  onMenuClick?: () => void;
}

export function CustomerLayout({
  children,
  stallId,
  onRefresh,
  onMenuClick,
}: CustomerLayoutProps) {
  const [stallName, setStallName] = useState('Food Court');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (stallId) {
      loadStallInfo();
    } else {
      setLoading(false);
    }
  }, [stallId]);

  async function loadStallInfo() {
    const supabase = createClient();
    const { data } = await supabase
      .from('users')
      .select('stall_name')
      .eq('id', stallId)
      .single();

    if (data?.stall_name) {
      setStallName(data.stall_name);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-red-600 relative overflow-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-red-600/95 to-red-600/80 backdrop-blur-sm p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
              <UtensilsCrossed className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-xl tracking-tighter">{loading ? 'Loading...' : stallName}</h1>
              {stallId && <p className="text-xs opacity-80">Digital Menu</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center hover:bg-white/35 transition-all duration-200 shadow-md"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            )}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center hover:bg-white/35 transition-all duration-200 shadow-md"
                title="Menu"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content Area with Top Padding */}
      <div className="fixed top-24 left-0 right-0 bottom-0 overflow-y-auto">{children}</div>
    </div>
  );
}
