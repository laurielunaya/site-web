/* Retrait Click and Collect : suivi de la démarche (créneau Planity)
   Planity ne permet pas de revenir automatiquement sur le site après la réservation :
   quand la cliente revient, on lui demande de confirmer, puis on affiche
   soit « tout est validé », soit « démarche non finalisée » (rappel conservé 48 h). */
(function () {
  'use strict';
  var KEY = 'lunaya-retrait';
  var MAX_AGE = 48 * 3600 * 1000;

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (v && v.s === 'pending' && Date.now() - v.t < MAX_AGE) return v;
      if (v) localStorage.removeItem(KEY);
    } catch (e) {}
    return null;
  }
  function write(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  var roots = Array.prototype.slice.call(document.querySelectorAll('[data-pickup]'));
  if (!roots.length) return;

  function setState(root, state) {
    root.dataset.current = state;
    root.querySelectorAll('[data-state]').forEach(function (el) {
      el.hidden = el.dataset.state !== state;
    });
  }

  roots.forEach(function (root) {
    var url = root.dataset.pickupUrl || 'https://www.planity.com/lunaya-38140-apprieu';
    var kind = root.dataset.pickup;
    var reopen = root.querySelector('[data-pickup-reopen]');
    if (reopen) { reopen.href = url; }

    root.querySelectorAll('[data-pickup-yes]').forEach(function (b) {
      b.addEventListener('click', function () {
        clear();
        setState(root, 'ok');
        removeBanner();
      });
    });
    root.querySelectorAll('[data-pickup-no]').forEach(function (b) {
      b.addEventListener('click', function () { setState(root, 'warn'); });
    });
    root.querySelectorAll('[data-pickup-finish]').forEach(function (b) {
      b.addEventListener('click', function () {
        var target = document.getElementById(root.dataset.pickupFinish);
        if (target) target.click();
        setState(root, 'ask');
      });
    });
    root.querySelectorAll('[data-pickup-reopen]').forEach(function (a) {
      a.addEventListener('click', function () { write({ s: 'pending', t: Date.now(), k: kind }); });
    });

    /* appelée par la page quand la cliente ouvre Planity */
    root.pickupStart = function () {
      write({ s: 'pending', t: Date.now(), k: kind });
      setState(root, 'ask');
    };
    setState(root, 'ask');
  });

  /* retour sur l'onglet du site après être allée sur Planity : on rappelle la question */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    var pending = read();
    if (!pending) return;
    roots.forEach(function (root) {
      var step = root.closest('.product-bar-step');
      if (step && !step.hidden && root.dataset.current === 'ask') {
        root.classList.remove('pickup-pulse');
        void root.offsetWidth;
        root.classList.add('pickup-pulse');
      }
    });
  });

  /* démarche laissée en route : bandeau en haut de la page pendant 48 h */
  var banner = null;
  function removeBanner() { if (banner && banner.parentNode) banner.parentNode.removeChild(banner); banner = null; }
  function showBanner(pending) {
    var main = document.getElementById('main') || document.querySelector('main');
    if (!main || banner) return;
    banner = document.createElement('div');
    banner.className = 'pickup-banner';
    banner.setAttribute('role', 'status');
    var url = roots[0].dataset.pickupUrl || 'https://www.planity.com/lunaya-38140-apprieu';
    banner.innerHTML =
      '<p><strong>⚠️ Démarche non finalisée.</strong> Vous avez envoyé votre demande, mais votre créneau de retrait n’a pas été confirmé : tant qu’il n’est pas réservé sur Planity, ' +
      (pending.k === 'cadeau' ? 'votre coffret ou bon cadeau n’est pas mis de côté' : 'vos produits ne sont pas mis de côté') + '.</p>' +
      '<div class="pickup-actions"><a class="btn btn-primary btn-sm" href="' + url + '" target="_blank" rel="noopener">Choisir mon créneau</a>' +
      '<button type="button" class="btn btn-outline btn-sm" data-banner-done>C’est fait ✓</button></div>';
    main.insertBefore(banner, main.firstChild);
    banner.querySelector('[data-banner-done]').addEventListener('click', function () {
      clear();
      banner.innerHTML = '<p><strong>🎉 Merci !</strong> Votre créneau est bien noté. À très bientôt à l’institut.</p>';
      var b = banner; banner = null;
      setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 4000);
    });
  }
  var pendingOnLoad = read();
  if (pendingOnLoad) showBanner(pendingOnLoad);

  window.LunayaPickup = {
    start: function (kind) {
      roots.forEach(function (root) { if (root.dataset.pickup === kind && root.pickupStart) root.pickupStart(); });
    }
  };
})();
