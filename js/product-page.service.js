/**
 * ProductPageService — enterprise-grade product listing & modal logic.
 * Browser-ready companion to the TypeScript src/ layer.
 */

// ─── Sanitize ────────────────────────────────────────────────────────────────

function sanitize(str) {
  const el = document.createElement('div');
  el.textContent = String(str ?? '');
  return el.innerHTML;
}

// ─── Size Buttons ─────────────────────────────────────────────────────────────

const SizeButtonService = {
  init(root = document) {
    root.querySelectorAll('.size-group').forEach(group => {
      group.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function () {
          group.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
          this.classList.add('selected');
        });
      });
    });
  },

  getSelected(card) {
    return card.querySelector('.size-btn.selected')?.textContent?.trim() ?? null;
  },

  highlightError(group, duration = 1500) {
    group.style.outline = '2px solid #c37989';
    setTimeout(() => { group.style.outline = ''; }, duration);
  },
};

// ─── Add-to-Cart Wire-up ──────────────────────────────────────────────────────

const AddToCartService = {
  wire(root = document) {
    root.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function () {
        const card = this.closest('.product-card');
        if (!card) return;
        const hasSizes = !!card.querySelector('.size-group');
        const size = SizeButtonService.getSelected(card);
        if (hasSizes && !size) {
          SizeButtonService.highlightError(card.querySelector('.size-group'));
          return;
        }
        const price = parseFloat(card.dataset.price);
        if (isNaN(price)) return;
        cartAdd({
          id:       card.dataset.id,
          name:     card.dataset.name,
          subtitle: card.dataset.subtitle,
          price,
          image:    card.dataset.image,
          color:    card.dataset.color || '',
          size:     size || '',
          promo:    card.dataset.promo || '',
        });
        showToast(`${card.dataset.name} adăugat în coș!`);
      });
    });
  },
};

// ─── Product Popup Modal ──────────────────────────────────────────────────────

const ProductModal = {
  _current: null,
  _qty: 1,

  TEMPLATE: `
  <div id="product-popup" style="display:none"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
    <div class="bg-white relative w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col sm:flex-row">

      <button id="pp-close"
        class="absolute top-3 right-4 text-2xl text-gray-500 hover:text-black z-10 leading-none">&times;</button>

      <div class="absolute top-3 left-4 text-xs text-gray-500 flex items-center gap-1">
        <button id="pp-back" class="flex items-center gap-1 hover:text-black">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Înapoi
        </button>
      </div>

      <div class="flex flex-col items-center p-4 pt-10 sm:w-[55%] flex-shrink-0">
        <img id="pp-main-img" src="" alt=""
          class="w-full max-h-72 sm:max-h-96 object-cover object-top mb-3"
          onerror="this.src='assets/image/placeholder.avif'" />
        <div id="pp-thumbs" class="flex gap-2 flex-wrap justify-center"></div>
      </div>

      <div class="flex flex-col p-5 pt-10 flex-1 min-w-0">
        <p id="pp-brand" class="text-xs font-bold tracking-widest text-gray-500 uppercase mb-1"></p>
        <h2 id="pp-name" class="text-xl sm:text-2xl font-light mb-1"></h2>

        <div class="flex items-center gap-1 mb-2 text-sm text-yellow-400">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star-half-stroke"></i>
        </div>

        <p id="pp-price" class="text-lg font-semibold mb-3"></p>
        <p id="pp-promo" class="text-red-400 text-xs mb-3 hidden"></p>

        <div class="flex items-center gap-3 mb-4">
          <button id="pp-qty-minus"
            class="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-black text-lg leading-none">−</button>
          <span id="pp-qty-val" class="text-sm w-4 text-center">1</span>
          <button id="pp-qty-plus"
            class="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-black text-lg leading-none">+</button>
        </div>

        <div id="pp-sizes-wrap" class="mb-4">
          <p class="text-xs text-gray-600 mb-2">Mărime</p>
          <div id="pp-size-btns" class="flex flex-wrap gap-2"></div>
          <p id="pp-size-error" class="text-[#c37989] text-xs mt-1 hidden">Selectează o mărime.</p>
        </div>

        <button id="pp-add-btn"
          class="bg-gray-200 text-gray-500 text-sm py-3 tracking-wider w-full mt-auto transition hover:bg-black hover:text-white">
          ADAUGAȚI ÎN COȘ
        </button>

        <p id="pp-subtitle" class="text-xs text-gray-400 mt-4 leading-relaxed"></p>
      </div>
    </div>
  </div>`,

  inject() {
    if (document.getElementById('product-popup')) return;
    document.body.insertAdjacentHTML('beforeend', this.TEMPLATE);
    this._bind();
  },

  _bind() {
    const self = this;

    document.getElementById('pp-qty-minus').addEventListener('click', () => {
      if (self._qty > 1) { self._qty--; document.getElementById('pp-qty-val').textContent = self._qty; }
    });
    document.getElementById('pp-qty-plus').addEventListener('click', () => {
      if (self._qty < MAX_QTY) { self._qty++; document.getElementById('pp-qty-val').textContent = self._qty; }
    });

    document.getElementById('pp-add-btn').addEventListener('click', () => {
      const selected = document.querySelector('#pp-size-btns .pp-size.bg-black');
      if (!selected || !self._current) {
        document.getElementById('pp-size-error').classList.remove('hidden');
        return;
      }
      const price = parseFloat(self._current.dataset.price);
      if (isNaN(price)) return;

      // Single add call with qty — no loop
      CartService.add({
        id:       self._current.dataset.id,
        name:     self._current.dataset.name,
        subtitle: self._current.dataset.subtitle,
        price,
        image:    self._current.dataset.image || self._current.querySelector('img')?.src || '',
        color:    self._current.dataset.color || '',
        size:     selected.textContent.trim(),
        promo:    self._current.dataset.promo || '',
      }, self._qty);

      CartBadge.sync();
      showToast(`${self._current.dataset.name} adăugat în coș!`);
      self.close();
    });

    document.getElementById('pp-close').addEventListener('click', () => self.close());
    document.getElementById('pp-back').addEventListener('click', () => self.close());
    document.getElementById('product-popup').addEventListener('click', function (e) {
      if (e.target === this) self.close();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') self.close(); });
  },

  open(card) {
    this._current = card;
    this._qty = 1;
    document.getElementById('pp-qty-val').textContent = '1';
    document.getElementById('pp-size-error').classList.add('hidden');

    const img = card.dataset.image || card.querySelector('img')?.src || '';
    const mainImg = document.getElementById('pp-main-img');
    mainImg.src = img;
    mainImg.alt = sanitize(card.dataset.name || '');

    // Use textContent (safe) for text nodes
    document.getElementById('pp-brand').textContent = card.dataset.name || "Victoria's Secret";
    document.getElementById('pp-name').textContent = card.dataset.subtitle || '';
    document.getElementById('pp-price').textContent =
      parseFloat(card.dataset.price).toFixed(2) + ' lei';
    document.getElementById('pp-subtitle').textContent = card.dataset.subtitle || '';

    const promoEl = document.getElementById('pp-promo');
    if (card.dataset.promo) {
      promoEl.textContent = card.dataset.promo;
      promoEl.classList.remove('hidden');
    } else {
      promoEl.classList.add('hidden');
    }

    const thumbs = document.getElementById('pp-thumbs');
    thumbs.innerHTML = '';
    const thumb = document.createElement('img');
    thumb.src = img;
    thumb.className = 'w-16 h-16 object-cover object-top cursor-pointer border-2 border-black hover:border-black transition';
    thumb.onerror = () => { thumb.src = 'assets/image/placeholder.avif'; };
    thumb.addEventListener('click', () => { mainImg.src = img; });
    thumbs.appendChild(thumb);

    const sizeBtns = document.getElementById('pp-size-btns');
    sizeBtns.innerHTML = '';
    card.querySelectorAll('.size-btn').forEach(btn => {
      const b = document.createElement('button');
      b.textContent = btn.textContent.trim();
      b.className = 'pp-size border border-gray-300 text-xs px-3 py-2 hover:border-black transition';
      b.addEventListener('click', () => {
        sizeBtns.querySelectorAll('.pp-size').forEach(s =>
          s.classList.remove('bg-black', 'text-white', 'border-black'),
        );
        b.classList.add('bg-black', 'text-white', 'border-black');
        document.getElementById('pp-size-error').classList.add('hidden');
      });
      sizeBtns.appendChild(b);
    });

    document.getElementById('product-popup').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  },

  close() {
    document.getElementById('product-popup').style.display = 'none';
    document.body.style.overflow = '';
  },
};

// ─── Search Overlay ───────────────────────────────────────────────────────────

const SearchOverlay = {
  _products: [],
  _timer: null,

  collect() {
    this._products = [];
    document.querySelectorAll('.product-card').forEach(card => {
      this._products.push({
        id:       card.dataset.id,
        name:     card.dataset.name,
        subtitle: card.dataset.subtitle,
        price:    parseFloat(card.dataset.price || '0'),
        image:    card.dataset.image || '',
        color:    card.dataset.color || '',
        sizes:    Array.from(card.querySelectorAll('.size-btn')).map(b => b.textContent.trim()),
      });
    });
  },

  init() {
    this.collect();

    const overlay   = document.getElementById('search-overlay');
    const input     = document.getElementById('search-input');
    const toggleBtn = document.getElementById('search-toggle');
    const closeBtn  = document.getElementById('search-close');
    const resultsEl = document.getElementById('search-results');
    const emptyEl   = document.getElementById('search-empty');

    if (!overlay || !input || !toggleBtn || !closeBtn || !resultsEl || !emptyEl) return;

    const self = this;

    function closeOverlay() {
      overlay.style.display = 'none';
      input.value = '';
      resultsEl.innerHTML = '';
      emptyEl.style.display = 'none';
    }

    toggleBtn.addEventListener('click', () => {
      overlay.style.display = 'flex';
      overlay.style.flexDirection = 'column';
      input.focus();
    });

    closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.style.display !== 'none') closeOverlay();
    });

    input.addEventListener('input', function () {
      clearTimeout(self._timer);
      self._timer = setTimeout(() => {
        const q = this.value.trim().toLowerCase();
        resultsEl.innerHTML = '';
        if (!q) { emptyEl.style.display = 'none'; return; }

        const matches = self._products.filter(p =>
          `${p.name} ${p.subtitle} ${p.color}`.toLowerCase().includes(q),
        );

        if (matches.length === 0) { emptyEl.style.display = 'block'; return; }
        emptyEl.style.display = 'none';

        matches.forEach(p => {
          const card = self._buildCard(p);
          resultsEl.appendChild(card);
        });
      }, 200);
    });
  },

  _buildCard(p) {
    const sizeHTML = p.sizes.map(sz =>
      `<button class="size-btn border border-gray-300 text-xs px-2 py-1 hover:border-black transition">${sanitize(sz)}</button>`,
    ).join('');

    const div = document.createElement('div');
    div.className = 'product-card flex flex-col';
    div.dataset.id       = p.id + '-s';
    div.dataset.name     = p.name;
    div.dataset.subtitle = p.subtitle;
    div.dataset.price    = p.price;
    div.dataset.image    = p.image;
    div.dataset.color    = p.color;

    const img = document.createElement('img');
    img.className = 'w-full cursor-pointer';
    img.src = p.image;
    img.alt = sanitize(p.name);
    img.loading = 'lazy';
    img.onerror = () => { img.src = 'assets/image/placeholder.avif'; };
    img.addEventListener('click', () => ProductModal.open(div));

    const body = document.createElement('div');
    body.className = 'flex flex-col p-2 flex-1';
    body.innerHTML = `
      <p class="text-sm font-medium">${sanitize(p.name)}</p>
      <p class="text-xs text-gray-600 mb-1">${sanitize(p.subtitle)}</p>
      <span class="text-sm font-semibold">${parseFloat(p.price).toFixed(2)} lei</span>
      <div class="flex gap-1 my-2 size-group">${sizeHTML}</div>
      <button class="add-to-cart mt-auto bg-black text-white text-xs py-2 hover:bg-gray-800 transition w-full">ADAUGĂ ÎN COȘ</button>`;

    div.appendChild(img);
    div.appendChild(body);

    SizeButtonService.init(div);
    AddToCartService.wire(div);

    return div;
  },
};

// ─── Header / Mobile Menu ─────────────────────────────────────────────────────

const HeaderService = {
  init() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!hamburger || !menu) return;
    hamburger.addEventListener('click', () => menu.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  },
};

// ─── Page Init ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  HeaderService.init();
  SizeButtonService.init();
  AddToCartService.wire();
  ProductModal.inject();
  SearchOverlay.init();

  document.querySelectorAll('.product-card').forEach(card => {
    const img = card.querySelector('img');
    if (img) {
      img.addEventListener('click', () => ProductModal.open(card));
      img.addEventListener('error', () => { img.src = 'assets/image/placeholder.avif'; });
    }
  });
});
