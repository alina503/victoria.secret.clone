export function updateCartBadge(count: number): void {
  document.querySelectorAll<HTMLElement>('.cart-badge').forEach((el) => {
    el.textContent = String(count);
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });
}

export function initCartBadge(initialCount: number): void {
  document.addEventListener('DOMContentLoaded', () => updateCartBadge(initialCount));
}
