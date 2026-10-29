(() => {
  const section = document.querySelector('#diensten');
  const cards = [...document.querySelectorAll('#diensten .service-card')];
  if (!section || cards.length < 3) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const update = () => {
    if (reduceMotion.matches) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(window.innerHeight * .9, 480);
    const progress = clamp((window.scrollY - sectionTop + window.innerHeight * .62) / travel, 0, 1);
    const starts = [0, .28, .56];

    cards.forEach((card, index) => {
      const localProgress = clamp((progress - starts[index]) / .34, 0, 1);
      const distance = clamp(card.offsetHeight * .58, 110, 180);
      card.style.setProperty('--service-lift', (-distance * localProgress) + 'px');
    });
  };

  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  reduceMotion.addEventListener?.('change', update);
  update();
})();
