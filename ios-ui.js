/* Muscle Atlas Pro 3.8 — independent iPhone presentation controls.
   Training records and IndexedDB schemas are intentionally untouched. */
(function () {
  'use strict';
  const key = 'muscle-atlas-appearance';
  const root = document.documentElement;
  const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  let choice = 'system';
  try {
    const stored = localStorage.getItem(key);
    if (['system', 'light', 'dark'].includes(stored)) choice = stored;
  } catch (_) { /* private browsing may disable localStorage */ }
  function syncTheme() {
    const resolved = choice === 'system' ? (media?.matches ? 'dark' : 'light') : choice;
    root.dataset.theme = resolved;
    root.dataset.appearanceChoice = choice;
    const meta = document.getElementById('browser-theme-color');
    if (meta) meta.setAttribute('content', resolved === 'dark' ? '#101724' : '#f5f7fb');
    const control = document.getElementById('appearance-mode');
    if (control && control.value !== choice) control.value = choice;
  }
  syncTheme();
  if (media) {
    if (media.addEventListener) media.addEventListener('change', syncTheme);
    else if (media.addListener) media.addListener(syncTheme);
  }
  document.addEventListener('DOMContentLoaded', () => {
    syncTheme();
    document.getElementById('appearance-mode')?.addEventListener('change', event => {
      const next = event.target.value;
      if (!['system', 'light', 'dark'].includes(next)) return;
      choice = next;
      try { localStorage.setItem(key, choice); } catch (_) {}
      syncTheme();
    });

    const trigger = document.getElementById('mobile-more-trigger');
    const sheet = document.getElementById('mobile-more-sheet');
    const overlay = document.getElementById('mobile-more-overlay');
    const closeButton = document.getElementById('mobile-more-close');
    if (!trigger || !sheet || !overlay || !closeButton) return;
    let previousFocus = null;
    function closeMore(restoreFocus = true) {
      if (sheet.hidden) return;
      sheet.hidden = overlay.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-sheet-open');
      if (restoreFocus && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    }
    function openMore() {
      if (!sheet.hidden) return;
      previousFocus = document.activeElement;
      sheet.hidden = overlay.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('mobile-sheet-open');
      closeButton.focus({ preventScroll: true });
    }
    trigger.addEventListener('click', () => sheet.hidden ? openMore() : closeMore());
    closeButton.addEventListener('click', () => closeMore());
    overlay.addEventListener('click', () => closeMore());
    sheet.querySelectorAll('[data-route]').forEach(b => b.addEventListener('click', () => closeMore(false)));
    document.addEventListener('muscleatlas:route', () => closeMore(false));
    document.addEventListener('keydown', e => {
      if (sheet.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeMore(); return; }
      if (e.key !== 'Tab') return;
      const focusables = [...sheet.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled])')];
      if (!focusables.length) return;
      if (e.shiftKey && document.activeElement === focusables[0]) { e.preventDefault(); focusables.at(-1).focus(); }
      if (!e.shiftKey && document.activeElement === focusables.at(-1)) { e.preventDefault(); focusables[0].focus(); }
    });
    let startY = null;
    sheet.addEventListener('touchstart', e => { startY = e.touches.length === 1 ? e.touches[0].clientY : null; }, { passive: true });
    sheet.addEventListener('touchend', e => {
      if (startY !== null && e.changedTouches[0].clientY - startY > 90) closeMore();
      startY = null;
    }, { passive: true });
    // The existing desktop brand also works like a native Home affordance.
    document.querySelector('.brand')?.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector('.sidebar-nav [data-route="dashboard"]')?.click();
    });
    document.querySelector('.mobile-nav [data-route="dashboard"]')?.setAttribute('aria-current', 'page');
    window.addEventListener('resize', () => {
      if (window.innerWidth > 750) closeMore(false);
    });
  });
})();
