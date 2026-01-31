'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Refs for GSAP
    const preloaderRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const logoLettersRef = useRef<HTMLSpanElement[]>([]);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const gradient1Ref = useRef<HTMLDivElement>(null);
    const gradient2Ref = useRef<HTMLDivElement>(null);
    const gradient3Ref = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const lineLeftRef = useRef<HTMLDivElement>(null);
    const lineRightRef = useRef<HTMLDivElement>(null);
    const cornerRefs = useRef<HTMLDivElement[]>([]);

    const logoText = 'BlackObsidian';

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Master timeline
            const masterTl = gsap.timeline();

            // Initial states
            gsap.set(logoLettersRef.current, { y: 60, opacity: 0, rotateX: -90 });
            gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
            gsap.set(progressBarRef.current, { scaleX: 0, opacity: 0 });
            gsap.set(counterRef.current, { opacity: 0, scale: 0.8 });
            gsap.set(cornerRefs.current, { opacity: 0, scale: 0 });
            gsap.set([lineLeftRef.current, lineRightRef.current], { scaleX: 0 });

            // Gradient animations - smooth continuous motion
            gsap.to(gradient1Ref.current, {
                x: '30%',
                y: '20%',
                scale: 1.2,
                duration: 8,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });

            gsap.to(gradient2Ref.current, {
                x: '-25%',
                y: '-15%',
                scale: 1.3,
                duration: 10,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: 0.5
            });

            gsap.to(gradient3Ref.current, {
                x: '20%',
                y: '-25%',
                scale: 1.1,
                duration: 12,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: 1
            });

            // Glow pulse animation
            gsap.to(glowRef.current, {
                opacity: 0.4,
                scale: 1.1,
                duration: 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });

            // Letter stagger animation with smooth easing
            masterTl.to(logoLettersRef.current, {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.8,
                stagger: 0.04,
                ease: 'back.out(1.7)'
            });

            // Subtitle fade in
            masterTl.to(subtitleRef.current, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4');

            // Lines extend
            masterTl.to([lineLeftRef.current, lineRightRef.current], {
                scaleX: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, '-=0.3');

            // Progress bar reveal
            masterTl.to(progressBarRef.current, {
                scaleX: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.4');

            // Counter fade in
            masterTl.to(counterRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                ease: 'back.out(2)'
            }, '-=0.2');

            // Corners fade in with stagger
            masterTl.to(cornerRefs.current, {
                opacity: 0.5,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(2)'
            }, '-=0.3');

            // Progress animation with smooth easing
            const progressObj = { value: 0 };
            gsap.to(progressObj, {
                value: 100,
                duration: 2.5,
                ease: 'power2.inOut',
                onUpdate: () => {
                    const val = Math.round(progressObj.value);
                    setProgress(val);
                    if (progressFillRef.current) {
                        gsap.to(progressFillRef.current, {
                            width: `${val}%`,
                            duration: 0.1,
                            ease: 'none'
                        });
                    }
                },
                onComplete: () => {
                    // Exit animation sequence
                    const exitTl = gsap.timeline({
                        onComplete: () => setIsLoading(false)
                    });

                    // Smooth exit animations
                    exitTl.to(counterRef.current, {
                        opacity: 0,
                        y: -15,
                        duration: 0.3,
                        ease: 'power2.in'
                    });

                    exitTl.to(progressBarRef.current, {
                        scaleX: 0,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power3.in'
                    }, '-=0.2');

                    exitTl.to([lineLeftRef.current, lineRightRef.current], {
                        scaleX: 0,
                        duration: 0.4,
                        ease: 'power2.in'
                    }, '-=0.3');

                    exitTl.to(subtitleRef.current, {
                        opacity: 0,
                        y: -10,
                        duration: 0.3,
                        ease: 'power2.in'
                    }, '-=0.3');

                    exitTl.to(logoLettersRef.current, {
                        y: -40,
                        opacity: 0,
                        rotateX: 45,
                        duration: 0.4,
                        stagger: 0.02,
                        ease: 'power3.in'
                    }, '-=0.2');

                    exitTl.to(cornerRefs.current, {
                        opacity: 0,
                        scale: 0,
                        duration: 0.3,
                        stagger: 0.05,
                        ease: 'power2.in'
                    }, '-=0.3');

                    exitTl.to(preloaderRef.current, {
                        yPercent: -100,
                        duration: 0.8,
                        ease: 'power4.inOut'
                    }, '-=0.1');
                }
            });
        }, preloaderRef);

        return () => ctx.revert();
    }, []);

    if (!isLoading) return null;

    return (
        <>
            <AnimatePresence>
                <div
                    key="preloader-content"
                    ref={preloaderRef}
                    className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Motion Gradient Orbs */}
                    <div
                        ref={gradient1Ref}
                        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-30 blur-[120px] pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(153,69,255,0.6) 0%, rgba(153,69,255,0) 70%)'
                        }}
                    />
                    <div
                        ref={gradient2Ref}
                        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-25 blur-[100px] pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(20,241,149,0.5) 0%, rgba(20,241,149,0) 70%)'
                        }}
                    />
                    <div
                        ref={gradient3Ref}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[150px] pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(0,212,255,0) 70%)'
                        }}
                    />

                    {/* Center Glow */}
                    <div
                        ref={glowRef}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-20 blur-[80px] pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                        }}
                    />

                    {/* Subtle grid overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                        `,
                            backgroundSize: '80px 80px'
                        }}
                    />

                    {/* Logo with letter animation */}
                    <div ref={logoRef} className="text-center mb-10 relative z-10">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight flex justify-center perspective-[1000px]">
                            {logoText.split('').map((letter, i) => (
                                <span
                                    key={i}
                                    ref={el => { if (el) logoLettersRef.current[i] = el; }}
                                    className={`inline-block ${i < 5 ? 'text-white' : ''}`}
                                    style={i >= 5 ? {
                                        background: 'linear-gradient(135deg, #9945FF 0%, #00D4FF 50%, #14F195 100%)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        backgroundSize: '200% 200%',
                                        animation: 'gradientShift 4s ease infinite'
                                    } : undefined}
                                >
                                    {letter}
                                </span>
                            ))}
                        </h1>

                        <p
                            ref={subtitleRef}
                            className="text-xs text-zinc-500 tracking-[0.3em] uppercase mt-4 font-medium"
                        >
                            Asset Management
                        </p>
                    </div>

                    {/* Decorative lines */}
                    <div className="flex items-center gap-6 mb-10">
                        <div
                            ref={lineLeftRef}
                            className="w-16 md:w-24 h-px origin-right"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(153,69,255,0.5))'
                            }}
                        />
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] animate-pulse" />
                        <div
                            ref={lineRightRef}
                            className="w-16 md:w-24 h-px origin-left"
                            style={{
                                background: 'linear-gradient(90deg, rgba(20,241,149,0.5), transparent)'
                            }}
                        />
                    </div>

                    {/* Progress bar */}
                    <div
                        ref={progressBarRef}
                        className="w-64 md:w-80 relative z-10 origin-center"
                    >
                        {/* Track */}
                        <div className="h-[2px] bg-white/5 rounded-full overflow-hidden relative">
                            {/* Fill */}
                            <div
                                ref={progressFillRef}
                                className="h-full rounded-full relative"
                                style={{
                                    background: 'linear-gradient(90deg, #9945FF 0%, #00D4FF 50%, #14F195 100%)',
                                    width: '0%',
                                    boxShadow: '0 0 20px rgba(153,69,255,0.5), 0 0 40px rgba(20,241,149,0.3)'
                                }}
                            />
                        </div>

                        {/* Counter */}
                        <div
                            ref={counterRef}
                            className="mt-8 flex justify-center items-baseline gap-1"
                        >
                            <span
                                className="text-4xl font-mono font-light tabular-nums"
                                style={{
                                    background: 'linear-gradient(135deg, #9945FF, #14F195)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent'
                                }}
                            >
                                {progress.toString().padStart(2, '0')}
                            </span>
                            <span className="text-sm text-zinc-600 font-mono">%</span>
                        </div>
                    </div>

                    {/* Corner accents */}
                    {[
                        { pos: 'top-8 left-8', rotate: 0 },
                        { pos: 'top-8 right-8', rotate: 90 },
                        { pos: 'bottom-8 right-8', rotate: 180 },
                        { pos: 'bottom-8 left-8', rotate: 270 },
                    ].map((corner, i) => (
                        <div
                            key={`corner-${i}`}
                            ref={el => { if (el) cornerRefs.current[i] = el; }}
                            className={`absolute ${corner.pos} w-8 h-8 pointer-events-none`}
                            style={{ transform: `rotate(${corner.rotate}deg)` }}
                        >
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path
                                    d="M0 16V4C0 1.79086 1.79086 0 4 0H16"
                                    stroke={`url(#cornerGradient-${i})`}
                                    strokeWidth="1.5"
                                />
                                <defs>
                                    <linearGradient id={`cornerGradient-${i}`} x1="0" y1="16" x2="16" y2="0">
                                        <stop stopColor="#9945FF" />
                                        <stop offset="1" stopColor="#14F195" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    ))}

                    {/* Bottom text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-8 text-[10px] text-zinc-600 tracking-[0.2em] uppercase font-mono"
                    >
                        Initializing Experience
                    </motion.p>
                </div>
            </AnimatePresence>

            <style jsx global>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>
        </>
    );
}
