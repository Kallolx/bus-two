import { Category, MenuItem } from '@/types';

export const categories: Category[] = [
  { id: 'biryani', name: 'Biryani', color: '#FF6B6B' },
  { id: 'burgers', name: 'Burgers', color: '#4ECDC4' },
  { id: 'chicken', name: 'Chicken', color: '#FFE66D' },
  { id: 'rice', name: 'Rice', color: '#95E1D3' },
  { id: 'pizza', name: 'Pizza', color: '#FFD93D' },
  { id: 'pasta', name: 'Pasta', color: '#6BCB77' },
  { id: 'wraps', name: 'Wraps', color: '#4D96FF' },
  { id: 'desserts', name: 'Desserts', color: '#FFB6C1' },
  { id: 'drinks', name: 'Drinks', color: '#7E57C2' },
];

export const menuItems: MenuItem[] = [
  // 🐔 Chicken
  {
    id: 'dynamit-chicken',
    name: 'Dynamit Chicken',
    description: 'Spicy golden fried chicken with a kick',
    price: 150,
    categoryId: 'chicken',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop',
    modifiers: [
      {
        id: 'spice',
        name: 'Spice Level',
        type: 'radio',
        options: [
          { label: 'Mild', price: 0 },
          { label: 'Medium', price: 0 },
          { label: 'Hot', price: 0 },
          { label: 'Extra Hot', price: 10 },
        ],
      },
      {
        id: 'extra-cheese',
        name: 'Extra Cheese',
        type: 'toggle',
        price: 20,
      },
    ],
  },
  {
    id: 'crispy-chicken-wings',
    name: 'Crispy Chicken Wings',
    description: 'Crunchy wings glazed with tangy BBQ sauce',
    price: 180,
    categoryId: 'chicken',
    image: 'https://images.unsplash.com/photo-1606755962773-d3247dd6f9f9?w=400&h=400&fit=crop',
  },
  {
    id: 'chicken-strips',
    name: 'Chicken Strips',
    description: 'Crispy chicken tenders served with dips',
    price: 130,
    categoryId: 'chicken',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop',
  },

  // 🍔 Burgers
  {
    id: 'sunshine-burger',
    name: 'Sunshine Burger',
    description: 'Juicy beef patty with special sauce',
    price: 180,
    categoryId: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    modifiers: [
      {
        id: 'extra-patty',
        name: 'Extra Patty',
        type: 'toggle',
        price: 50,
      },
      {
        id: 'cheese',
        name: 'Cheese',
        type: 'toggle',
        price: 15,
      },
    ],
  },
  {
    id: 'spicy-chicken-burger',
    name: 'Spicy Chicken Burger',
    description: 'Crispy spicy chicken fillet with creamy mayo',
    price: 160,
    categoryId: 'burgers',
    image: 'https://images.unsplash.com/photo-1606756790138-1967e6d1f67f?w=400&h=400&fit=crop',
  },
  {
    id: 'double-beef-burger',
    name: 'Double Beef Burger',
    description: 'Two juicy patties with melted cheddar and smoky sauce',
    price: 220,
    categoryId: 'burgers',
    image: 'https://images.unsplash.com/photo-1606755962713-cadcf1c3f2e1?w=400&h=400&fit=crop',
  },

  // 🍛 Biryani
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    description: 'Fragrant rice with tender chicken and aromatic spices',
    price: 200,
    categoryId: 'biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=400&fit=crop',
    modifiers: [
      { id: 'raita', name: 'Raita', type: 'toggle', price: 20 },
      { id: 'extra-chicken', name: 'Extra Chicken', type: 'toggle', price: 40 },
    ],
  },
  {
    id: 'mutton-biryani',
    name: 'Mutton Biryani',
    description: 'Rich and flavorful mutton biryani',
    price: 250,
    categoryId: 'biryani',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400&h=400&fit=crop',
  },
  {
    id: 'beef-biryani',
    name: 'Beef Biryani',
    description: 'Tender beef with fragrant basmati rice and spices',
    price: 240,
    categoryId: 'biryani',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400&h=400&fit=crop',
  },

  // 🍚 Rice
  {
    id: 'fried-rice',
    name: 'Chicken Fried Rice',
    description: 'Classic fried rice with vegetables and chicken',
    price: 120,
    categoryId: 'rice',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=400&fit=crop',
    modifiers: [{ id: 'egg', name: 'Add Egg', type: 'toggle', price: 15 }],
  },
  {
    id: 'veg-fried-rice',
    name: 'Vegetable Fried Rice',
    description: 'Colorful mix of veggies and soy flavor',
    price: 100,
    categoryId: 'rice',
    image: 'https://images.unsplash.com/photo-1599939575824-37cb4c18a2b9?w=400&h=400&fit=crop',
  },

  // 🍕 Pizza
  {
    id: 'margherita-pizza',
    name: 'Margherita Pizza',
    description: 'Classic cheese and tomato pizza',
    price: 220,
    categoryId: 'pizza',
    image: 'https://images.unsplash.com/photo-1601924582971-c9e8e01b4b06?w=400&h=400&fit=crop',
  },
  {
    id: 'pepperoni-pizza',
    name: 'Pepperoni Pizza',
    description: 'Loaded with pepperoni and mozzarella',
    price: 260,
    categoryId: 'pizza',
    image: 'https://images.unsplash.com/photo-1601924582971-c9e8e01b4b06?w=400&h=400&fit=crop',
  },
  {
    id: 'bbq-chicken-pizza',
    name: 'BBQ Chicken Pizza',
    description: 'Smoky BBQ sauce with chicken and cheese',
    price: 250,
    categoryId: 'pizza',
    image: 'https://images.unsplash.com/photo-1601924582971-c9e8e01b4b06?w=400&h=400&fit=crop',
  },

  // 🍝 Pasta
  {
    id: 'alfredo-pasta',
    name: 'Chicken Alfredo Pasta',
    description: 'Creamy white sauce with grilled chicken',
    price: 210,
    categoryId: 'pasta',
    image: 'https://images.unsplash.com/photo-1612874742870-b29c4b19a2c7?w=400&h=400&fit=crop',
  },
  {
    id: 'spaghetti-bolognese',
    name: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta with minced beef sauce',
    price: 190,
    categoryId: 'pasta',
    image: 'https://images.unsplash.com/photo-1625944230921-76a9a8a0d7ad?w=400&h=400&fit=crop',
  },

  // 🌯 Wraps
  {
    id: 'chicken-shawarma',
    name: 'Chicken Shawarma Wrap',
    description: 'Grilled chicken with garlic sauce and veggies',
    price: 140,
    categoryId: 'wraps',
    image: 'https://images.unsplash.com/photo-1606755962773-d3247dd6f9f9?w=400&h=400&fit=crop',
  },
  {
    id: 'beef-wrap',
    name: 'Beef Wrap',
    description: 'Tender beef slices with spicy mayo',
    price: 160,
    categoryId: 'wraps',
    image: 'https://images.unsplash.com/photo-1599022355268-2760ea23b87a?w=400&h=400&fit=crop',
  },

  // 🍰 Desserts
  {
    id: 'chocolate-brownie',
    name: 'Chocolate Brownie',
    description: 'Warm fudge brownie with chocolate drizzle',
    price: 100,
    categoryId: 'desserts',
    image: 'https://images.unsplash.com/photo-1599785209794-55b8df4d90ae?w=400&h=400&fit=crop',
  },
  {
    id: 'cheesecake',
    name: 'New York Cheesecake',
    description: 'Creamy cheesecake with a buttery crust',
    price: 150,
    categoryId: 'desserts',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop',
  },
  {
    id: 'ice-cream',
    name: 'Ice Cream Scoop',
    description: 'Choose from chocolate, vanilla, or strawberry',
    price: 80,
    categoryId: 'desserts',
    image: 'https://images.unsplash.com/photo-1565958011705-44e2113d0c1d?w=400&h=400&fit=crop',
    modifiers: [
      {
        id: 'flavor',
        name: 'Flavor',
        type: 'radio',
        options: [
          { label: 'Chocolate', price: 0 },
          { label: 'Vanilla', price: 0 },
          { label: 'Strawberry', price: 0 },
          { label: 'Mango', price: 5 },
        ],
      },
    ],
  },

  // 🥤 Drinks
  {
    id: 'cola',
    name: 'Coca Cola',
    description: 'Chilled carbonated drink',
    price: 50,
    categoryId: 'drinks',
    image: 'https://images.unsplash.com/photo-1581595220892-b0739d2f4cc9?w=400&h=400&fit=crop',
  },
  {
    id: 'lemonade',
    name: 'Fresh Lemonade',
    description: 'Refreshing lemon drink with mint',
    price: 60,
    categoryId: 'drinks',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=400&fit=crop',
  },
  {
    id: 'iced-coffee',
    name: 'Iced Coffee',
    description: 'Cold brew coffee with milk and sugar',
    price: 80,
    categoryId: 'drinks',
    image: 'https://images.unsplash.com/photo-1527169402691-aefbe0b22cd9?w=400&h=400&fit=crop',
  },
];
