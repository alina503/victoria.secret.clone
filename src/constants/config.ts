export const APP_CONFIG = {
  name: "Victoria's Secret",
  tagline: 'Nu te opri să strălucești',
  currency: 'lei',
  locale: 'ro-RO',
  instagramHandle: '@VICTORIASSECRETROMANIA',
  copyright: "© 2024 Victoria's Secret. All Rights Reserved.",
} as const;

export const SHIPPING_CONFIG = {
  freeThreshold: 269,
  standardCost: 20,
  currency: 'lei',
} as const;

export const CART_CONFIG = {
  storageKey: 'vs_cart',
  maxQty: 99,
} as const;

export const PROMO_CODES: Record<string, number> = {
  VS10: 0.1,
  VS15: 0.15,
  VS20: 0.2,
};

export const TOAST_DURATION = 3000;
export const SIZE_ERROR_DURATION = 1500;
