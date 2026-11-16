import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraRig({
  tourPlaying = false,
  tourProgress = 0,
  activeAngle = 'hero',
  pointerPos = { x: 0, y: 0 },
  manualRotation = { x: 0, y: 0 },
}) {
  const { camera } = useThree();
  const currentPos = useRef(new THREE.Vector3(0.2, 1.45, 5.0));
  const currentLookAt = useRef(new THREE.Vector3(0.2, 0.45, 0));

  const angleTargets = {
    hero: {
      pos: new THREE.Vector3(0.2, 1.45, 5.0),
      lookAt: new THREE.Vector3(0.2, 0.45, 0),
    },
    top: {
      pos: new THREE.Vector3(0.2, 4.2, 2.0),
      lookAt: new THREE.Vector3(0.2, 0.3, 0),
    },
    macro: {
      pos: new THREE.Vector3(-0.5, 0.75, 2.6),
      lookAt: new THREE.Vector3(-0.15, 0.55, 0.05),
    },
    side: {
      pos: new THREE.Vector3(2.6, 1.3, 3.4),
      lookAt: new THREE.Vector3(0.3, 0.45, 0),
    },
  };

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const targetPos = new THREE.Vector3();
    const targetLookAt = new THREE.Vector3();

    if (tourPlaying) {
      const p = tourProgress % 1;

      if (p < 0.25) {
        const alpha = p / 0.25;
        const ease = THREE.MathUtils.smoothstep(alpha, 0, 1);
        targetPos.lerpVectors(angleTargets.hero.pos, angleTargets.top.pos, ease);
        targetLookAt.lerpVectors(angleTargets.hero.lookAt, angleTargets.top.lookAt, ease);
      } else if (p < 0.5) {
        const alpha = (p - 0.25) / 0.25;
        const ease = THREE.MathUtils.smoothstep(alpha, 0, 1);
        targetPos.lerpVectors(angleTargets.top.pos, angleTargets.macro.pos, ease);
        targetLookAt.lerpVectors(angleTargets.top.lookAt, angleTargets.macro.lookAt, ease);
      } else if (p < 0.75) {
        const alpha = (p - 0.5) / 0.25;
        const ease = THREE.MathUtils.smoothstep(alpha, 0, 1);
        targetPos.lerpVectors(angleTargets.macro.pos, angleTargets.side.pos, ease);
        targetLookAt.lerpVectors(angleTargets.macro.lookAt, angleTargets.side.lookAt, ease);
      } else {
        const alpha = (p - 0.75) / 0.25;
        const ease = THREE.MathUtils.smoothstep(alpha, 0, 1);
        targetPos.lerpVectors(angleTargets.side.pos, angleTargets.hero.pos, ease);
        targetLookAt.lerpVectors(angleTargets.side.lookAt, angleTargets.hero.lookAt, ease);
      }

      targetPos.x += Math.sin(t * 1.2) * 0.12;
      targetPos.y += Math.cos(t * 0.9) * 0.06;
    } else {
      const selected = angleTargets[activeAngle] || angleTargets.hero;
      targetPos.copy(selected.pos);
      targetLookAt.copy(selected.lookAt);

      targetPos.x += pointerPos.x * 0.35 + manualRotation.y * 1.2;
      targetPos.y += -pointerPos.y * 0.25 + manualRotation.x * 1.0;
      targetPos.y += Math.sin(t * 1.2) * 0.015;
    }

    currentPos.current.lerp(targetPos, 0.07);
    currentLookAt.current.lerp(targetLookAt, 0.07);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
