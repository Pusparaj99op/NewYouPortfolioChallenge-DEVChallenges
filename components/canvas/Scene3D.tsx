'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Sphere, MeshDistortMaterial, Stars, Torus, RoundedBox } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

interface Scene3DProps {
    colorScheme: {
        primary: string;
        secondary: string;
        accent: string;
    };
    category: 'Trading' | 'Finance' | 'Web3';
    projectId: number;
}

// 1. Sensex Options AI - Animated Sphere with morphing surface
function AnimatedSphere({ color }: { color: string }) {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Sphere args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

// 2. BXOTS - Rotating Torus with morphing surface
function RotatingTorus({ color }: { color: string }) {
    const torusRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (torusRef.current) {
            torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
            torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
            <Torus ref={torusRef} args={[1, 0.4, 32, 100]}>
                <MeshDistortMaterial
                    color={color}
                    distort={0.3}
                    speed={1.5}
                    roughness={0.1}
                    metalness={0.9}
                    emissive={color}
                    emissiveIntensity={0.3}
                />
            </Torus>
        </Float>
    );
}

// 3. QSCI Indicator - Pulsing soft corner octahedron with morphing surface
function PulsingOctahedron({ color }: { color: string }) {
    const octaRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (octaRef.current) {
            const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
            octaRef.current.scale.set(scale, scale, scale);
            octaRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            octaRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    // Create octahedron geometry manually with soft corners
    const geometry = new THREE.OctahedronGeometry(1.2, 2); // subdivision for smoother edges

    return (
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
            <mesh ref={octaRef} geometry={geometry}>
                <MeshDistortMaterial
                    color={color}
                    distort={0.25}
                    speed={1.8}
                    roughness={0.2}
                    metalness={0.7}
                    emissive={color}
                    emissiveIntensity={0.4}
                />
            </mesh>
        </Float>
    );
}

// 4. Wealth Manager - Glowing Icosahedron with wireframe and morphing surface
function GlowingIcosahedron({ color }: { color: string }) {
    const icoRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (icoRef.current) {
            icoRef.current.rotation.x = state.clock.getElapsedTime() * 0.15;
            icoRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
        }
    });

    const geometry = new THREE.IcosahedronGeometry(1, 2); // subdivision for smoother surface

    return (
        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.4}>
            <group>
                <mesh ref={icoRef} geometry={geometry}>
                    <MeshDistortMaterial
                        color={color}
                        distort={0.3}
                        speed={1.6}
                        roughness={0.3}
                        metalness={0.8}
                        emissive={color}
                        emissiveIntensity={0.5}
                    />
                </mesh>
                <mesh geometry={new THREE.IcosahedronGeometry(1.1, 2)}>
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.1}
                        wireframe
                    />
                </mesh>
            </group>
        </Float>
    );
}

// 5. Ripple Scaler - Spinning soft corner cubes with morphing surface
function SpinningCubes({ color }: { color: string }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.4;
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.6;
        }
    });

    return (
        <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.5}>
            <group ref={groupRef}>
                {/* Soft corner cube using RoundedBox */}
                <RoundedBox args={[0.8, 0.8, 0.8]} radius={0.1} smoothness={4}>
                    <MeshDistortMaterial
                        color={color}
                        distort={0.2}
                        speed={2}
                        roughness={0.2}
                        metalness={0.9}
                    />
                </RoundedBox>
                {/* Wireframe outer cube */}
                <RoundedBox args={[1.2, 1.2, 1.2]} radius={0.12} smoothness={4}>
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.15}
                        wireframe
                    />
                </RoundedBox>
            </group>
        </Float>
    );
}

// 6. BTC Options Algo - Double Cone with morphing surface
function DoubleCone({ color }: { color: string }) {
    const groupRef = useRef<THREE.Group>(null);
    const cone1Ref = useRef<THREE.Mesh>(null);
    const cone2Ref = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
        }
    });

    return (
        <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.5}>
            <group ref={groupRef}>
                {/* Top cone */}
                <mesh ref={cone1Ref} position={[0, 0.75, 0]}>
                    <coneGeometry args={[0.8, 1.5, 32]} />
                    <MeshDistortMaterial
                        color={color}
                        distort={0.25}
                        speed={1.7}
                        roughness={0.2}
                        metalness={0.8}
                        emissive={color}
                        emissiveIntensity={0.3}
                    />
                </mesh>
                {/* Bottom cone */}
                <mesh ref={cone2Ref} position={[0, -0.75, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.8, 1.5, 32]} />
                    <MeshDistortMaterial
                        color={color}
                        distort={0.25}
                        speed={1.7}
                        roughness={0.2}
                        metalness={0.8}
                        emissive={color}
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </group>
        </Float>
    );
}

function Scene({ colorScheme, category, projectId }: Scene3DProps) {
    // Select 3D object based on project ID
    const get3DObject = () => {
        switch (projectId) {
            case 1: // Sensex Options AI
                return <AnimatedSphere color={colorScheme.primary} />;
            case 2: // BXOTS
                return <RotatingTorus color={colorScheme.primary} />;
            case 3: // QSCI Indicator
                return <PulsingOctahedron color={colorScheme.primary} />;
            case 4: // Wealth Manager
                return <GlowingIcosahedron color={colorScheme.primary} />;
            case 5: // Ripple Scaler
                return <SpinningCubes color={colorScheme.primary} />;
            case 6: // BTC Options Algo
                return <DoubleCone color={colorScheme.primary} />;
            default:
                return <AnimatedSphere color={colorScheme.primary} />;
        }
    };

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color={colorScheme.accent} />
            <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.3} penumbra={1} color={colorScheme.secondary} />

            {get3DObject()}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Environment preset="city" />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
            />
        </>
    );
}

export default function Scene3D({ colorScheme, category, projectId }: Scene3DProps) {
    return (
        <div className="w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <Scene colorScheme={colorScheme} category={category} projectId={projectId} />
                </Suspense>
            </Canvas>
        </div>
    );
}
