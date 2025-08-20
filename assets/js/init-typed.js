(function () {
  function init() {
    var el = document.getElementById('typed-output');
    if (!el || typeof window.Typed === 'undefined') {
      console.warn("Typed.js not available or #typed-output not found.");
      return;
    }

    // Add fallback text for layout stability
    if (!el.textContent.trim()) {
      el.textContent = 'Varthai';
    }

    // Then overwrite with Typed.js
    new Typed('#typed-output', {
      strings: ['வார்த்தை', 'Varthai'],
      typeSpeed: 300,
      backSpeed: 300,
      backDelay: 1200,
      startDelay: 350,
      smartBackspace: true,
      showCursor: true,
      cursorChar: '_',
      loop: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();