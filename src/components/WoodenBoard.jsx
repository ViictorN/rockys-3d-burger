import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createWoodPlatterTextures } from '../utils/proceduralTextures';

export default function WoodenBoard() {
  const { texture, roughnessMap } = useMemo(() => createWoodPlatterTextures(), []);

  // Beveled circular platter geometry:
  const boardGeo = useMemo(() => {
    return new THREE.CylinderGeometry(2.05, 1.95, 0.22, 96, 4);
  }, []);

  // Dark rustic oiled walnut wood material
  const topMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughnessMap: roughnessMap,
      roughness: 0.65,
      metalness: 0.04,
      bumpMap: texture,
      bumpScale: 0.012,
      color: new THREE.Color('#221610'),
    });
  }, [texture, roughnessMap]);

  const sideMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      roughness: 0.75,
      metalness: 0.03,
      color: new THREE.Color('#140c08'),
      bumpScale: 0.02,
    });
  }, []);

  return (
    <group position={[0, -0.11, 0]}>
      {/* Wooden circular platter */}
      <mesh
        geometry={boardGeo}
        material={[sideMaterial, topMaterial, sideMaterial]}
        castShadow
        receiveShadow
      />

      {/* Subtle outer dark edge ring rim */}
      <mesh position={[0, 0.112, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.98, 2.05, 96]} />
        <meshBasicMaterial color="#2d1c14" opacity={0.7} transparent />
      </mesh>

      {/* Realistic contact shadow directly beneath wooden slab */}
      <mesh position={[0, -0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 2.25, 64]} />
        <meshBasicMaterial color="#000000" opacity={0.65} transparent />
      </mesh>
    </group>
  );
}
