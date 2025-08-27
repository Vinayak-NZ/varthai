(function () {
  const slider = document.getElementById('image-slider');
  if (!slider) return;

  const track  = slider.querySelector('.slides');
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const prev   = slider.querySelector('.prev');
  const next   = slider.querySelector('.next');
  const dotsEl = slider.querySelector('.dots');

  let idx = 0, startX = 0, deltaX = 0, dragging = false, moved = false;

  // --- NEW: helper to get visible viewport width (excludes side padding) ---
  function viewW() {
    const cs  = getComputedStyle(slider);
    const padL = parseFloat(cs.paddingLeft)  || 0;
    const padR = parseFloat(cs.paddingRight) || 0;
    return slider.clientWidth - padL - padR;
  }

  // Build dots (unchanged)
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.addEventListener('click', (e) => { e.stopPropagation(); go(i); });
    dotsEl.appendChild(b);
  });

  // --- CHANGED: px-based transform to avoid peeking ---
  function update() {
    track.style.transition = 'transform .28s ease';
    track.style.transform  = `translateX(${-idx * viewW()}px)`;
    dotsEl.querySelectorAll('button').forEach((b, i) =>
      b.setAttribute('aria-selected', i === idx ? 'true' : 'false')
    );
  }
  function go(i) { idx = Math.max(0, Math.min(i, slides.length - 1)); update(); }
  function nextSlide(){ go(idx + 1); }
  function prevSlide(){ go(idx - 1); }

  // Arrow clicks (unchanged)
  next.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); });
  prev.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); });

  // Keyboard (unchanged)
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.stopPropagation(); nextSlide(); }
    if (e.key === 'ArrowLeft')  { e.stopPropagation(); prevSlide(); }
  });

  // --- CHANGED: drag uses px, not percent ---
  function onStart(x){
    dragging = true; moved = false;
    startX = x; deltaX = 0;
    track.style.transition = 'none';
  }
  function onMove(x){
    if (!dragging) return;
    deltaX = x - startX;
    if (Math.abs(deltaX) > 3) moved = true;
    const pos = (-idx * viewW()) + deltaX;
    track.style.transform = `translateX(${pos}px)`;
  }
  function onEnd(){
    if (!dragging) return;
    dragging = false;
    const threshold = viewW() * 0.15;
    if (deltaX < -threshold)      nextSlide();
    else if (deltaX > threshold)  prevSlide();
    else                          update();
  }

  // Bind mouse/touch (unchanged)
  track.addEventListener('mousedown', (e) => { e.stopPropagation(); onStart(e.clientX); });
  window.addEventListener('mousemove', (e) => { if (dragging) onMove(e.clientX); });
  window.addEventListener('mouseup',   (e) => { if (dragging) { onEnd(); e.stopPropagation(); } });

  track.addEventListener('touchstart', (e) => { e.stopPropagation(); onStart(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove',  (e) => { if (dragging) onMove(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend',   (e) => { if (dragging) { onEnd(); e.stopPropagation(); } });

  // Prevent bubbling (unchanged)
  ['click','mousedown','mouseup','touchstart','touchend'].forEach(type => {
    slider.addEventListener(type, (e) => e.stopPropagation());
  });

  // Initialize only when expanded (unchanged)
  function maybeInit(){
    const card = slider.closest('.phd-item');
    const grid = slider.closest('.phd-grid');
    const active = card?.classList.contains('expanded') && grid?.classList.contains('expanded-mode');
    slider.style.display = active ? 'block' : 'none';
    slider.tabIndex = active ? 0 : -1;
    if (active) requestAnimationFrame(update);
  }
  const grid = document.querySelector('.phd-grid');
  if (grid){
    new MutationObserver(maybeInit).observe(grid, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }
  maybeInit();
})();