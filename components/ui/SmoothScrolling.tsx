"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollingProps {
    children: ReactNode;
}

export default function SmoothScrolling({ children }: SmoothScrollingProps) {
    const lenisRef = useRef<any>(null);

    useEffect(() => {
        // Integrate GSAP ScrollTrigger with Lenis
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        gsap.ticker.add(update);

        // Disable Lenis RAF loop when using GSAP ticker
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    // Update ScrollTrigger on Lenis scroll
    useEffect(() => {
        const handleScroll = () => {
            ScrollTrigger.update();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <ReactLenis
            ref={lenisRef}
            root
            options={{
                lerp: 0.08, // Smoother interpolation
                duration: 1.2, // Longer duration for more luxurious feel
                smoothWheel: true,
                wheelMultiplier: 0.8, // Slightly slower wheel scrolling
                touchMultiplier: 1.5, // Faster touch scrolling for mobile
                infinite: false,
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
            }}
        >
            {children}
        </ReactLenis>
    );
}
