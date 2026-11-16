import * as THREE from 'three';

/**
 * Deterministic pseudo-random generator for pure React 19 render & memo computations.
 */
export function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Generates a high-resolution circular dark walnut wood texture using HTML5 Canvas.
 * Creates realistic concentric grain rings, natural wood grain variation, and perimeter groove.
 */
export function createWoodPlatterTextures() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const cx = size / 2;
  const cy = size / 2;
  let stepSeed = 1;
  const nextRand = () => {
    stepSeed += 1;
    return seededRandom(stepSeed);
  };

  // Deep dark walnut culinary board gradient
  const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, size * 0.48);
  grad.addColorStop(0, '#1b120c');
  grad.addColorStop(0.4, '#150d08');
  grad.addColorStop(0.75, '#110a06');
  grad.addColorStop(0.92, '#0c0704');
  grad.addColorStop(1, '#070402');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Concentric tree rings and wood fibers
  ctx.save();
  ctx.translate(cx, cy);

  for (let r = 8; r < size * 0.48; r += 2 + nextRand() * 3.5) {
    ctx.beginPath();
    const ringAlpha = 0.06 + nextRand() * 0.1;
    const isDark = nextRand() > 0.4;
    ctx.strokeStyle = isDark ? `rgba(6, 3, 2, ${ringAlpha})` : `rgba(45, 28, 18, ${ringAlpha})`;
    ctx.lineWidth = 1 + nextRand() * 2.5;

    // Organic wobble to rings
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const wobble = Math.sin(angle * 7) * 2 + Math.cos(angle * 13) * 1.5;
      const x = (r + wobble) * Math.cos(angle);
      const y = (r + wobble) * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Radial ray lines / wood medullary rays
  for (let i = 0; i < 360; i += 3 + nextRand() * 6) {
    const angle = (i * Math.PI) / 180;
    const len = size * 0.12 + nextRand() * size * 0.35;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(35, 22, 14, ${0.03 + nextRand() * 0.04})`;
    ctx.lineWidth = 1 + nextRand() * 1.5;
    ctx.moveTo(Math.cos(angle) * 15, Math.sin(angle) * 15);
    ctx.lineTo(Math.cos(angle) * len, Math.sin(angle) * len);
    ctx.stroke();
  }

  // Fine linear wood grain overlay
  ctx.restore();
  ctx.save();
  for (let y = 0; y < size; y += 3) {
    ctx.fillStyle = nextRand() > 0.5 ? 'rgba(0,0,0,0.03)' : 'rgba(55,34,22,0.025)';
    ctx.fillRect(0, y, size, 1 + nextRand() * 2);
  }
  ctx.restore();

  // Juice groove ring indentation (carved groove 5% from rim)
  ctx.save();
  ctx.translate(cx, cy);
  const grooveRadius = size * 0.44;
  ctx.beginPath();
  ctx.arc(0, 0, grooveRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(4, 2, 1, 0.85)';
  ctx.lineWidth = 7;
  ctx.stroke();

  // Subtle inner highlight of groove
  ctx.beginPath();
  ctx.arc(0, 0, grooveRadius - 3.5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(50, 32, 22, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Outer beveled edge
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.485, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(55, 36, 24, 0.45)';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.restore();

  // Diffuse texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  // Roughness Map Canvas
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');
  rCtx.fillStyle = '#aaaaaa'; // Roughness ~0.65
  rCtx.fillRect(0, 0, size, size);

  rCtx.save();
  rCtx.translate(cx, cy);
  rCtx.beginPath();
  rCtx.arc(0, 0, grooveRadius, 0, Math.PI * 2);
  rCtx.strokeStyle = '#555555';
  rCtx.lineWidth = 7;
  rCtx.stroke();
  rCtx.restore();

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);

  return { texture, roughnessMap };
}

/**
 * Creates parchment paper texture for the fry basket liner
 */
export function createParchmentTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f3ede4';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 350; i++) {
    const x = seededRandom(i * 11 + 1) * size;
    const y = seededRandom(i * 11 + 2) * size;
    const len = 10 + seededRandom(i * 11 + 3) * 35;
    const angle = seededRandom(i * 11 + 4) * Math.PI;
    ctx.strokeStyle =
      seededRandom(i * 11 + 5) > 0.5
        ? 'rgba(200, 185, 165, 0.22)'
        : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(-0.2);
  ctx.fillStyle = 'rgba(150, 120, 90, 0.18)';
  ctx.font = 'bold 34px "Bebas Neue", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("ROCKY'S CRAFT BURGERS", 0, -18);
  ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('EST. 2024 • CRISPY & FRESH', 0, 12);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
