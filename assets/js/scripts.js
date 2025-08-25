document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.phd-grid');
  if (!grid) return;

  function collapseAll({ scroll = true } = {}) {
    grid.classList.remove('expanded-mode');
    grid.querySelectorAll('.phd-item.expanded').forEach(i => i.classList.remove('expanded'));
    if (scroll) window.scrollTo({ top: grid.offsetTop, behavior: 'smooth' });
  }

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.phd-item');
    if (!card) return;

    const isExpandedMode = grid.classList.contains('expanded-mode');
    const isOpen = card.classList.contains('expanded');

    // While EXPANDED, ignore clicks on interactive UI (slider/arrows/dots/links)
    // This prevents collapsing when swiping or using the controls.
    if (isExpandedMode && e.target.closest('.slider, .slides, .slide, .nav, .dots, .phd-link, a, button')) {
      return;
    }
    // Note: when COLLAPSED we *do not* guard; clicking the card (incl. chart thumb) will expand.

    // Toggle behaviour
    collapseAll({ scroll: false });
    if (isOpen) {
      grid.classList.remove('expanded-mode');
      window.scrollTo({ top: grid.offsetTop, behavior: 'smooth' });
      grid.dispatchEvent(new CustomEvent('phd:collapsed', { detail: { card } }));
    } else {
      card.classList.add('expanded');
      grid.classList.add('expanded-mode');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      grid.dispatchEvent(new CustomEvent('phd:expanded', { detail: { card } }));
    }
  });

  // Esc to collapse
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && grid.classList.contains('expanded-mode')) {
      collapseAll();
      grid.dispatchEvent(new CustomEvent('phd:collapsed', { detail: { card: null } }));
    }
  });
});