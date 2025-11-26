import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = await createClient();

  // Get the stall ID from the request (from menu page)
  const stallId = body.stallId;
  
  if (!stallId) {
    return NextResponse.json({ error: 'Stall ID is required' }, { status: 400 });
  }

  // Check if the stall is accepting new orders
  const { data: stallSettings } = await supabase
    .from('users')
    .select('accept_new_orders')
    .eq('id', stallId)
    .single();

  if (!stallSettings?.accept_new_orders) {
    return NextResponse.json(
      { error: 'This stall is not accepting new orders at the moment' },
      { status: 403 }
    );
  }

  // Generate a unique 3-digit token for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get existing tokens for today to avoid duplicates
  const { data: existingOrders } = await supabase
    .from('orders')
    .select('token')
    .eq('user_id', stallId)
    .gte('created_at', today.toISOString());

  const existingTokens = new Set((existingOrders || []).map((o: any) => o.token));
  
  // Generate unique token
  let token: number;
  do {
    token = Math.floor(100 + Math.random() * 900); // Random 3-digit token
  } while (existingTokens.has(token));

  // Calculate total from items
  const subtotal = body.items.reduce((sum: number, item: any) => sum + item.subtotal, 0);
  const total = subtotal;

  // Create order in database
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: stallId,
      token,
      status: 'waiting',
      total,
      fulfillment_type: body.fulfillmentType,
      payment_method: body.paymentMethod,
      customer_name: body.deliveryInfo?.name || null,
      customer_phone: body.deliveryInfo?.phone || null,
      delivery_address: body.deliveryInfo?.address || null,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return NextResponse.json({ error: 'Failed to create order', details: orderError.message }, { status: 500 });
  }

  // Create order items
  const orderItems = body.items.map((item: any) => ({
    order_id: order.id,
    menu_item_id: item.menuItemId,
    menu_item_name: item.name,
    menu_item_price: item.price,
    quantity: item.quantity,
    selected_modifiers: item.selectedModifiers || {},
    subtotal: item.subtotal,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    return NextResponse.json({ error: 'Failed to create order items', details: itemsError.message }, { status: 500 });
  }

  // Deduct inventory for each menu item
  for (const item of body.items) {
    // Get the ingredients for this menu item
    const { data: ingredients, error: ingredientsError } = await supabase
      .from('menu_item_ingredients')
      .select('inventory_item_id, quantity')
      .eq('menu_item_id', item.menuItemId);

    if (!ingredientsError && ingredients && ingredients.length > 0) {
      // Deduct each ingredient quantity
      for (const ingredient of ingredients) {
        const totalDeduction = ingredient.quantity * item.quantity; // ingredient qty per item * items ordered

        // Update inventory
        await supabase.rpc('deduct_inventory', {
          p_inventory_item_id: ingredient.inventory_item_id,
          p_quantity: totalDeduction
        });
      }
    }
  }

  return NextResponse.json({ orderId: order.id, token: order.token });
}
