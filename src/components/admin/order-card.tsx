'use client';

import { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  onConfirm?: (orderId: string) => void;
  onStatusChange?: (orderId: string, status: Order['status']) => void;
}

export default function OrderCard({ order, onConfirm, onStatusChange }: OrderCardProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'waiting':
        return 'bg-orange-100 text-orange-800';
      case 'cooking':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
      {/* Order Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">#{order.token}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Token #{order.token}</h3>
            <p className="text-xs text-gray-500">{formatTime(order.createdAt)}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Order Items */}
      <div className="space-y-1 mb-2 text-sm">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-700">
              {item.name} <span className="text-gray-400">×{item.quantity}</span>
            </span>
            {Object.keys(item.selectedModifiers).length > 0 && (
              <span className="text-xs text-gray-400">+modifiers</span>
            )}
          </div>
        ))}
      </div>

      {/* Fulfillment Type */}
      <div className="flex items-center gap-2 mb-2 text-xs">
        <span className="text-xs font-medium text-gray-500">
          {order.fulfillment.type === 'dine-in' && '🍽️ Dine-in'}
          {order.fulfillment.type === 'takeaway' && '🥡 Takeaway'}
          {order.fulfillment.type === 'delivery' && '🚚 Delivery'}
        </span>
        {order.fulfillment.deliveryInfo && (
          <span className="text-xs text-gray-400">
            • {order.fulfillment.deliveryInfo.name}
          </span>
        )}
      </div>

      {/* Total and Action */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div>
          <span className="text-gray-500 text-xs">BDT</span>{' '}
          <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-900">{order.total.toFixed(2)}</span>
        </div>

        {order.status === 'waiting' && onConfirm && (
          <button
            onClick={() => onConfirm(order.id)}
            aria-label={`Confirm order ${order.id}`}
            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
          >
            Confirm
          </button>
        )}

        {order.status === 'cooking' && onStatusChange && (
          <button
            onClick={() => onStatusChange(order.id, 'ready')}
            aria-label={`Mark order ${order.id} ready`}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
          >
            Mark Ready
          </button>
        )}
      </div>
    </div>
  );
}
