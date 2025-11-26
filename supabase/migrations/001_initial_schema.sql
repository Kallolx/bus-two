-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users profile table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  stall_name TEXT NOT NULL,
  stall_description TEXT,
  stall_logo_url TEXT,
  phone TEXT,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#FF6B35',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, name)
);

-- Create inventory items table
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity DECIMAL(10, 2) DEFAULT 0 NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('kg', 'pc', 'ltr', 'gm')),
  low_stock_threshold DECIMAL(10, 2) DEFAULT 10 NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, name)
);

-- Create menu items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create menu item ingredients junction table
CREATE TABLE IF NOT EXISTS public.menu_item_ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(menu_item_id, inventory_item_id)
);

-- Create modifiers table
CREATE TABLE IF NOT EXISTS public.modifiers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('toggle', 'radio', 'quantity')),
  price DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create modifier options table (for radio type modifiers)
CREATE TABLE IF NOT EXISTS public.modifier_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  modifier_id UUID REFERENCES public.modifiers(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  token INTEGER NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('dine-in', 'takeaway', 'delivery')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'digital')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'cooking', 'ready', 'completed', 'cancelled')),
  customer_name TEXT,
  customer_phone TEXT,
  delivery_address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES public.menu_items(id) NOT NULL,
  menu_item_name TEXT NOT NULL,
  menu_item_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  selected_modifiers JSONB DEFAULT '{}',
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_user_id ON public.inventory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_user_id ON public.menu_items(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_public ON public.menu_items(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modifier_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Users can view their own categories" ON public.categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON public.categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON public.categories
  FOR DELETE USING (auth.uid() = user_id);

-- Inventory items policies
CREATE POLICY "Users can view their own inventory" ON public.inventory_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inventory" ON public.inventory_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory" ON public.inventory_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory" ON public.inventory_items
  FOR DELETE USING (auth.uid() = user_id);

-- Menu items policies
CREATE POLICY "Users can view their own menu items" ON public.menu_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view published menu items" ON public.menu_items
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own menu items" ON public.menu_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own menu items" ON public.menu_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own menu items" ON public.menu_items
  FOR DELETE USING (auth.uid() = user_id);

-- Menu item ingredients policies
CREATE POLICY "Users can view their own menu item ingredients" ON public.menu_item_ingredients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE menu_items.id = menu_item_ingredients.menu_item_id
      AND menu_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own menu item ingredients" ON public.menu_item_ingredients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE menu_items.id = menu_item_ingredients.menu_item_id
      AND menu_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own menu item ingredients" ON public.menu_item_ingredients
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE menu_items.id = menu_item_ingredients.menu_item_id
      AND menu_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own menu item ingredients" ON public.menu_item_ingredients
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE menu_items.id = menu_item_ingredients.menu_item_id
      AND menu_items.user_id = auth.uid()
    )
  );

-- Modifiers policies
CREATE POLICY "Users can view their own modifiers" ON public.modifiers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE menu_items.id = modifiers.menu_item_id
      AND menu_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view modifiers for public menu items" ON public.modifiers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE menu_items.id = modifiers.menu_item_id
      AND menu_items.is_public = true
    )
  );

CREATE POLICY "Users can insert their own modifiers" ON public.modifiers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE menu_items.id = modifiers.menu_item_id
      AND menu_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own modifiers" ON public.modifiers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE menu_items.id = modifiers.menu_item_id
      AND menu_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own modifiers" ON public.modifiers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.menu_items
      WHERE menu_items.id = modifiers.menu_item_id
      AND menu_items.user_id = auth.uid()
    )
  );

-- Modifier options policies
CREATE POLICY "Users can view their own modifier options" ON public.modifier_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modifiers
      JOIN public.menu_items ON menu_items.id = modifiers.menu_item_id
      WHERE modifiers.id = modifier_options.modifier_id
      AND menu_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view modifier options for public menu items" ON public.modifier_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modifiers
      JOIN public.menu_items ON menu_items.id = modifiers.menu_item_id
      WHERE modifiers.id = modifier_options.modifier_id
      AND menu_items.is_public = true
    )
  );

CREATE POLICY "Users can insert their own modifier options" ON public.modifier_options
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.modifiers
      JOIN public.menu_items ON menu_items.id = modifiers.menu_item_id
      WHERE modifiers.id = modifier_options.modifier_id
      AND menu_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own modifier options" ON public.modifier_options
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.modifiers
      JOIN public.menu_items ON menu_items.id = modifiers.menu_item_id
      WHERE modifiers.id = modifier_options.modifier_id
      AND menu_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own modifier options" ON public.modifier_options
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.modifiers
      JOIN public.menu_items ON menu_items.id = modifiers.menu_item_id
      WHERE modifiers.id = modifier_options.modifier_id
      AND menu_items.user_id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert orders to their stall" ON public.orders
  FOR INSERT WITH CHECK (true); -- Anyone can place an order

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (true); -- Anyone can add items to an order

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, stall_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'stall_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_inventory_items_updated_at BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_menu_items_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
