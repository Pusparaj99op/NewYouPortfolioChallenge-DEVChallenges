'use client';

import { useRef, useState, useCallback, ReactNode } from 'react';
import { gsap } from 'gsap';
import { useSoundEffects } from '@/hooks/use-sound-effects';

interface MagneticButtonProps {
    children: ReactNode;
    strength?: number;
    className?: string;
}

export default function MagneticButton({
    children,
    strength = 30,
    className = ''
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null);
    const rippleRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
    const rippleIdRef = useRef(0);
    const { playHover, playClick } = useSoundEffects();

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        // Magnetic movement
        gsap.to(buttonRef.current, {
            x: deltaX * strength,
            y: deltaY * strength,
            rotateX: -deltaY * 10,
            rotateY: deltaX * 10,
            duration: 0.4,
            ease: 'power2.out'
        });

        // Glow follows cursor
        if (glowRef.current) {
            const localX = e.clientX - rect.left;
            const localY = e.clientY - rect.top;
            gsap.to(glowRef.current, {
                x: localX,
                y: localY,
                duration: 0.3
            });
        }
    }, [strength]);

    const handleMouseLeave = useCallback(() => {
        if (!buttonRef.current) return;

        // Spring back with elastic ease
        gsap.to(buttonRef.current, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
        });
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (!buttonRef.current) return;

        playHover();

        // Scale up slightly on enter
        gsap.to(buttonRef.current, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        });
    }, [playHover]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!buttonRef.current) return;

        playClick();

        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Add ripple
        rippleIdRef.current += 1;
        const newRipple = { x, y, id: rippleIdRef.current };
        setRipples(prev => [...prev, newRipple]);

        // Click animation
        gsap.to(buttonRef.current, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });

        // Remove ripple after animation
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
    }, []);

    const handleMouseLeaveScale = useCallback(() => {
        if (!buttonRef.current) return;

        gsap.to(buttonRef.current, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    }, []);

    return (
        <div
            ref={buttonRef}
            className={`magnetic-button relative inline-block cursor-pointer ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
                handleMouseLeave();
                handleMouseLeaveScale();
            }}
            onMouseEnter={handleMouseEnter}
            onClick={handleClick}
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
        >
            {/* Glow effect that follows cursor */}
            <div
                ref={glowRef}
                className="absolute w-20 h-20 rounded-full bg-accent-purple/20 blur-xl pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: 0, top: 0 }}
            />

            {/* Ripple container */}
            <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                {ripples.map(ripple => (
                    <span
                        key={ripple.id}
                        className="absolute rounded-full bg-white/30 animate-ripple"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Border glow on hover */}
            <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-full border border-accent-purple/50 blur-[2px]" />
            </div>
        </div>
    );
}
