/**
 * TSI-UK Article Card Renderer
 * -----------------------------------------------------
 * Single source of truth for what an article card looks like.
 * carousel.js and articles.js both pull from here — edit a card
 * visual once and it propagates everywhere.
 *
 * Exposes window.TSI_CARDS = { render, categoryClass, fmtUrl }
 *   render(article, variant) -> HTML string
 *     variant = 'grid' | 'carousel' | 'related'
 * -----------------------------------------------------
 */
(function () {
  // Absolute path — works from any page (root, /category/*, /articles/*).
  // The old relative 'articles/<slug>.html' 404'd on category pages because
  // it resolved to /category/articles/<slug>.html.
  function fmtUrl(slug) { return '/articles/' + slug + '.html'; }

  // Slugified category -> matches CSS selectors like
  //   .article-card[data-cat="high-risk"] { ... }
  function categoryClass(cat) {
    return (cat || '')
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Escape text so it's safe inside HTML (card content comes from
  // the article registry which we control, but still safer).
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderGrid(a) {
    var cat = categoryClass(a.category);
    return '' +
      '<a class="article-card" data-cat="' + cat + '" href="' + fmtUrl(a.slug) + '">' +
        '<div class="article-card-inner">' +
          '<div class="article-tag">' + esc(a.category) + '</div>' +
          '<h3>' + esc(a.title) + '</h3>' +
          '<p>' + esc(a.snippet) + '</p>' +
          '<div class="article-meta">' +
            '<span class="read-time">' + esc(a.readTime) + ' min read</span>' +
            '<span class="earn-badge">' + esc(a.earn) + '</span>' +
          '</div>' +
        '</div>' +
      '</a>';
  }

  function renderCarousel(a) {
    var cat = categoryClass(a.category);
    return '' +
      '<div class="carousel-card" data-cat="' + cat + '">' +
        '<div class="carousel-card-body">' +
          '<div class="carousel-category">' + esc(a.category) + '</div>' +
          '<div class="carousel-earn">' + esc(a.earn) + '</div>' +
          '<div class="carousel-earn-label">potential earnings</div>' +
          '<div class="carousel-title">' + esc(a.title) + '</div>' +
          '<div class="carousel-snippet">' + esc(a.snippet) + '</div>' +
          '<div class="carousel-meta"><span>' + esc(a.readTime) + ' min read</span></div>' +
        '</div>' +
        '<div class="carousel-card-footer">' +
          '<a href="' + fmtUrl(a.slug) + '" class="carousel-btn-read">Read guide</a>' +
          '<a href="' + fmtUrl(a.slug) + '" class="carousel-btn-signup">Open &rarr;</a>' +
        '</div>' +
      '</div>';
  }

  function renderRelated(a) {
    // Compact version for "related articles" at the foot of an article.
    var cat = categoryClass(a.category);
    return '' +
      '<a class="related-card" data-cat="' + cat + '" href="' + fmtUrl(a.slug) + '">' +
        '<div class="related-tag">' + esc(a.category) + '</div>' +
        '<h4>' + esc(a.title) + '</h4>' +
        '<p>' + esc(a.snippet) + '</p>' +
      '</a>';
  }

  function render(article, variant) {
    if (variant === 'carousel') return renderCarousel(article);
    if (variant === 'related')  return renderRelated(article);
    return renderGrid(article);
  }

  window.TSI_CARDS = { render: render, categoryClass: categoryClass, fmtUrl: fmtUrl };
})();
