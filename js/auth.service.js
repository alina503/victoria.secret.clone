/**
 * AuthService — LocalStorage-based user authentication.
 * Shared across login, register, and all pages for header state.
 */

const AUTH_KEY = 'vs_user';

const AuthService = {
  register(firstName, lastName, email, password) {
    const users = this._getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'exists' };
    }
    const user = { id: Date.now(), firstName, lastName, email, password: this._hash(password) };
    users.push(user);
    this._saveUsers(users);
    this._setSession({ id: user.id, firstName, lastName, email });
    return { ok: true };
  },

  login(email, password) {
    const users = this._getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === this._hash(password)
    );
    if (!user) return { ok: false, error: 'invalid' };
    this._setSession({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email });
    return { ok: true };
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  getSession() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  isLoggedIn() {
    return this.getSession() !== null;
  },

  _setSession(data) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  },

  _getUsers() {
    try {
      const raw = localStorage.getItem('vs_users');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },

  _saveUsers(users) {
    try { localStorage.setItem('vs_users', JSON.stringify(users)); } catch { /* quota */ }
  },

  // Simple obfuscation (not cryptographic — for portfolio/demo only, never production)
  _hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return h.toString(36);
  },
};

// ─── Logout confirmation modal ────────────────────────────────────────────────

const LOGOUT_MODAL_HTML = `
<div id="logout-modal" style="display:none"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
  <div class="bg-white shadow-xl p-6 max-w-sm w-full text-center">
    <p class="text-base font-light mb-1">Deconectare</p>
    <p id="logout-modal-msg" class="text-sm text-gray-600 mb-6"></p>
    <div class="flex gap-3 justify-center">
      <button id="logout-cancel"
        class="px-5 py-2 border border-gray-300 text-sm hover:border-black transition">Anulează</button>
      <button id="logout-confirm"
        class="px-5 py-2 bg-black text-white text-sm hover:bg-gray-800 transition">Deconectează-te</button>
    </div>
  </div>
</div>`;

function injectLogoutModal() {
  if (document.getElementById('logout-modal')) return;
  document.body.insertAdjacentHTML('beforeend', LOGOUT_MODAL_HTML);

  document.getElementById('logout-cancel').addEventListener('click', closeLogoutModal);
  document.getElementById('logout-modal').addEventListener('click', function (e) {
    if (e.target === this) closeLogoutModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLogoutModal();
  });
}

function openLogoutModal(userName, onConfirm) {
  injectLogoutModal();
  document.getElementById('logout-modal-msg').textContent =
    `Ești sigur că vrei să te deconectezi din contul ${userName}?`;
  document.getElementById('logout-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const confirmBtn = document.getElementById('logout-confirm');
  const newBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
  newBtn.addEventListener('click', () => {
    closeLogoutModal();
    onConfirm();
  });
}

function closeLogoutModal() {
  const modal = document.getElementById('logout-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ─── Header user icon state ───────────────────────────────────────────────────

function initAuthHeader() {
  const session = AuthService.getSession();
  const userLink = document.getElementById('user-nav-link');
  const userIcon = document.getElementById('user-nav-icon');
  if (!userLink) return;

  if (session) {
    userLink.href = '#';
    userLink.title = `${session.firstName} ${session.lastName}`;
    if (userIcon) {
      userIcon.className = 'fa-solid fa-user text-xl sm:text-2xl cursor-pointer text-[#c37989]';
    }
    userLink.addEventListener('click', function (e) {
      e.preventDefault();
      openLogoutModal(`${session.firstName} ${session.lastName}`, () => {
        AuthService.logout();
        window.location.reload();
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initAuthHeader();
  initNewsletterFooter();
});

// ─── Newsletter Footer ────────────────────────────────────────────────────────

function initNewsletterFooter() {
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var msg = form.querySelector('.newsletter-msg');
      if (!input) return;
      var email = input.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (msg) { msg.textContent = 'Introduceți un e-mail valid.'; msg.className = 'newsletter-msg text-xs text-red-500 mt-2'; }
        return;
      }
      var subs = [];
      try { subs = JSON.parse(localStorage.getItem('vs_newsletter') || '[]'); } catch { subs = []; }
      if (!subs.includes(email)) { subs.push(email); localStorage.setItem('vs_newsletter', JSON.stringify(subs)); }
      input.value = '';
      if (msg) { msg.textContent = 'Mulțumim! Ești abonat(ă) la newsletter.'; msg.className = 'newsletter-msg text-xs text-green-600 mt-2'; }
    });
  });
}
