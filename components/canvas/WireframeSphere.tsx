'use client';

import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import {
    Float,
    MeshTransmissionMaterial,
    Trail,
    shaderMaterial,
    Line,
    Sphere,
    Torus
} from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import Scene from './Scene';

// Premium color palette
const ACCENT_CYAN = '#00D9FF';
const ACCENT_PURPLE = '#9945FF';
const ACCENT_GOLD = '#F0B90B';
const ACCENT_WHITE = '#FFFFFF';

// Holographic shader for premium glass effect
const HolographicMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new THREE.Color(ACCENT_CYAN),
    },
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
    }
    `,
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float uTime;
    uniform vec3 uColor;

    void main() {
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

        vec3 color1 = vec3(0.0, 0.95, 1.0); // Brighter Cyan
        vec3 color2 = vec3(0.7, 0.35, 1.0); // Brighter Purple
        vec3 color3 = vec3(1.0, 0.85, 0.3); // Brighter Gold

        float wave = sin(vPosition.y * 8.0 + uTime * 2.0) * 0.5 + 0.5;
        float wave2 = sin(vPosition.x * 6.0 - uTime * 1.5) * 0.5 + 0.5;

        vec3 color = mix(color1, color2, wave);
        color = mix(color, color3, wave2 * 0.3);

        float alpha = fresnel * 0.7 + 0.15; // Increased visibility
        color += fresnel * 0.8; // Stronger fresnel glow

        gl_FragColor = vec4(color, alpha);
    }
    `
);

extend({ HolographicMaterial });

declare module '@react-three/fiber' {
    interface ThreeElements {
        holographicMaterial: any;
    }
}

/**
 * Animated price line that flows around the sphere
 */
function PriceLine({ radius, speed, color, yOffset, amplitude }: {
    radius: number;
    speed: number;
    color: string;
    yOffset: number;
    amplitude: number;
}) {
    const lineRef = useRef<THREE.Group>(null);

    const points = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        const segments = 200;
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const noise = Math.sin(angle * 8) * amplitude + Math.sin(angle * 12) * amplitude * 0.5;
            pts.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                yOffset + noise,
                Math.sin(angle) * radius
            ));
        }
        return pts;
    }, [radius, yOffset, amplitude]);

    useFrame((state, delta) => {
        if (lineRef.current) {
            lineRef.current.rotation.y += delta * speed;
        }
    });

    return (
        <group ref={lineRef}>
            <Line
                points={points}
                color={color}
                lineWidth={1.5}
                transparent
                opacity={0.8}
            />
        </group>
    );
}



/**
 * Orbital data ring
 */
/**
 * Individual trailing ring on the same orbit path
 */
function TrailingRing({ radius, color, trailIndex, totalTrails, rotationOffset }: {
    radius: number;
    color: string;
    trailIndex: number;
    totalTrails: number;
    rotationOffset: number;
}) {
    const ringRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);

    useFrame((state) => {
        if (materialRef.current) {
            const t = state.clock.elapsedTime;
            // Strong exponential fade - first ring bright, rest fade quickly
            const baseFade = Math.pow(0.65, trailIndex);
            // Subtle shimmer
            const shimmer = Math.sin(t * 1.5 - trailIndex * 0.2) * 0.1 + 0.9;
            materialRef.current.opacity = baseFade * shimmer * 0.8;
        }
    });

    // Each ring is rotated along the orbit path to create trailing effect
    return (
        <group rotation={[0, rotationOffset, 0]}>
            <Torus ref={ringRef} args={[radius, 0.012 - trailIndex * 0.001, 8, 64]}>
                <meshBasicMaterial
                    ref={materialRef}
                    color={color}
                    transparent
                    opacity={0.6}
                    side={THREE.DoubleSide}
                />
            </Torus>
        </group>
    );
}

/**
 * 3D Orbital ring system with trailing echoes following the same path
 */
function OrbitTrailRings({ radius, color, trailCount = 6, baseRotationSpeed = 0.15, tiltX = 0, tiltZ = 0 }: {
    radius: number;
    color: string;
    trailCount?: number;
    baseRotationSpeed?: number;
    tiltX?: number;
    tiltZ?: number;
}) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Rotate the entire trail system
            groupRef.current.rotation.y += delta * baseRotationSpeed;
        }
    });

    // Create trailing rings with tight angular offsets - close together, behind the leader
    const trails = useMemo(() => {
        const angularSpacing = Math.PI / 45; // Reduced trail spacing
        return Array.from({ length: trailCount }).map((_, i) => ({
            id: i,
            rotationOffset: -i * angularSpacing, // Negative offset - trails follow behind
        }));
    }, [trailCount]);

    return (
        <group ref={groupRef} rotation={[tiltX, 0, tiltZ]}>
            {trails.map((trail) => (
                <TrailingRing
                    key={trail.id}
                    radius={radius}
                    color={color}
                    trailIndex={trail.id}
                    totalTrails={trailCount}
                    rotationOffset={trail.rotationOffset}
                />
            ))}
        </group>
    );
}

/**
 * Orbital data ring with 3D trailing echoes
 */
function DataRing({ radius, tilt, rotationSpeed, color }: {
    radius: number;
    tilt: number;
    rotationSpeed: number;
    color: string;
}) {
    return (
        <OrbitTrailRings
            radius={radius}
            color={color}
            trailCount={4}
            baseRotationSpeed={rotationSpeed}
            tiltX={tilt}
            tiltZ={tilt * 0.3}
        />
    );
}

/**
 * Central crystal core
 */
function CrystalCore() {
    const coreRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        if (coreRef.current) {
            coreRef.current.rotation.y = time * 0.2;
            coreRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
        }
        if (innerRef.current) {
            innerRef.current.rotation.y = -time * 0.3;
            const scale = 1 + Math.sin(time * 2) * 0.05;
            innerRef.current.scale.setScalar(scale);
        }
    });

    return (
        <group>
            {/* Outer crystal */}
            <mesh ref={coreRef} scale={0.6}>
                <octahedronGeometry args={[1, 0]} />
                <meshPhysicalMaterial
                    color={ACCENT_PURPLE}
                    emissive={ACCENT_PURPLE}
                    emissiveIntensity={0.5} // Increased glow
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.6}
                    transmission={0.4}
                />
            </mesh>

            {/* Inner glowing core */}
            <mesh ref={innerRef} scale={0.25}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color={ACCENT_GOLD}
                    emissive={ACCENT_GOLD}
                    emissiveIntensity={2} // Very bright core
                />
            </mesh>

            {/* Core glow */}
            <mesh scale={0.5}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color={ACCENT_GOLD}
                    transparent
                    opacity={0.2}
                />
            </mesh>
        </group>
    );
}

/**
 * Holographic outer shell
 */
function HolographicShell() {
    const materialRef = useRef<any>(null);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uTime = state.clock.elapsedTime;
        }
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <Sphere ref={meshRef} args={[1.4, 32, 32]}>
            <holographicMaterial
                ref={materialRef}
                transparent
                side={THREE.DoubleSide}
                depthWrite={false}
            />
        </Sphere>
    );
}

/**
 * Glass transmission sphere
 */
function GlassSphere() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.03;
        }
    });

    return (
        <Sphere ref={meshRef} args={[1.6, 64, 64]}>
            <MeshTransmissionMaterial
                backside
                samples={4}
                thickness={0.2}
                chromaticAberration={0.2} // Increased aberration
                anisotropy={0.3}
                distortion={0.1}
                distortionScale={0.1}
                temporalDistortion={0.05}
                iridescence={1}
                iridescenceIOR={1.5}
                iridescenceThicknessRange={[100, 400]}
                transmission={0.98} // Clearer
                roughness={0}
                color="#2a2a4e" // Slightly lighter tint
            />
        </Sphere>
    );
}



/**
 * Trailing orbiters
 */
function Orbiter({ radius, speed, color, tilt, size }: {
    radius: number;
    speed: number;
    color: string;
    tilt: number;
    size: number;
}) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime * speed;
        if (meshRef.current) {
            meshRef.current.position.x = Math.cos(time) * radius;
            meshRef.current.position.z = Math.sin(time) * radius;
            meshRef.current.position.y = Math.sin(time * 2) * 0.15;
        }
    });

    return (
        <group rotation={[tilt, 0, 0]}>
            <Trail
                width={0.3}
                length={6}
                color={color}
                attenuation={(t) => t * t}
            >
                <mesh ref={meshRef} scale={size}>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={1}
                    />
                </mesh>
            </Trail>
        </group>
    );
}

/**
 * Main Premium Finance Globe
 */
function FinanceGlobe() {
    const groupRef = useRef<THREE.Group>(null);
    const autoRotationSpeed = 0.06;



    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * autoRotationSpeed;
            groupRef.current.rotation.x = 0.1;
        }
    });

    return (
        <Float speed={0.3} rotationIntensity={0.03} floatIntensity={0.1}>
            <group ref={groupRef} scale={1.0}>

                {/* Ambient sparkles */}


                {/* Glass outer sphere */}
                <GlassSphere />

                {/* Holographic shell effect */}
                <HolographicShell />

                {/* Central crystal core */}
                <CrystalCore />

                {/* Price chart lines - simplified and spaced better */}
                <PriceLine radius={1.05} speed={0.12} color={ACCENT_CYAN} yOffset={0.2} amplitude={0.04} />
                <PriceLine radius={1.15} speed={-0.1} color={ACCENT_PURPLE} yOffset={-0.15} amplitude={0.03} />

                {/* Data orbit rings - cleaner layout with distinct angles */}
                <DataRing radius={1.7} tilt={Math.PI / 3} rotationSpeed={0.15} color={ACCENT_GOLD} />
                <DataRing radius={1.85} tilt={-Math.PI / 6} rotationSpeed={-0.12} color={ACCENT_PURPLE} />

                {/* Trailing orbiters - reduced to 2 for cleaner look */}
                <Orbiter radius={1.9} speed={0.5} color={ACCENT_CYAN} tilt={0.3} size={0.04} />
                <Orbiter radius={2.1} speed={0.4} color={ACCENT_GOLD} tilt={-0.2} size={0.035} />





                {/* Top accent */}
                <mesh position={[0, 2.0, 0]} scale={0.04}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial
                        color={ACCENT_CYAN}
                        emissive={ACCENT_CYAN}
                        emissiveIntensity={1}
                        metalness={1}
                        roughness={0}
                    />
                </mesh>

                {/* Bottom accent */}
                <mesh position={[0, -2.0, 0]} scale={0.04}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial
                        color={ACCENT_GOLD}
                        emissive={ACCENT_GOLD}
                        emissiveIntensity={1}
                        metalness={1}
                        roughness={0}
                    />
                </mesh>
            </group>
        </Float>
    );
}

export default function WireframeSphere() {
    return (
        <motion.div
            className="w-full h-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 1,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1,
            }}
        >
            <Scene className="w-full h-full">
                <FinanceGlobe />
            </Scene>
        </motion.div>
    );
}
