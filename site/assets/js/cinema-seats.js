/* Bitcoin FilmFest — 3D cinema seats (the "aisle walk").
   Builds three solid rows of CSS seats in perspective inside .seat-rows and
   walks the viewer slowly toward the screen as the page scrolls. No new row
   is ever revealed; passing rows slide under the bottom edge. The pointer
   turns the room slightly. Every value is read from data attributes on the
   .seat-rows element, so tuning never needs a code change. Prototype and
   tuning panel: /lab/seats/. */

(function () {
  'use strict';

  var host = document.querySelector('.seat-rows');
  if (!host) return;

  function num(name, fallback) {
    var v = parseFloat(host.getAttribute('data-' + name));
    return isNaN(v) ? fallback : v;
  }
  function str(name, fallback) {
    return host.getAttribute('data-' + name) || fallback;
  }

  var cfg = {
    size: num('size', 1.3),              // seat size multiplier
    pos: num('position', 0.3),           // rows lowered by this many seat heights (desktop)
    posPhone: num('position-phone', 0),  // same, below 700px wide
    arms: num('arms', 0),                // armrest gap as a share of seat width
    walk: num('walk', 0.75),             // rows passed over the whole page
    look: num('look', 0.35),             // pointer "look around" strength
    light: num('light', 1),              // seat brightness multiplier
    aisle: num('aisle-lights', 1),       // step light strength
    color: str('color', '#05121a'),
    pattern: str('pattern', 'houndstooth'),
    patternColor: str('pattern-color', '#4f4040'),
    patternScale: num('pattern-scale', 0.33),
    patternStrength: num('pattern-strength', 0.2)
  };

  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var rows = [];
  var W = 0, H = 0;
  var ps = 0, mx = 0, mxT = 0;
  var ticking = false;

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---- upholstery patterns (colour c, scale k in seat-font ems) ---- */
  function svg(markup) { return 'url("data:image/svg+xml,' + encodeURIComponent(markup) + '")'; }
  function tile(k, base) { var t = (base * k).toFixed(3) + 'em'; return t + ' ' + t; }
  var NS = 'xmlns="http://www.w3.org/2000/svg"';
  var BTC = 'M43.6 27.3c.6-4-2.4-6.1-6.6-7.5l1.4-5.5-3.3-.8-1.3 5.4-2.7-.6 1.3-5.4-3.3-.8-1.4 5.5-2.1-.5-4.6-1.1-.9 3.5s2.4.6 2.4.6c1.3.3 1.6 1.2 1.5 1.9l-3.7 15c-.2.4-.6 1-1.5.8 0 0-2.4-.6-2.4-.6l-1.6 3.8 4.3 1.1 2.4.6-1.4 5.5 3.3.8 1.4-5.5 2.7.7-1.4 5.5 3.3.8 1.4-5.5c5.6 1.1 9.8.6 11.6-4.4 1.4-4-.1-6.4-3-7.9 2.1-.5 3.7-1.9 4.1-4.8zm-7.5 10.5c-1 4-7.8 1.8-10 1.3l1.8-7.1c2.2.6 9.3 1.7 8.2 5.8zm1-10.6c-.9 3.7-6.6 1.8-8.4 1.3l1.6-6.4c1.9.5 7.8 1.3 6.8 5.1z';
  var HEART = 'M32 56S2 38 2 18C2 8 10 2 18 2c6 0 11 3 14 8 3-5 8-8 14-8 8 0 16 6 16 16 0 20-30 38-30 38z';
  var PATTERNS = {
    none: function () { return { img: 'none' }; },
    pinstripe: function (k, c) { return { img: 'linear-gradient(90deg, ' + c + ' 0 12%, transparent 12%)', size: (1.4 * k).toFixed(3) + 'em 100%', repeat: 'repeat-x' }; },
    corduroy: function (k, c) { return { img: 'linear-gradient(90deg, transparent, ' + c + ' 50%, transparent)', size: (0.9 * k).toFixed(3) + 'em 100%', repeat: 'repeat-x' }; },
    diagonal: function (k, c) { return { img: 'linear-gradient(45deg, ' + c + ' 0 25%, transparent 25% 50%, ' + c + ' 50% 75%, transparent 75%)', size: tile(k, 1.2) }; },
    grid: function (k, c) { var t = tile(k, 1.4); return { img: 'linear-gradient(' + c + ' 0 8%, transparent 8%), linear-gradient(90deg, ' + c + ' 0 8%, transparent 8%)', size: t + ', ' + t }; },
    crosshatch: function (k, c) { var t = tile(k, 1.2); return { img: 'linear-gradient(45deg, transparent 47%, ' + c + ' 47% 53%, transparent 53%), linear-gradient(-45deg, transparent 47%, ' + c + ' 47% 53%, transparent 53%)', size: t + ', ' + t }; },
    quilted: function (k, c) { var t = tile(k, 2.2); return { img: 'linear-gradient(45deg, transparent 45%, ' + c + ' 45% 55%, transparent 55%), linear-gradient(-45deg, transparent 45%, ' + c + ' 45% 55%, transparent 55%)', size: t + ', ' + t }; },
    checker: function (k, c) { return { img: 'conic-gradient(' + c + ' 25%, transparent 0 50%, ' + c + ' 0 75%, transparent 0)', size: tile(k, 1.2) }; },
    houndstooth: function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="0 0 8 8"><path fill="' + c + '" d="M0 0h4v4H0zM4 4h4v4H4zM4 0l4 4V2L6 0zM0 4l4 4H2L0 6zM4 4L2 2h2zM4 4l2 2H4z"/></svg>'), size: tile(k, 1.4) }; },
    herringbone: function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="0 0 20 20"><path stroke="' + c + '" stroke-width="3" fill="none" d="M0 0l10 10M0 10l10 10M-10 10L0 20M10 0l10 -10M10 10L20 0M10 20l10-10M20 20l10-10"/></svg>'), size: tile(k, 1.6) }; },
    chevron: function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="0 0 20 10"><polyline fill="none" stroke="' + c + '" stroke-width="2.5" points="0,9 10,1 20,9"/></svg>'), size: (1.6 * k).toFixed(3) + 'em ' + (0.8 * k).toFixed(3) + 'em' }; },
    waves: function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="0 0 20 10"><path fill="none" stroke="' + c + '" stroke-width="2" d="M0 5q5-5 10 0t10 0"/></svg>'), size: (1.6 * k).toFixed(3) + 'em ' + (0.8 * k).toFixed(3) + 'em' }; },
    dots: function (k, c) { return { img: 'radial-gradient(circle, ' + c + ' 0 18%, transparent 21%)', size: tile(k, 1.2) }; },
    'btc-tile': function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="8 6 48 52"><path fill="' + c + '" d="' + BTC + '"/></svg>'), size: tile(k, 2) }; },
    'heart-tile': function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="-14 -14 92 86"><path fill="' + c + '" d="' + HEART + '"/></svg>'), size: tile(k, 2) }; },
    'star-tile': function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="0 0 20 20"><polygon fill="' + c + '" points="10,3 11.8,8 17,8 12.8,11 14.4,16 10,13 5.6,16 7.2,11 3,8 8.2,8"/></svg>'), size: tile(k, 1.8) }; },
    'rabbit-tile': function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="0 0 24 24"><g fill="' + c + '"><ellipse cx="9" cy="7" rx="2" ry="5.5" transform="rotate(-10 9 7)"/><ellipse cx="15" cy="7" rx="2" ry="5.5" transform="rotate(10 15 7)"/><circle cx="12" cy="15" r="5"/></g></svg>'), size: tile(k, 2) }; },
    'film-tile': function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="0 0 24 16"><g fill="' + c + '"><rect x="0" y="0" width="24" height="3"/><rect x="0" y="13" width="24" height="3"/><rect x="2" y="5" width="8" height="6" rx="1"/><rect x="14" y="5" width="8" height="6" rx="1"/></g></svg>'), size: (2.4 * k).toFixed(3) + 'em ' + (1.6 * k).toFixed(3) + 'em' }; },
    bitcoin: function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="' + c + '"/><path fill="' + cfg.color + '" d="' + BTC + '"/></svg>'), size: (34 * k).toFixed(0) + '% auto', repeat: 'no-repeat', pos: '50% 26%' }; },
    heart: function (k, c) { return { img: svg('<svg ' + NS + ' viewBox="0 0 64 58"><path fill="' + c + '" d="' + HEART + '"/></svg>'), size: (34 * k).toFixed(0) + '% auto', repeat: 'no-repeat', pos: '50% 26%' }; }
  };

  function applyLook() {
    var p = (PATTERNS[cfg.pattern] || PATTERNS.none)(cfg.patternScale, cfg.patternColor);
    host.style.setProperty('--sr-seat', cfg.color);
    host.style.setProperty('--sr-pattern', p.img);
    host.style.setProperty('--sr-pattern-size', p.size || 'auto');
    host.style.setProperty('--sr-pattern-repeat', p.repeat || 'repeat');
    host.style.setProperty('--sr-pattern-pos', p.pos || 'center');
    host.style.setProperty('--sr-pattern-op', String(cfg.patternStrength));
    host.style.setProperty('--sr-aisle-op', String(cfg.aisle));
  }

  /* ---- rows ---- */
  function buildRow() {
    var el = document.createElement('div');
    el.className = 'sr-row';
    var html = '';
    for (var j = 0; j < 34; j++) {
      if (j === 10 || j === 24) html += '<span class="sr-aisle"><i></i></span>';
      html += '<span class="sr-seat"><i></i></span>';
    }
    el.innerHTML = html;
    return el;
  }

  function build() {
    W = window.innerWidth;
    H = window.innerHeight;
    // Phones keep a physically large seat: about three across at 1.3x.
    var sw = Math.round((W < 700 ? W / 4.2 : Math.max(W / 7, H * 0.11)) * cfg.size);
    host.style.setProperty('--sr-w', sw + 'px');
    host.style.setProperty('--sr-arm', Math.round(sw * cfg.arms) + 'px');
    host.textContent = '';
    rows = [];
    for (var i = 0; i < 3; i++) {
      var el = buildRow();
      host.appendChild(el);
      rows.push({ el: el, w: el.offsetWidth, h: el.offsetHeight });
    }
  }

  // Rows sit on a raked floor; d is the distance in rows ahead of the viewer.
  // Geometry is in seat heights, so phones and laptops compose the same.
  function walk(k) {
    var h = rows[0].h;
    var lower = W < 700 ? cfg.posPhone : cfg.pos;
    var P = 1.2 * H, D = 0.8 * H, drop = 0.49 * h, eye = 1.83 * h;
    var hz = H + (0.37 + lower) * h - eye;
    rows.forEach(function (r, i) {
      var st = r.el.style;
      var d = i - k;
      if (d <= -0.95) { st.visibility = 'hidden'; return; }
      var s = P / (P + D * d);
      var y = hz + (eye + drop * d) * s;
      var cx = W / 2 - mx * 0.07 * W * s;
      st.visibility = 'visible';
      st.transform = 'translate(' + (cx - r.w / 2).toFixed(1) + 'px,' + (y - r.h).toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
      st.filter = 'brightness(' + ((0.5 + 0.1 * Math.max(0, d)) * cfg.light).toFixed(2) + ')';
      st.zIndex = String(1000 - Math.round(d * 100));
    });
  }

  function frame() {
    ticking = false;
    var motion = !reduce.matches;
    var max = Math.max(1, doc.scrollHeight - H);
    var target = motion ? clamp(window.scrollY / max, 0, 1) : 0;
    var targetMx = motion ? mxT * cfg.look : 0;
    // Ease toward the targets so the room glides after the scroll.
    ps += (target - ps) * 0.09;
    mx += (targetMx - mx) * 0.06;
    if (Math.abs(target - ps) < 0.0004) ps = target;
    if (Math.abs(targetMx - mx) < 0.0005) mx = targetMx;
    if (ps !== target || mx !== targetMx) request();
    walk(ps * cfg.walk);
  }

  function request() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(frame);
  }

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mxT = clamp((e.clientX / W) * 2 - 1, -1, 1);
    request();
  }, { passive: true });
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { build(); request(); }, 120);
  });
  // Soft navigation swaps page content and changes the page height without a
  // resize; re-read the scroll range whenever the document grows or shrinks.
  if ('ResizeObserver' in window) new ResizeObserver(request).observe(document.body);

  applyLook();
  build();
  doc.classList.add('seat-rows-live');
  frame();
})();
