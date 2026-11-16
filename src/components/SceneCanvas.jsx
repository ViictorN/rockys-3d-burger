import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import PlatterGroup from './PlatterGroup';
import CameraRig from './CameraRig';

function SceneLoader() {
  return (
    <mesh position={[0, 0, 0]}>
      <ringGeometry args={[0.9, 1.0, 32]} />
      <meshBasicMaterial color="#f59e0b" wireframe />
    </mesh>
  );
}

export default function SceneCanvas({
  burgerType = 'chicken',
  isTransitioning = false,
  showLines = true,
  showCallouts = true,
  tourPlaying = false,
  tourProgress = 0,
  activeAngle = 'hero',
  pointerPos = { x: 0, y: 0 },
  manualRotation = { x: 0, y: 0 },
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 1.35, 4.4], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.28,
        powerPreference: 'high-performance',
      }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <ambientLight color="#2e1f18" intensity={1.4} />

      <spotLight
        position={[-3, 6, 4]}
        angle={0.5}
        penumbra={0.7}
        intensity={3.2}
        color="#fff4e6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      <directionalLight position={[0, 4, -4]} intensity={3.8} color="#ffa336" />
      <directionalLight position={[3, 2, 2]} intensity={1.2} color="#ffecd6" />
      <directionalLight position={[0, -3, 2]} intensity={0.4} color="#708aa8" />

      <ContactShadows
        position={[0, -0.58, 0]}
        opacity={0.75}
        scale={6}
        blur={2.4}
        far={3.5}
        color="#050302"
      />

      <Suspense fallback={<SceneLoader />}>
        <PlatterGroup
          burgerType={burgerType}
          isTransitioning={isTransitioning}
          showLines={showLines}
          showCallouts={showCallouts}
          tourPlaying={tourPlaying}
          manualRotation={manualRotation}
          pointerPos={pointerPos}
        />

        <CameraRig
          tourPlaying={tourPlaying}
          tourProgress={tourProgress}
          activeAngle={activeAngle}
          pointerPos={pointerPos}
          manualRotation={manualRotation}
        />
      </Suspense>
    </Canvas>
  );
}
