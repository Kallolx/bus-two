import { CartItem, MenuItem } from '@/types';

export function calculateItemSubtotal(
  item: MenuItem,
  quantity: number,
  selectedModifiers: { [modifierId: string]: any }
): number {
  let subtotal = item.price * quantity;

  if (item.modifiers) {
    item.modifiers.forEach((modifier) => {
      const selected = selectedModifiers[modifier.id];
      if (modifier.type === 'toggle' && selected && modifier.price) {
        subtotal += modifier.price * quantity;
      } else if (modifier.type === 'radio' && selected && modifier.options) {
        const option = modifier.options.find((opt) => opt.label === selected);
        if (option && option.price) {
          subtotal += option.price * quantity;
        }
      }
    });
  }

  return subtotal;
}

export function createCartItem(
  item: MenuItem,
  quantity: number,
  selectedModifiers: { [modifierId: string]: any }
): CartItem {
  return {
    menuItemId: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity,
    selectedModifiers,
    subtotal: calculateItemSubtotal(item, quantity, selectedModifiers),
  };
}

export function calculateCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.subtotal, 0);
}
