/* Arrivée depuis une fiche produit (produits.html#p-...) : le produit est mis en évidence */
(function () {
  var h = location.hash;
  if (!h || h.indexOf('#p-') !== 0) return;
  var el;
  try { el = document.querySelector(h); } catch (e) { return; }
  if (!el) return;
  setTimeout(function () {
    el.scrollIntoView({ block: 'center' });
    el.classList.add('product-flash');
    setTimeout(function () { el.classList.remove('product-flash'); }, 3200);
  }, 350);
})();
