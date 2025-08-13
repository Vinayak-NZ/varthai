<script>
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.phd-grid');
  if (!grid) return;

  const collapseAll = () => grid.querySelectorAll('.phd-item')
    .forEach(i => i.classList.remove('expanded'));

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.phd-item');
    if (!card) return;

    const isOpen = card.classList.contains('expanded');
    collapseAll();

    if (isOpen) {
      grid.classList.remove('expanded-mode');
      window.scrollTo({ top: grid.offsetTop, behavior: 'smooth' });
    } else {
      card.classList.add('expanded');
      grid.classList.add('expanded-mode');
      window.scrollTo({ top: 0, behavior: 'smooth' });  // take over the screen
    }
  });

  // Esc to collapse
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      grid.classList.remove('expanded-mode');
      collapseAll();
      window.scrollTo({ top: grid.offsetTop, behavior: 'smooth' });
    }
  });
});
</script>