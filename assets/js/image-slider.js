(function () {
  // 1) Point at the correct slider element (or make it future-proof).
  // If you only have one slider, this is fine:
  const slider = document.getElementById('image-slider');
  if (!slider) return;

  const track  = slider.querySelector('.slides');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prev   = slider.querySelector('.prev');
  const next   = slider.querySelector('.next');
  const dotsEl = slider.querySelector('.dots');

  let idx = 0, startX = 0, deltaX = 0, dragging = false, moved = false;

  // Build dots
  dotsEl.innerHTML = '';
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.addEventListener('click', (e) => { e.stopPropagation(); go(i); });
    dotsEl.appendChild(b);
  });

  function update() {
    // Ensure the track is exactly aligned to the current slide
    track.style.transition = 'transform .28s ease';
    track.style.transform  = `translateX(${(-idx) * 100}%)`;
    dotsEl.querySelectorAll('button').forEach((b, i) =>
      b.setAttribute('aria-selected', i === idx ? 'true' : 'false')
    );
  }
  function go(i) { idx = Math.max(0, Math.min(i, slides.length - 1)); update(); }
  function nextSlide(){ go(idx + 1); }
  function prevSlide(){ go(idx - 1); }

  // Arrow clicks (don’t bubble to card)
  if (next) next.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
  if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });

  // Keyboard (left/right) when slider has focus
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.stopPropagation(); nextSlide(); }
    if (e.key === 'ArrowLeft')  { e.stopPropagation(); prevSlide(); }
  });

  // (Optional) Disable drag/swipe entirely so arrows are the only navigation
  function onStart(){ /* disabled */ }
  function onMove(){ /* disabled */ }
  function onEnd(){  /* disabled */ }

  // Cancel "click" after a drag; also never bubble slider clicks to the card
  ['click','mousedown','mouseup','touchstart','touchend'].forEach(type => {
    slider.addEventListener(type, (e) => e.stopPropagation());
  });

  // Preload slide images once active
  function preloadSlides() {
    slides.forEach(sl => {
      const img = sl.querySelector('img');
      if (img && img.dataset.preloaded !== '1') {
        const i = new Image();
        i.src = img.src;
        img.dataset.preloaded = '1';
      }
    });
  }

  // Only show/initialize when the card is expanded
  function maybeInit(){
    const card = slider.closest('.phd-item');
    const grid = slider.closest('.phd-grid'); // 2) Observe the grid that actually contains THIS slider
    const active = card?.classList.contains('expanded') && grid?.classList.contains('expanded-mode');

    // DO NOT toggle display here; your CSS already does that.
    if (active) {
      preloadSlides();
      // Snap to the current slide after layout settles
      requestAnimationFrame(() => {
        track.style.transition = 'none';
        track.style.transform  = `translateX(${(-idx) * 100}%)`;
        // next frame re-enable transition
        requestAnimationFrame(() => {
          track.style.transition = 'transform .28s ease';
        });
      });
    }
  }

  // Observe the class changes on the *correct* grid (the one this slider is inside)
  const grid = slider.closest('.phd-grid');
  if (grid){
    new MutationObserver(maybeInit).observe(grid, { attributes: true, attributeFilter: ['class'] });
  }

  // Initial state
  maybeInit();
})();