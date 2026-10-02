// Contenus de fin d'année : ce fichier n'est chargé par le site qu'entre le 1er novembre et le 6 janvier.
// Du 15 au 25 décembre, le message "dernière ligne droite" remplace le message de saison.
(function () {
  const lastCall = !!(window.lunayaSeason && window.lunayaSeason.lastCall);

  /* badge sur le lien Idées Cadeaux du menu */
  document.querySelectorAll('.nav-links a[href="idees-cadeaux.html"], .mobile-menu a[href="idees-cadeaux.html"]').forEach((a) => {
    const badge = document.createElement('span');
    badge.className = 'nav-badge';
    badge.textContent = 'Noël';
    a.appendChild(badge);
  });

  /* accueil : bandeau des coffrets */
  const spot = document.querySelector('.hs-spot');
  if (spot) {
    const anchor = spot.closest('section');
    const eyebrow = lastCall ? 'Dernière ligne droite avant Noël' : 'Édition Fêtes de Noël';
    const title = lastCall ? 'Il est encore temps d\'offrir' : 'Des coffrets à glisser sous le sapin';
    const text = lastCall
      ? 'Retrait possible <strong>jusqu\'au 25 décembre</strong> : les créneaux partent vite, réservez vos coffrets et bons cadeaux dès maintenant.'
      : '12 coffrets cheveux, visage et corps, dès <strong>36,90&nbsp;€</strong>, à offrir ou à s\'offrir.';
    const sec = document.createElement('section');
    sec.style.cssText = 'padding-top:34px; padding-bottom:10px;';
    sec.innerHTML = '<div class="container"><a href="idees-cadeaux.html#coffrets" class="xmas-band">'
      + '<div class="xmas-band-text"><span class="eyebrow">' + eyebrow + '</span><h2>' + title + '</h2><p>' + text + '</p></div>'
      + '<span class="btn btn-primary xmas-band-cta">Découvrir les coffrets <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>'
      + '</a></div>';
    anchor.parentNode.insertBefore(sec, anchor);
  }

  /* page Idées cadeaux : textes et noms de coffrets de saison */
  const coffrets = document.getElementById('coffrets');
  if (coffrets) {
    const eyebrow = coffrets.querySelector('.section-head .eyebrow');
    const lede = coffrets.querySelector('.section-head .lede');
    if (eyebrow) eyebrow.textContent = 'Édition Fêtes de Noël';
    if (lede) lede.textContent = 'Des coffrets pensés pour tous les budgets et toutes les envies — l\'idée cadeau prête à glisser sous le sapin.';
    const rename = { 'Cocon Douceur Vanille': 'Cocon d\'Hiver Vanille', 'Grand Coffret Corps': 'Grand Coffret Corps Féerie de Noël' };
    document.querySelectorAll('.coffret-card[data-coffret]').forEach((card) => {
      const next = rename[card.dataset.coffret];
      if (!next) return;
      card.dataset.coffret = next;
      const h3 = card.querySelector('h3');
      if (h3) h3.textContent = next;
    });
    if (lastCall) {
      const heroLede = document.querySelector('.page-hero .lede');
      if (heroLede) {
        const p = document.createElement('p');
        p.className = 'last-call';
        p.innerHTML = '<span aria-hidden="true">🎄</span> Noël approche : retrait possible jusqu\'au 25 décembre, les créneaux partent vite. Réservez vos coffrets et bons cadeaux dès maintenant.';
        heroLede.insertAdjacentElement('afterend', p);
      }
    }
  }
})();