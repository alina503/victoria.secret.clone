/**
 * CartService — enterprise-grade cart management.
 * Replaces the original cart.js with a clean service pattern.
 */

const CART_KEY = 'vs_cart';
const MAX_QTY = 99;
const FREE_SHIPPING_THRESHOLD = 269;
const STANDARD_SHIPPING_COST = 20;
const PROMO_CODES = { VS10: 0.1, VS15: 0.15, VS20: 0.2 };

// ─── Storage Layer ────────────────────────────────────────────────────────────

function storageGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded – silent */ }
}

// ─── Cart Service ─────────────────────────────────────────────────────────────

const CartService = {
  load() {
    return storageGet(CART_KEY, []);
  },

  save(items) {
    storageSet(CART_KEY, items);
  },

  add(product, qty = 1) {
    const safeQty = Math.max(1, Math.min(qty, MAX_QTY));
    const items = this.load();
    const key = `${product.id}|${product.size || ''}|${product.color || ''}`;
    const existing = items.find(i => i.key === key);
    if (existing) {
      existing.qty = Math.min(existing.qty + safeQty, MAX_QTY);
    } else {
      items.push({ ...product, key, qty: safeQty });
    }
    this.save(items);
    return items;
  },

  remove(key) {
    const items = this.load().filter(i => i.key !== key);
    this.save(items);
    return items;
  },

  setQty(key, qty) {
    const items = this.load();
    const item = items.find(i => i.key === key);
    if (item) item.qty = Math.max(1, Math.min(qty, MAX_QTY));
    this.save(items);
    return items;
  },

  getTotalItems(items) {
    return (items || this.load()).reduce((s, i) => s + i.qty, 0);
  },

  calculateSummary(items, promoCode) {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const itemCount = this.getTotalItems(items);
    const shipping = subtotal > 0
      ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST)
      : 0;
    const discountRate = promoCode && PROMO_CODES[promoCode.toUpperCase()]
      ? PROMO_CODES[promoCode.toUpperCase()]
      : 0;
    const discount = (subtotal + shipping) * discountRate;
    const total = subtotal + shipping - discount;
    return { subtotal, shipping, discount, total, itemCount };
  },

  applyPromo(code) {
    return !!PROMO_CODES[code.toUpperCase()];
  },
};

// ─── Badge UI ─────────────────────────────────────────────────────────────────

const CartBadge = {
  update(count) {
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = String(count);
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },

  sync() {
    this.update(CartService.getTotalItems());
  },
};

// ─── Toast UI ─────────────────────────────────────────────────────────────────

const Toast = {
  _timer: null,

  show(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    if (!toast || !msg) return;
    msg.textContent = message;
    toast.style.display = 'flex';
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => { toast.style.display = 'none'; }, duration);
  },

  hide() {
    const toast = document.getElementById('toast');
    if (toast) toast.style.display = 'none';
    if (this._timer) clearTimeout(this._timer);
  },
};

// ─── Public API (global scope for HTML pages) ─────────────────────────────────

function cartLoad() { return CartService.load(); }
function cartSave(items) { CartService.save(items); }
function cartAdd(product, qty = 1) { CartService.add(product, qty); CartBadge.sync(); }
function cartRemove(key) { CartService.remove(key); CartBadge.sync(); }
function cartSetQty(key, qty) { CartService.setQty(key, qty); CartBadge.sync(); }
function cartTotalItems() { return CartService.getTotalItems(); }
function cartUpdateBadge() { CartBadge.sync(); }
function showToast(msg) { Toast.show(msg); }

// Auto-init badge + cross-tab sync
document.addEventListener('DOMContentLoaded', () => {
  CartBadge.sync();
  window.addEventListener('storage', (e) => {
    if (e.key === 'vs_cart') CartBadge.sync();
  });
});
