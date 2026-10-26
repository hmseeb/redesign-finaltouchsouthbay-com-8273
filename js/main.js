/* =========================================================
   Final Touch Window Cleaning — interactions
   ========================================================= */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- Current year ---------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- Sticky header shadow ---------------- */
  var header = $('#header');
  var onScrollHeader = function () {
    if (!header) return;
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScrollHeader();

  /* ---------------- Mobile nav ---------------- */
  var burger = $('#burger');
  var nav    = $('#nav');
  var scrim  = $('#navScrim');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (scrim) scrim.hidden = true;
    document.body.classList.remove('is-locked');
  }
  function openNav() {
    if (!nav) return;
    nav.classList.add('is-open');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    if (scrim) scrim.hidden = false;
    document.body.classList.add('is-locked');
  }
  if (burger) {
    burger.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeNav(); else openNav();
    });
  }
  if (scrim) scrim.addEventListener('click', closeNav);

  /* ---------------- Dropdowns ---------------- */
  var dropItems = $$('.nav__item--drop');
  var isDesktop = function () { return window.matchMedia('(min-width: 901px)').matches; };

  dropItems.forEach(function (item) {
    var toggle = $('.nav__toggle', item);
    if (!toggle) return;

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      var willOpen = !item.classList.contains('is-open');
      dropItems.forEach(function (o) {
        if (o !== item) {
          o.classList.remove('is-open');
          var t = $('.nav__toggle', o);
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', willOpen);
      toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    item.addEventListener('mouseenter', function () {
      if (!isDesktop()) return;
      item.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    });
    item.addEventListener('mouseleave', function () {
      if (!isDesktop()) return;
      item.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', function (e) {
    if (!isDesktop()) return;
    if (e.target.closest && e.target.closest('.nav__item--drop')) return;
    dropItems.forEach(function (o) {
      o.classList.remove('is-open');
      var t = $('.nav__toggle', o);
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeNav();
    dropItems.forEach(function (o) {
      o.classList.remove('is-open');
      var t = $('.nav__toggle', o);
      if (t) t.setAttribute('aria-expanded', 'false');
    });
    closeLightbox();
  });

  /* Close the drawer after tapping any in-page link */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (nav && nav.classList.contains('is-open')) closeNav();
    });
  });

  window.addEventListener('resize', function () {
    if (isDesktop() && nav && nav.classList.contains('is-open')) closeNav();
  });

  /* ---------------- FAQ: one open at a time ---------------- */
  var faqItems = $$('#faqList .faq__item');
  faqItems.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqItems.forEach(function (other) { if (other !== d) other.open = false; });
    });
  });

  /* ---------------- Forms ---------------- */
  function setError(field, on) {
    if (!field) return;
    field.classList.toggle('has-error', !!on);
  }

  function validate(form) {
    var ok = true;
    $$('[required]', form).forEach(function (input) {
      var field = input.closest('.field');
      var valid;
      if (input.type === 'checkbox') {
        valid = input.checked;
      } else if (input.type === 'tel') {
        var digits = (input.value || '').replace(/\D/g, '');
        valid = digits.length >= 10;
      } else {
        valid = (input.value || '').trim().length >= 2;
      }
      setError(field, !valid);
      if (!valid && ok) {
        ok = false;
        try { input.focus({ preventScroll: false }); } catch (err) { input.focus(); }
      }
    });
    return ok;
  }

  function wireForm(formId, okId) {
    var form = document.getElementById(formId);
    var ok   = document.getElementById(okId);
    if (!form) return;

    $$('input, select, textarea', form).forEach(function (input) {
      var evt = (input.type === 'checkbox' || input.tagName === 'SELECT') ? 'change' : 'input';
      input.addEventListener(evt, function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('has-error')) setError(field, false);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) {
        if (ok) ok.hidden = true;
        return;
      }
      if (ok) {
        ok.hidden = false;
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      var btn = $('button[type="submit"]', form);
      if (btn) {
        btn.textContent = 'Request Received';
        btn.disabled = true;
        btn.style.opacity = '.75';
      }
    });
  }
  wireForm('quoteForm', 'quoteOk');
  wireForm('contactForm', 'contactOk');

  /* ---------------- Gallery lightbox ---------------- */
  var lb      = $('#lightbox');
  var lbCap   = $('#lbCap');
  var lbFig   = lb ? $('.lightbox__fig', lb) : null;
  var lbImg   = null;
  var gitems  = $$('#galleryGrid .gitem');
  var current = 0;
  var lastFocused = null;

  // The lightbox <img> is created the first time it is needed. Keeping an
  // empty-src placeholder in the markup made the browser resolve src="" to
  // the page URL, which requests the document and reports a broken image.
  function ensureLbImg() {
    if (lbImg || !lbFig) return lbImg;
    lbImg = document.createElement('img');
    lbImg.id = 'lbImg';
    lbFig.insertBefore(lbImg, lbCap || null);
    return lbImg;
  }

  function showAt(i) {
    if (!gitems.length) return;
    current = (i + gitems.length) % gitems.length;
    var el = gitems[current];
    var img = $('img', el);
    var src = el.getAttribute('data-full') || (img ? img.src : '');
    var node = ensureLbImg();
    if (node && src) {
      node.src = src;
      node.alt = img ? img.alt : '';
    }
    if (lbCap) lbCap.textContent = el.getAttribute('data-caption') || '';
  }
  function openLightbox(i) {
    if (!lb) return;
    lastFocused = document.activeElement;
    showAt(i);
    lb.hidden = false;
    document.body.classList.add('is-locked');
    var close = $('#lbClose');
    if (close) close.focus();
  }
  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    document.body.classList.remove('is-locked');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  gitems.forEach(function (el, i) {
    el.addEventListener('click', function () { openLightbox(i); });
  });
  var lbClose = $('#lbClose');
  var lbPrev  = $('#lbPrev');
  var lbNext  = $('#lbNext');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', function () { showAt(current - 1); });
  if (lbNext)  lbNext.addEventListener('click', function () { showAt(current + 1); });
  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox__fig')) closeLightbox();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (!lb || lb.hidden) return;
    if (e.key === 'ArrowLeft')  showAt(current - 1);
    if (e.key === 'ArrowRight') showAt(current + 1);
  });

  /* ---------------- Back to top ---------------- */
  var toTop = $('#toTop');
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  var onScrollTop = function () {
    if (toTop) toTop.hidden = window.scrollY < 600;
  };
  onScrollTop();

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScrollHeader();
      onScrollTop();
      ticking = false;
    });
  }, { passive: true });

  /* ---------------- Scroll reveal ---------------- */
  var revealTargets = [
    '.sec-head', '.svc', '.svc-foot', '.about__media', '.about__copy',
    '.step', '.gcard', '.rep__item', '.rep__cta', '.gitem',
    '.areas__copy', '.areas__list li', '.faq__aside', '.faq__item',
    '.cinfo', '.hours', '.contact__social', '.contact__form', '.trust__item'
  ].join(',');

  var nodes = $$(revealTargets);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce && 'IntersectionObserver' in window) {
    nodes.forEach(function (n) { n.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, idx) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(idx * 70, 280) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    nodes.forEach(function (n) { io.observe(n); });
  }
})();
