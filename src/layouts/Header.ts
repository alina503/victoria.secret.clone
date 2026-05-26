import { updateCartBadge } from '../components/ui/CartBadge';
import { cartStore } from '../store/cartStore';

export function initHeader(): void {
  initMobileMenu();
  initCartBadgeSync();
}

function initMobileMenu(): void {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target as Node) && !mobileMenu.contains(e.target as Node)) {
      mobileMenu.classList.remove('open');
    }
  });
}

function initCartBadgeSync(): void {
  updateCartBadge(cartStore.getTotalCount());
  cartStore.subscribe((state) => {
    updateCartBadge(state.items.reduce((sum, i) => sum + i.qty, 0));
  });
}
