"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Simplified, elegant obsidian crystal
export default function ObsidianCrystal(props: object) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowMeshRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    const { pointer } = useThree();

    // Animation frame - subtle continuous rotation
    useFrame((state, delta) => {
        if (meshRef.current) {
            // Gentle continuous rotation
            meshRef.current.rotation.y += delta * 0.1;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;

            // Very subtle mouse-reactive movement
            const targetX = pointer.x * 0.3;
            const targetY = pointer.y * 0.3;
            meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.01;
            meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.01;
        }

        if (glowMeshRef.current && meshRef.current) {
            // Subtle pulsing glow
            const pulse = Math.sin(state.clock.elapsedTime * 1.5) * 0.02 + 1.02;
            glowMeshRef.current.scale.setScalar(pulse);
            glowMeshRef.current.rotation.y = meshRef.current.rotation.y;
        }
    });

    // Scroll-triggered animations
    useGSAP(() => {
        if (!meshRef.current) return;

        // Gentle rotation on scroll
        gsap.to(meshRef.current.rotation, {
            x: Math.PI,
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 2,
            },
        });

        // Subtle position shift on scroll
        gsap.to(meshRef.current.position, {
            y: -0.5,
            z: 0.3,
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 2,
            },
        });

    }, { dependencies: [] });

    return (
        <group ref={groupRef} position={[2.5, 0, -2]} scale={0.8}>
            {/* Main crystal with refined transmission material */}
            <Float
                speed={1.5}
                rotationIntensity={0.1}
                floatIntensity={0.2}
            >
                <mesh
                    ref={meshRef}
                    {...props}
                >
                    <icosahedronGeometry args={[1, 1]} />
                    <MeshTransmissionMaterial
                        backside
                        backsideThickness={3}
                        thickness={1.5}
                        roughness={0.1}
                        transmission={0.95}
                        ior={1.4}
                        chromaticAberration={0.5}
                        anisotropy={0.2}
                        color="#0a0a0a"
                        distortion={0.2}
                        distortionScale={0.3}
                        temporalDistortion={0.05}
                        resolution={512}
                        samples={6}
                    />
                </mesh>
            </Float>

            {/* Subtle outer glow */}
            <mesh ref={glowMeshRef}>
                <icosahedronGeometry args={[1.02, 1]} />
                <meshBasicMaterial
                    color="#9945FF"
                    transparent
                    opacity={0.05}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
}
