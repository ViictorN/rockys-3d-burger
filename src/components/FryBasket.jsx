import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { createParchmentTexture, seededRandom } from '../utils/proceduralTextures';

export default function FryBasket({ position = [0.85, 0.0, -0.15], rotation = [0, -0.2, 0] }) {
  const paperTexture = useMemo(() => createParchmentTexture(), []);

  const wireMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#2a2b30',
      metalness: 0.92,
      roughness: 0.25,
      envMapIntensity: 1.2,
    });
  }, []);

  const paperMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: paperTexture,
      roughness: 0.9,
      metalness: 0.02,
      color: '#f4ede2',
      side: THREE.DoubleSide,
    });
  }, [paperTexture]);

  const fryMaterials = useMemo(() => {
    const colors = ['#f7b731', '#f5a623', '#e08f1b', '#fa8231', '#d47318'];
    return colors.map(
      (c) =>
        new THREE.MeshStandardMaterial({
          color: c,
          roughness: 0.65,
          metalness: 0.05,
        })
    );
  }, []);

  const fries = useMemo(() => {
    const list = [];
    const count = 32;
    const fryGeo = new THREE.BoxGeometry(0.08, 0.9, 0.08);

    for (let i = 0; i < count; i++) {
      const base = i * 23;
      const spreadX = (seededRandom(base + 1) - 0.5) * 0.42;
      const spreadZ = (seededRandom(base + 2) - 0.5) * 0.32;
      const heightVar = 0.75 + seededRandom(base + 3) * 0.45;
      const posY = 0.45 + (heightVar - 0.9) * 0.5;

      const rotX = (seededRandom(base + 4) - 0.5) * 0.4 + (spreadZ > 0 ? 0.15 : -0.15);
      const rotZ = (seededRandom(base + 5) - 0.5) * 0.4 + (spreadX > 0 ? -0.15 : 0.15);
      const rotY = seededRandom(base + 6) * Math.PI;

      const matIndex = Math.floor(seededRandom(base + 7) * fryMaterials.length);

      list.push({
        position: [spreadX, posY, spreadZ],
        rotation: [rotX, rotY, rotZ],
        scale: [1, heightVar / 0.9, 1],
        material: fryMaterials[matIndex],
      });
    }
    return { list, fryGeo };
  }, [fryMaterials]);

  useEffect(() => {
    return () => {
      paperTexture.dispose();
      wireMaterial.dispose();
      paperMaterial.dispose();
      fryMaterials.forEach((m) => m.dispose());
      fries.fryGeo.dispose();
    };
  }, [paperTexture, wireMaterial, paperMaterial, fryMaterials, fries]);

  const basketWidth = 0.62;
  const basketDepth = 0.52;
  const basketHeight = 0.68;
  const wireThickness = 0.015;

  return (
    <group position={position} rotation={rotation}>
      {[
        [-basketWidth / 2, -basketDepth / 2],
        [basketWidth / 2, -basketDepth / 2],
        [-basketWidth / 2, basketDepth / 2],
        [basketWidth / 2, basketDepth / 2],
      ].map(([x, z], idx) => (
        <mesh
          key={`post-${idx}`}
          position={[x, basketHeight / 2, z]}
          material={wireMaterial}
          castShadow
        >
          <cylinderGeometry args={[wireThickness, wireThickness, basketHeight, 16]} />
        </mesh>
      ))}

      <mesh
        position={[0, basketHeight, -basketDepth / 2]}
        rotation={[0, 0, Math.PI / 2]}
        material={wireMaterial}
      >
        <cylinderGeometry args={[wireThickness, wireThickness, basketWidth, 16]} />
      </mesh>
      <mesh
        position={[0, basketHeight, basketDepth / 2]}
        rotation={[0, 0, Math.PI / 2]}
        material={wireMaterial}
      >
        <cylinderGeometry args={[wireThickness, wireThickness, basketWidth, 16]} />
      </mesh>
      <mesh
        position={[-basketWidth / 2, basketHeight, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={wireMaterial}
      >
        <cylinderGeometry args={[wireThickness, wireThickness, basketDepth, 16]} />
      </mesh>
      <mesh
        position={[basketWidth / 2, basketHeight, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={wireMaterial}
      >
        <cylinderGeometry args={[wireThickness, wireThickness, basketDepth, 16]} />
      </mesh>

      <mesh
        position={[0, 0.02, -basketDepth / 2]}
        rotation={[0, 0, Math.PI / 2]}
        material={wireMaterial}
      >
        <cylinderGeometry args={[wireThickness, wireThickness, basketWidth, 16]} />
      </mesh>
      <mesh
        position={[0, 0.02, basketDepth / 2]}
        rotation={[0, 0, Math.PI / 2]}
        material={wireMaterial}
      >
        <cylinderGeometry args={[wireThickness, wireThickness, basketWidth, 16]} />
      </mesh>
      <mesh
        position={[-basketWidth / 2, 0.02, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={wireMaterial}
      >
        <cylinderGeometry args={[wireThickness, wireThickness, basketDepth, 16]} />
      </mesh>
      <mesh
        position={[basketWidth / 2, 0.02, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={wireMaterial}
      >
        <cylinderGeometry args={[wireThickness, wireThickness, basketDepth, 16]} />
      </mesh>

      {[0.22, 0.44].map((y, ribIdx) => (
        <group key={`rib-${ribIdx}`}>
          <mesh position={[0, y, -basketDepth / 2]} rotation={[0, 0, Math.PI / 2]} material={wireMaterial}>
            <cylinderGeometry args={[wireThickness * 0.7, wireThickness * 0.7, basketWidth, 8]} />
          </mesh>
          <mesh position={[0, y, basketDepth / 2]} rotation={[0, 0, Math.PI / 2]} material={wireMaterial}>
            <cylinderGeometry args={[wireThickness * 0.7, wireThickness * 0.7, basketWidth, 8]} />
          </mesh>
          <mesh position={[-basketWidth / 2, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={wireMaterial}>
            <cylinderGeometry args={[wireThickness * 0.7, wireThickness * 0.7, basketDepth, 8]} />
          </mesh>
          <mesh position={[basketWidth / 2, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={wireMaterial}>
            <cylinderGeometry args={[wireThickness * 0.7, wireThickness * 0.7, basketDepth, 8]} />
          </mesh>
        </group>
      ))}

      <group position={[0, basketHeight * 0.8, basketDepth / 2]}>
        <mesh position={[0, 0.18, 0.22]} rotation={[Math.PI / 3, 0, 0]} material={wireMaterial}>
          <cylinderGeometry args={[wireThickness * 1.2, wireThickness * 1.2, 0.45, 16]} />
        </mesh>
      </group>

      <mesh position={[0, basketHeight * 0.35, 0]} material={paperMaterial} receiveShadow>
        <boxGeometry args={[basketWidth * 0.94, basketHeight * 0.7, basketDepth * 0.94]} />
      </mesh>

      <group>
        {fries.list.map((fry, index) => (
          <mesh
            key={`fry-${index}`}
            geometry={fries.fryGeo}
            material={fry.material}
            position={fry.position}
            rotation={fry.rotation}
            scale={fry.scale}
            castShadow
            receiveShadow
          />
        ))}
      </group>
    </group>
  );
}
