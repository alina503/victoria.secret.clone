// Shared logic for all product listing pages
document.getElementById('hamburger').addEventListener('click', function () {
  document.getElementById('mobile-menu').classList.toggle('open');
});

document.querySelectorAll('.size-group').forEach(function (group) {
  group.querySelectorAll('.size-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      group.querySelectorAll('.size-btn').forEach(function (b) { b.classList.remove('selected'); });
      this.classList.add('selected');
    });
  });
});

let toastTimer;
function showToast(msg) {
  var toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.style.display = 'flex';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.style.display = 'none'; }, 3000);
}

document.querySelectorAll('.add-to-cart').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var card = this.closest('.product-card');
    var selectedSize = card.querySelector('.size-btn.selected');
    if (!selectedSize) {
      var group = card.querySelector('.size-group');
      group.style.outline = '2px solid #c37989';
      setTimeout(function () { group.style.outline = ''; }, 1500);
      return;
    }
    cartAdd({
      id:       card.dataset.id,
      name:     card.dataset.name,
      subtitle: card.dataset.subtitle,
      price:    parseFloat(card.dataset.price),
      image:    card.dataset.image,
      color:    card.dataset.color || '',
      size:     selectedSize.textContent.trim(),
      promo:    card.dataset.promo || ''
    });
    showToast(card.dataset.name + ' adăugat în coș!');
  });
});

// ── Product detail popup ─────────────────────────────────────────────────────

(function () {
  // Inject popup HTML once
  var popupHTML = `
  <div id="product-popup" style="display:none" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
    <div class="bg-white relative w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col sm:flex-row">

      <!-- Close -->
      <button id="pp-close" class="absolute top-3 right-4 text-2xl text-gray-500 hover:text-black z-10 leading-none">&times;</button>

      <!-- Back link -->
      <div class="absolute top-3 left-4 text-xs text-gray-500 flex items-center gap-1">
        <button id="pp-back" class="flex items-center gap-1 hover:text-black">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          Înapoi
        </button>
      </div>

      <!-- Left: images -->
      <div class="flex flex-col items-center p-4 pt-10 sm:w-[55%] flex-shrink-0">
        <img id="pp-main-img" src="" alt="" class="w-full max-h-72 sm:max-h-96 object-cover object-top mb-3" />
        <div id="pp-thumbs" class="flex gap-2 flex-wrap justify-center"></div>
      </div>

      <!-- Right: details -->
      <div class="flex flex-col p-5 pt-10 flex-1 min-w-0">
        <p id="pp-brand" class="text-xs font-bold tracking-widest text-gray-500 uppercase mb-1"></p>
        <h2 id="pp-name" class="text-xl sm:text-2xl font-light mb-1"></h2>

        <!-- Stars -->
        <div class="flex items-center gap-1 mb-2 text-sm text-yellow-400">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half-stroke"></i>
        </div>

        <p id="pp-price" class="text-lg font-semibold mb-3"></p>
        <p id="pp-promo" class="text-red-400 text-xs mb-3 hidden"></p>

        <!-- Quantity -->
        <div class="flex items-center gap-3 mb-4">
          <button id="pp-qty-minus" class="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-black text-lg leading-none">−</button>
          <span id="pp-qty-val" class="text-sm w-4 text-center">1</span>
          <button id="pp-qty-plus"  class="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-black text-lg leading-none">+</button>
        </div>

        <!-- Sizes -->
        <div id="pp-sizes-wrap" class="mb-4">
          <p id="pp-size-label" class="text-xs text-gray-600 mb-2">Mărime</p>
          <div id="pp-size-btns" class="flex flex-wrap gap-2"></div>
          <p id="pp-size-error" class="text-[#c37989] text-xs mt-1 hidden">Selectează o mărime.</p>
        </div>

        <!-- Add to cart -->
        <button id="pp-add-btn" class="bg-gray-200 text-gray-500 text-sm py-3 tracking-wider w-full mt-auto transition hover:bg-black hover:text-white">
          ADAUGAȚI ÎN COȘ
        </button>

        <p id="pp-subtitle" class="text-xs text-gray-400 mt-4 leading-relaxed"></p>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', popupHTML);

  var popup    = document.getElementById('product-popup');
  var mainImg  = document.getElementById('pp-main-img');
  var thumbs   = document.getElementById('pp-thumbs');
  var brand    = document.getElementById('pp-brand');
  var nameEl   = document.getElementById('pp-name');
  var priceEl  = document.getElementById('pp-price');
  var promoEl  = document.getElementById('pp-promo');
  var subtitle = document.getElementById('pp-subtitle');
  var sizeBtns = document.getElementById('pp-size-btns');
  var sizeErr  = document.getElementById('pp-size-error');
  var qtyVal   = document.getElementById('pp-qty-val');
  var addBtn   = document.getElementById('pp-add-btn');

  var currentCard = null;
  var currentQty  = 1;

  function openPopup(card) {
    currentCard = card;
    currentQty  = 1;
    qtyVal.textContent = '1';
    sizeErr.classList.add('hidden');

    // Fill data
    var img  = card.dataset.image || card.querySelector('img').src;
    mainImg.src = img;
    mainImg.alt = card.dataset.name || '';
    brand.textContent   = card.dataset.name || 'Victoria\'s Secret';
    nameEl.textContent  = card.dataset.subtitle || '';
    priceEl.textContent = parseFloat(card.dataset.price).toFixed(2) + ' lei';

    if (card.dataset.promo) {
      promoEl.textContent = card.dataset.promo;
      promoEl.classList.remove('hidden');
    } else {
      promoEl.classList.add('hidden');
    }
    subtitle.textContent = card.dataset.subtitle || '';

    // Thumbnails — use the card image + 2 placeholder tints for demo
    thumbs.innerHTML = '';
    [img].forEach(function (src, i) {
      var t = document.createElement('img');
      t.src = src;
      t.className = 'w-16 h-16 object-cover object-top cursor-pointer border-2 ' + (i === 0 ? 'border-black' : 'border-transparent') + ' hover:border-black transition';
      t.addEventListener('click', function () {
        mainImg.src = src;
        thumbs.querySelectorAll('img').forEach(function (th) { th.classList.remove('border-black'); th.classList.add('border-transparent'); });
        t.classList.add('border-black');
      });
      thumbs.appendChild(t);
    });

    // Size buttons — clone from card's size-group
    sizeBtns.innerHTML = '';
    var cardSizes = card.querySelectorAll('.size-btn');
    cardSizes.forEach(function (btn) {
      var b = document.createElement('button');
      b.textContent = btn.textContent.trim();
      b.className = 'pp-size border border-gray-300 text-xs px-3 py-2 hover:border-black transition';
      b.addEventListener('click', function () {
        sizeBtns.querySelectorAll('.pp-size').forEach(function (s) {
          s.classList.remove('bg-black', 'text-white', 'border-black');
        });
        b.classList.add('bg-black', 'text-white', 'border-black');
        sizeErr.classList.add('hidden');
      });
      sizeBtns.appendChild(b);
    });

    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    popup.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Qty controls
  document.getElementById('pp-qty-minus').addEventListener('click', function () {
    if (currentQty > 1) { currentQty--; qtyVal.textContent = currentQty; }
  });
  document.getElementById('pp-qty-plus').addEventListener('click', function () {
    currentQty++; qtyVal.textContent = currentQty;
  });

  // Add to cart from popup
  addBtn.addEventListener('click', function () {
    var selected = sizeBtns.querySelector('.pp-size.bg-black');
    if (!selected) { sizeErr.classList.remove('hidden'); return; }
    for (var i = 0; i < currentQty; i++) {
      cartAdd({
        id:       currentCard.dataset.id,
        name:     currentCard.dataset.name,
        subtitle: currentCard.dataset.subtitle,
        price:    parseFloat(currentCard.dataset.price),
        image:    currentCard.dataset.image || currentCard.querySelector('img').src,
        color:    currentCard.dataset.color || '',
        size:     selected.textContent.trim(),
        promo:    currentCard.dataset.promo || ''
      });
    }
    showToast(currentCard.dataset.name + ' adăugat în coș!');
    closePopup();
  });

  // Close triggers
  document.getElementById('pp-close').addEventListener('click', closePopup);
  document.getElementById('pp-back').addEventListener('click', closePopup);
  popup.addEventListener('click', function (e) { if (e.target === popup) closePopup(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePopup(); });

  // Expose for dynamically created cards (search results)
  window.openPopup = openPopup;

  // Open popup on product image click
  document.querySelectorAll('.product-card').forEach(function (card) {
    var img = card.querySelector('img');
    if (img) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function () { openPopup(card); });
    }
  });
})();
