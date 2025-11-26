import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stallId = searchParams.get('stallId');

  if (!stallId) {
    return NextResponse.json({ error: 'Stall ID is required' }, { status: 400 });
  }

  const supabase = await createClient();

  // Check if digital menu is enabled for this stall
  const { data: stallSettings } = await supabase
    .from('users')
    .select('enable_digital_menu')
    .eq('id', stallId)
    .single();

  if (!stallSettings?.enable_digital_menu) {
    return NextResponse.json(
      { error: 'Digital menu is currently unavailable for this stall' },
      { status: 403 }
    );
  }

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', stallId)
    .order('sort_order');

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 });
  }

  // Fetch public menu items first (simplified query)
  const { data: menuItems, error: menuError } = await supabase
    .from('menu_items')
    .select('*')
    .eq('user_id', stallId)
    .eq('is_public', true)
    .order('name');

  if (menuError) {
    console.error('Error fetching menu items:', menuError);
    return NextResponse.json({ error: 'Failed to load menu', details: menuError.message }, { status: 500 });
  }

  // Fetch ingredients for all menu items
  const { data: ingredientsData, error: ingredientsError } = await supabase
    .from('menu_item_ingredients')
    .select(`
      menu_item_id,
      quantity,
      inventory_items (
        id,
        name,
        unit
      )
    `)
    .in('menu_item_id', menuItems.map(item => item.id));

  if (ingredientsError) {
    console.error('Error fetching ingredients:', ingredientsError);
  }

  // Fetch modifiers for all menu items
  const { data: modifiersData, error: modifiersError } = await supabase
    .from('modifiers')
    .select('*')
    .in('menu_item_id', menuItems.map(item => item.id));

  if (modifiersError) {
    console.error('Error fetching modifiers:', modifiersError);
  }

  // Transform data to match frontend types
  const transformedCategories = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    color: cat.color,
  }));

  const transformedItems = menuItems.map((item) => {
    // Find ingredients for this menu item
    const itemIngredients = ingredientsData?.filter(
      (ing: any) => ing.menu_item_id === item.id
    ) || [];

    // Find modifiers for this menu item (only enabled ones)
    const itemModifiers = modifiersData?.filter(
      (mod: any) => mod.menu_item_id === item.id && (mod.enabled ?? true)
    ) || [];

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.category_id,
      image: item.image_url || '/placeholder-food.jpg',
      isAvailable: item.is_available,
      ingredients: itemIngredients.map((ing: any) => ({
        id: ing.inventory_items?.id || '',
        name: ing.inventory_items?.name || '',
        quantity: ing.quantity,
        unit: ing.inventory_items?.unit || '',
      })),
      modifiers: itemModifiers.map((mod: any) => ({
        id: mod.id,
        name: mod.name,
        type: mod.type || 'toggle',
        price: parseFloat(mod.price) || 0,
        enabled: mod.enabled ?? true,
      })),
    };
  });

  return NextResponse.json({
    categories: transformedCategories,
    items: transformedItems,
  });
}
