export interface UseModal {
  open(): void;
  close(): void;
  toggle(): void;
  isOpen(): boolean;
}

export function useModal(modalId: string): UseModal {
  function getEl(): HTMLElement | null {
    return document.getElementById(modalId);
  }

  function open(): void {
    const el = getEl();
    if (!el) return;
    el.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function close(): void {
    const el = getEl();
    if (!el) return;
    el.style.display = 'none';
    document.body.style.overflow = '';
  }

  function toggle(): void {
    isOpen() ? close() : open();
  }

  function isOpen(): boolean {
    const el = getEl();
    return el ? el.style.display !== 'none' && el.style.display !== '' : false;
  }

  return { open, close, toggle, isOpen };
}
