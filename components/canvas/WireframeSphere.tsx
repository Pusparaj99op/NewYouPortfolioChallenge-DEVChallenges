'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import Scene from './Scene';

function RotatingSpheres() {
    const outerRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (outerRef.current) {
            outerRef.current.rotation.y += delta * 0.1;
            outerRef.current.rotation.z += delta * 0.05;
        }
        if (innerRef.current) {
            innerRef.current.rotation.y -= delta * 0.15;
            innerRef.current.rotation.x += delta * 0.1;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <group scale={2.2}>
                {/* Outer Purple Sphere */}
                <Sphere args={[1, 16, 16]} ref={outerRef}>
                    <meshBasicMaterial
                        color="#9945FF"
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </Sphere>

                {/* Inner Green Sphere */}
                <Sphere args={[0.7, 12, 12]} ref={innerRef}>
                    <meshBasicMaterial
                        color="#14F195"
                        wireframe
                        transparent
                        opacity={0.2}
                    />
                </Sphere>
            </group>
        </Float>
    );
}

export default function WireframeSphere() {
    return (
        <Scene className="w-full h-full">
            <RotatingSpheres />
        </Scene>
    );
}
