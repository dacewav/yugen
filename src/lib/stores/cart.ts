import { writable, derived } from 'svelte/store';

interface CartItem {
  id: string;
  type: 'beat' | 'drumkit' | 'drop';
  title: string;
  coverUrl: string;
  price: number;
  tier?: string;
}

export const cartItems = writable<CartItem[]>([]);

export const cartTotal = derived(cartItems, ($items) =>
  $items.reduce((sum, item) => sum + item.price, 0)
);

export const cartCount = derived(cartItems, ($items) => $items.length);

export function addToCart(item: CartItem) {
  cartItems.update(items => {
    if (items.find(i => i.id === item.id && i.tier === item.tier)) return items;
    return [...items, item];
  });
}

export function removeFromCart(id: string, tier?: string) {
  cartItems.update(items =>
    items.filter(i => !(i.id === id && i.tier === tier))
  );
}

export function clearCart() {
  cartItems.set([]);
}
