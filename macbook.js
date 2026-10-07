import * as THREE from 'three';

const canvasHost = document.querySelector('#macbook-canvas');
const toggle = document.querySelector('.device-toggle');

if (canvasHost) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.25, 7.2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  canvasHost.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x6e6e6e, 2.5));
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xb9c8e8, 1.4);
  fillLight.position.set(-4, 2, 2);
  scene.add(fillLight);

  const laptop = new THREE.Group();
  laptop.position.set(1.8, -0.35, 0);
  laptop.rotation.set(0.06, -0.9, -0.08);
  scene.add(laptop);

  const aluminium = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, metalness: 0.78, roughness: 0.27 });
  const darkAluminium = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.68, roughness: 0.3 });
  const black = new THREE.MeshStandardMaterial({ color: 0x090909, metalness: 0.18, roughness: 0.25 });
  const screenGlow = new THREE.MeshStandardMaterial({ color: 0x20242a, emissive: 0x101319, emissiveIntensity: 0.7, roughness: 0.2 });
  const keyboardMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, metalness: 0.35, roughness: 0.45 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.18, 2.18), aluminium);
  base.position.y = -0.6;
  laptop.add(base);

  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.035, 1.23), keyboardMat);
  keyboard.position.set(0, -0.49, -0.03);
  laptop.add(keyboard);

  const trackpad = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.025, 0.62), darkAluminium);
  trackpad.position.set(0, -0.465, 0.65);
  laptop.add(trackpad);

  const hinge = new THREE.Group();
  hinge.position.set(0, -0.51, -0.98);
  hinge.rotation.x = 0.08;
  laptop.add(hinge);

  const lid = new THREE.Group();
  lid.position.set(0, 0.94, 0);
  hinge.add(lid);

  const screenBack = new THREE.Mesh(new THREE.BoxGeometry(3.25, 1.9, 0.13), darkAluminium);
  lid.add(screenBack);

  const screen = new THREE.Mesh(new THREE.BoxGeometry(2.93, 1.58, 0.035), screenGlow);
  screen.position.z = 0.082;
  lid.add(screen);

  const cameraDot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), black);
  cameraDot.position.set(0, 0.69, 0.11);
  lid.add(cameraDot);

  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), new THREE.MeshBasicMaterial({ color: 0xd8d8d8 }));
  logo.rotation.x = Math.PI / 2;
  logo.position.set(0, 0.1, -0.08);
  lid.add(logo);

  let targetLidRotation = 0.08;
  let targetSpin = -0.9;
  let targetX = 0.12;
  let dragging = false;
  let lastX = 0;

  const setSize = () => {
    const width = Math.max(canvasHost.clientWidth, 1);
    const height = Math.max(canvasHost.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    laptop.scale.setScalar(width < 800 ? 0.86 : 1);
  };

  const setOpen = open => {
    targetLidRotation = open ? 0.08 : 1.48;
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = `${open ? 'Sluit laptop' : 'Open laptop'} <span>↗</span>`;
    }
  };

  toggle?.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  canvasHost.addEventListener('pointerdown', event => {
    dragging = true;
    lastX = event.clientX;
    canvasHost.setPointerCapture(event.pointerId);
  });
  canvasHost.addEventListener('pointermove', event => {
    if (!dragging) return;
    targetSpin += (event.clientX - lastX) * 0.008;
    lastX = event.clientX;
  });
  canvasHost.addEventListener('pointerup', () => { dragging = false; });
  canvasHost.addEventListener('pointercancel', () => { dragging = false; });

  const animate = time => {
    requestAnimationFrame(animate);
    const t = time * 0.001;
    targetX = dragging ? targetX : 0.12;
    laptop.position.x += (targetX - laptop.position.x) * 0.035;
    laptop.rotation.y += (targetSpin - laptop.rotation.y) * 0.08;
    laptop.rotation.z = -0.08 + Math.sin(t * 0.8) * 0.025;
    laptop.rotation.x = 0.06 + Math.sin(t * 0.65) * 0.018;
    hinge.rotation.x += (targetLidRotation - hinge.rotation.x) * 0.1;
    renderer.render(scene, camera);
  };

  new ResizeObserver(setSize).observe(canvasHost);
  setSize();
  animate(0);
}
