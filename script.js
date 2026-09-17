(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (coarse && window.innerWidth >= 720) document.documentElement.classList.add('desktop-on-mobile');

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const progress = document.querySelector('.scroll-line span');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (progress) progress.style.width = `${p * 100}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  const reveal = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveal.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    reveal.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min((i % 4) * 65, 195)}ms`;
      io.observe(el);
    });
  }

  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.querySelector('.mobile-menu');
  const closeBtn = document.querySelector('.menu-close');
  const setMenu = open => {
    if (!menu || !menuBtn) return;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn?.addEventListener('click', () => setMenu(true));
  closeBtn?.addEventListener('click', () => setMenu(false));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  document.querySelectorAll('.service-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      document.querySelectorAll('.service-row').forEach(r => r.classList.remove('is-active'));
      row.classList.add('is-active');
    });
  });

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    const orb = document.querySelector('.cursor-orb');
    window.addEventListener('pointermove', e => {
      if (!orb) return;
      orb.style.opacity = '1';
      orb.style.left = `${e.clientX}px`;
      orb.style.top = `${e.clientY}px`;
    }, { passive: true });

    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(1000px) rotateX(${-y * 4.5}deg) rotateY(${x * 5.5}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * .07}px,${y * .10}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    const portrait = document.querySelector('.hero-portrait');
    const hero = document.querySelector('.hero');
    hero?.addEventListener('pointermove', e => {
      if (!portrait || window.innerWidth < 1121) return;
      const x = (e.clientX / window.innerWidth - .5) * 10;
      const y = (e.clientY / window.innerHeight - .5) * 7;
      portrait.style.marginLeft = `${x}px`;
      portrait.style.marginTop = `${y}px`;
    });
    hero?.addEventListener('pointerleave', () => {
      if (portrait) { portrait.style.marginLeft = ''; portrait.style.marginTop = ''; }
    });
  }
})();
