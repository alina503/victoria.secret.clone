import type { ToastOptions } from '../types';
import { TOAST_DURATION } from '../constants/config';

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export interface UseToast {
  show(options: ToastOptions): void;
  hide(): void;
}

export function useToast(): UseToast {
  function show({ message, duration = TOAST_DURATION }: ToastOptions): void {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    if (!toast || !msg) return;

    msg.textContent = message;
    toast.style.display = 'flex';

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.display = 'none';
    }, duration);
  }

  function hide(): void {
    const toast = document.getElementById('toast');
    if (toast) toast.style.display = 'none';
    if (toastTimer) clearTimeout(toastTimer);
  }

  return { show, hide };
}
