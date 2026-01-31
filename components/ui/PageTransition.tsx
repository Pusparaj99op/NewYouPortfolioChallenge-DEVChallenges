'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageTransition() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayPath, setDisplayPath] = useState('');
    const previousPath = useRef(pathname);

    // Refs for GSAP
    const overlayRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const dotsRef = useRef<HTMLDivElement[]>([]);

    const getPageName = useCallback((path: string) => {
        if (path === '/') return 'Home';
        if (path === '/quantitative-trading') return 'Trading Terminal';
        if (path === '/modern-web') return 'Modern Web';
        // Capitalize first letter and replace hyphens
        return path.slice(1).split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }, []);

    useEffect(() => {
        // Only trigger on actual navigation (not initial load)
        if (previousPath.current !== pathname && previousPath.current !== '') {
            setDisplayPath(getPageName(pathname));
            setIsTransitioning(true);
            previousPath.current = pathname;
        } else {
            previousPath.current = pathname;
        }
    }, [pathname, searchParams, getPageName]);

    useEffect(() => {
        if (!isTransitioning) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    setTimeout(() => setIsTransitioning(false), 100);
                }
            });

            // Initial states
            gsap.set(overlayRef.current, { yPercent: 100 });
            gsap.set(textRef.current, { y: 30, opacity: 0 });
            gsap.set(lineRef.current, { scaleX: 0 });
            gsap.set(dotsRef.current, { scale: 0, opacity: 0 });

            // Overlay slides in
            tl.to(overlayRef.current, {
                yPercent: 0,
                duration: 0.5,
                ease: 'power4.inOut'
            });

            // Line extends
            tl.to(lineRef.current, {
                scaleX: 1,
                duration: 0.4,
                ease: 'power2.out'
            }, '-=0.2');

            // Text reveals
            tl.to(textRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: 'power3.out'
            }, '-=0.2');

            // Dots animate
            tl.to(dotsRef.current, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                stagger: 0.1,
                ease: 'back.out(2)'
            }, '-=0.2');

            // Hold briefly
            tl.to({}, { duration: 0.3 });

            // Dots pulse
            tl.to(dotsRef.current, {
                scale: 1.3,
                duration: 0.2,
                stagger: 0.05,
                ease: 'power2.inOut',
                yoyo: true,
                repeat: 1
            });

            // Exit sequence
            tl.to(textRef.current, {
                y: -20,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in'
            });

            tl.to(lineRef.current, {
                scaleX: 0,
                duration: 0.3,
                ease: 'power2.in'
            }, '-=0.2');

            tl.to(dotsRef.current, {
                scale: 0,
                opacity: 0,
                duration: 0.2,
                stagger: 0.05,
                ease: 'power2.in'
            }, '-=0.2');

            // Overlay slides out (opposite direction)
            tl.to(overlayRef.current, {
                yPercent: -100,
                duration: 0.5,
                ease: 'power4.inOut'
            }, '-=0.1');

        }, overlayRef);

        return () => ctx.revert();
    }, [isTransitioning]);

    return (
        <AnimatePresence>
            {isTransitioning && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-[9998] flex flex-col items-center justify-center overflow-hidden pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%)'
                    }}
                >
                    {/* Animated gradient background */}
                    <motion.div
                        className="absolute inset-0 opacity-40"
                        animate={{
                            background: [
                                'radial-gradient(circle at 30% 50%, rgba(153,69,255,0.15) 0%, transparent 50%)',
                                'radial-gradient(circle at 70% 50%, rgba(20,241,149,0.15) 0%, transparent 50%)',
                                'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.15) 0%, transparent 50%)',
                            ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Horizontal line */}
                    <div
                        ref={lineRef}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-32 md:w-48 h-px origin-center"
                        style={{
                            background: 'linear-gradient(90deg, transparent, #9945FF, #14F195, transparent)'
                        }}
                    />

                    {/* Page name */}
                    <div ref={textRef} className="text-center relative z-10">
                        <p className="text-xs text-zinc-500 tracking-[0.3em] uppercase mb-2 font-mono">
                            Navigating to
                        </p>
                        <h2
                            className="text-2xl md:text-4xl font-bold tracking-tight"
                            style={{
                                background: 'linear-gradient(135deg, #fff 0%, #9945FF 50%, #14F195 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent'
                            }}
                        >
                            {displayPath}
                        </h2>
                    </div>

                    {/* Loading dots */}
                    <div className="absolute bottom-1/3 flex gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                ref={el => { if (el) dotsRef.current[i] = el; }}
                                className="w-2 h-2 rounded-full"
                                style={{
                                    background: ['#9945FF', '#00D4FF', '#14F195'][i]
                                }}
                            />
                        ))}
                    </div>

                    {/* Corner accents */}
                    {[
                        'top-4 left-4 border-t border-l',
                        'top-4 right-4 border-t border-r',
                        'bottom-4 left-4 border-b border-l',
                        'bottom-4 right-4 border-b border-r',
                    ].map((pos, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.3 }}
                            className={`absolute ${pos} w-6 h-6 border-zinc-700`}
                        />
                    ))}

                    {/* Scan line effect */}
                    <motion.div
                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            )}
        </AnimatePresence>
    );
}
