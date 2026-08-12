/* ============================================================================
   VESPER SUPPLY — Interaction layer
   Vanilla JS, no dependencies, no build step.
   Every animation here is gated on prefers-reduced-motion.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Current year in the footer
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------------
     Header: solid background once scrolled off the hero
     ------------------------------------------------------------------ */
  var header = document.getElementById('siteHeader');
  var aboutSection = document.getElementById('about');

  /* Scroll offset at which the header lockup collapses to the isotype: the
     point where the About section meets the bottom of the header. Measured
     rather than hard-coded, because the hero's height moves with the
     viewport and with the display webfont. */
  var compactAt = Infinity;

  function measureCompactPoint() {
    if (!header || !aboutSection) return;
    compactAt = aboutSection.getBoundingClientRect().top
              + window.scrollY
              - header.offsetHeight;
  }

  function syncHeader() {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 24);
    // Compared against a fixed page offset, so it stays compact for every
    // section below About instead of flipping back as About scrolls past.
    header.classList.toggle('is-compact', window.scrollY >= compactAt);
  }

  measureCompactPoint();
  syncHeader();

  window.addEventListener('scroll', syncHeader, { passive: true });
  window.addEventListener('resize', function () {
    measureCompactPoint();
    syncHeader();
  });

  // The display webfont changes the hero's height, which moves the threshold.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      measureCompactPoint();
      syncHeader();
    });
  }

  /* ---------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  var toggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMenu() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      mobileNav.classList.toggle('is-open', !open);
    });

    // Close after tapping any link inside the drawer.
    mobileNav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    // Escape closes, and focus returns to the trigger.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Scroll reveal
     Elements start hidden via CSS only when motion is allowed; with reduced
     motion the CSS media query already renders them visible, so we simply
     mark everything revealed and skip the observer.
     ------------------------------------------------------------------ */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-revealed'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Corridor diagram: pause the travelling pulse for reduced motion
     ------------------------------------------------------------------ */
  if (reduceMotion) {
    var diagram = document.getElementById('corridorDiagram');
    var svg = diagram && diagram.querySelector('svg');
    if (svg && typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
  }

  /* ---------------------------------------------------------------------
     Figure counters
     Only animates elements carrying data-count, so the "—" placeholders
     are left alone.
     ------------------------------------------------------------------ */
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;

    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1100;
    var start = null;

    function tick(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('[data-count]');

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------------------------------------------------------------------
     Active nav link tracking
     ------------------------------------------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));

  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* ---------------------------------------------------------------------
     RFQ form
     No backend required: on a valid submit we compose a pre-filled email.
     To post to a real form service instead, give the <form> an action and
     remove its data-mailto attribute.
     ------------------------------------------------------------------ */
  var form = document.getElementById('rfqForm');
  var status = document.getElementById('rfqStatus');

  function fieldError(input) {
    return document.querySelector('[data-error-for="' + input.id + '"]');
  }

  function validateField(input) {
    var valid = input.checkValidity();
    var error = fieldError(input);
    input.setAttribute('aria-invalid', valid ? 'false' : 'true');
    if (error) error.hidden = valid;
    return valid;
  }

  if (form && form.hasAttribute('data-mailto')) {
    var required = Array.prototype.slice.call(
      form.querySelectorAll('input[required], textarea[required]')
    );

    // Validate on blur, then live-correct once the field has been touched.
    required.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var allValid = true;
      var firstInvalid = null;

      required.forEach(function (input) {
        if (!validateField(input)) {
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!allValid) {
        if (status) status.textContent = 'Check the highlighted fields above.';
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var get = function (name) {
        var el = form.elements[name];
        return el ? el.value.trim() : '';
      };

      var subject = 'RFQ — ' + get('company') + ' — ' + get('category');
      var body = [
        'Name:     ' + get('name'),
        'Company:  ' + get('company'),
        'Email:    ' + get('email'),
        'Category: ' + get('category'),
        '',
        'Requirement:',
        get('details')
      ].join('\n');

      var href = 'mailto:' + form.getAttribute('data-mailto') +
                 '?subject=' + encodeURIComponent(subject) +
                 '&body=' + encodeURIComponent(body);

      window.location.href = href;

      if (status) status.textContent = 'Opening your email client with the request ready to send.';
    });
  }

  /* ---------------------------------------------------------------------
     Horizontal card scroller
     Scrolling itself is native. This adds the arrow buttons, keyboard
     support, and hides the controls when everything already fits.
     ------------------------------------------------------------------ */
  var scroller = document.getElementById('industryScroller');
  var scrollerNav = document.getElementById('industryNav');

  if (scroller && scrollerNav) {
    var prevBtn = scrollerNav.querySelector('[data-scroll="prev"]');
    var nextBtn = scrollerNav.querySelector('[data-scroll="next"]');

    function stepSize() {
      var card = scroller.querySelector('.ind-card');
      if (!card) return scroller.clientWidth;
      var gap = parseFloat(getComputedStyle(scroller.querySelector('.scroller__track')).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    // The scroller carries horizontal padding so hover lift and focus rings are
    // not clipped. Snap points align to the padding edge, so scrollLeft rests at
    // padding-left rather than 0 — the end tolerance has to allow for that.
    function endTolerance() {
      var pad = parseFloat(getComputedStyle(scroller).paddingLeft) || 0;
      return pad + 2;
    }

    function syncControls() {
      var maxScroll = scroller.scrollWidth - scroller.clientWidth;
      var slack = endTolerance();
      var overflows = maxScroll > slack;

      scrollerNav.hidden = !overflows;
      if (!overflows) return;

      prevBtn.disabled = scroller.scrollLeft <= slack;
      nextBtn.disabled = scroller.scrollLeft >= maxScroll - slack;
    }

    function step(direction) {
      scroller.scrollBy({
        left: direction * stepSize(),
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }

    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });

    // The scroller is focusable, so give it arrow-key control too.
    scroller.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
      if (event.key === 'ArrowLeft')  { event.preventDefault(); step(-1); }
    });

    scroller.addEventListener('scroll', syncControls, { passive: true });
    window.addEventListener('resize', syncControls);

    syncControls();
    // Card widths depend on the display webfont, so re-check once it lands.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncControls);
  }

})();
