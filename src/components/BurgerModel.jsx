import React, { useMemo, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRandom } from '../utils/proceduralTextures';

export default function BurgerModel({
  modelPath = '/models/burger_chicken.glb',
  targetSize = 1.75,
  position = [-0.35, 0.0, 0.05],
  rotation = [0, 0.25, 0],
  isTransitioning = false,
}) {
  const groupRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Clone scene to allow clean isolation & avoid memory conflicts
  const clonedModel = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        if (node.material) {
          node.material = node.material.clone();
          node.material.roughness = Math.min(node.material.roughness, 0.65);
          node.material.envMapIntensity = 1.25;
          if (node.material.map) {
            node.material.map.colorSpace = THREE.SRGBColorSpace;
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(cloned);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    cloned.position.x = -center.x;
    cloned.position.y = -box.min.y;
    cloned.position.z = -center.z;

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? targetSize / maxDim : 1;
    cloned.scale.setScalar(scale);

    const wrapper = new THREE.Group();
    wrapper.add(cloned);

    return wrapper;
  }, [scene, targetSize]);

  // Lush organic ruffled curly lettuce leaves around the patty
  const { lettuceGroup, leafGeo, lettuceMat } = useMemo(() => {
    const count = 18;
    const geo = new THREE.PlaneGeometry(0.35, 0.35, 8, 8);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const curl = Math.sin(u * 14) * 0.06 + Math.cos(v * 12) * 0.05;
      pos.setZ(i, curl);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: '#439d25',
      roughness: 0.45,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    const group = new THREE.Group();

    for (let i = 0; i < count; i++) {
      const base = i * 31;
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.72 + Math.sin(i * 3.2) * 0.08;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0.28 + Math.sin(i * 2.5) * 0.04;

      const leaf = new THREE.Mesh(geo, mat);
      leaf.position.set(x, y, z);
      leaf.rotation.x = -Math.PI / 2 + (seededRandom(base + 1) - 0.5) * 0.4;
      leaf.rotation.y = angle + Math.PI / 2 + (seededRandom(base + 2) - 0.5) * 0.5;
      leaf.rotation.z = Math.sin(i) * 0.3;
      leaf.scale.setScalar(0.9 + seededRandom(base + 3) * 0.35);
      leaf.castShadow = true;
      leaf.receiveShadow = true;
      group.add(leaf);
    }

    return { lettuceGroup: group, leafGeo: geo, lettuceMat: mat };
  }, []);

  useEffect(() => {
    return () => {
      leafGeo.dispose();
      lettuceMat.dispose();
    };
  }, [leafGeo, lettuceMat]);

  useFrame((state) => {
    if (groupRef.current && !isTransitioning) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 1.8) * 0.012;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive object={clonedModel} />
      <primitive object={lettuceGroup} />
    </group>
  );
}

useGLTF.preload('/models/burger_chicken.glb');
useGLTF.preload('/models/burger_smash.glb');
useGLTF.preload('/models/burger_triple.glb');
