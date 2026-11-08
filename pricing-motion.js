(() => {
  const section = document.querySelector('#prijzen');
  const cards = [...document.querySelectorAll('.price-card')];
  const cta = document.querySelector('.pricing-cta');
  const browser = document.querySelector('.desktop-browser');
  const closeBrowser = browser?.querySelector('.browser-dot-close');
  if (!section || !cards.length) return;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const rotations = [-9, 7, -5];
  const starts = [0, .18, .36];
  let syncLineFromPointer = () => {};
  const update = () => {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
    const progress = clamp((window.scrollY - sectionTop + window.innerHeight * .5) / travel, 0, 1);
    const sceneProgress = clamp((progress - .76) / .24, 0, 1);
    section.classList.toggle('scene-mode', sceneProgress > .05);
    section.style.setProperty('--scene-opacity', sceneProgress);
    section.style.setProperty('--scene-preview-opacity', clamp((sceneProgress - .12) / .88, 0, 1));
    const browserProgress = clamp(sceneProgress / .9, 0, 1);
    section.style.setProperty('--browser-left', `${50 - browserProgress * 19}%`);
    section.style.setProperty('--browser-top', `${50 + browserProgress * 19}%`);
    section.style.setProperty('--browser-scale', `${1.08 - browserProgress * .08}`);
    section.style.setProperty('--browser-opacity', clamp(sceneProgress / .16, 0, 1));
    section.style.setProperty('--deck-opacity', 1 - clamp(sceneProgress * 1.35, 0, 1));
    section.style.setProperty('--scene-scale', 1 - sceneProgress * .52);
    section.style.setProperty('--scene-x', `${-6 * sceneProgress}vw`);
    section.style.setProperty('--scene-y', `${49 * sceneProgress}vh`);
    cta?.classList.toggle('is-released', progress >= .98);
    syncLineFromPointer();
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

  closeBrowser?.addEventListener('click', () => {
    browser.classList.add('is-closed');
  });

  const line = document.querySelector('.pricing-cta-line');
  const circle = line?.querySelector('.pricing-cta-circle');
  let hideTimer;
  if (line && circle) {
    let pointerPosition = null;
    syncLineFromPointer = () => {
      if (!pointerPosition) return;
      const bounds = line.getBoundingClientRect();
      const isOver = pointerPosition.clientX >= bounds.left
        && pointerPosition.clientX <= bounds.right
        && pointerPosition.clientY >= bounds.top
        && pointerPosition.clientY <= bounds.bottom;
      if (!isOver) {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => line.classList.remove('is-active'), 450);
        return;
      }
      clearTimeout(hideTimer);
      line.classList.add('is-active');
      const x = Math.min(bounds.width, Math.max(0, pointerPosition.clientX - bounds.left));
      line.style.setProperty('--line-x', `${(x / bounds.width) * 100}%`);
    };
    window.addEventListener('pointermove', (event) => {
      pointerPosition = {clientX: event.clientX, clientY: event.clientY};
      syncLineFromPointer();
    }, {passive:true});
    line.addEventListener('pointerenter', () => {
      clearTimeout(hideTimer);
      line.classList.add('is-active');
    });
    line.addEventListener('pointermove', (event) => {
      const bounds = line.getBoundingClientRect();
      const x = Math.min(bounds.width, Math.max(0, event.clientX - bounds.left));
      line.style.setProperty('--line-x', `${(x / bounds.width) * 100}%`);
    });
    line.addEventListener('pointerleave', () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => line.classList.remove('is-active'), 450);
    });
  }
})();
