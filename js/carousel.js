/**
 * TSI-UK Top Picks Carousel
 * -----------------------------------------------------
 * Reads window.TSI_TOP_PICKS (populated by articles.js)
 * and renders into #carousel-track. Arrow buttons,
 * pagination dots, and responsive card count are all
 * handled here.
 * -----------------------------------------------------
 */
(function () {
  function getWeekLabel() {
    var now = new Date();
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return 'Week of ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  }

  function catAccent(cat) {
    var c = (cat || '').toLowerCase();
    if (c.indexOf('high') !== -1) return '#e85d4a';
    if (c.indexOf('cashback') !== -1) return '#1a6b3a';
    if (c.indexOf('freelanc') !== -1) return '#3e5c76';
    if (c.indexOf('selling') !== -1) return '#7a4a2e';
    if (c.indexOf('tax') !== -1) return '#5a4a7a';
    return '#c8972a';
  }

  function visibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function build() {
    var track = document.getElementById('carousel-track');
    if (!track || !window.TSI_TOP_PICKS || window.TSI_TOP_PICKS.length === 0) return;

    var picks = window.TSI_TOP_PICKS;
    var current = 0;

    var weekEl = document.getElementById('carousel-week');
    if (weekEl) weekEl.textContent = getWeekLabel();

    track.innerHTML = '';
    picks.forEach(function (a) {
      var card = document.createElement('div');
      card.className = 'carousel-card';
      card.innerHTML =
        '<div class="carousel-card-body">' +
          '<div class="carousel-category" style="color:' + catAccent(a.category) + '">' + a.category + '</div>' +
          '<div class="carousel-earn">' + a.earn + '</div>' +
          '<div class="carousel-earn-label">potential earnings</div>' +
          '<div class="carousel-title">' + a.title + '</div>' +
          '<div class="carousel-snippet">' + a.snippet + '</div>' +
          '<div class="carousel-meta"><span>' + a.readTime + ' min read</span></div>' +
        '</div>' +
        '<div class="carousel-card-footer">' +
          '<a href="articles/' + a.slug + '.html" class="carousel-btn-read">Read guide</a>' +
          '<a href="articles/' + a.slug + '.html" class="carousel-btn-signup">Open →</a>' +
        '</div>';
      track.appendChild(card);
    });

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
