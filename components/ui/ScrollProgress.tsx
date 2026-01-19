'use client';

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
    useEffect(() => {
        // Create progress bar animation linked to scroll
        const animation = gsap.to('.scroll-progress-bar', {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.1, // Smooth interaction
            },
        });

        // Create secondary/echo animation for the glow effect using Golden Ratio timing
        const glowAnimation = gsap.to('.scroll-progress-glow', {
            opacity: 1,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: '10% top',
                scrub: true,
                toggleActions: 'play none none reverse'
            }
        });

        return () => {
            animation.kill();
            glowAnimation.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-[3px] z-[100] bg-white/5 pointer-events-none">
            <div
                className="scroll-progress-bar h-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-green relative w-0"
            >
                {/* Glowing orb at the end - Fibonacci dimensions */}
                <div
                    className="scroll-progress-glow absolute right-0 top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full bg-accent-green shadow-[0_0_13px_5px_rgba(20,241,149,0.6)] opacity-0"
                />
            </div>
        </div>
    );
}
