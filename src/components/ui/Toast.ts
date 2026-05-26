import { TOAST_DURATION } from '../../constants/config';
import { ROUTES } from '../../constants/routes';

const TOAST_TEMPLATE = `
<div id="toast" style="display:none"
  class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-6 py-3 rounded z-50 flex items-center gap-3">
  <i class="fa-solid fa-circle-check text-green-400"></i>
  <span id="toast-msg">Produs adăugat în coș!</span>
  <a href="${ROUTES.cart}" class="underline whitespace-nowrap">Vezi coșul</a>
</div>`;

let timer: ReturnType<typeof setTimeout> | null = null;

export function injectToast(): void {
  if (document.getElementById('toast')) return;
  document.body.insertAdjacentHTML('beforeend', TOAST_TEMPLATE);
}

export function showToast(message: string, duration = TOAST_DURATION): void {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toast-msg');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.style.display = 'flex';

  if (timer) clearTimeout(timer);
  timer = setTimeout(() => { toast.style.display = 'none'; }, duration);
}

export function hideToast(): void {
  const toast = document.getElementById('toast');
  if (toast) toast.style.display = 'none';
  if (timer) clearTimeout(timer);
}
