import type { SearchResult } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { sanitizeText } from '../../utils/helpers';
import { initSizeButtons, getSelectedSize, highlightSizeError } from '../ui/SizeButton';
import { showToast } from '../ui/Toast';
import { cart } from '../../hooks/useCart';
import { openProductModal } from './ProductModal';

const s = sanitizeText;

export function renderProductCard(product: SearchResult): HTMLElement {
  const sizeButtons = product.sizes
    .map((size) =>
      `<button class="size-btn border border-gray-300 text-xs px-2 py-1 hover:border-black transition">${s(size)}</button>`,
    )
    .join('');

  const div = document.createElement('div');
  div.className = 'product-card flex flex-col';
  div.dataset.id = product.id;
  div.dataset.name = product.name;
  div.dataset.subtitle = product.subtitle;
  div.dataset.price = String(product.price);
  div.dataset.image = product.image;
  div.dataset.color = product.color;

  div.innerHTML = `
    <img class="w-full cursor-pointer" src="${s(product.image)}" alt="${s(product.name)}" loading="lazy" onerror="this.src='assets/image/placeholder.avif'" />
    <div class="flex flex-col p-2 sm:p-3 flex-1">
      <p class="text-sm sm:text-base font-medium">${s(product.name)}</p>
      <p class="text-xs sm:text-sm text-gray-600 mb-1">${s(product.subtitle)}</p>
      <span class="text-base sm:text-lg font-semibold">${formatPrice(product.price)}</span>
      <div class="flex gap-1 my-2 size-group">${sizeButtons}</div>
      <button class="add-to-cart mt-auto bg-black text-white text-xs py-2 hover:bg-gray-800 transition w-full">
        ADAUGĂ ÎN COȘ
      </button>
    </div>`;

  initSizeButtons(div);

  div.querySelector<HTMLImageElement>('img')?.addEventListener('click', () => {
    openProductModal(div);
  });

  div.querySelector('.add-to-cart')?.addEventListener('click', () => {
    const size = getSelectedSize(div);
    if (!size) {
      const group = div.querySelector<HTMLElement>('.size-group');
      if (group) highlightSizeError(group);
      return;
    }
    cart.add({
      id: product.id,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      image: product.image,
      color: product.color,
      size,
      promo: product.promo ?? '',
    });
    showToast(`${product.name} adăugat în coș!`);
  });

  return div;
}

export function initPageProductCards(): void {
  document.querySelectorAll<HTMLElement>('.product-card').forEach((card) => {
    const img = card.querySelector<HTMLImageElement>('img');
    if (img) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openProductModal(card));
      img.addEventListener('error', () => { img.src = 'assets/image/placeholder.avif'; });
    }

    card.querySelector('.add-to-cart')?.addEventListener('click', () => {
      const size = getSelectedSize(card);
      if (!size) {
        const group = card.querySelector<HTMLElement>('.size-group');
        if (group) highlightSizeError(group);
        return;
      }
      const name = card.dataset.name ?? '';
      const price = parseFloat(card.dataset.price ?? '0');
      if (isNaN(price)) return;
      cart.add({
        id: card.dataset.id ?? '',
        name,
        subtitle: card.dataset.subtitle ?? '',
        price,
        image: card.dataset.image ?? '',
        color: card.dataset.color ?? '',
        size,
        promo: card.dataset.promo ?? '',
      });
      showToast(`${name} adăugat în coș!`);
    });
  });
}
