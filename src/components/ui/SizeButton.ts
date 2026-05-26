import { SIZE_ERROR_DURATION } from '../../constants/config';

export function initSizeButtons(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('.size-group').forEach((group) => {
    group.querySelectorAll<HTMLButtonElement>('.size-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        group.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('selected'));
        this.classList.add('selected');
      });
    });
  });
}

export function getSelectedSize(card: HTMLElement): string | null {
  return card.querySelector<HTMLButtonElement>('.size-btn.selected')?.textContent?.trim() ?? null;
}

export function highlightSizeError(group: HTMLElement): void {
  group.style.outline = '2px solid #c37989';
  setTimeout(() => { group.style.outline = ''; }, SIZE_ERROR_DURATION);
}

export function createSizeButton(label: string, extraClass = ''): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.className = `size-btn border border-gray-300 text-xs px-2 py-1 hover:border-black transition${extraClass ? ` ${extraClass}` : ''}`;
  return btn;
}
