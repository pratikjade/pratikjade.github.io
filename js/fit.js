/* Scales the 1440px drawing sheet to fill tablets and large displays; phones (<900px) use the stacked CSS layout. */
(function () {
  var app = document.getElementById('app');
  function fit() {
    var w = document.documentElement.clientWidth;
    app.style.zoom = w >= 900 ? Math.min(w / 1440, 2.2) : '';
  }
  fit();
  window.addEventListener('resize', fit);
})();
