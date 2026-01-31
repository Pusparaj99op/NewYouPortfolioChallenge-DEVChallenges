"use client";

import * as Fiber from "@react-three/fiber";
import { Environment, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { Suspense, useState, useMemo } from "react";
import * as THREE from "three";

// Loading fallback
function Loader() {
    return null;
}

interface SceneProps {
    children: React.ReactNode;
    className?: string;
}

export default function Scene({ children, className }: SceneProps) {
    const [dpr, setDpr] = useState(1.2);

    // Memoize camera settings
    const cameraProps = useMemo(() => ({
        position: [0, 0, 5] as [number, number, number],
        fov: 45,
        near: 0.1,
        far: 100
    }), []);

    // Memoize GL settings
    const glProps = useMemo(() => ({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance" as const,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
    }), []);

    return (
        <div className={className}>
            <Fiber.Canvas
                dpr={dpr}
                gl={glProps}
                camera={cameraProps}
                frameloop="demand"
            >
                {/* Performance monitoring with adaptive quality */}
                <PerformanceMonitor
                    onIncline={() => setDpr(Math.min(1.5, dpr + 0.3))}
                    onDecline={() => setDpr(Math.max(0.8, dpr - 0.3))}
                    flipflops={3}
                    factor={1}
                    ms={50}
                >
                    <AdaptiveDpr pixelated />
                </PerformanceMonitor>

                {/* Accent point lights - subtle */}
                <pointLight
                    position={[3, 2, 0]}
                    intensity={0.5}
                    color="#9945FF"
                    distance={8}
                    decay={2}
                />
                <pointLight
                    position={[-3, -2, 0]}
                    intensity={0.4}
                    color="#14F195"
                    distance={8}
                    decay={2}
                />

                {/* Environment removed to prevent fetch error for missing HDR */}

                <Suspense fallback={<Loader />}>
                    {children}
                </Suspense>
            </Fiber.Canvas>
        </div>
    );
}
