import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AnimatedLines3D({ isActive = true }) {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const orbitalRef = useRef();
  const trailingDotRef = useRef();

  // Smooth orbital spline trajectory around the platter
  const curvePoints = useMemo(() => {
    const points = [];
    const count = 100;
    for (let i = 0; i <= count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const r = 2.45 + Math.sin(theta * 2) * 0.15;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const y = Math.sin(theta * 2) * 0.4 + 0.35;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curvePoints, 128, 0.009, 8, true);
  }, [curvePoints]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.15;
      const s = 1 + Math.sin(t * 1.8) * 0.02;
      ring1Ref.current.scale.set(s, s, s);
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.1;
    }

    if (orbitalRef.current) {
      orbitalRef.current.rotation.y += delta * 0.28;
      orbitalRef.current.rotation.x = Math.sin(t * 0.6) * 0.08;
    }

    if (trailingDotRef.current) {
      const u = (t * 0.12) % 1;
      const pt = curvePoints.getPoint(u);
      trailingDotRef.current.position.copy(pt);
    }
  });

  if (!isActive) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Ground subtle presentation rings around wooden board */}
      <group position={[0, -0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Inner ring */}
        <mesh ref={ring1Ref}>
          <ringGeometry args={[2.28, 2.30, 80]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.28}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outer subtle ring */}
        <mesh ref={ring2Ref}>
          <ringGeometry args={[2.65, 2.665, 80]} />
          <meshBasicMaterial
            color="#ea580c"
            transparent
            opacity={0.16}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 4 Cardinal cross tick marks */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
          <mesh
            key={`tick-${idx}`}
            position={[Math.cos(angle) * 2.29, Math.sin(angle) * 2.29, 0.001]}
            rotation={[0, 0, angle]}
          >
            <planeGeometry args={[0.06, 0.012]} />
            <meshBasicMaterial color="#f59e0b" opacity={0.45} transparent />
          </mesh>
        ))}
      </group>

      {/* Luminous orbital kinetic trajectory line */}
      <group ref={orbitalRef}>
        <mesh geometry={tubeGeo}>
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.42}
          />
        </mesh>

        {/* Glowing animated particle traveling along the curve */}
        <mesh ref={trailingDotRef}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}
