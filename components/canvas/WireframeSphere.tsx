'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Sphere({ color = '#9945FF' }: { color?: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} scale={2.8}>
                <icosahedronGeometry args={[1, 2]} />
                <meshBasicMaterial
                    color={color}
                    wireframe
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>
            {/* Inner Sphere for glow effect */}
            <mesh scale={2.5}>
                <icosahedronGeometry args={[1, 4]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.05}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </Float>
    );
}

export default function WireframeSphere() {
    return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center relative z-10 opacity-70 hover:opacity-100 transition-opacity duration-500">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <Sphere />
                <Environment preset="city" />
            </Canvas>
            {/* Background Glow */}
            <div className="absolute inset-0 bg-radial-gradient from-accent-purple/10 to-transparent blur-3xl -z-10" />
        </div>
    );
}
