'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GradientOrbProps {
    colors: string[];
    size?: 'sm' | 'md' | 'lg' | 'xl';
    blur?: 'sm' | 'md' | 'lg' | 'xl';
    opacity?: number;
    className?: string;
    animate?: boolean;
}

const sizeMap = {
    sm: 'w-32 h-32',
    md: 'w-64 h-64',
    lg: 'w-96 h-96',
    xl: 'w-[600px] h-[600px]'
};

const blurMap = {
    sm: 'blur-[60px]',
    md: 'blur-[100px]',
    lg: 'blur-[150px]',
    xl: 'blur-[200px]'
};

export default function GradientOrb({
    colors,
    size = 'lg',
    blur = 'lg',
    opacity = 0.3,
    className = '',
    animate = true
}: GradientOrbProps) {
    const orbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!animate || !orbRef.current) return;

        const ctx = gsap.context(() => {
            // Morphing animation
            gsap.to(orbRef.current, {
                scale: 1.2,
                duration: 8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });

            // Rotation animation
            gsap.to(orbRef.current, {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none'
            });
        }, orbRef);

        return () => ctx.revert();
    }, [animate]);

    const gradientStyle = {
        background: `radial-gradient(circle, ${colors.join(', ')})`,
        opacity
    };

    return (
        <motion.div
            ref={orbRef}
            className={`${sizeMap[size]} ${blurMap[blur]} rounded-full pointer-events-none ${className}`}
            style={gradientStyle}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
        />
    );
}
