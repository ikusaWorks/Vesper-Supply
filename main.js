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
     Posts JSON to the Cloudflare Pages Function. If that endpoint is not
     reachable — previewing from the local python server, or before the
     project is deployed — it falls back to composing an email, so the form
     is never a dead end.
     ------------------------------------------------------------------ */
  var form = document.getElementById('rfqForm');
  var status = document.getElementById('rfqStatus');
  var submitBtn = form && form.querySelector('[type="submit"]');

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

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('rfq__status--error', 'rfq__status--ok');
    if (kind) status.classList.add('rfq__status--' + kind);
  }

  if (form) {
    var required = Array.prototype.slice.call(
      form.querySelectorAll('input[required], textarea[required]')
    );

    required.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') validateField(input);
      });
    });

    function readForm() {
      var out = {};
      ['name', 'company', 'email', 'category', 'details', 'website'].forEach(function (key) {
        var el = form.elements[key];
        out[key] = el ? el.value.trim() : '';
      });
      return out;
    }

    function mailtoFallback(payload) {
      var body = [
        'Name:     ' + payload.name,
        'Company:  ' + payload.company,
        'Email:    ' + payload.email,
        'Category: ' + payload.category,
        '',
        'Requirement:',
        payload.details
      ].join('\n');
      window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent('RFQ — ' + payload.company + ' — ' + payload.category) +
        '&body=' + encodeURIComponent(body);
      setStatus('Opening your email client with the request ready to send.', 'ok');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var allValid = true, firstInvalid = null;
      required.forEach(function (input) {
        if (!validateField(input)) {
          allValid = false;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (!allValid) {
        setStatus('Check the highlighted fields above.', 'error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var payload = readForm();

      submitBtn.disabled = true;
      setStatus('Sending…');

      fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (body) {
            return { ok: res.ok && body.ok, body: body };
          });
        })
        .then(function (result) {
          if (result.ok) {
            form.reset();
            setStatus('Thank you — we have your request and will reply shortly.', 'ok');
          } else if (result.body && result.body.error) {
            setStatus(result.body.error, 'error');
          } else {
            mailtoFallback(payload);
          }
        })
        .catch(function () {
          // Endpoint unreachable: local preview, or not deployed yet.
          mailtoFallback(payload);
        })
        .then(function () { submitBtn.disabled = false; });
    });
  }

  /* ---------------------------------------------------------------------
     Custom dot cursor
     Gated on a fine pointer, so touch devices are left alone. The
     .has-dot-cursor class is what hides the native cursor, and it is only
     applied here — if this script never runs, the normal cursor survives.
     ------------------------------------------------------------------ */
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var cursorEl = document.getElementById('cursor');

  if (finePointer && cursorEl) {
    document.documentElement.classList.add('has-dot-cursor');

    var curX = 0, curY = 0, queued = false;

    // Sections that need the lighter blue.
    var DARK = '.hero, .band--inverse, .cta-band, .site-footer, .mobile-nav';
    var onDark = null;

    function drawCursor() {
      queued = false;
      cursorEl.style.transform = 'translate3d(' + curX + 'px,' + curY + 'px,0)';

      // Which section is under the pointer decides the dot colour. Hit-testing
      // costs a layout read, so only write the class when it actually changes.
      var under = document.elementFromPoint(curX, curY);
      var isDark = !!(under && under.closest && under.closest(DARK));
      if (isDark !== onDark) {
        onDark = isDark;
        cursorEl.classList.toggle('is-on-dark', isDark);
      }
    }

    // Coalesce to one paint per frame; mousemove fires far more often than that.
    document.addEventListener('mousemove', function (event) {
      curX = event.clientX;
      curY = event.clientY;
      if (!queued) { queued = true; requestAnimationFrame(drawCursor); }
    }, { passive: true });

    var INTERACTIVE = 'a, button, summary, [role="button"], .scroller, label';
    var TEXTFIELD   = 'input, textarea, select';

    document.addEventListener('mouseover', function (event) {
      var t = event.target;
      if (t.closest && t.closest(TEXTFIELD)) {
        cursorEl.classList.add('is-hidden');
        cursorEl.classList.remove('is-active');
        return;
      }
      cursorEl.classList.remove('is-hidden');
      cursorEl.classList.toggle('is-active', !!(t.closest && t.closest(INTERACTIVE)));
    }, { passive: true });

    // Leaving the window entirely, rather than crossing between elements.
    document.addEventListener('mouseout', function (event) {
      if (!event.relatedTarget) cursorEl.classList.add('is-hidden');
    }, { passive: true });

    document.addEventListener('mouseenter', function () {
      cursorEl.classList.remove('is-hidden');
    }, { passive: true });

    // A pen or finger on a hybrid device should hand the native cursor back.
    window.addEventListener('touchstart', function () {
      document.documentElement.classList.remove('has-dot-cursor');
    }, { passive: true, once: true });
  }

  /* ---------------------------------------------------------------------
     About image slider
     Crossfade between stacked slides. Advances on its own, but pauses on
     hover and on keyboard focus so it never moves under someone reading
     or tabbing, and does not auto-advance at all under reduced motion.
     ------------------------------------------------------------------ */
  var slider = document.getElementById('aboutSlider');

  if (slider) {
    var slides = [].slice.call(slider.querySelectorAll('.slider__slide'));
    var dots   = [].slice.call(slider.querySelectorAll('.slider__dot'));
    var current = 0;
    var timer = null;
    var INTERVAL = 5500;

    function show(next) {
      current = (next + slides.length) % slides.length;
      slides.forEach(function (el, i) { el.classList.toggle('is-current', i === current); });
      dots.forEach(function (el, i) {
        el.classList.toggle('is-current', i === current);
        el.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
    }

    function start() {
      if (reduceMotion || timer) return;
      timer = setInterval(function () { show(current + 1); }, INTERVAL);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); stop(); start(); });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    // Nothing to animate while the section is off screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
      }, { threshold: 0.2 }).observe(slider);
    } else {
      start();
    }
  }

})();
