import { collectPageProducts, filterProducts } from '../services/searchService';
import { renderProductCard } from '../components/features/ProductCard';
import { useModal } from '../hooks/useModal';
import { debounce } from '../utils/helpers';

export function initSearchOverlay(): void {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input') as HTMLInputElement | null;
  const toggleBtn = document.getElementById('search-toggle');
  const closeBtn = document.getElementById('search-close');
  const resultsEl = document.getElementById('search-results');
  const emptyEl = document.getElementById('search-empty') as HTMLElement | null;

  if (!overlay || !input || !toggleBtn || !closeBtn || !resultsEl || !emptyEl) return;

  const modal = useModal('search-overlay');
  const products = collectPageProducts();

  function clearResults(): void {
    input!.value = '';
    resultsEl!.innerHTML = '';
    emptyEl!.style.display = 'none';
  }

  toggleBtn.addEventListener('click', () => {
    overlay.style.flexDirection = 'column';
    modal.open();
    input.focus();
  });

  closeBtn.addEventListener('click', () => { clearResults(); modal.close(); });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { clearResults(); modal.close(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.isOpen()) { clearResults(); modal.close(); }
  });

  const handleInput = debounce(() => {
    const q = input!.value.trim();
    resultsEl!.innerHTML = '';

    if (!q) { emptyEl!.style.display = 'none'; return; }

    const matches = filterProducts(products, q);

    if (matches.length === 0) {
      emptyEl!.style.display = 'block';
      return;
    }

    emptyEl!.style.display = 'none';
    matches.forEach((p) => resultsEl!.appendChild(renderProductCard(p)));
  }, 200);

  input.addEventListener('input', handleInput);
}
