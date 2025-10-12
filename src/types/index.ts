// Core data types for the customer-facing app

export interface Modifier {
  id: string;
  name: string;
  type: 'toggle' | 'radio' | 'quantity';
  options?: { label: string; price: number }[];
  price?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  modifiers?: Modifier[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedModifiers: { [modifierId: string]: any };
  subtotal: number;
}

export type FulfillmentType = 'dine-in' | 'takeaway' | 'delivery';

export interface DeliveryInfo {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  token: number;
  items: CartItem[];
  total: number;
  fulfillment: {
    type: FulfillmentType;
    deliveryInfo?: DeliveryInfo;
  };
  paymentMethod: 'cash' | 'digital';
  status: 'waiting' | 'cooking' | 'ready' | 'completed';
  createdAt: string;
}

export interface OrderStatusUpdate {
  orderId: string;
  status: Order['status'];
  timestamp: string;
  eta?: string;
}
