import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const supabase = await createClient();

  // Fetch order with items
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *
      )
    `)
    .eq('id', orderId)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  // Transform to match frontend Order type
  const transformedOrder = {
    id: order.id,
    token: order.token,
    items: order.order_items.map((item: any) => ({
      menuItemId: item.menu_item_id,
      name: item.menu_item_name,
      price: item.menu_item_price,
      image: '/placeholder-food.jpg',
      quantity: item.quantity,
      selectedModifiers: item.selected_modifiers || {},
      subtotal: item.subtotal,
    })),
    total: order.total,
    fulfillment: {
      type: order.fulfillment_type,
      deliveryInfo: order.customer_name ? {
        name: order.customer_name,
        phone: order.customer_phone,
        address: order.delivery_address,
      } : undefined,
    },
    paymentMethod: order.payment_method,
    status: order.status,
    createdAt: order.created_at,
  };

  return NextResponse.json(transformedOrder);
}
