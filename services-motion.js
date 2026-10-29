(() => {
  const section = document.querySelector('#diensten');
  const cards = [...document.querySelectorAll('#diensten .service-card')];
  if (!section || cards.length < 3) return;

  cards.forEach((card) => {
    const orbit = document.createElement('span');
    orbit.className = 'card-hover-orbit';
    orbit.setAttribute('aria-hidden', 'true');
    card.appendChild(orbit);
    card.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'mouse') return;
      card.classList.add('is-hovered');
    });
    card.addEventListener('pointerleave', () => card.classList.remove('is-hovered'));
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const update = () => {
    if (reduceMotion.matches) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(section.offsetHeight - window.innerHeight, 600);
    const progress = clamp((window.scrollY - sectionTop + window.innerHeight * .55) / travel, 0, 2);
    const starts = [0, .28, .56];
    const exitStarts = [0, .2, .4];

    cards.forEach((card, index) => {
      const localProgress = clamp((Math.min(progress, 1) - starts[index]) / .34, 0, 1);
      const exitProgress = clamp((progress - 1 - exitStarts[index]) / .35, 0, 1);
      const distance = clamp(card.offsetHeight * .58, 110, 180);
      const exitDistance = window.innerHeight * 1.05 + index * 45;
      card.style.setProperty('--service-lift', (-distance * localProgress - exitDistance * exitProgress) + 'px');
      card.style.setProperty('--service-opacity', 1 - exitProgress);
    });
  };

  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  reduceMotion.addEventListener?.('change', update);
  update();
})();
