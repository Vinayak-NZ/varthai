document.addEventListener('DOMContentLoaded', () => {
  // For each grid (skip the static/no-expand grids)
  document.querySelectorAll('.phd-grid').forEach((grid) => {
    if (grid.classList.contains('no-expand')) return;

    const section = grid.closest('.full-bleed') || grid.parentElement;

    const collapseAll = () => {
      grid.querySelectorAll('.phd-item.expanded').forEach(i => i.classList.remove('expanded'));
      grid.classList.remove('expanded-mode');
      syncSectionZ();
    };

    const syncSectionZ = () => {
      const expanded = grid.classList.contains('expanded-mode');
      // Remove the helper from all sections first
      document.querySelectorAll('.full-bleed').forEach(s => s.classList.remove('section-on-top'));
      if (expanded && section) section.classList.add('section-on-top');
    };

    // Click to expand/collapse in-place
    grid.addEventListener('click', (e) => {
      // Ignore clicks inside interactive areas of an expanded card
      if (e.target.closest('.slider') || e.target.closest('.phd-footer')) return;

      const card = e.target.closest('.phd-item');
      if (!card || !grid.contains(card)) return;

      const isOpen = card.classList.contains('expanded');
      collapseAll();

      if (!isOpen) {
        card.classList.add('expanded');
        grid.classList.add('expanded-mode');
        syncSectionZ();
        // Scroll the opened card into view neatly
        requestAnimationFrame(() => {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });

    // Keep z-index helper in sync if classes change
    new MutationObserver(syncSectionZ).observe(grid, { attributes: true, attributeFilter: ['class'] });
    syncSectionZ();
  });

  // ESC closes whichever grid is expanded (and scrolls back to that grid)
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.phd-grid.expanded-mode').forEach((grid) => {
      grid.classList.remove('expanded-mode');
      grid.querySelectorAll('.phd-item').forEach(i => i.classList.remove('expanded'));
      const section = grid.closest('.full-bleed');
      if (section) section.classList.remove('section-on-top');
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Safety: cancel naked "#" links so they never jump the page to top
  document.addEventListener('click', (e) => {
    const bad = e.target.closest('a[href="#"]');
    if (bad) { e.preventDefault(); e.stopPropagation(); }
  });
});