'use client';

import { useRef, useState, MouseEvent, ReactNode } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    strength?: number; // How strong the pull is
}

export default function MagneticButton({
    children,
    className = '',
    strength = 30
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = buttonRef.current!.getBoundingClientRect();

        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        // Apply magnetic effect
        gsap.to(buttonRef.current, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 1,
            ease: 'power4.out',
        });

        // Move text slightly differently for depth
        if (textRef.current) {
            gsap.to(textRef.current, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 1,
                ease: 'power4.out',
            });
        }
    };

    const handleMouseLeave = () => {
        gsap.to(buttonRef.current, {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.3)',
        });

        if (textRef.current) {
            gsap.to(textRef.current, {
                x: 0,
                y: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.3)',
            });
        }
    };

    return (
        <div
            ref={buttonRef}
            className={`inline-block cursor-none ${className}`} // cursor-none because we'll handle custom cursor
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <span ref={textRef} className="block pointer-events-none relative z-10">
                {children}
            </span>
        </div>
    );
}
