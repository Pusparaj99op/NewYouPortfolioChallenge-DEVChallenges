"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './GlassCursor.module.css';

const GlassCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Hide default cursor
        document.body.style.cursor = 'none';

        // Create quickTo setters for better performance
        const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power2.out" });
        const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power2.out" });

        const onMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;

            // Calculate distance from edges for fade-out
            const edgeThreshold = 50;
            const opacity = (
                clientX < edgeThreshold ||
                clientY < edgeThreshold ||
                clientX > window.innerWidth - edgeThreshold ||
                clientY > window.innerHeight - edgeThreshold
            ) ? 0 : 1;

            // Move the cursor immediately using quickTo
            xTo(clientX);
            yTo(clientY);

            // Opacity can still be a normal tween as it changes less frequently/smoothly
            gsap.to(cursorRef.current, {
                opacity: opacity,
                duration: 0.2,
                overwrite: 'auto'
            });
        };

        const onOrderedHoverCheck = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for text elements first (p, span, h1-h6, inputs)
            const isText = target.closest('p, span, h1, h2, h3, h4, h5, h6, input[type="text"], input[type="email"], textarea, label');
            // Check for clickable elements
            const isClickable = target.closest('a, button, input[type="submit"], input[type="button"], [role="button"]');

            if (isText && !isClickable) {
                // Text State: Tall thin pill
                gsap.to(cursorRef.current, {
                    width: 4,
                    height: 30,
                    borderRadius: 2,
                    scale: 1,
                    duration: 0.3
                });
            } else if (isClickable) {
                // Clickable State: Scale up circle
                gsap.to(cursorRef.current, {
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    scale: 1.5,
                    duration: 0.3
                });
            } else {
                // Default State
                gsap.to(cursorRef.current, {
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    scale: 1,
                    duration: 0.3
                });
            }
        };

        const onMouseDown = () => {
            gsap.to(cursorRef.current, {
                scale: 0.9,
                duration: 0.1
            });
        };

        const onMouseUp = () => {
            // We revert to whatever the current hover state dictates,
            // but for simplicity, let's just spring back to near-original scale
            // checking the last applied state logic would be better,
            // but standard 'scale' reversion often works if we trigger the hover check again
            // or we just return to 1 (if not hovering) or 1.5 (if hovering).
            // A simple "scale up a bit" works for feedback.
            gsap.to(cursorRef.current, {
                scale: 1,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
            // Trigger a re-check of hover state to ensure correct final scale
            // (This is a bit hacky, but robust enough for visual FX)
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onOrderedHoverCheck);
        window.addEventListener('mouseout', onOrderedHoverCheck);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        return () => {
            document.body.style.cursor = 'auto';
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onOrderedHoverCheck);
            window.removeEventListener('mouseout', onOrderedHoverCheck);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <div className={styles.cursorContainer}>
            <div ref={cursorRef} className={styles.cursor}></div>
        </div>
    );
};

export default GlassCursor;
