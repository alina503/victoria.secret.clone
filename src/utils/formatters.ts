import { APP_CONFIG } from '../constants/config';

export function formatPrice(amount: number): string {
  return `${amount.toFixed(2)} ${APP_CONFIG.currency}`;
}

export function formatItemCount(count: number): string {
  return count === 1 ? '1 produs' : `${count} produse`;
}

export function buildCartKey(id: string, size: string, color: string): string {
  return `${id}|${size}|${color}`;
}
