export function qs<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): T | null {
  return root.querySelector<T>(selector);
}

export function qsAll<T extends Element = Element>(
  selector: string,
  root: ParentNode = document,
): NodeListOf<T> {
  return root.querySelectorAll<T>(selector);
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  innerHTML?: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

export function show(el: HTMLElement): void {
  el.style.display = 'flex';
}

export function hide(el: HTMLElement): void {
  el.style.display = 'none';
}

export function toggleClass(el: Element, cls: string, force?: boolean): void {
  el.classList.toggle(cls, force);
}
