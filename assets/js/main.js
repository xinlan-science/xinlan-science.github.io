(function () {
  var root = document.documentElement;

  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  Array.prototype.forEach.call(document.querySelectorAll('.theme-toggle'), function (b) {
    b.addEventListener('click', function () { setTheme(isDark() ? 'light' : 'dark'); });
  });

  var nav = document.getElementById('nav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var openBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  var closeBtn = menu && menu.querySelector('.menu-close');
  var behind = document.querySelectorAll('.nav, #main, .site-footer');
  function setInert(on) {
    Array.prototype.forEach.call(behind, function (el) {
      if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert');
    });
  }
  function openMenu() {
    menu.hidden = false;
    document.body.classList.add('menu-open');
    openBtn.setAttribute('aria-expanded', 'true');
    setInert(true);
    var first = menu.querySelector('.mm-links a');
    if (first) first.focus();
  }
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    document.body.classList.remove('menu-open');
    openBtn.setAttribute('aria-expanded', 'false');
    setInert(false);
    openBtn.focus();
  }
  if (openBtn && menu) {
    openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    menu.addEventListener('click', function (e) { if (e.target === menu) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) closeMenu(); });
  }

  Array.prototype.forEach.call(document.querySelectorAll('a[href^="http"]'), function (a) {
    if (a.hostname !== window.location.hostname) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    }
  });

  var pills = document.querySelectorAll('.subnav a[href^="#"]');
  if (pills.length && 'IntersectionObserver' in window) {
    var map = {};
    Array.prototype.forEach.call(pills, function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Array.prototype.forEach.call(pills, function (a) { a.classList.remove('is-active'); });
        var a = map[en.target.id];
        if (a) a.classList.add('is-active');
      });
    }, { rootMargin: '-140px 0px -60% 0px' });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();
