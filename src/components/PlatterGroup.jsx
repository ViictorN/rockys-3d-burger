import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import WoodenBoard from './WoodenBoard';
import BurgerModel from './BurgerModel';
import FryBasket from './FryBasket';
import SteamParticles from './SteamParticles';
import AnimatedLines3D from './AnimatedLines3D';
import IngredientCallouts from './IngredientCallouts';

export default function PlatterGroup({
  burgerType = 'chicken',
  isTransitioning = false,
  showLines = true,
  showCallouts = false,
  tourPlaying = false,
  manualRotation = { x: 0, y: 0 },
  pointerPos = { x: 0, y: 0 },
}) {
  const groupRef = useRef();
  const transitionSpin = useRef(0);

  // Model file paths
  const modelPaths = {
    chicken: '/models/burger_chicken.glb',
    smash: '/models/burger_smash.glb',
    triple: '/models/burger_triple.glb',
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Base pitch forward (around 15 degrees)
    const basePitch = THREE.MathUtils.degToRad(15);

    let targetRotX = basePitch;
    let targetRotY = 0;

    if (tourPlaying) {
      // Gentle turntable rotation during tour
      targetRotY = t * 0.4;
      targetRotX = basePitch + Math.sin(t * 0.8) * 0.08;
    } else {
      // Interactive pointer tilt & drag
      targetRotX = basePitch - pointerPos.y * 0.18 + manualRotation.x * 0.8;
      targetRotY = pointerPos.x * 0.25 + manualRotation.y * 1.2;

      // Subtle resting idle float
      targetRotY += Math.sin(t * 0.6) * 0.025;
    }

    if (isTransitioning) {
      transitionSpin.current += delta * 9;
      targetRotY += transitionSpin.current;
    } else {
      transitionSpin.current = 0;
    }

    // Smooth spring interpolation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
  });

  return (
    <group
      ref={groupRef}
      position={[0.22, -0.35, 0]}
      scale={[0.84, 0.84, 0.84]}
    >
      {/* Dark Rustic Circular Wooden Platter */}
      <WoodenBoard />

      {/* Main 3D Burger */}
      <BurgerModel
        modelPath={modelPaths[burgerType] || modelPaths.chicken}
        targetSize={1.75}
        position={[-0.32, 0.02, 0.05]}
        rotation={[0, 0.35, 0]}
        isTransitioning={isTransitioning}
      />

      {/* Miniature Wire Fry Basket with Golden French Fries */}
      <FryBasket
        position={[0.82, 0.02, -0.15]}
        rotation={[0, -0.22, 0]}
      />

      {/* Rising Steam and Heat Aroma Wisps */}
      <SteamParticles count={28} />

      {/* Animated 3D Kinetic Lines and Radar Base */}
      <AnimatedLines3D isActive={showLines} />

      {/* Interactive Ingredient HUD Callouts */}
      <IngredientCallouts visible={showCallouts} burgerType={burgerType} />
    </group>
  );
}
