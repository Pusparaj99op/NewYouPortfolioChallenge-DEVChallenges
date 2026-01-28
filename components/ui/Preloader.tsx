'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';

// Dynamically import Lottie for SSR safety
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Animated geometric loader animation data (inline for simplicity)
const loaderAnimationData = {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 200,
    h: 200,
    nm: "Obsidian Loader",
    ddd: 0,
    assets: [],
    layers: [
        {
            ddd: 0,
            ind: 1,
            ty: 4,
            nm: "Shape 1",
            sr: 1,
            ks: {
                o: { a: 0, k: 100, ix: 11 },
                r: {
                    a: 1,
                    k: [
                        { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
                        { t: 120, s: [360] }
                    ],
                    ix: 10
                },
                p: { a: 0, k: [100, 100, 0], ix: 2 },
                a: { a: 0, k: [0, 0, 0], ix: 1 },
                s: {
                    a: 1,
                    k: [
                        { i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 0, s: [80, 80, 100] },
                        { i: { x: [0.667, 0.667, 0.667], y: [1, 1, 1] }, o: { x: [0.333, 0.333, 0.333], y: [0, 0, 0] }, t: 60, s: [100, 100, 100] },
                        { t: 120, s: [80, 80, 100] }
                    ],
                    ix: 6
                }
            },
            ao: 0,
            shapes: [
                {
                    ty: "gr",
                    it: [
                        {
                            ind: 0,
                            ty: "sh",
                            ix: 1,
                            ks: {
                                a: 0,
                                k: {
                                    i: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                    o: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                                    v: [[0, -50], [43.3, -25], [43.3, 25], [0, 50], [-43.3, 25], [-43.3, -25]],
                                    c: true
                                },
                                ix: 2
                            },
                            nm: "Hexagon"
                        },
                        {
                            ty: "st",
                            c: { a: 0, k: [0.6, 0.271, 1, 1], ix: 3 },
                            o: { a: 0, k: 100, ix: 4 },
                            w: { a: 0, k: 3, ix: 5 },
                            lc: 2,
                            lj: 2,
                            nm: "Stroke"
                        },
                        {
                            ty: "tr",
                            p: { a: 0, k: [0, 0], ix: 2 },
                            a: { a: 0, k: [0, 0], ix: 1 },
                            s: { a: 0, k: [100, 100], ix: 3 },
                            r: { a: 0, k: 0, ix: 6 },
                            o: { a: 0, k: 100, ix: 7 },
                            sk: { a: 0, k: 0, ix: 4 },
                            sa: { a: 0, k: 0, ix: 5 },
                            nm: "Transform"
                        }
                    ],
                    nm: "Hexagon",
                    np: 2,
                    cix: 2,
                    bm: 0
                }
            ],
            ip: 0,
            op: 120,
            st: 0,
            bm: 0
        },
        {
            ddd: 0,
            ind: 2,
            ty: 4,
            nm: "Shape 2",
            sr: 1,
            ks: {
                o: { a: 0, k: 60, ix: 11 },
                r: {
                    a: 1,
                    k: [
                        { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
                        { t: 120, s: [-360] }
                    ],
                    ix: 10
                },
                p: { a: 0, k: [100, 100, 0], ix: 2 },
                a: { a: 0, k: [0, 0, 0], ix: 1 },
                s: { a: 0, k: [60, 60, 100], ix: 6 }
            },
            ao: 0,
            shapes: [
                {
                    ty: "gr",
                    it: [
                        {
                            ind: 0,
                            ty: "sh",
                            ix: 1,
                            ks: {
                                a: 0,
                                k: {
                                    i: [[0, 0], [0, 0], [0, 0]],
                                    o: [[0, 0], [0, 0], [0, 0]],
                                    v: [[0, -50], [43.3, 25], [-43.3, 25]],
                                    c: true
                                },
                                ix: 2
                            },
                            nm: "Triangle"
                        },
                        {
                            ty: "st",
                            c: { a: 0, k: [0.078, 0.945, 0.584, 1], ix: 3 },
                            o: { a: 0, k: 100, ix: 4 },
                            w: { a: 0, k: 2, ix: 5 },
                            lc: 2,
                            lj: 2,
                            nm: "Stroke"
                        },
                        {
                            ty: "tr",
                            p: { a: 0, k: [0, 0], ix: 2 },
                            a: { a: 0, k: [0, 0], ix: 1 },
                            s: { a: 0, k: [100, 100], ix: 3 },
                            r: { a: 0, k: 0, ix: 6 },
                            o: { a: 0, k: 100, ix: 7 },
                            sk: { a: 0, k: 0, ix: 4 },
                            sa: { a: 0, k: 0, ix: 5 },
                            nm: "Transform"
                        }
                    ],
                    nm: "Triangle",
                    np: 2,
                    cix: 2,
                    bm: 0
                }
            ],
            ip: 0,
            op: 120,
            st: 0,
            bm: 0
        }
    ],
    markers: []
};

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const preloaderRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const lottieRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Entrance animations
        const tl = gsap.timeline();

        tl.fromTo(lottieRef.current,
            { scale: 0, opacity: 0, rotation: -180 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
        );

        tl.fromTo(logoRef.current,
            { y: 30, opacity: 0, filter: 'blur(10px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' },
            '-=0.4'
        );

        tl.fromTo(progressRef.current,
            { width: 0, opacity: 0 },
            { width: '12rem', opacity: 1, duration: 0.5, ease: 'power2.out' },
            '-=0.3'
        );

        // Simulate loading progress with easing
        const targetProgress = { value: 0 };
        gsap.to(targetProgress, {
            value: 100,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
                setProgress(targetProgress.value);
            },
            onComplete: () => {
                // Exit animation sequence
                const exitTl = gsap.timeline({
                    onComplete: () => setIsLoading(false)
                });

                exitTl.to(progressRef.current, {
                    opacity: 0,
                    y: 10,
                    duration: 0.3
                });

                exitTl.to(logoRef.current, {
                    y: -20,
                    opacity: 0,
                    filter: 'blur(5px)',
                    duration: 0.4
                }, '-=0.2');

                exitTl.to(lottieRef.current, {
                    scale: 0,
                    rotation: 180,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in'
                }, '-=0.3');

                exitTl.to(preloaderRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: 'power4.inOut',
                });
            }
        });

        return () => {
            tl.kill();
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            ref={preloaderRef}
            className="preloader fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-green/10 animate-pulse" />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50" />

            {/* Lottie Animation */}
            <div ref={lottieRef} className="w-32 h-32 mb-8">
                <Lottie
                    animationData={loaderAnimationData}
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            {/* Logo Animation */}
            <div ref={logoRef} className="text-center">
                <div className="text-4xl font-black tracking-tighter">
                    <span className="text-white">Black</span>
                    <span className="gradient-text">Obsidian</span>
                </div>
                <div className="text-sm text-text-muted tracking-widest mt-2">
                    ASSET MANAGEMENT
                </div>
            </div>

            {/* Progress Bar */}
            <div ref={progressRef} className="mt-8 w-48">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-green transition-all duration-100 relative"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                </div>

                {/* Loading Text */}
                <div className="mt-4 text-xs text-text-muted font-mono text-center flex items-center justify-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                    {Math.min(Math.round(progress), 100)}%
                </div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-accent-purple/50 animate-float"
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 3) * 20}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + i}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
