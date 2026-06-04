'use strict';

/* ── Custom Cursor ─────────────────────────────────────────── */
(function () {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  document.querySelectorAll('a, button, .service-card, .result-card, .case-card, .testimonial-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor-follower--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor-follower--hover');
    });
  });
})();

/* ── Navbar scroll ─────────────────────────────────────────── */
(function () {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile menu ───────────────────────────────────────────── */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── Hero Canvas — animated particle field ─────────────────── */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 90;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    r:  Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    o:  Math.random() * 0.5 + 0.1,
  }));

  const CONNECT_DIST = 140;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,93,255,${p.o})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(124,93,255,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Reveal on Scroll ──────────────────────────────────────── */
(function () {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => io.observe(t));
})();

/* ── Counter Animation ─────────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('.count, .hero__stat-num');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target || el.textContent, 10);
      const dur    = 1600;
      const start  = performance.now();

      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        el.textContent = Math.round(eased * target);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();

/* ── Language Toggle ───────────────────────────────────────── */
(function () {
  const toggle = document.getElementById('langToggle');
  if (!toggle) return;

  let currentLang = localStorage.getItem('ven-lang') || 'en';
  applyLanguage(currentLang);

  toggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'de' : 'en';
    localStorage.setItem('ven-lang', currentLang);
    applyLanguage(currentLang);
  });

  function applyLanguage(lang) {
    document.documentElement.lang = lang;

    // Update toggle UI
    toggle.querySelectorAll('.lang-toggle__option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-en][data-de]').forEach(el => {
      const text = el.dataset[lang];
      if (!text) return;

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else if (el.tagName === 'OPTION') {
        el.textContent = text;
      } else if (text.includes('<br>')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // Update select options
    document.querySelectorAll('select option[data-en][data-de]').forEach(opt => {
      opt.textContent = opt.dataset[lang] || opt.dataset.en;
    });

    // Update form placeholders
    updateFormPlaceholders(lang);
  }

  function updateFormPlaceholders(lang) {
    const placeholders = {
      en: { message: 'Tell us about your goals...' },
      de: { message: 'Erzählen Sie uns von Ihren Zielen...' },
    };
    const msg = document.querySelector('textarea[name="message"]');
    if (msg) msg.placeholder = placeholders[lang].message;
  }
})();

/* ── Contact Form ──────────────────────────────────────────── */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '...';
    btn.disabled = true;

    setTimeout(() => {
      form.classList.add('hidden');
      form.style.display = 'none';
      success.classList.add('visible');
    }, 900);
  });
})();

/* ── Smooth anchor links ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 76;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});
