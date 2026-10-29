(() => {
  const section = document.querySelector('#prijzen');
  const cards = [...document.querySelectorAll('.price-card')];
  if (!section || !cards.length) return;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const rotations = [-9, 7, -5];
  const starts = [0, .27, .54];
  const update = () => {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    const progress = clamp((window.scrollY - sectionTop + window.innerHeight * .5) / travel, 0, 1);
    cards.forEach((card, index) => {
      const local = clamp((progress - starts[index]) / .3, 0, 1);
      card.style.setProperty('--card-opacity', local);
      card.style.setProperty('--card-y', `${(1 - local) * 72}vh`);
      card.style.setProperty('--card-rotate', `${rotations[index] * (1 - local)}deg`);
    });
  };
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();
