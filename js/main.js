'use strict';

/* ── Loader ─────────────────────────────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  if (!loader) return;
  let w = 0;
  const iv = setInterval(() => {
    w = Math.min(w + Math.random() * 18, 90);
    fill.style.width = w + '%';
  }, 80);
  window.addEventListener('load', () => {
    clearInterval(iv);
    fill.style.width = '100%';
    setTimeout(() => loader.classList.add('done'), 400);
  });
})();

/* ── Blob cursor ─────────────────────────────────────────────── */
(function () {
  const blob = document.getElementById('blob');
  if (!blob || window.matchMedia('(pointer: coarse)').matches) {
    if (blob) blob.style.display = 'none';
    return;
  }
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function raf() {
    cx += (tx - cx) * 0.1;
    cy += (ty - cy) * 0.1;
    blob.style.left = cx + 'px';
    blob.style.top  = cy + 'px';
    requestAnimationFrame(raf);
  })();
  document.querySelectorAll('a,button,.tilt-card,.svc-card,.ring-card,.case-card').forEach(el => {
    el.addEventListener('mouseenter', () => blob.classList.add('blob--big'));
    el.addEventListener('mouseleave', () => blob.classList.remove('blob--big'));
  });
})();

/* ── Nav scroll ─────────────────────────────────────────────── */
(function () {
  const nav = document.getElementById('nav');
  const tick = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ── Mobile menu ─────────────────────────────────────────────── */
(function () {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger) return;
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

/* ── Word cycling with scramble ──────────────────────────────── */
(function () {
  const el    = document.getElementById('heroWord');
  if (!el) return;
  const words = ['ignite', 'launch', 'scale', 'transform', 'grow'];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let idx = 0;

  function scrambleTo(word) {
    const steps = 14, dur = 700;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      const revealed = Math.floor((step / steps) * word.length);
      let out = word.slice(0, revealed);
      for (let i = revealed; i < word.length; i++) {
        out += chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out;
      if (step >= steps) { clearInterval(iv); el.textContent = word; }
    }, dur / steps);
  }

  setInterval(() => {
    idx = (idx + 1) % words.length;
    // slide out
    el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    el.style.transform  = 'translateY(-100%)';
    el.style.opacity    = '0';
    setTimeout(() => {
      el.style.transition = 'none';
      el.style.transform  = 'translateY(100%)';
      el.style.opacity    = '0';
      requestAnimationFrame(() => {
        el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease';
        el.style.transform  = 'translateY(0)';
        el.style.opacity    = '1';
        scrambleTo(words[idx]);
      });
    }, 320);
  }, 2800);
})();

/* ── Mouse parallax on hero ──────────────────────────────────── */
(function () {
  const hero  = document.getElementById('heroParallax');
  if (!hero || window.matchMedia('(pointer: coarse)').matches) return;
  const rows  = hero.querySelectorAll('[data-depth]');
  document.getElementById('hero')?.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const mx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
    const my = (e.clientY - rect.top  - rect.height / 2) / rect.height;
    rows.forEach(row => {
      const d = parseFloat(row.dataset.depth) * 28;
      row.style.transform = `translate(${mx * d}px, ${my * d}px)`;
    });
  });
  document.getElementById('hero')?.addEventListener('mouseleave', () => {
    rows.forEach(row => { row.style.transform = ''; });
  });
})();

/* ── Magnetic buttons ────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.32;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.32;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();

/* ── 3D card tilt ────────────────────────────────────────────── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform = `perspective(700px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) translateZ(8px)`;
      card.style.transition = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      card.style.transform  = '';
    });
  });
})();

/* ── Horizontal services slider ──────────────────────────────── */
(function () {
  const slider   = document.getElementById('servicesSlider');
  const track    = document.getElementById('servicesTrack');
  const prevBtn  = document.getElementById('sliderPrev');
  const nextBtn  = document.getElementById('sliderNext');
  const progFill = document.getElementById('sliderProgress');
  if (!slider) return;

  let isDown = false, startX = 0, scrollStart = 0;

  slider.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX - slider.offsetLeft;
    scrollStart = slider.scrollLeft;
    slider.classList.add('grabbing');
  });
  window.addEventListener('mouseup', () => {
    isDown = false; slider.classList.remove('grabbing');
  });
  slider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    slider.scrollLeft = scrollStart - (e.pageX - slider.offsetLeft - startX) * 1.4;
  });

  // Touch
  let touchStart = 0;
  slider.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; scrollStart = slider.scrollLeft; }, { passive: true });
  slider.addEventListener('touchmove',  e => {
    slider.scrollLeft = scrollStart - (e.touches[0].clientX - touchStart) * 1.4;
  }, { passive: true });

  // Arrow buttons — snap to card width
  const cardW = () => (track.querySelector('.svc-card')?.offsetWidth || 320) + 20;
  prevBtn?.addEventListener('click', () => { slider.scrollBy({ left: -cardW(), behavior: 'smooth' }); });
  nextBtn?.addEventListener('click', () => { slider.scrollBy({ left:  cardW(), behavior: 'smooth' }); });

  // Progress bar
  slider.addEventListener('scroll', () => {
    const max = slider.scrollWidth - slider.clientWidth;
    const pct = max > 0 ? (slider.scrollLeft / max) * 100 : 20;
    if (progFill) progFill.style.width = Math.max(pct, 4) + '%';
  }, { passive: true });
})();

/* ── SVG ring progress ───────────────────────────────────────── */
(function () {
  const CIRC = 2 * Math.PI * 68; // ≈ 427.26
  document.querySelectorAll('.ring-card').forEach(card => {
    const ring   = card.querySelector('.ring-fill');
    const numEl  = card.querySelector('.ring-count');
    const target = parseInt(card.dataset.target);
    const max    = parseInt(card.dataset.max) || 100;
    if (!ring || !numEl) return;

    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const pct = Math.min(target / max, 1);
      ring.style.strokeDashoffset = CIRC * (1 - pct);
      let count = 0;
      const step = target / 60;
      const iv = setInterval(() => {
        count = Math.min(count + step, target);
        numEl.textContent = Math.round(count);
        if (count >= target) clearInterval(iv);
      }, 24);
      io.unobserve(card);
    }, { threshold: 0.4 });
    io.observe(card);
  });
})();

/* ── Sticky process ──────────────────────────────────────────── */
(function () {
  const steps    = document.querySelectorAll('.process__step');
  const fill     = document.getElementById('procFill');
  const lbl      = document.getElementById('procLbl');
  const lang     = () => document.documentElement.lang || 'en';
  if (!steps.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const n   = parseInt(e.target.dataset.step);
      const tot = steps.length;
      steps.forEach(s => s.classList.toggle('active', parseInt(s.dataset.step) === n));
      if (fill) fill.style.width = (n / tot * 100) + '%';
      if (lbl) {
        lbl.textContent = lang() === 'de'
          ? `Schritt ${n} von ${tot}`
          : `Step ${n} of ${tot}`;
      }
    });
  }, { threshold: 0.55 });
  steps.forEach(s => io.observe(s));
  steps[0]?.classList.add('active');
})();

/* ── Testimonial carousel ────────────────────────────────────── */
(function () {
  const slides = document.querySelectorAll('.carousel__slide');
  const dots   = document.querySelectorAll('.dot');
  if (!slides.length) return;
  let cur = 0, timer;

  function go(n) {
    slides[cur].classList.remove('active');
    dots[cur]?.classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    dots[cur]?.classList.add('active');
  }
  function startAuto() { timer = setInterval(() => go(cur + 1), 5000); }
  function resetAuto() { clearInterval(timer); startAuto(); }

  startAuto();
  document.getElementById('carouselNext')?.addEventListener('click', () => { go(cur + 1); resetAuto(); });
  document.getElementById('carouselPrev')?.addEventListener('click', () => { go(cur - 1); resetAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { go(parseInt(d.dataset.idx)); resetAuto(); }));
})();

/* ── Hero stat counters ──────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.hero__stat .count');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = parseInt(el.dataset.target);
      const start = performance.now();
      const dur   = 1600;
      (function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
        el.textContent = Math.round(ease * target);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      })(start);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  els.forEach(el => io.observe(el));
})();

/* ── Scroll reveal ───────────────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.section-header, .about__left, .about__right, .partners, .contact__left, .contact__right, .services__hd, .section-title, .tag');
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── Language toggle ─────────────────────────────────────────── */
(function () {
  const toggle = document.getElementById('langToggle');
  if (!toggle) return;
  let lang = localStorage.getItem('ven-lang') || 'en';
  applyLang(lang);

  toggle.addEventListener('click', () => {
    lang = lang === 'en' ? 'de' : 'en';
    localStorage.setItem('ven-lang', lang);
    applyLang(lang);
  });

  function applyLang(l) {
    document.documentElement.lang = l;
    toggle.querySelectorAll('.lang-toggle__opt').forEach(o => {
      o.classList.toggle('active', o.dataset.lang === l);
    });
    document.querySelectorAll('[data-en][data-de]').forEach(el => {
      const val = el.dataset[l];
      if (!val) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else if (el.tagName === 'OPTION') {
        el.textContent = val;
      } else {
        el.textContent = val;
      }
    });
    // update process label if active
    const lbl = document.getElementById('procLbl');
    if (lbl) {
      const n   = document.querySelector('.process__step.active')?.dataset?.step || 1;
      const tot = document.querySelectorAll('.process__step').length;
      lbl.textContent = l === 'de' ? `Schritt ${n} von ${tot}` : `Step ${n} of ${tot}`;
    }
    // update textarea placeholder
    const ta = document.querySelector('textarea[name="message"]');
    if (ta) ta.placeholder = l === 'de' ? 'Erzählen Sie uns von Ihren Zielen...' : 'Tell us about your goals...';
  }
})();

/* ── Contact form ────────────────────────────────────────────── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '...'; btn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 900);
  });
})();

/* ── Smooth anchor scroll ────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});
