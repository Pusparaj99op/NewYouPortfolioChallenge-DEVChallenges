'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 100);

        // Hide preloader after animation
        const timer = setTimeout(() => {
            gsap.to('.preloader', {
                yPercent: -100,
                duration: 0.8,
                ease: 'power4.inOut',
                onComplete: () => setIsLoading(false),
            });
        }, 1500);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="preloader fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
            {/* Logo Animation */}
            <div className="mb-8">
                <div className="text-4xl font-black tracking-tighter">
                    <span className="text-white">Black</span>
                    <span className="gradient-text">Obsidian</span>
                </div>
                <div className="text-sm text-text-muted tracking-widest mt-2 text-center">
                    ASSET MANAGEMENT
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-accent-purple to-accent-green transition-all duration-100"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
            </div>

            {/* Loading Text */}
            <div className="mt-4 text-xs text-text-muted font-mono">
                {Math.min(Math.round(progress), 100)}%
            </div>
        </div>
    );
}
