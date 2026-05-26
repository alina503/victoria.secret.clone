export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function sanitizeText(text: string): string {
  const el = document.createElement('div');
  el.textContent = text;
  return el.innerHTML;
}

export function getCurrentPageKey(): string {
  const path = window.location.pathname;
  const file = path.split('/').pop() ?? 'index.html';
  return file.replace('.html', '');
}
