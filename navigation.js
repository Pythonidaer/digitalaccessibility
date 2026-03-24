(() => {
  const toggleButton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#primary-navigation');

  if (!toggleButton || !nav) return;

  toggleButton.addEventListener('click', () => {
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

    toggleButton.setAttribute('aria-expanded', String(!isExpanded));
    toggleButton.setAttribute(
      'aria-label',
      isExpanded ? 'Open main menu' : 'Close main menu'
    );

    nav.classList.toggle('is-open');
  });

  const mediaQuery = window.matchMedia('(min-width: 769px)');

  function syncNavState() {
    if (mediaQuery.matches) {
      nav.classList.remove('is-open');
      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.setAttribute('aria-label', 'Open main menu');
    }
  }

  mediaQuery.addEventListener('change', syncNavState);
})();

(() => {
  function siteRootPrefix() {
    const raw = document.body?.dataset?.sitePath;
    if (!raw || raw === 'index.html') return '';
    const segments = raw.split('/').filter(Boolean);
    return '../'.repeat(Math.max(0, segments.length - 1));
  }

  function initHeaderSearchLink() {
    const list = document.querySelector('#primary-navigation .primary-nav__list');
    if (!list || list.querySelector('.primary-nav__item--search')) return;

    const prefix = siteRootPrefix();
    const li = document.createElement('li');
    li.className = 'primary-nav__item primary-nav__item--search';

    const a = document.createElement('a');
    a.href = `${prefix}search.html`;
    a.textContent = 'Search';

    const sitePath = document.body?.dataset?.sitePath;
    if (sitePath === 'search.html') {
      a.setAttribute('aria-current', 'page');
    }

    li.appendChild(a);
    list.appendChild(li);
  }

  initHeaderSearchLink();
})();
