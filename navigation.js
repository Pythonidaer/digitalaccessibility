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