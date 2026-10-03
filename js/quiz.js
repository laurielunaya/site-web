// Lunaya — questionnaire "Quel soin choisir ?" (page Prestations : tous les soins ; page Head Spa : les rituels Head Spa)
(function () {
  const body = document.getElementById('quizBody');
  if (!body) return;
  const mode = body.dataset.quiz || 'full';
  const onHeadSpaPage = mode === 'headspa';

  const HS = ' · +15 min de séchage';
  const R = (name, meta, text, href, extra, service) => ({ result: { name, meta, text, href, extra: extra || '', service: service || '' } });

  const relax = { q: 'Combien de temps voulez-vous vous accorder ?', opts: [
    ['Environ 1 h', R('Head Spa Essentiel', '1h · 95 €' + HS, 'L\'essentiel du rituel Head Spa, idéal pour découvrir.', 'head-spa.html', '', 'Head Spa Essentiel')],
    ['1h30', R('Head Spa Intense', '1h30 · 125 €' + HS, 'Un rituel plus long et plus approfondi.', 'head-spa.html', '', 'Head Spa Intense')],
    ['2 h pour vraiment déconnecter', R('Head Spa Holistique', '2h · 180 €' + HS, 'L\'expérience sensorielle signature de l\'institut.', 'head-spa.html', '', 'Head Spa Holistique')]
  ]};
  const bubble = R('Bubble Hair Spa Coréen', '1h45 · 190 €' + HS, 'Notre soin coréen le plus complet pour purifier et apaiser le cuir chevelu : diagnostic au microscope, AquaPeel, soins Histemo, Bubble Shampoo et LED thérapie, dans une vraie parenthèse de détente.', 'head-spa.html', 'Nouveauté', 'Bubble Hair Spa Coréen');
  const trees = {
    full: {
      start: { q: 'Qu\'est-ce qui vous ferait du bien ?', opts: [
        ['Un moment de détente profonde', { next: 'relax' }],
        ['Purifier et apaiser mon cuir chevelu (pellicules, excès de sébum, irritations…)', bubble],
        ['Un soin du visage', { next: 'face' }],
        ['Un soin du corps', { next: 'body' }],
        ['Offrir, ou venir à deux', { next: 'gift' }]
      ]},
      relax: relax,
      face: { q: 'Quelle est votre envie ?', opts: [
        ['Un coup d\'éclat rapide', R('Sublimateur', '30 min · 35 €', 'Un soin express pour retrouver de l\'éclat.', 'soin-visage.html')],
        ['Un soin complet adapté à ma peau', R('Sur Mesure', '75 min · 75 €', 'Un soin personnalisé selon les besoins de votre peau.', 'soin-visage.html')],
        ['Le soin le plus complet', R('Majestueux', '90 min · 95 €', 'Notre soin visage d\'exception.', 'soin-visage.html')],
        ['Une action anti-âge', R('Anti-Âge Global, appareil Dermophyt\'s', '90 min · 105 €', 'Un soin ciblé anti-âge avec appareil.', 'soin-visage.html')],
        ['J\'ai moins de 18 ans', R('Peaux Jeunes (– 18 ans)', '50 min · 52 €', 'Un soin adapté aux peaux jeunes.', 'soin-visage.html')]
      ]},
      body: { q: 'Quelle est votre envie ?', opts: [
        ['Me détendre en profondeur', R('Rituel Relaxant', '60 min · 75 €', 'Un modelage pour relâcher les tensions.', 'soins-corps.html')],
        ['Soulager mon dos', R('Rituel Dos', '45 min · 52 €', 'Un soin ciblé pour le dos.', 'soins-corps.html')],
        ['Alléger mes jambes', R('Rituel Jambes Légères', '45 min · 52 €', 'Un soin pour retrouver des jambes légères.', 'soins-corps.html')],
        ['Une vraie escapade de 1h30', R('Rituel Évasion', '90 min · 99 €', 'Un long rituel pour déconnecter.', 'soins-corps.html')]
      ]},
      gift: { q: 'Que souhaitez-vous faire ?', opts: [
        ['Offrir un bon cadeau', R('Un bon cadeau', 'Soin ou montant libre', 'Choisissez le soin à offrir, en version électronique ou imprimée.', 'idees-cadeaux.html#bons-cadeaux', 'gift')],
        ['Composer un coffret', R('Un coffret cadeau', 'Cheveux, visage ou corps', 'Des coffrets prêts à offrir, ou composez le vôtre.', 'idees-cadeaux.html#coffrets', 'gift')],
        ['Venir à deux', R('Head Spa Duo', '1h · 180 €' + HS, 'Un Head Spa à partager.', 'head-spa.html')]
      ]}
    },
    headspa: {
      start: { q: 'Pour qui est le Head Spa ?', opts: [
        ['Pour moi', { next: 'need' }],
        ['Pour un homme', R('Head Spa Homme', '1h · 80 €' + HS, 'Le rituel Head Spa pensé pour les hommes.', 'head-spa.html', '', 'Head Spa Homme')],
        ['Pour un enfant (4 à 13 ans)', R('Head Spa Enfant', '30 min · 50 €' + HS, 'Une parenthèse adaptée aux enfants de 4 à 13 ans.', 'head-spa.html', '', 'Head Spa Enfant')],
        ['Pour venir à deux', { next: 'duo' }],
        ['Pour offrir', R('Un bon cadeau Head Spa', 'Le soin de votre choix', 'Choisissez le Head Spa à offrir, en version électronique ou imprimée.', '#bon-cadeau', 'gift')]
      ]},
      need: { q: 'Qu\'est-ce qui vous ferait du bien ?', opts: [
        ['Me détendre en profondeur', { next: 'relax' }],
        ['Purifier et apaiser mon cuir chevelu (pellicules, excès de sébum, irritations…)', bubble],
        ['Un moment énergétique et relaxant (Reiki)', R('Head Spa X Reiki', '1h45 · 155 €' + HS, 'Soin énergétique et relaxation profonde.', 'head-spa.html', '', 'Head Spa X Reiki')],
        ['Le cuir chevelu et le corps', R('Head Spa X Massage Corps', '2h · 165 €' + HS, 'Un Head Spa associé à un massage du corps.', 'head-spa.html', '', 'Head Spa X Massage Corps')]
      ]},
      relax: relax,
      duo: { q: 'Quelle formule à deux ?', opts: [
        ['Head Spa à deux', R('Head Spa Duo', '1h · 180 €' + HS, 'Un Head Spa à partager.', 'head-spa.html', '', 'Head Spa Duo')],
        ['Head Spa à deux avec soin du visage', R('Head Spa Duo X Soin Visage', '1h30 · 240 €' + HS, 'Le Head Spa à deux, complété d\'un soin du visage.', 'head-spa.html', '', 'Head Spa Duo X Soin Visage')]
      ]}
    }
  };
  const tree = trees[mode] || trees.full;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  /* page Head Spa : afficher et ouvrir le soin conseillé dans la liste */
  function goToService(name) {
    const items = Array.from(document.querySelectorAll('.service-item'));
    const norm = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();
    const target = norm(name);
    const item = items.find((i) => { const n = i.querySelector('.service-name'); return n && norm(n.textContent) === target; })
      || items.find((i) => { const n = i.querySelector('.service-name'); return n && norm(n.textContent).startsWith(target); });
    if (!item) return;
    const top = item.getBoundingClientRect().top + window.scrollY - 130;
    window.scrollTo({ top: top, behavior: 'smooth' });
    if (!item.classList.contains('open')) {
      const q = item.querySelector('.service-q');
      if (q) setTimeout(() => q.click(), 450);
    }
  }

  let path = [];

  function render(key) {
    body.innerHTML = '';
    const node = tree[key];
    body.appendChild(el('p', 'quiz-q', node.q));
    const list = el('div', 'quiz-opts');
    node.opts.forEach(([label, target]) => {
      const b = el('button', 'quiz-opt', label);
      b.type = 'button';
      b.addEventListener('click', () => {
        if (target.next) { path.push(key); render(target.next); }
        else showResult(target.result);
      });
      list.appendChild(b);
    });
    body.appendChild(list);
    if (path.length) {
      const back = el('button', 'quiz-link', '← Retour');
      back.type = 'button';
      back.addEventListener('click', () => render(path.pop()));
      body.appendChild(back);
    }
  }

  function showResult(r) {
    body.innerHTML = '';
    body.appendChild(el('p', 'quiz-q', 'Notre conseil pour vous'));
    const card = el('div', 'quiz-result');
    if (r.extra && r.extra !== 'gift') card.appendChild(el('span', 'quiz-tag', r.extra));
    card.appendChild(el('h3', '', r.name));
    card.appendChild(el('p', 'quiz-meta', r.meta));
    card.appendChild(el('p', 'quiz-text', r.text));
    const actions = el('div', 'quiz-actions');
    const see = el('a', 'btn btn-outline btn-sm', r.extra === 'gift' ? 'Voir les idées cadeaux' : 'Voir ce soin');
    see.href = r.href;
    if (onHeadSpaPage && r.service) {
      see.href = '#' + r.service.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      see.addEventListener('click', (e) => { e.preventDefault(); goToService(r.service); });
    } else if (onHeadSpaPage && r.href.startsWith('#')) {
      see.textContent = 'Choisir le bon cadeau';
      see.addEventListener('click', (e) => {
        e.preventDefault();
        const t = document.querySelector(r.href);
        if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
      });
    }
    actions.appendChild(see);
    if (r.extra !== 'gift') {
      const book = el('a', 'btn btn-primary btn-sm', 'Réserver');
      book.href = 'reservation.html';
      actions.appendChild(book);
    }
    card.appendChild(actions);
    body.appendChild(card);
    const again = el('button', 'quiz-link', '↺ Recommencer');
    again.type = 'button';
    again.addEventListener('click', () => { path = []; render('start'); });
    body.appendChild(again);
  }

  render('start');
})();