import type { CartItem, CartState } from '../types';
import { PROMO_CODES } from '../constants/config';
import {
  loadCartState,
  saveCartState,
  addToCart,
  removeFromCart,
  setCartItemQty,
  getTotalItems,
  calculateOrderSummary,
} from '../services/cartService';

type CartListener = (state: CartState) => void;

function createCartStore() {
  let state: CartState = loadCartState();

  const listeners = new Set<CartListener>();

  function notify(): void {
    listeners.forEach((fn) => fn(state));
  }

  function getState(): CartState {
    return state;
  }

  function add(product: Omit<CartItem, 'key' | 'qty'>, qty = 1): void {
    state = { ...state, items: addToCart(product, qty) };
    saveCartState(state);
    notify();
  }

  function remove(key: string): void {
    state = { ...state, items: removeFromCart(key) };
    saveCartState(state);
    notify();
  }

  function setQty(key: string, qty: number): void {
    state = { ...state, items: setCartItemQty(key, qty) };
    saveCartState(state);
    notify();
  }

  function applyPromo(code: string): boolean {
    if (state.promoApplied) return false;
    const upper = code.toUpperCase();
    if (!PROMO_CODES[upper]) return false;
    state = { ...state, promoCode: upper, promoDiscount: PROMO_CODES[upper], promoApplied: true };
    saveCartState(state);
    notify();
    return true;
  }

  function getSummary() {
    return calculateOrderSummary(state.items, state.promoCode);
  }

  function getTotalCount(): number {
    return getTotalItems(state.items);
  }

  function subscribe(fn: CartListener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { getState, add, remove, setQty, applyPromo, getSummary, getTotalCount, subscribe };
}

export const cartStore = createCartStore();
