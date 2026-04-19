/* ============================================================
   ZIME MAYEZA — Main Interactions JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile nav toggle ── */
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    drawer.classList.toggle('open');
  });
  document.querySelectorAll('.nav-drawer a').forEach(a =>
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      drawer.classList.remove('open');
    })
  );

  /* ── Scroll reveal ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ── Experience accordion ── */
  document.querySelectorAll('.exp-card').forEach(card => {
    card.addEventListener('click', () => {
      const isOpen = card.classList.contains('active');
      document.querySelectorAll('.exp-card').forEach(c => {
        c.classList.remove('active');
        const t = c.querySelector('.exp-toggle');
        if (t) t.textContent = '+ Expand details';
      });
      if (!isOpen) {
        card.classList.add('active');
        const t = card.querySelector('.exp-toggle');
        if (t) t.textContent = '— Collapse';
      }
    });
  });

  /* ── Typing animation on hero subtitle ── */
  const typingEl = document.querySelector('.hero-title');
  if (typingEl) {
    const full = typingEl.dataset.text || typingEl.textContent;
    typingEl.textContent = '';
    let i = 0;
    const type = () => {
      if (i <= full.length) {
        typingEl.textContent = full.slice(0, i) + (i < full.length ? '|' : '');
        i++;
        setTimeout(type, i < full.length ? 50 : 800);
      } else {
        typingEl.textContent = full;
      }
    };
    setTimeout(type, 900);
  }

  /* ── Counter animation for stats ── */
  function animateCounter(el, target, suffix, duration = 1400) {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  }

  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-drawer a');

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.classList.toggle('active-link', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObs.observe(s));

  /* ── Cursor glow (desktop only) ── */
  if (window.innerWidth > 900) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      width:300px; height:300px; border-radius:50%;
      background: radial-gradient(circle, rgba(155,93,229,0.06) 0%, transparent 70%);
      transform:translate(-50%,-50%);
      transition: left 0.12s ease, top 0.12s ease;
      left:-300px; top:-300px;
    `;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
