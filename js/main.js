// Lunaya — interactions

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- hero video showcase (cycles through services) ---------- */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
    } else {
      const sources = [
        'assets/hero-headspa.mp4',
        'assets/hero-facial.mp4',
        'assets/hero-manicure.mp4',
        'assets/hero-massage.mp4'
      ];
      let idx = 0;
      heroVideo.addEventListener('ended', () => {
        idx = (idx + 1) % sources.length;
        heroVideo.src = sources[idx];
        heroVideo.play().catch(() => {});
      });
      heroVideo.play().catch(() => {});
    }
  }

  /* ---------- sticky nav state ---------- */
  const navShell = document.getElementById('navShell');
  const onScroll = () => {
    if (window.scrollY > 20) navShell.classList.add('scrolled');
    else navShell.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMenu = () => {
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- smooth scroll offset for fixed header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 110;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMenu();
    });
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          if (entry.target.classList.contains('reveal-stagger')) {
            Array.from(entry.target.children).forEach((child, i) => {
              child.style.setProperty('--i', i);
            });
          }
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => {
      el.classList.add('reveal');
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('reveal', 'in'));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Service accordion (listes de prestations détaillées) ---------- */
  document.querySelectorAll('.service-item').forEach(item => {
    const btn = item.querySelector('.service-q');
    const panel = item.querySelector('.service-a');
    if (!panel) return;
    const toggle = () => {
      const isOpen = item.classList.contains('open');
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = 0;
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    };
    btn.addEventListener('click', (e) => {
      if (e.target.closest('.service-book-link')) return;
      toggle();
    });
    btn.addEventListener('keydown', (e) => {
      if (e.target.closest('.service-book-link')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  /* ---------- media rotator (photos de galerie en rotation aléatoire) ---------- */
  document.querySelectorAll('.media-rotator').forEach((el) => {
    const images = (el.dataset.images || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (!images.length) return;

    const layerA = document.createElement('div');
    const layerB = document.createElement('div');
    layerA.className = 'layer';
    layerB.className = 'layer';
    el.appendChild(layerA);
    el.appendChild(layerB);

    let currentIndex = Math.floor(Math.random() * images.length);
    layerA.style.backgroundImage = `url('${images[currentIndex]}')`;
    layerA.classList.add('active');
    let activeLayer = layerA;

    if (images.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setInterval(() => {
      let nextIndex = Math.floor(Math.random() * images.length);
      if (nextIndex === currentIndex) nextIndex = (nextIndex + 1) % images.length;
      currentIndex = nextIndex;
      const nextLayer = activeLayer === layerA ? layerB : layerA;
      nextLayer.style.backgroundImage = `url('${images[currentIndex]}')`;
      nextLayer.classList.add('active');
      activeLayer.classList.remove('active');
      activeLayer = nextLayer;
    }, 2000);
  });

});
