
// Static-site interactivity: theme toggle, mobile menu, active nav.
(function(){
  // Theme toggle
  function applyTheme(dark){
    document.documentElement.classList.toggle('dark', dark);
    document.querySelectorAll('[data-theme-toggle]').forEach(function(b){
      b.innerHTML = dark
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    });
  }
  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme(prefersDark);
  } catch(e){}
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-theme-toggle]');
    if (t){
      var dark = !document.documentElement.classList.contains('dark');
      applyTheme(dark);
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch(e){}
      return;
    }
    var m = e.target.closest('[data-menu-toggle]');
    if (m){
      var nav = document.querySelector('[data-mobile-nav]');
      if (nav){ nav.toggleAttribute('hidden'); }
    }
  });
})();
