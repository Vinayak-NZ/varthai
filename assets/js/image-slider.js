(function () {
  const slider = document.getElementById('image-slider'); // <-- fixed ID
  if (!slider) return;

  const track  = slider.querySelector('.slides');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prev   = slider.querySelector('.prev');
  const next   = slider.querySelector('.next');
  const dotsEl = slider.querySelector('.dots');

  let idx = 0, startX = 0, deltaX = 0, dragging = false, moved = false;

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.addEventListener('click', (e) => { e.stopPropagation(); go(i); });
    dotsEl.appendChild(b);
  });

  function update() {
    track.style.transition = 'transform .28s ease';
    track.style.transform = `translateX(${(-idx) * 100}%)`;
    dotsEl.querySelectorAll('button').forEach((b, i) =>
      b.setAttribute('aria-selected', i === idx ? 'true' : 'false')
    );
  }
  function go(i) { idx = Math.max(0, Math.min(i, slides.length - 1)); update(); }
  function nextSlide(){ go(idx + 1); }
  function prevSlide(){ go(idx - 1); }

  // Arrows (don’t collapse the card)
  if (next) next.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
  if (prev) prev.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });

  // Keyboard
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.stopPropagation(); nextSlide(); }
    if (e.key === 'ArrowLeft')  { e.stopPropagation(); prevSlide(); }
  });

  // Drag/swipe
  function onStart(x){
    dragging = true; moved = false; startX = x; deltaX = 0;
    track.style.transition = 'none';
  }
  function onMove(x){
    if (!dragging) return;
    deltaX = x - startX;
    if (Math.abs(deltaX) > 3) moved = true;
    const pct = (-idx * 100) + (deltaX / slider.clientWidth) * 100;
    track.style.transform = `translateX(${pct}%)`;
  }
  function onEnd(){
    if (!dragging) return;
    dragging = false;
    const threshold = slider.clientWidth * 0.15;
    if (deltaX < -threshold)      nextSlide();
    else if (deltaX > threshold)  prevSlide();
    else                          update();
  }

  // Mouse
  track.addEventListener('mousedown', (e) => { e.stopPropagation(); onStart(e.clientX); });
  window.addEventListener('mousemove', (e) => { if (dragging) onMove(e.clientX); });
  window.addEventListener('mouseup',   (e) => { if (dragging) { onEnd(); e.stopPropagation(); } });

  // Touch
  track.addEventListener('touchstart', (e) => { e.stopPropagation(); onStart(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove',  (e) => { if (dragging) onMove(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',   (e) => { if (dragging) { onEnd(); e.stopPropagation(); } });

  // Never bubble slider interactions to the card; cancel "click" after drag
  ['click','mousedown','mouseup','touchstart','touchend'].forEach(type => {
    slider.addEventListener(type, (e) => e.stopPropagation());
  });
  track.addEventListener('click', (e) => { if (moved) e.preventDefault(); e.stopPropagation(); });

  // Preload slide images when expanded so later slides never appear blank
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

  // Only show/initialize slider when the card is expanded
  function maybeInit(){
    const card = slider.closest('.phd-item');
    const grid = slider.closest('.phd-grid');
    const active = card?.classList.contains('expanded') && grid?.classList.contains('expanded-mode');

    slider.style.display = active ? 'block' : 'none';
    slider.tabIndex = active ? 0 : -1;

    if (active) {
      preloadSlides();
      requestAnimationFrame(update);
    }
  }

  const grid = document.querySelector('.phd-grid');
  if (grid){
    new MutationObserver(maybeInit).observe(grid, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }
  // Initial state
  maybeInit();
})();