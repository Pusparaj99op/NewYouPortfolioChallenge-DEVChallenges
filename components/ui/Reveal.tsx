'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}

export default function Reveal({
    children,
    delay = 0,
    direction = 'up',
    className = ''
}: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const directions = {
            up: { y: 60, x: 0 },
            down: { y: -60, x: 0 },
            left: { y: 0, x: 60 },
            right: { y: 0, x: -60 },
        };

        const { x, y } = directions[direction];

        gsap.fromTo(
            ref.current,
            {
                y,
                x,
                opacity: 0,
            },
            {
                y: 0,
                x: 0,
                opacity: 1,
                duration: 1,
                delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: ref.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }, [delay, direction]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}
