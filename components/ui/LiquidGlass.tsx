'use client';

import { useRef, ReactNode } from 'react';
import { gsap } from 'gsap';

interface LiquidGlassProps {
    children: ReactNode;
    className?: string;
}

export default function LiquidGlass({ children, className = '' }: LiquidGlassProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !contentRef.current) return;

        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        // Chromatic aberration effect (simulated with text-shadow/box-shadow or translate)
        // Here we'll just move the content slightly to create a "thick glass" refraction feel
        // For a true RGB split, we'd need multiple layers, but simple movement works well for "liquid" feel

        gsap.to(contentRef.current, {
            x: (x - 0.5) * 10,
            y: (y - 0.5) * 10,
            duration: 0.4,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = () => {
        if (!contentRef.current) return;

        gsap.to(contentRef.current, {
            x: 0,
            y: 0,
            clearProps: 'all',
            duration: 0.7,
            ease: 'elastic.out(1, 0.5)',
        });
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden group/glass ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Liquid Glare Layer */}
            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover/glass:animate-shine pointer-events-none z-10" />

            {/* Content Layer */}
            <div ref={contentRef} className="relative z-0 h-full">
                {children}
            </div>
        </div>
    );
}
