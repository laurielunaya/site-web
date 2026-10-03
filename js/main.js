// Lunaya — interactions

/* ---------- consentement aux cookies : l'outil de mesure d'audience (Google Tag Manager) ne se charge qu'après accord ---------- */
(function () {
  const KEY = 'lunaya-consent';
  const GTM_ID = 'GTM-TPFK3M8X';
  const SIX_MONTHS = 182 * 24 * 3600 * 1000;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && (saved.choice === 'granted' || saved.choice === 'denied') && Date.now() - saved.date < SIX_MONTHS) return saved.choice;
    } catch (e) { /* stockage indisponible */ }
    return null;
  }
  function saveChoice(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice: choice, date: Date.now() })); } catch (e) { /* ignoré */ }
  }
  function loadGtm() {
    if (window.__lunayaGtm) return;
    window.__lunayaGtm = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }

  function closeBanner() {
    const el = document.getElementById('cookieBanner');
    if (el) el.remove();
    document.body.classList.remove('has-cookie-banner');
    document.body.style.removeProperty('--cookie-h');
  }
  function showBanner() {
    if (document.getElementById('cookieBanner')) return;
    const el = document.createElement('div');
    el.id = 'cookieBanner';
    el.className = 'cookie-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Gestion des cookies');
    el.innerHTML = '<p>Nous utilisons un outil de mesure d\'audience pour comprendre comment le site est utilisé et l\'améliorer. Rien n\'est collecté sans votre accord. <a href="politique-confidentialite.html">En savoir plus</a></p>'
      + '<div class="cookie-actions">'
      + '<button type="button" class="btn btn-outline btn-sm" data-consent="denied">Refuser</button>'
      + '<button type="button" class="btn btn-primary btn-sm" data-consent="granted">Accepter</button>'
      + '</div>';
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-consent]');
      if (!b) return;
      saveChoice(b.dataset.consent);
      if (b.dataset.consent === 'granted') loadGtm();
      closeBanner();
    });
    document.body.appendChild(el);
    document.body.classList.add('has-cookie-banner');
    document.body.style.setProperty('--cookie-h', (el.offsetHeight + 16) + 'px');
  }

  window.lunayaCookies = { show: showBanner };

  document.addEventListener('DOMContentLoaded', () => {
    const choice = readChoice();
    if (choice === 'granted') loadGtm();
    else if (choice === null) showBanner();

    /* lien "Gérer mes cookies" dans le pied de page */
    document.querySelectorAll('.footer-legal').forEach((box) => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = 'Gérer mes cookies';
      a.addEventListener('click', (e) => { e.preventDefault(); showBanner(); });
      box.appendChild(a);
    });
  });
})();
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- accessibilité : nom accessible pour les champs qui n'ont qu'un texte d'exemple ---------- */
  document.querySelectorAll('input, select, textarea').forEach((f) => {
    if (f.type === 'hidden' || f.type === 'checkbox' || f.getAttribute('aria-label') || (f.labels && f.labels.length)) return;
    const text = f.tagName === 'SELECT' ? (f.options[0] ? f.options[0].textContent : '') : f.placeholder;
    if (text) f.setAttribute('aria-label', text.replace(/\s*\(facultatif\)/i, ', facultatif').replace(/…$/, ''));
  });

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
    }, { threshold: 0.05, rootMargin: '0px 0px 200px 0px' });

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

  /* ---------- images en chargement différé (data-bg) : chargées à l'approche de l'écran ---------- */
  const lazyBgs = document.querySelectorAll('[data-bg]');
  const loadBg = (el) => {
    el.style.backgroundImage = "url('" + el.dataset.bg + "')";
    el.removeAttribute('data-bg');
  };
  if ('IntersectionObserver' in window) {
    const bgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadBg(entry.target);
          bgObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '900px 0px' });
    lazyBgs.forEach((el) => bgObserver.observe(el));
  } else {
    lazyBgs.forEach(loadBg);
  }

  /* ---------- contenus de fin d'année : chargés seulement du 1er novembre au 6 janvier ----------
     Ajouter ?noel=1 (ou ?noel=fin pour le message du 15 au 25 décembre) à l'adresse d'une page pour prévisualiser. */
  const today = new Date();
  const noelParam = new URLSearchParams(window.location.search).get('noel');
  const seasonActive = today.getMonth() >= 10
    || (today.getMonth() === 0 && today.getDate() <= 6)
    || noelParam === '1' || noelParam === 'fin';
  const lastCall = (today.getMonth() === 11 && today.getDate() >= 15 && today.getDate() <= 25)
    || noelParam === 'fin';
  if (seasonActive) {
    window.lunayaSeason = { lastCall: lastCall };
    const seasonScript = document.createElement('script');
    seasonScript.src = 'js/noel.js';
    document.body.appendChild(seasonScript);
  }
  /* ---------- pied de page : lien direct vers les bons cadeaux ---------- */
  document.querySelectorAll('footer .footer-col').forEach((col) => {
    const list = col.querySelector('ul');
    const title = col.querySelector('h5');
    if (!list || !title || title.textContent.trim() !== 'Contact') return;
    const li = document.createElement('li');
    li.innerHTML = '<a href="idees-cadeaux.html#bons-cadeaux">Offrir un bon cadeau</a>';
    list.appendChild(li);

    /* adresse, horaires et parking visibles sur toutes les pages */
    const info = document.createElement('li');
    info.className = 'footer-info';
    info.innerHTML = '<a href="https://www.google.com/maps/search/?api=1&query=Lunaya+110+route+de+Rives+38140+Apprieu" target="_blank" rel="noopener">110 route de Rives, 38140 Apprieu</a>'
      + '<span class="footer-info-sub">Parking gratuit sur place</span>'
      + '<span class="footer-info-sub">Sur rendez-vous, du lundi au samedi</span>'
      + '<a class="footer-info-sub" href="contact.html#horaires">Voir les horaires détaillés</a>';
    list.insertBefore(info, list.firstChild);

    const ig = document.createElement('li');
    ig.innerHTML = '<a href="https://ig.me/m/linstitutdebeauteapprieu" target="_blank" rel="noopener">Nous écrire sur Instagram</a>';
    list.appendChild(ig);
  });

  /* ---------- bouton "Copier le lien" (page d'accueil) ---------- */
  const copyBtn = document.getElementById('shareCopyBtn');
  if (copyBtn) {
    const label = copyBtn.textContent;
    copyBtn.addEventListener('click', () => {
      const url = copyBtn.dataset.url;
      const done = () => {
        copyBtn.textContent = 'Lien copié ✓';
        setTimeout(() => { copyBtn.textContent = label; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(() => { window.prompt('Copiez ce lien :', url); });
      } else {
        window.prompt('Copiez ce lien :', url);
      }
    });
  }

  /* ---------- quick-nav : surligne la rubrique en cours de lecture ---------- */
  document.querySelectorAll('.quick-nav').forEach((nav) => {
    if (!('IntersectionObserver' in window)) return;
    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const targets = links
      .map((a) => ({ a, el: document.getElementById(a.getAttribute('href').slice(1)) }))
      .filter((x) => x.el);
    if (!targets.length) return;
    const LINE = 190;
    let ticking = false;
    const update = () => {
      ticking = false;
      let current = null;
      let bestTop = -Infinity;
      targets.forEach((x) => {
        const top = x.el.getBoundingClientRect().top;
        if (top <= LINE && top > bestTop) { bestTop = top; current = x; }
      });
      links.forEach((l) => l.classList.toggle('active', !!current && l === current.a));
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
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
