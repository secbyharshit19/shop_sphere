import { CartItem, PRODUCTS } from '../data/catalog';

export const CART_STORAGE_KEY = 'shopsphere_cart_v1';
export const FREE_SHIPPING_THRESHOLD = 75;
export const STANDARD_SHIPPING_FEE = 9.95;
export const ESTIMATED_TAX_RATE = 0.08;
export const MAX_ITEM_QUANTITY = 20;

interface StoredCartEntry {
  id: string;
  quantity: number;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  totalSavings: number;
  shipping: number;
  estimatedTax: number;
  grandTotal: number;
  qualifiesForFreeShipping: boolean;
  remainingForFreeShipping: number;
  freeShippingProgress: number;
}

function roundCurrency(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function calculateCartSummary(items: CartItem[]): CartSummary {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalCents = items.reduce(
    (sum, item) => sum + Math.round(item.product.price * 100) * item.quantity,
    0
  );
  const subtotal = subtotalCents / 100;

  const savingsCents = items.reduce((sum, item) => {
    if (
      item.product.originalPrice &&
      item.product.originalPrice > item.product.price
    ) {
      const unitDiscountCents =
        Math.round(item.product.originalPrice * 100) -
        Math.round(item.product.price * 100);
      return sum + unitDiscountCents * item.quantity;
    }
    return sum;
  }, 0);
  const totalSavings = savingsCents / 100;

  const qualifiesForFreeShipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const estimatedTax = roundCurrency(subtotal * ESTIMATED_TAX_RATE);
  const grandTotal = roundCurrency(subtotal + shipping + estimatedTax);
  const remainingForFreeShipping = roundCurrency(
    Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  );
  const freeShippingProgress = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100
  );

  return {
    totalItems,
    subtotal,
    totalSavings,
    shipping,
    estimatedTax,
    grandTotal,
    qualifiesForFreeShipping,
    remainingForFreeShipping,
    freeShippingProgress,
  };
}

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const mergedById = new Map<string, CartItem>();

    for (const entry of parsed) {
      if (
        !entry ||
        typeof entry !== 'object' ||
        typeof (entry as StoredCartEntry).id !== 'string' ||
        typeof (entry as StoredCartEntry).quantity !== 'number'
      ) {
        continue;
      }

      const { id, quantity } = entry as StoredCartEntry;
      if (!Number.isFinite(quantity) || quantity < 1) continue;

      const product = PRODUCTS.find((item) => item.id === id);
      if (!product) continue;

      const clampedQuantity = Math.min(
        MAX_ITEM_QUANTITY,
        Math.floor(quantity)
      );
      const existing = mergedById.get(id);
      if (existing) {
        existing.quantity = Math.min(
          MAX_ITEM_QUANTITY,
          existing.quantity + clampedQuantity
        );
      } else {
        mergedById.set(id, { product, quantity: clampedQuantity });
      }
    }

    return Array.from(mergedById.values());
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: StoredCartEntry[] = items.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
    }));
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota or private browsing restrictions
  }
}
