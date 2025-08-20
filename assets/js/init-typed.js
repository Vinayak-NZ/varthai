(function () {
  function init() {
    var el = document.getElementById('typed-output');
    if (!el || typeof Typed === 'undefined') return;

    // Start with static fallback content to anchor layout
    const originalText = el.innerText;

    new Typed('#typed-output', {
      strings: ['வார்த்தை', originalText],
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