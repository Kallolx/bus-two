import { NextRequest, NextResponse } from 'next/server';
import { Order } from '@/types';

// In-memory store for demo (use database in production)
const orders = new Map<string, Order>();

export async function POST(request: NextRequest) {
  const body = await request.json();

  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const token = Math.floor(100 + Math.random() * 900); // Random 3-digit token

  const order: Order = {
    id: orderId,
    token,
    items: body.items,
    total: body.total,
    fulfillment: body.fulfillment,
    paymentMethod: body.paymentMethod,
    status: 'waiting',
    createdAt: new Date().toISOString(),
  };

  orders.set(orderId, order);

  // Simulate automatic status progression for demo
  setTimeout(() => {
    const ord = orders.get(orderId);
    if (ord) {
      ord.status = 'cooking';
      orders.set(orderId, ord);
    }
  }, 10000); // 10 seconds

  setTimeout(() => {
    const ord = orders.get(orderId);
    if (ord) {
      ord.status = 'ready';
      orders.set(orderId, ord);
    }
  }, 30000); // 30 seconds

  return NextResponse.json({ orderId, token });
}

export { orders };
