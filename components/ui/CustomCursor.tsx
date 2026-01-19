'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        // Hide default cursor
        document.body.style.cursor = 'none';

        // Add event listeners for hover states
        const addHoverListeners = () => {
            const hoverables = document.querySelectorAll('a, button, input, textarea, .hoverable');

            hoverables.forEach((el) => {
                el.addEventListener('mouseenter', () => setIsHovering(true));
                el.addEventListener('mouseleave', () => setIsHovering(false));
            });
        };

        addHoverListeners();
        // Re-add listeners on DOM changes (simple observer could be better but this works for now)
        const observer = new MutationObserver(addHoverListeners);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.body.style.cursor = 'auto';
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;

            // Inner dot (instant)
            gsap.set(cursorRef.current, {
                x: clientX,
                y: clientY,
            });

            // Outer follower (delayed)
            gsap.to(followerRef.current, {
                x: clientX,
                y: clientY,
                duration: 0.8,
                ease: 'power4.out',
            });
        };

        const onMouseDown = () => setIsClicking(true);
        const onMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    // Update cursor style based on state
    useEffect(() => {
        if (isHovering) {
            gsap.to(followerRef.current, {
                scale: 1.5,
                backgroundColor: 'rgba(153, 69, 255, 0.2)', // Accent purple transparent
                borderColor: 'transparent',
                duration: 0.3,
            });
            gsap.to(cursorRef.current, {
                scale: 0, // Hide dot on hover
                duration: 0.3,
            });
        } else {
            gsap.to(followerRef.current, {
                scale: 1,
                backgroundColor: 'transparent',
                borderColor: '#9945FF',
                duration: 0.3,
            });
            gsap.to(cursorRef.current, {
                scale: 1,
                duration: 0.3,
            });
        }

        if (isClicking) {
            gsap.to(followerRef.current, {
                scale: 0.8,
                duration: 0.1,
            });
        }
    }, [isHovering, isClicking]);

    // Don't render on mobile/touch devices
    // Simple check, can be refined
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <>
            {/* Inner Dot */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-accent-green rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
            />

            {/* Outer Follower */}
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-8 h-8 border border-accent-purple rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
            />
        </>
    );
}
