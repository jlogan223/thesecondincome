/**
 * TSI-UK Top Picks Carousel
 * -----------------------------------------------------
 * Reads window.TSI_TOP_PICKS (populated by articles.js)
 * and renders into #carousel-track via window.TSI_CARDS.
 *
 * Card visuals live in App/js/cards.js — this file only
 * handles paging, dots, and responsive card count.
 * -----------------------------------------------------
 */
(function () {
  function getWeekLabel() {
    var now = new Date();
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return 'Week of ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  }

  function visibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function build() {
    var track = document.getElementById('carousel-track');
    if (!track || !window.TSI_TOP_PICKS || window.TSI_TOP_PICKS.length === 0) return;
    if (!window.TSI_CARDS) {
      // cards.js must be loaded before this script.
      if (window.console) console.warn('TSI_CARDS missing — ensure cards.js loads before carousel.js');
      return;
    }

    var picks = window.TSI_TOP_PICKS;
    var current = 0;

    var weekEl = document.getElementById('carousel-week');
    if (weekEl) weekEl.textContent = getWeekLabel();

    track.innerHTML = picks.map(function (a) {
      return window.TSI_CARDS.render(a, 'carousel');
    }).join('');

    var dotsEl = document.getElementById('carousel-dots');
    function rebuildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      var total = Math.max(1, picks.length - visibleCount() + 1);
      for (var d = 0; d < total; d++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (d === current ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (d + 1));
        (function (i) { dot.addEventListener('click', function () { goTo(i); }); })(d);
        dotsEl.appendChild(dot);
      }
    }

    function cardStep() {
      var first = track.querySelector('.carousel-card');
      if (!first) return 0;
      return first.offsetWidth + 24;
    }

    function goTo(idx) {
      var max = Math.max(0, picks.length - visibleCount());
      current = Math.max(0, Math.min(idx, max));
      track.style.transform = 'translateX(-' + (current * cardStep()) + 'px)';
      var dots = document.querySelectorAll('.carousel-dot');
      for (var i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === current);
      }
    }

    var prev = document.getElementById('carousel-prev');
    var next = document.getElementById('carousel-next');
    if (prev) prev.addEventListener('click', function () { goTo(current - 1); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); });
    window.addEventListener('resize', function () { rebuildDots(); goTo(current); });

    rebuildDots();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
