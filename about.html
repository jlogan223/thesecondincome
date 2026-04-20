(function() {
  function getWeekLabel() {
    var now = new Date();
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return 'Week of ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  }
  function getCatColor(cat) {
    return cat === 'high-risk' ? '#e85d4a' : 'var(--gold)';
  }
  function getVis() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }
  function buildCarousel() {
    var container = document.getElementById('top-picks-carousel');
    if (!container || !window.TSI_FEATURED) return;
    var arts = window.TSI_FEATURED;
    var current = 0;
    var weekEl = document.getElementById('carousel-week');
    if (weekEl) weekEl.textContent = getWeekLabel();
    var track = document.getElementById('carousel-track');
    if (!track) return;
    track.innerHTML = '';
    arts.forEach(function(a) {
      var signupBtn = a.affiliate
        ? '<a href="'+a.affiliate+'" target="_blank" rel="noopener" class="carousel-btn-signup">Sign up now →</a>'
        : '<a href="'+a.slug+'" class="carousel-btn-signup">Read guide →</a>';
      var card = document.createElement('div');
      card.className = 'carousel-card';
      card.innerHTML =
        '<div class="carousel-card-body">'+
          '<div class="carousel-category" style="color:'+getCatColor(a.category)+'">'+a.categoryLabel+'</div>'+
          '<div class="carousel-earn">'+a.earn+'</div>'+
          '<div class="carousel-earn-label">potential earnings</div>'+
          '<div class="carousel-title">'+a.title+'</div>'+
          '<div class="carousel-snippet">'+a.snippet+'</div>'+
          '<div class="carousel-meta"><span>'+a.readTime+' min read</span></div>'+
        '</div>'+
        '<div class="carousel-card-footer">'+
          '<a href="'+a.slug+'" class="carousel-btn-read">Read guide</a>'+
          signupBtn+
        '</div>';
      track.appendChild(card);
    });
    var dotsEl = document.getElementById('carousel-dots');
    function rebuildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      var total = Math.max(1, arts.length - getVis() + 1);
      for (var d = 0; d < total; d++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (d === current ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide '+(d+1));
        (function(i){ dot.addEventListener('click', function(){ goTo(i); }); })(d);
        dotsEl.appendChild(dot);
      }
    }
    function cardWidth() {
      var cards = track.querySelectorAll('.carousel-card');
      if (!cards.length) return 0;
      return cards[0].offsetWidth + 24;
    }
    function goTo(idx) {
      var max = Math.max(0, arts.length - getVis());
      current = Math.max(0, Math.min(idx, max));
      track.style.transform = 'translateX(-'+(current * cardWidth())+'px)';
      document.querySelectorAll('.carousel-dot').forEach(function(d,i){ d.classList.toggle('active', i === current); });
    }
    var prevBtn = document.getElementById('carousel-prev');
    var nextBtn = document.getElementById('carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', function(){ goTo(current-1); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ goTo(current+1); });
    window.addEventListener('resize', function(){ rebuildDots(); goTo(current); });
    rebuildDots();
  }
  document.addEventListener('DOMContentLoaded', buildCarousel);
})();
