'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedTextProps {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
    animation?: 'fade' | 'slide' | 'wave' | 'cascade';
    gradient?: boolean;
}

export default function AnimatedText({
    text,
    className = '',
    delay = 0,
    stagger = 0.03,
    animation = 'cascade',
    gradient = false
}: AnimatedTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const chars = containerRef.current.querySelectorAll('.char');

        const ctx = gsap.context(() => {
            switch (animation) {
                case 'fade':
                    gsap.fromTo(chars,
                        { opacity: 0 },
                        {
                            opacity: 1,
                            duration: 0.8,
                            stagger,
                            delay,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: containerRef.current,
                                start: 'top 85%',
                            }
                        }
                    );
                    break;

                case 'slide':
                    gsap.fromTo(chars,
                        { opacity: 0, y: 50 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            stagger,
                            delay,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: containerRef.current,
                                start: 'top 85%',
                            }
                        }
                    );
                    break;

                case 'wave':
                    gsap.fromTo(chars,
                        { opacity: 0, y: 30, rotateX: -90 },
                        {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            duration: 1,
                            stagger,
                            delay,
                            ease: 'back.out(1.5)',
                            scrollTrigger: {
                                trigger: containerRef.current,
                                start: 'top 85%',
                            }
                        }
                    );
                    break;

                case 'cascade':
                    gsap.fromTo(chars,
                        { opacity: 0, y: 100, rotateX: -45, scale: 0.5 },
                        {
                            opacity: 1,
                            y: 0,
                            rotateX: 0,
                            scale: 1,
                            duration: 1.2,
                            stagger,
                            delay,
                            ease: 'power4.out',
                            scrollTrigger: {
                                trigger: containerRef.current,
                                start: 'top 85%',
                            }
                        }
                    );
                    break;
            }
        }, containerRef);

        return () => ctx.revert();
    }, [text, delay, stagger, animation]);

    const chars = text.split('').map((char, i) => (
        <span
            key={i}
            className={`char inline-block ${char === ' ' ? 'w-[0.25em]' : ''} ${gradient ? 'gradient-text' : ''}`}
            style={{ display: 'inline-block' }}
        >
            {char === ' ' ? '\u00A0' : char}
        </span>
    ));

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`}>
            {chars}
        </div>
    );
}
