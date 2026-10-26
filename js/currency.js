/* Currency display: GBP for UK visitors, USD for everyone else.
   - Country comes from /api/geo (Vercel's x-vercel-ip-country header).
   - Unknown country or a failed lookup → USD. Local preview → GBP.
   - The £/$ toggle saves a `currency` cookie, which overrides detection.
   - Fixed prices, no live conversion.

   Markup hooks:
     [data-price="key"]        text swapped from PRICES[key]
     [data-price-label="key"]  aria-label swapped from LABELS[key]
     select[data-budget]       options rebuilt from BUDGETS (selection kept by position)
     a[data-href-gbp][data-href-usd]  href swapped to the active currency's link
     input[name="currency"]    hidden field submitted with the contact form
     [data-currency-toggle]    wrapper holding buttons with data-currency="GBP|USD" */
(function () {
  var PRICES = {
    ghost:     { GBP: 'From £800',   USD: 'From $1,000' },
    mixing:    { GBP: 'From £150',   USD: 'From $199' },
    priority:  { GBP: 'From £2,500', USD: 'From $3,500' },
    essentials:{ GBP: '£20',         USD: '$25' },
    template:  { GBP: 'Free',        USD: 'Free' },
    // /vocals page
    vocalMix:     { GBP: '£60',       USD: '$80' },
    fullVocalMix: { GBP: '£120',      USD: '$160' },
    mixMaster:    { GBP: 'from £150', USD: 'from $200' }
  };

  var LABELS = {
    essentials: {
      GBP: 'UK House Essentials Vol. 1 — Sample Pack — £20',
      USD: 'UK House Essentials Vol. 1 — Sample Pack — $25'
    },
    template: {
      GBP: 'Free Mixing Logic Pro Template — Free',
      USD: 'Free Mixing Logic Pro Template — Free'
    }
  };

  var BUDGETS = {
    GBP: ['Under £800', '£800–£1,500', '£1,500–£3,000', '£3,000+', 'Not sure yet'],
    USD: ['Under $1,000', '$1,000–$2,000', '$2,000–$4,000', '$4,000+', 'Not sure yet']
  };

  var COOKIE = 'currency';
  // Bumped from 'geoCurrency' so sessions cached under the old US-only rule re-detect.
  var GEO_CACHE = 'geoCurrency2';

  function readCookie() {
    var m = document.cookie.match(/(?:^|;\s*)currency=(GBP|USD)\b/);
    return m ? m[1] : null;
  }

  function writeCookie(value) {
    document.cookie = COOKIE + '=' + value + '; path=/; max-age=31536000; SameSite=Lax';
  }

  function apply(currency) {
    document.documentElement.setAttribute('data-currency', currency);

    document.querySelectorAll('[data-price]').forEach(function (el) {
      var p = PRICES[el.getAttribute('data-price')];
      if (p) el.textContent = p[currency];
    });

    document.querySelectorAll('[data-price-label]').forEach(function (el) {
      var l = LABELS[el.getAttribute('data-price-label')];
      if (l) el.setAttribute('aria-label', l[currency]);
    });

    document.querySelectorAll('select[data-budget]').forEach(function (select) {
      // Index 0 is the "Select a budget" placeholder; keep the chosen slot.
      var selected = select.selectedIndex;
      var options = BUDGETS[currency];
      for (var i = 0; i < options.length; i++) {
        var opt = select.options[i + 1];
        if (!opt) {
          opt = document.createElement('option');
          select.appendChild(opt);
        }
        opt.value = options[i];
        opt.textContent = options[i];
      }
      select.selectedIndex = selected;
    });

    document.querySelectorAll('a[data-href-gbp][data-href-usd]').forEach(function (a) {
      a.href = a.getAttribute(currency === 'USD' ? 'data-href-usd' : 'data-href-gbp');
    });

    document.querySelectorAll('input[name="currency"]').forEach(function (input) {
      input.value = currency;
    });

    document.querySelectorAll('[data-currency-toggle] [data-currency]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-currency') === currency ? 'true' : 'false');
    });
  }

  // Local preview has no Vercel geo header, so default to GBP there for testing.
  function isLocal() {
    var h = location.hostname;
    return location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' ||
      h === '[::1]' || /\.local$/.test(h) || /^(10|192\.168)\./.test(h);
  }

  // GB → GBP. Every other country, or an unknown one, → USD.
  function detect() {
    if (isLocal()) return Promise.resolve('GBP');

    var cached = null;
    try { cached = sessionStorage.getItem(GEO_CACHE); } catch (e) {}
    if (cached === 'GBP' || cached === 'USD') return Promise.resolve(cached);

    return fetch('/api/geo', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (data) {
        var c = data && data.country === 'GB' ? 'GBP' : 'USD';
        try { sessionStorage.setItem(GEO_CACHE, c); } catch (e) {}
        return c;
      })
      .catch(function () { return 'USD'; });
  }

  function init() {
    document.querySelectorAll('[data-currency-toggle] [data-currency]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var c = btn.getAttribute('data-currency');
        writeCookie(c);
        apply(c);
      });
    });

    var saved = readCookie();
    if (saved) {
      apply(saved);
      return;
    }
    apply('GBP');
    detect().then(function (c) {
      // A toggle click may have landed while we were waiting.
      apply(readCookie() || c);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
