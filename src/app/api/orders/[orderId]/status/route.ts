import { NextRequest, NextResponse } from 'next/server';
import { orders } from '../../route';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const order = orders.get(params.orderId);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json(order);
}
