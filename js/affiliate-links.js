// The Second Income UK — affiliate link rewriter
// -----------------------------------------------
// Hybrid model: the build-time assembler pre-renders affiliate URLs into the
// static HTML so search engine crawlers see proper rel="sponsored" links at
// crawl time. THIS script runs in the browser as a SAFETY NET for:
//
//   1. Brands approved AFTER an article was last assembled (no rebuild needed)
//   2. Dynamic content (related-articles cards, future widgets)
//   3. Articles authored by hand that use data-aff-brand without going through
//      the assembler
//
// Usage inside any article:
//   <a data-aff-brand="topcashback" href="#placeholder" class="aff-link">TopCashback</a>
//   <a data-aff-brand="justpark"
//      data-aff-target="https://www.justpark.com/how-it-works/rent-out-your-driveway"
//      href="#placeholder">JustPark</a>
//
// If the brand is approved + allowed for TSI-UK + not red-flagged, href is set
// + rel="sponsored nofollow noopener" + target="_blank". Pending or unknown
// brands keep the placeholder, get aria-disabled=true and class aff-link-pending.
//
// Adapted from Loyal & Loved's affiliate-links.js (2026-04-26) with two new
// network handlers added: referral (for personal cashback referral links —
// L&L doesn't use these) and partnerstack (Shopify via pxf.io).
//
// Drop in <head> as: <script src="/js/affiliate-links.js" defer></script>

(function () {
  'use strict';

  var SOURCE = '/affiliates-tsi.json';
  var SITE_ID = 'thesecondincome-uk';

  // Promise cache — fetched once per page load.
  var READY = fetch(SOURCE, { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      window.TSI_AFFILIATES = data;
      return data;
    })
    .catch(function (err) {
      console.warn('[affiliate-links] could not load ' + SOURCE + ':', err);
      return null;
    });

  // Public API — call directly if you need a URL programmatically (e.g. from
  // related-articles cards or future React/Vue widgets).
  window.buildAffiliateLink = function (brandSlug, targetUrl) {
    return READY.then(function (data) {
      if (!data) return null;
      var brand = data.brands && data.brands[brandSlug];
      if (!brand) {
        console.warn('[affiliate-links] unknown brand:', brandSlug);
        return null;
      }
      if (brand.status !== 'approved') return null;
      if (brand.ethicsFlag === 'red_do_not_wire') {
        console.warn('[affiliate-links] refusing — brand flagged do-not-wire:', brandSlug);
        return null;
      }

      var publisher = data.publisher || {};
      var networks = data.networks || {};
      var target = targetUrl || brand.merchantHome || '';

      switch (brand.network) {
        // Personal cashback referrals (TopCashback, Quidco, Swagbucks).
        // No deeplinks — one static URL only.
        case 'referral':
          return brand.staticLink || null;

        // PartnerStack / pxf.io style (Shopify). Static link with embedded affiliate code.
        case 'partnerstack':
          return brand.staticLink || null;

        // Direct programmes (Fiverr, Printful). Static link unless template + target.
        case 'direct':
          if (brand.staticLink) return brand.staticLink;
          if (brand.linkTemplate && target) {
            return brand.linkTemplate.replace('{url}', encodeURIComponent(target));
          }
          return null;

        // AWIN — substitute mid + affid + target into cread.php template.
        case 'awin': {
          var aid = publisher.awin_publisher_id;
          if (!aid || /REPLACE_WITH/.test(aid)) {
            console.warn('[affiliate-links] AWIN publisher ID missing');
            return null;
          }
          var awinTmpl = (networks.awin && networks.awin.linkTemplate)
            || 'https://www.awin1.com/cread.php?awinmid={merchantId}&awinaffid={publisherId}&ued={url}';
          return awinTmpl
            .replace('{merchantId}', encodeURIComponent(brand.merchantId))
            .replace('{publisherId}', encodeURIComponent(aid))
            .replace('{url}', encodeURIComponent(target));
        }

        // Amazon — append ?tag=<site-tag>.
        case 'amazon': {
          var tags = publisher.amazon_associates_tags || {};
          var tag = tags[SITE_ID];
          if (!tag || !target) return null;
          try {
            var u = new URL(target);
            u.searchParams.set('tag', tag);
            return u.toString();
          } catch (e) {
            console.warn('[affiliate-links] invalid Amazon target URL:', target);
            return null;
          }
        }

        // Impact / partnerize — template with target.
        case 'impact':
          if (!brand.linkTemplate) return null;
          return brand.linkTemplate.replace('{url}', encodeURIComponent(target));

        default:
          return null;
      }
    });
  };

  // DOM rewriter — runs once on DOMContentLoaded.
  function rewire() {
    var anchors = document.querySelectorAll('a[data-aff-brand]');
    if (!anchors.length) return;
    READY.then(function () {
      anchors.forEach(function (a) {
        // If this anchor already has a real href (build-time injected), skip — we'd
        // only overwrite with the same URL anyway. Save the cycles.
        var existing = a.getAttribute('href');
        if (existing && existing.charAt(0) !== '#' && existing.indexOf('javascript:') !== 0) {
          a.setAttribute('rel', 'sponsored nofollow noopener');
          if (!a.getAttribute('target')) a.setAttribute('target', '_blank');
          return;
        }
        var slug = a.getAttribute('data-aff-brand');
        var target = a.getAttribute('data-aff-target') || '';
        window.buildAffiliateLink(slug, target).then(function (url) {
          if (url) {
            a.setAttribute('href', url);
            a.setAttribute('rel', 'sponsored nofollow noopener');
            a.setAttribute('target', '_blank');
            a.classList.remove('aff-link-pending');
            a.classList.add('aff-link-live');
            a.removeAttribute('aria-disabled');
          } else {
            // Pending, unknown, or do-not-wire — keep as placeholder.
            a.setAttribute('aria-disabled', 'true');
            a.classList.remove('aff-link-live');
            a.classList.add('aff-link-pending');
            a.removeAttribute('href');
            a.style.cursor = 'default';
            a.addEventListener('click', function (e) { e.preventDefault(); });
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rewire);
  } else {
    rewire();
  }
})();

/* ===========================================================================
 * PB Eng affiliate click tracking — beacons every successful affiliate click
 * to the Cloudflare Worker so the dashboard can count clicks per page/brand.
 * Self-contained IIFE — does not interfere with the rewriter above.
 * Uses event delegation so it works for both build-time-injected and runtime-
 * rewritten links. navigator.sendBeacon is fire-and-forget; never blocks click.
 * Source of truth: Website Dashboard/cloudflare-worker/tracking-snippet.js
 * =========================================================================== */
(function () {
  'use strict';

  var TRACK_URL = 'https://pb-eng-click-tracker.jlogan223.workers.dev/track';
  var host = (location.host || '').toLowerCase();
  var SITE = host.indexOf('loyalandloved') !== -1 ? 'll'
           : host.indexOf('thesecondincome') !== -1 ? 'tsi'
           : 'unknown';

  function shouldTrack(a) {
    if (!a) return false;
    var hasBrand = a.dataset && a.dataset.affBrand;
    var hasAffClass = a.classList && a.classList.contains('aff-link');
    if (!hasBrand && !hasAffClass) return false;
    var href = a.getAttribute('href');
    if (!href) return false;
    if (href.charAt(0) === '#') return false;
    if (a.getAttribute('aria-disabled') === 'true') return false;
    return true;
  }

  function detectNetwork(a, href) {
    var explicit = a.dataset && (a.dataset.affNetwork || a.dataset.network);
    if (explicit) return explicit;
    if (!href) return 'unknown';
    if (/amzn\.to|amazon\./i.test(href)) return 'amazon';
    if (/awin1\.com|awin\./i.test(href)) return 'awin';
    if (/topcashback/i.test(href)) return 'topcashback';
    if (/quidco/i.test(href)) return 'quidco';
    if (/swagbucks/i.test(href)) return 'swagbucks';
    if (/pxf\.io|partnerstack/i.test(href)) return 'partnerstack';
    return 'unknown';
  }

  function send(a) {
    try {
      var href = a.getAttribute('href') || '';
      var data = {
        site: SITE,
        page: location.pathname,
        brand: (a.dataset && a.dataset.affBrand) || '',
        network: detectNetwork(a, href),
        targetUrl: href,
        referrer: document.referrer || ''
      };
      var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(TRACK_URL, blob);
    } catch (e) { /* never block navigation */ }
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t) return;
    var a = (t.closest ? t.closest('a') : null);
    if (shouldTrack(a)) send(a);
  }, true);
})();
