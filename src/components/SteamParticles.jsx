import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRandom } from '../utils/proceduralTextures';

export default function SteamParticles({ count = 35 }) {
  const pointsRef = useRef();

  // Deterministic particle initial positions & velocities (pure for React 19)
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const base = i * 17;
      const isBurger = seededRandom(base + 1) > 0.35;
      const originX = isBurger
        ? -0.35 + (seededRandom(base + 2) - 0.5) * 0.7
        : 0.85 + (seededRandom(base + 3) - 0.5) * 0.4;
      const originZ = isBurger
        ? 0.05 + (seededRandom(base + 4) - 0.5) * 0.6
        : -0.15 + (seededRandom(base + 5) - 0.5) * 0.4;

      pos[i * 3 + 0] = originX;
      pos[i * 3 + 1] = 0.5 + seededRandom(base + 6) * 0.9;
      pos[i * 3 + 2] = originZ;

      vel[i * 3 + 0] = (seededRandom(base + 7) - 0.5) * 0.005;
      vel[i * 3 + 1] = 0.006 + seededRandom(base + 8) * 0.008;
      vel[i * 3 + 2] = (seededRandom(base + 9) - 0.5) * 0.005;
    }

    return { positions: pos, velocities: vel };
  }, [count]);

  const geo = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [positions]);

  useEffect(() => {
    return () => {
      geo.dispose();
    };
  }, [geo]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArray = posAttr.array;
    const t = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      posArray[idx + 1] += velocities[idx + 1];
      posArray[idx + 0] += Math.sin(t * 1.5 + i) * 0.002;
      posArray[idx + 2] += Math.cos(t * 1.2 + i) * 0.002;

      if (posArray[idx + 1] > 2.2) {
        const isBurger = Math.random() > 0.35;
        posArray[idx + 0] = isBurger
          ? -0.35 + (Math.random() - 0.5) * 0.6
          : 0.85 + (Math.random() - 0.5) * 0.35;
        posArray[idx + 1] = 0.4 + Math.random() * 0.2;
        posArray[idx + 2] = isBurger
          ? 0.05 + (Math.random() - 0.5) * 0.5
          : -0.15 + (Math.random() - 0.5) * 0.35;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <pointsMaterial
        size={0.18}
        color="#ffe8d1"
        transparent
        opacity={0.16}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
