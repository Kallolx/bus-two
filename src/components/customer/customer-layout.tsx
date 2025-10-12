'use client';

import { RefreshCw, Menu } from 'lucide-react';

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
              <h1 className="font-bold">Food Court</h1>
              {stallId && <p className="text-sm opacity-90">Stall #{stallId}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-white" />
              </button>
            )}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content Area with Top Padding */}
      <div className="pt-20">{children}</div>
    </div>
  );
}
