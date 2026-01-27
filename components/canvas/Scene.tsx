"use client";

import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { Suspense } from "react";

export default function Scene({ children, ...props }: any) {
    return (
        <Canvas {...props}>
            <directionalLight position={[-5, 5, 5]} intensity={4} />
            <Suspense fallback={null}>
                {children}
                <Preload all />
            </Suspense>
        </Canvas>
    );
}
