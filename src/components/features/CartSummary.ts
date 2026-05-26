import type { OrderSummary } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { SHIPPING_CONFIG } from '../../constants/config';

export function renderCartSummary(summary: OrderSummary): void {
  const subtotalEl = document.getElementById('subtotal');
  const totalItemsEl = document.getElementById('total-items');
  const totalPriceEl = document.getElementById('total-price');
  const shippingEl = document.getElementById('shipping-cost');
  const discountEl = document.getElementById('discount-amount');
  const bannerEl = document.getElementById('shipping-banner');

  if (subtotalEl) subtotalEl.textContent = formatPrice(summary.subtotal);
  if (totalItemsEl) totalItemsEl.textContent = String(summary.itemCount);
  if (totalPriceEl) totalPriceEl.textContent = formatPrice(summary.total);

  if (discountEl) {
    if (summary.discount > 0) {
      discountEl.textContent = `−${formatPrice(summary.discount)}`;
      discountEl.parentElement?.classList.remove('hidden');
    } else {
      discountEl.parentElement?.classList.add('hidden');
    }
  }

  if (shippingEl) {
    if (summary.subtotal === 0) {
      shippingEl.textContent = '—';
      shippingEl.className = 'text-gray-400';
    } else if (summary.shipping === 0) {
      shippingEl.textContent = 'Gratuită';
      shippingEl.className = 'text-green-600 font-medium';
    } else {
      shippingEl.textContent = formatPrice(summary.shipping);
      shippingEl.className = 'text-gray-700';
    }
  }

  if (bannerEl) {
    const threshold = SHIPPING_CONFIG.freeThreshold;
    if (summary.subtotal === 0) {
      bannerEl.innerHTML = `Adaugă produse pentru a beneficia de livrare gratuită de la ${formatPrice(threshold)}.`;
    } else if (summary.subtotal < threshold) {
      const rem = formatPrice(threshold - summary.subtotal);
      bannerEl.innerHTML = `Ești la <strong>${rem}</strong> distanță de <strong>livrare gratuită!</strong>`;
    } else {
      bannerEl.innerHTML = 'Felicitări! Ai obținut <strong>livrare gratuită!</strong>';
    }
  }
}

export function initPromoCode(
  onApply: (code: string) => { success: boolean; discountRate?: number },
): void {
  const applyBtn = document.getElementById('apply-promo');
  const promoInput = document.getElementById('promo-input') as HTMLInputElement | null;
  const promoMsg = document.getElementById('promo-msg');

  if (!applyBtn || !promoInput || !promoMsg) return;

  applyBtn.addEventListener('click', () => {
    promoMsg.className = 'text-xs mt-1';
    promoMsg.classList.remove('hidden');

    const result = onApply(promoInput.value.trim());
    if (result.success) {
      const pct = ((result.discountRate ?? 0) * 100).toFixed(0);
      promoMsg.textContent = `Cod aplicat! Reducere ${pct}%.`;
      promoMsg.classList.add('text-green-600');
      promoInput.disabled = true;
      applyBtn.setAttribute('disabled', 'true');
      applyBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
      promoMsg.textContent = 'Cod invalid sau deja aplicat. Încearcă din nou.';
      promoMsg.classList.add('text-red-500');
    }
  });
}
