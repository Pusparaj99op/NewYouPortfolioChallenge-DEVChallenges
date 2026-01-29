'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, ContactShadows, Environment, Lightformer, Text, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function Geometries() {
    return (
        <group>
            {/* Main centerpiece */}
            <Float floatIntensity={2} rotationIntensity={2} speed={1.5}>
                <mesh position={[0, 0, 0]}>
                    <torusKnotGeometry args={[1, 0.3, 128, 32]} />
                    <MeshTransmissionMaterial
                        backside
                        backsideThickness={5}
                        thickness={2}
                        roughness={0}
                        chromaticAberration={0.5}
                        anisotropy={0.5}
                        color="#ffffff"
                        distortion={0.5}
                        distortionScale={0.5}
                        temporalDistortion={0.1}
                    />
                </mesh>
            </Float>

            {/* Floating spheres */}
            <Float floatIntensity={4} rotationIntensity={4} speed={2}>
                <mesh position={[-2, 2, -2]}>
                    <icosahedronGeometry args={[0.5, 0]} />
                    <meshStandardMaterial color="#9945FF" roughness={0.1} metalness={0.8} />
                </mesh>
            </Float>
            <Float floatIntensity={3} rotationIntensity={5} speed={2.5}>
                <mesh position={[2.5, -1, -3]}>
                    <octahedronGeometry args={[0.6, 0]} />
                    <meshStandardMaterial color="#14F195" roughness={0.1} metalness={0.8} />
                </mesh>
            </Float>
            <Float floatIntensity={5} rotationIntensity={3} speed={1.2}>
                <mesh position={[-3, -2, -1]}>
                    <dodecahedronGeometry args={[0.7, 0]} />
                    <meshStandardMaterial color="#00C2FF" roughness={0.1} metalness={0.8} />
                </mesh>
            </Float>
        </group>
    );
}

function Lighting() {
    return (
        <group>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            <Environment preset="city">
                <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[2, 10, 1]} />
                <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[2, 10, 1]} />
                <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[8, 1, 1]} />
            </Environment>
        </group>
    );
}

function AnimatedText() {
    const textRef = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (textRef.current) {
            textRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.2;
        }
    });

    return (
        <group ref={textRef} position={[0, -2.5, 0]}>
            <Text
                font="/fonts/inter-bold.woff" // Assuming font exists or uses default
                fontSize={0.8}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
            >
                MODERN WEB
                <meshStandardMaterial color="white" toneMapped={false} />
            </Text>
        </group>
    );
}

export default function ModernWebHero() {
    return (
        <div className="w-full h-[60vh] md:h-[80vh] relative rounded-3xl overflow-hidden glass-panel border border-white/10 bg-black/50">
            <div className="absolute top-4 left-6 z-10">
                <h2 className="text-xs font-mono text-zinc-400 tracking-widest border border-white/10 px-3 py-1 rounded-full uppercase">Interactive 3D Experience</h2>
            </div>
            <Canvas
                shadows
                camera={{ position: [0, 0, 8], fov: 45 }}
                className="w-full h-full"
                dpr={[1, 2]} // Performance optimization for varied screens
            >
                <color attach="background" args={['#050505']} />
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                <Geometries />
                <Lighting />
                <ContactShadows position={[0, -3.5, 0]} opacity={0.5} scale={20} blur={2} far={4.5} />
            </Canvas>
            <div className="absolute bottom-6 right-6 z-10 flex gap-4">
                <div className="text-right">
                    <div className="text-xs text-zinc-500 font-mono">RENDER ENGINE</div>
                    <div className="text-sm text-white font-bold">THREE.JS / WEBGL</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-zinc-500 font-mono">FRAMEWORK</div>
                    <div className="text-sm text-white font-bold">R3F + DREI</div>
                </div>
            </div>
        </div>
    );
}
