(() => {
  const section = document.querySelector('#prijzen');
  const cards = [...document.querySelectorAll('.price-card')];
  const cta = document.querySelector('.pricing-cta');
  if (!section || !cards.length) return;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const rotations = [-9, 7, -5];
  const starts = [0, .27, .54];
  const update = () => {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    const progress = clamp((window.scrollY - sectionTop + window.innerHeight * .5) / travel, 0, 1);
    cta?.classList.toggle('is-released', progress >= .98);
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

  const line = document.querySelector('.pricing-cta-line');
  const circle = line?.querySelector('span');
  if (line && circle) {
    line.addEventListener('pointerenter', () => line.classList.add('is-active'));
    line.addEventListener('pointermove', (event) => {
      const bounds = line.getBoundingClientRect();
      const x = Math.min(bounds.width, Math.max(0, event.clientX - bounds.left));
      line.style.setProperty('--line-x', `${(x / bounds.width) * 100}%`);
    });
    line.addEventListener('pointerleave', () => line.classList.remove('is-active'));
  }
})();
