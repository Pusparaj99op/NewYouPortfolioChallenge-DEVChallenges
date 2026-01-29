"use client";

import * as Fiber from "@react-three/fiber";
import { Environment, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { Suspense, useState } from "react";
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
    const [dpr, setDpr] = useState(1.5);

    return (
        <div className={className}>
            <Fiber.Canvas
                dpr={dpr}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1,
                }}
                camera={{
                    position: [0, 0, 5],
                    fov: 45,
                    near: 0.1,
                    far: 100
                }}
            >
                {/* Performance monitoring with adaptive quality */}
                <PerformanceMonitor
                    onIncline={() => setDpr(Math.min(2, dpr + 0.5))}
                    onDecline={() => setDpr(Math.max(1, dpr - 0.5))}
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
