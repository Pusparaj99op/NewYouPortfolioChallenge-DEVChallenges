'use client';

import { useRef, ReactNode, MouseEvent } from 'react';
import { gsap } from 'gsap';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    intensity?: number;
    glare?: boolean;
}

export default function TiltCard({
    children,
    className = '',
    intensity = 10,
    glare = true
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const glareRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        const rotateX = (y - 0.5) * intensity * -1;
        const rotateY = (x - 0.5) * intensity;

        gsap.to(cardRef.current, {
            rotateX,
            rotateY,
            duration: 0.5,
            ease: 'power2.out',
            transformPerspective: 1000,
        });

        if (glareRef.current && glare) {
            gsap.to(glareRef.current, {
                opacity: 0.15,
                x: `${x * 100}%`,
                y: `${y * 100}%`,
                duration: 0.5,
            });
        }
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;

        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
        });

        if (glareRef.current) {
            gsap.to(glareRef.current, {
                opacity: 0,
                duration: 0.5,
            });
        }
    };

    return (
        <div
            ref={cardRef}
            className={`relative transform-gpu ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {children}

            {/* Glare Effect */}
            {glare && (
                <div
                    ref={glareRef}
                    className="absolute inset-0 pointer-events-none opacity-0 rounded-inherit"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, transparent 50%)',
                        transform: 'translate(-50%, -50%)',
                        width: '150%',
                        height: '150%',
                    }}
                />
            )}
        </div>
    );
}
