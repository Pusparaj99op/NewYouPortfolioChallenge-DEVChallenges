"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ObsidianCrystal(props: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
        }
    });

    useGSAP(() => {
        if (meshRef.current) {
            gsap.to(meshRef.current.rotation, {
                x: Math.PI * 2,
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                },
            });

            gsap.to(meshRef.current.position, {
                y: -2,
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1,
                },
            });
        }
    }, { dependencies: [] });

    return (
        <mesh ref={meshRef} {...props}>
            <icosahedronGeometry args={[1, 0]} />
            <MeshTransmissionMaterial
                backside
                backsideThickness={5}
                thickness={2}
                roughness={0}
                transmission={1}
                ior={1.5}
                chromaticAberration={1}
                anisotropy={1}
                color="#1a1a1a"
            />
        </mesh>
    );
}
