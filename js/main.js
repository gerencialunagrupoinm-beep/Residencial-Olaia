// OLAIA Sanctuary — minimal JS for navigation + copy
(function () {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = Array.from(document.querySelectorAll('.nav__item'));
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  function setMenu(open) {
    if (!sidebar) return;
    sidebar.classList.toggle('open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = !sidebar.classList.contains('open');
      setMenu(open);
    });
  }

  // Close menu when clicking a link (mobile)
  navLinks.forEach(a => {
    a.addEventListener('click', () => setMenu(false));
  });

  // Active section highlight
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.01 });

  sections.forEach(s => io.observe(s));

  // Copy box
  const copyBox = document.querySelector('.copybox');
  if (copyBox) {
    const btn = copyBox.querySelector('button');
    const payload = copyBox.getAttribute('data-copy') || copyBox.innerText;
    if (btn) {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(payload);
          const prev = btn.textContent;
          btn.textContent = 'Copiado ✓';
          setTimeout(() => btn.textContent = prev, 1200);
        } catch (e) {
          alert('No se pudo copiar automáticamente. Copia el texto manualmente.');
        }
      });
    }
  }

  // Close sidebar if user taps outside (mobile)
  document.addEventListener('click', (e) => {
    if (!sidebar || !sidebar.classList.contains('open')) return;
    const isInside = sidebar.contains(e.target) || (menuBtn && menuBtn.contains(e.target));
    if (!isInside) setMenu(false);
  });
})();