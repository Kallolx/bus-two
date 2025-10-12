# XFoodCourt - Customer App

A modern food ordering system for food courts and stalls.

## Customer App Features

### 🍽️ Menu Browsing
- Scan QR code to access stall menu
- Browse items by category
- Quick add or view details with modifiers
- Real-time cart tracking

### 🛒 Checkout
- Multiple fulfillment options: Dine-in, Takeaway, Delivery
- Saved delivery information (localStorage)
- Cash and digital payment options
- Order summary and editing

### 📱 Real-Time Status Tracking
- Large token number display
- Live progress timeline (Waiting → Cooking → Ready)
- Server-Sent Events (SSE) for instant updates
- Order summary and history

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── menu/[stallId]/    # Menu browsing page
│   ├── checkout/          # Order checkout
│   ├── status/[orderId]/  # Real-time status tracking
│   └── api/
│       ├── menu/          # Menu data endpoint
│       └── orders/        # Order management & SSE
├── components/
│   └── customer/          # Customer-facing components
├── lib/
│   ├── cart-storage.ts    # localStorage helpers
│   └── cart-utils.ts      # Cart calculations
├── data/
│   └── mock-menu.ts       # Mock menu data
└── types/
    └── index.ts           # TypeScript definitions
```

## Key Technologies

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** with custom design tokens
- **Server-Sent Events (SSE)** for real-time updates
- **localStorage** for cart persistence

## Demo Flow

1. Visit `/menu/1` to browse the menu
2. Add items to cart (with or without modifiers)
3. Click "View Cart" and choose fulfillment type
4. Place order (cash payment by default)
5. Redirected to status page with token number
6. Watch real-time updates as order progresses

## Mock Data

The app includes mock menu data with:
- 6 sample items (Biryani, Burgers, Chicken, Rice)
- 4 categories with color coding
- Modifiers (spice level, extra cheese, etc.)

## Real-Time Updates

Orders automatically progress through statuses:
- **Waiting** (0-10 seconds)
- **Cooking** (10-30 seconds)
- **Ready** (after 30 seconds)

This simulates kitchen workflow without a backend.

## Next Steps

- [ ] Add admin dashboard for order management
- [ ] Implement inventory tracking
- [ ] Add recipe linking
- [ ] Connect to real backend/database
- [ ] Add authentication for admin
- [ ] Implement payment gateway integration
- [ ] Add order history for customers

## Fonts

- **DM Sans** - Primary sans-serif font
- **Inter** - Monospace/secondary font

## Design System

Colors and spacing follow a cohesive design system with:
- Rounded pills and cards
- Vibrant accent colors
- Mobile-first responsive design
- High-contrast, accessible UI
