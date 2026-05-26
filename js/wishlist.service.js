/**
 * WishlistService — localStorage-based wishlist shared across all pages.
 */

const WISHLIST_KEY = 'vs_wishlist';

const WishlistService = {
  load() {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); } catch { return []; }
  },

  save(items) {
    try { localStorage.setItem(WISHLIST_KEY, JSON.stringify(items)); } catch { /* quota */ }
  },

  has(id) {
    return this.load().some(function (i) { return i.id === id; });
  },

  toggle(product) {
    var items = this.load();
    var idx = items.findIndex(function (i) { return i.id === product.id; });
    if (idx >= 0) {
      items.splice(idx, 1);
      this.save(items);
      return false; // removed
    } else {
      items.push(product);
      this.save(items);
      return true; // added
    }
  },

  count() {
    return this.load().length;
  },
};

// ─── Inject heart buttons onto all .product-card elements ────────────────────

function initWishlistButtons(root) {
  root = root || document;
  root.querySelectorAll('.product-card').forEach(function (card) {
    if (card.querySelector('.wishlist-btn')) return; // already wired
    var id = card.dataset.id;
    if (!id) return;

    var btn = document.createElement('button');
    btn.className = 'wishlist-btn absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow transition';
    btn.setAttribute('aria-label', 'Adaugă la favorite');
    btn.setAttribute('title', 'Adaugă la favorite');
    btn.innerHTML = WishlistService.has(id)
      ? '<i class="fa-solid fa-heart text-[#c37989] text-sm"></i>'
      : '<i class="fa-regular fa-heart text-gray-400 text-sm hover:text-[#c37989]"></i>';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var product = {
        id:       card.dataset.id,
        name:     card.dataset.name,
        subtitle: card.dataset.subtitle || '',
        price:    parseFloat(card.dataset.price) || 0,
        image:    card.dataset.image || card.querySelector('img')?.src || '',
        color:    card.dataset.color || '',
      };
      var added = WishlistService.toggle(product);
      btn.innerHTML = added
        ? '<i class="fa-solid fa-heart text-[#c37989] text-sm"></i>'
        : '<i class="fa-regular fa-heart text-gray-400 text-sm hover:text-[#c37989]"></i>';
      btn.setAttribute('title', added ? 'Elimină din favorite' : 'Adaugă la favorite');

      // Toast feedback
      if (typeof showToast === 'function') {
        showToast(added ? product.name + ' adăugat la favorite!' : product.name + ' eliminat din favorite.');
      }
    });

    // Make sure the card wrapper is positioned
    var wrapper = card.querySelector('.relative') || card;
    if (card.querySelector('img')) {
      var imgWrap = card.querySelector('img').parentElement;
      if (imgWrap) {
        imgWrap.style.position = 'relative';
        imgWrap.appendChild(btn);
      } else {
        card.style.position = 'relative';
        card.appendChild(btn);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initWishlistButtons();
});
