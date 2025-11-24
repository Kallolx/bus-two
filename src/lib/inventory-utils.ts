/**
 * Inventory Management Utilities
 * Handles auto-deduction of ingredients when orders are placed
 */

import { Order, MenuItemRecipe, InventoryItem, Ingredient } from '@/types';

/**
 * Calculate total ingredient requirements for an order
 */
export function calculateIngredientRequirements(
  order: Order,
  menuRecipes: MenuItemRecipe[]
): Map<string, number> {
  const requirements = new Map<string, number>();

  order.items.forEach((orderItem) => {
    const recipe = menuRecipes.find((r) => r.id === orderItem.menuItemId);
    if (!recipe || !recipe.ingredients) return;

    recipe.ingredients.forEach((ingredient) => {
      const currentQty = requirements.get(ingredient.inventoryItemId) || 0;
      requirements.set(
        ingredient.inventoryItemId,
        currentQty + ingredient.quantity * orderItem.quantity
      );
    });
  });

  return requirements;
}

/**
 * Check if inventory has sufficient stock for an order
 */
export function checkInventoryAvailability(
  requirements: Map<string, number>,
  inventory: InventoryItem[]
): { available: boolean; insufficientItems: string[] } {
  const insufficientItems: string[] = [];

  requirements.forEach((requiredQty, inventoryItemId) => {
    const inventoryItem = inventory.find((item) => item.id === inventoryItemId);
    if (!inventoryItem || inventoryItem.quantity < requiredQty) {
      insufficientItems.push(inventoryItem?.name || inventoryItemId);
    }
  });

  return {
    available: insufficientItems.length === 0,
    insufficientItems,
  };
}

/**
 * Deduct ingredients from inventory
 */
export function deductInventory(
  requirements: Map<string, number>,
  inventory: InventoryItem[]
): InventoryItem[] {
  return inventory.map((item) => {
    const deductQty = requirements.get(item.id) || 0;
    return {
      ...item,
      quantity: Math.max(0, item.quantity - deductQty),
    };
  });
}

/**
 * Get low stock items
 */
export function getLowStockItems(inventory: InventoryItem[]): InventoryItem[] {
  return inventory.filter((item) => item.quantity <= item.lowStockThreshold);
}

/**
 * Check if an item is low stock
 */
export function isLowStock(item: InventoryItem): boolean {
  return item.quantity <= item.lowStockThreshold;
}

/**
 * Process order and update inventory
 * Returns updated inventory and any warnings
 */
export function processOrderInventory(
  order: Order,
  menuRecipes: MenuItemRecipe[],
  currentInventory: InventoryItem[]
): {
  updatedInventory: InventoryItem[];
  success: boolean;
  lowStockWarnings: InventoryItem[];
  error?: string;
} {
  // Calculate requirements
  const requirements = calculateIngredientRequirements(order, menuRecipes);

  // Check availability
  const { available, insufficientItems } = checkInventoryAvailability(
    requirements,
    currentInventory
  );

  if (!available) {
    return {
      updatedInventory: currentInventory,
      success: false,
      lowStockWarnings: [],
      error: `Insufficient stock for: ${insufficientItems.join(', ')}`,
    };
  }

  // Deduct inventory
  const updatedInventory = deductInventory(requirements, currentInventory);

  // Check for low stock warnings
  const lowStockWarnings = getLowStockItems(updatedInventory);

  return {
    updatedInventory,
    success: true,
    lowStockWarnings,
  };
}
