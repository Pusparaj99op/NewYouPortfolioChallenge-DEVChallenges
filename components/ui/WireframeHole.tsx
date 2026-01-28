'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface WireframeHoleProps {
    speed?: number;
    gridScale?: number;
    depth?: number;
    colorStart?: string;
    colorEnd?: string;
    backgroundColor?: string;
}

const HoleMesh: React.FC<WireframeHoleProps> = ({
    speed = 0.5,
    gridScale = 20,
    depth = 4.0,
    colorStart = '#8a2be2', // BlueViolet
    colorEnd = '#00ffff',   // Aqua
    backgroundColor = '#000000'
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColorStart: { value: new THREE.Color(colorStart) },
            uColorEnd: { value: new THREE.Color(colorEnd) },
            uGridScale: { value: gridScale },
            uDepth: { value: depth },
        }),
        [colorStart, colorEnd, gridScale, depth]
    );

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime() * speed;
        }
    });

    const vertexShader = `
    varying vec2 vUv;
    varying float vDistance;
    varying vec3 vPos;
    uniform float uDepth;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Calculate distance from center in UV space (0.5, 0.5 is center)
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(uv, center);
      vDistance = dist;

      // Funnel deformation
      // We map UV (0..1) to World coords roughly (-1..1) for calculations
      float r = dist * 4.0;

      // Experiment with deformation:
      // A steep drop in the center flattening out.
      // z = -A / (r^k + epsilon)

      float z = -uDepth * exp(-2.0 * r * r);

      pos.z += z;
      vPos = pos;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

    const fragmentShader = `
    varying vec2 vUv;
    varying float vDistance;
    varying vec3 vPos;
    uniform float uTime;
    uniform float uGridScale;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;

    void main() {
      // Polar Coordinates from center of UV
      vec2 center = vec2(0.5, 0.5);
      vec2 delta = vUv - center;
      float radius = length(delta);
      float angle = atan(delta.y, delta.x);

      // Animation: Move radius inwards
      // fract(radius * scale - time)

      float radialProgress = fract(radius * uGridScale - uTime);
      float angularProgress = fract(angle * (uGridScale / 3.14159) * 0.5);

      // Draw grid lines
      // We want thin sharp lines.
      // Use smoothstep for anti-aliasing.

      float lineWidth = 0.05;
      float circleLines = smoothstep(lineWidth, 0.0, abs(radialProgress - 0.5) * 2.0);
      float spokeLines = smoothstep(lineWidth, 0.0, abs(angularProgress - 0.5) * 2.0);

      float grid = max(circleLines, spokeLines);

      // Fade out at edges (radius > 0.5)
      float alpha = 1.0 - smoothstep(0.40, 0.50, radius);

      // Fade out at center (infinite hole)
      // alpha *= smoothstep(0.01, 0.1, radius);

      // Color Gradient based on depth/radius
      vec3 color = mix(uColorStart, uColorEnd, radius * 2.5);

      // Add "glow"
      float glow = exp(-radius * 5.0) * 0.5;

      gl_FragColor = vec4(color + glow, alpha * grid * 0.8 + glow * 0.2);
    }
  `;

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[20, 20, 128, 128]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
};

export default function WireframeHole(props: WireframeHoleProps) {
    return (
        <div className="w-full h-full relative">
            <Canvas
                camera={{ position: [0, 3, 3], fov: 60 }}
                gl={{ alpha: true, antialias: true }}
            >
                <HoleMesh {...props} />
            </Canvas>
        </div>
    );
}
