(() => {
  const menu = document.querySelector('.standard-menu');
  const nav = document.querySelector('.standard-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('open', open);
  });
})();
