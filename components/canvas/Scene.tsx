"use client";

import { Canvas } from "@react-three/fiber";
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
            <Canvas
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
                {/* Performance monitoring */}
                <PerformanceMonitor
                    onIncline={() => setDpr(Math.min(2, dpr + 0.5))}
                    onDecline={() => setDpr(Math.max(1, dpr - 0.5))}
                >
                    <AdaptiveDpr pixelated />
                </PerformanceMonitor>

                {/* Subtle ambient lighting */}
                <ambientLight intensity={0.4} color="#ffffff" />
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={0.6}
                    color="#ffffff"
                />
                <directionalLight
                    position={[-5, -5, -5]}
                    intensity={0.3}
                    color="#9945FF"
                />

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

                {/* Environment for reflections */}
                <Environment preset="night" />

                <Suspense fallback={<Loader />}>
                    {children}
                </Suspense>
            </Canvas>
        </div>
    );
}
