import type { SearchResult } from '../types';

export function collectPageProducts(): SearchResult[] {
  const products: SearchResult[] = [];

  document.querySelectorAll<HTMLElement>('.product-card').forEach((card) => {
    const sizes = Array.from(card.querySelectorAll('.size-btn')).map((b) =>
      b.textContent?.trim() ?? '',
    );
    products.push({
      id: card.dataset.id ?? '',
      name: card.dataset.name ?? '',
      subtitle: card.dataset.subtitle ?? '',
      price: parseFloat(card.dataset.price ?? '0'),
      image: card.dataset.image ?? '',
      color: card.dataset.color ?? '',
      sizes,
    });
  });

  return products;
}

export function filterProducts(
  products: SearchResult[],
  query: string,
): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return products.filter((p) =>
    `${p.name} ${p.subtitle} ${p.color}`.toLowerCase().includes(q),
  );
}
