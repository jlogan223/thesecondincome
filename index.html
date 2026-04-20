// Theme switcher — auto-detects browser preference, persists user choice
(function() {
  const STORAGE_KEY = 'tsi_theme';

  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = theme === 'dark'
        ? '<span>&#9788;</span> Light'
        : '<span>&#9790;</span> Dark';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Apply immediately to avoid flash
  applyTheme(getPreferred());

  // Expose toggle function for button
  window.toggleTheme = function() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };

  // Re-apply once DOM is ready (updates button label)
  document.addEventListener('DOMContentLoaded', function() {
    applyTheme(getPreferred());
  });
})();
