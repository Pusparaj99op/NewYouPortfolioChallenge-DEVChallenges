'use client';

import React, { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import MagneticButton from '@/components/ui/MagneticButton';
import ShinyText from '@/components/ShinyText';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Torus, MeshTransmissionMaterial, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

// Text split component for character-by-character animation
function SplitText({ text, className, isAnimated = false }: { text: string; className?: string; isAnimated?: boolean }) {
    return (
        <span className={className}>
            {text.split('').map((char, i) => (
                <span
                    key={i}
                    className="split-char inline-block"
                    style={{ display: char === ' ' ? 'inline' : (isAnimated ? 'inline' : 'inline-block') }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </span>
    );
}

// Animated counter component with GSAP optimized for performance
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
    // Use ref instead of state to avoid re-renders during animation
    const valueRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!containerRef.current || !valueRef.current || hasAnimated.current) return;

        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
        const suffix = value.replace(/[0-9.]/g, '');

        // Create ScrollTrigger for the stat
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top 85%',
            onEnter: () => {
                if (hasAnimated.current) return;
                hasAnimated.current = true;

                const obj = { val: 0 };
                gsap.to(obj, {
                    val: numericValue,
                    duration: 2.5,
                    delay: delay,
                    ease: 'power3.out',
                    onUpdate: () => {
                        if (valueRef.current) {
                            if (value.includes('.')) {
                                valueRef.current.textContent = obj.val.toFixed(1) + suffix;
                            } else {
                                valueRef.current.textContent = Math.floor(obj.val) + suffix;
                            }
                        }
                    }
                });
            }
        });
    }, [value, delay]);

    return (
        <div ref={containerRef} className="group cursor-default relative stat-card">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/0 via-accent-purple/5 to-accent-green/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl blur-xl" />
            <div className="relative p-5 sm:p-6 rounded-2xl transition-all duration-500 group-hover:bg-white/[0.03] border border-transparent group-hover:border-white/[0.08]">
                {/* Value with enhanced styling */}
                <div
                    ref={valueRef}
                    className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 group-hover:text-accent-green transition-colors duration-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    style={{ fontFamily: 'var(--font-mono), "Fira Code", monospace', fontVariantNumeric: 'tabular-nums' }}
                >
                    0{value.replace(/[0-9.]/g, '')}
                </div>
                {/* Label with subtle accent line */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-px bg-gradient-to-r from-accent-purple/50 to-transparent group-hover:w-6 transition-all duration-300" />
                    <div className="text-[10px] sm:text-xs text-text-muted uppercase tracking-[0.2em] font-medium group-hover:text-text-secondary transition-colors duration-300">
                        {label}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Animated gradient orb component
function GradientOrb({ className, color, delay = 0 }: { className: string; color: string; delay?: number }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
                x: [0, 30, -20, 0],
                y: [0, -20, 30, 0]
            }}
            transition={{
                duration: 8,
                delay,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
            style={{
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                filter: 'blur(60px)'
            }}
        />
    );
}

// Mouse follower gradient
function MouseGradient() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { damping: 25, stiffness: 100 });
    const springY = useSpring(mouseY, { damping: 25, stiffness: 100 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 200);
            mouseY.set(e.clientY - 200);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 opacity-30"
            style={{
                x: springX,
                y: springY,
                background: 'radial-gradient(circle, rgba(153,69,255,0.15) 0%, transparent 70%)',
                filter: 'blur(40px)'
            }}
        />
    );
}

// 3D Glass Torus Model with transmission material
function GlassTorusModel() {
    const torusRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (torusRef.current) {
            torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
            torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    return (
        <group scale={1.5}>




            {/* Glass Torus - smaller and more transparent */}
            <Torus ref={torusRef} args={[1, 0.4, 32, 100]}>
                <MeshTransmissionMaterial
                    thickness={0.1}
                    roughness={0}
                    transmission={1}
                    ior={1.2}
                    chromaticAberration={0.02}
                    backside={true}
                    distortion={0.2}
                    distortionScale={0.2}
                    temporalDistortion={0.05}
                    clearcoat={1}
                    clearcoatRoughness={0}
                />
            </Torus>
        </group>
    );
}

// Glass Torus Scene - embedded Canvas
const GlassTorusScene = React.forwardRef<HTMLDivElement>((props, ref) => {
    return (
        <div ref={ref} className="absolute inset-0 pointer-events-none z-50">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <GlassTorusModel />
                    <directionalLight intensity={3} position={[0, 2, 3]} />
                    <ambientLight intensity={0.5} />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
});

GlassTorusScene.displayName = 'GlassTorusScene';

export default function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const gradient1Ref = useRef<HTMLDivElement>(null);
    const gradient2Ref = useRef<HTMLDivElement>(null);
    const gradient3Ref = useRef<HTMLDivElement>(null);
    const glassTorusRef = useRef<HTMLDivElement>(null);
    const [isAnimated, setIsAnimated] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Lenis scroll velocity for parallax
    const lenis = useLenis();

    // Mouse tracking for interactive elements
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setMousePosition({
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height
                });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            // Split text character animation for title words
            const splitChars = gsap.utils.toArray('.split-char') as HTMLElement[];

            // Initial state - hide all characters
            gsap.set(splitChars, {
                opacity: 0,
                y: 100,
                rotateX: -90,
                transformOrigin: 'center bottom'
            });

            // Animate badge first
            tl.from('.hero-badge', {
                scale: 0,
                opacity: 0,
                x: -50,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)'
            });

            // Stagger character reveal for each word group
            tl.to(splitChars, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                stagger: {
                    each: 0.03,
                    from: 'start' // Changed to start for left alignment flow
                },
                duration: 1,
                ease: 'power4.out',
                onComplete: () => setIsAnimated(true)
            }, '-=0.4');

            // Subtitle with blur reveal
            tl.from(subtitleRef.current, {
                x: -30,
                opacity: 0,
                filter: 'blur(10px)',
                duration: 1.2,
            }, '-=0.6');

            // Tagline slide
            tl.from('.hero-tagline', {
                x: -20,
                opacity: 0,
                duration: 0.8,
            }, '-=0.8');

            // Buttons with elastic bounce
            tl.from(buttonsRef.current?.children || [], {
                y: 40,
                opacity: 0,
                scale: 0.8,
                stagger: 0.15,
                duration: 0.8,
                ease: 'elastic.out(1, 0.8)'
            }, '-=0.6');

            // Stats with distinct reveal
            tl.from(statsRef.current, {
                y: 60,
                opacity: 0,
                duration: 0.8,
            }, '-=0.4');

            // Grid Parallax
            if (gridRef.current) {
                gsap.to(gridRef.current, {
                    backgroundPosition: '0px 100px',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1
                    }
                });
            }

            // Title parallax on scroll
            gsap.to(titleRef.current, {
                y: 50,
                opacity: 0.5,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: '50% top',
                    scrub: 1
                }
            });

            // Glass Torus parallax - moves independently to create depth
            if (glassTorusRef.current) {
                gsap.to(glassTorusRef.current, {
                    y: -150,
                    scale: 0.85,
                    opacity: 0.7,
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1.5,
                    }
                });
            }

        }, heroRef);

        return () => ctx.revert();
    }, []);

    const stats = [
        { label: 'Years Experience', value: '5+' },
        { label: 'Projects Built', value: '20+' },
        { label: 'Sharpe Ratio', value: '2.1' },
        { label: 'Uptime', value: '99.9%' },
    ];

    return (
        <section
            ref={heroRef}
            id="home"
            className="relative min-h-screen flex items-center overflow-hidden bg-background-primary pt-20"
        >
            {/* Mouse Following Gradient */}
            <MouseGradient />

            {/* Premium Geometric Background with Framer Motion */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                {/* Animated Grid with Gradient Overlay */}
                <motion.div
                    ref={gridRef}
                    className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_30%,transparent_100%)]"
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Premium Motion Gradient Orbs */}
                <GradientOrb
                    className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full opacity-20"
                    color="rgba(153,69,255,0.15)"
                    delay={0}
                />
                <GradientOrb
                    className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
                    color="rgba(20,241,149,0.12)"
                    delay={1}
                />
                <GradientOrb
                    className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
                    color="rgba(0,212,255,0.1)"
                    delay={2}
                />
                <GradientOrb
                    className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full opacity-10"
                    color="rgba(255,107,107,0.08)"
                    delay={3}
                />

                {/* Animated mesh gradient background */}
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        background: [
                            'radial-gradient(ellipse at 20% 30%, rgba(153,69,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(20,241,149,0.06) 0%, transparent 50%)',
                            'radial-gradient(ellipse at 80% 30%, rgba(153,69,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(20,241,149,0.06) 0%, transparent 50%)',
                            'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(153,69,255,0.04) 0%, transparent 70%)',
                            'radial-gradient(ellipse at 20% 30%, rgba(153,69,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(20,241,149,0.06) 0%, transparent 50%)',
                        ]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                />

                {/* Animated Side Accent Lines */}
                <motion.div
                    className="absolute top-1/4 left-8 w-px bg-gradient-to-b from-transparent via-accent-purple/50 to-transparent"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 192, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                />
                <motion.div
                    className="absolute top-1/3 left-8 h-px bg-gradient-to-r from-accent-purple/50 to-transparent"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 96, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                />

                {/* Floating Particles Removed */}

                {/* Noise Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

                {/* Scan line effect */}
                <motion.div
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/20 to-transparent"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex flex-col items-center justify-center gap-12 lg:gap-16">

                    {/* Content */}
                    <div className="flex flex-col items-center text-center w-full max-w-5xl z-20">
                        {/* Premium Status Badge */}
                        <div className="mb-12 mt-20">
                            <div className="hero-badge inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/10 text-sm font-medium hover:bg-white/[0.06] hover:border-accent-green/30 transition-all duration-500 cursor-default group backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-60"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green shadow-[0_0_15px_rgba(20,241,149,0.8)]"></span>
                                </span>
                                <span className="text-gray-200 tracking-wide group-hover:text-white transition-colors duration-300">Available for new projects</span>
                            </div>
                        </div>

                        {/* Title with 3D Glass Effect Overlay */}
                        <div className="relative w-full">
                            {/* Glass Torus 3D Effect */}
                            <GlassTorusScene ref={glassTorusRef} />
                            <h1
                                ref={titleRef}
                                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-[-0.04em] mb-10 leading-[0.85] perspective-1000 select-none relative z-10"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                                        <div className="inline-block relative group">
                                            <ShinyText
                                                text="Design"
                                                disabled={false}
                                                speed={3}
                                                shineColor="#ffffff"
                                                color="#e5e5e5"
                                                className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] font-black tracking-[-0.04em] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                            />
                                            <span className="absolute -bottom-2 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-accent-purple/50 transition-all duration-500 blur-sm"></span>
                                        </div>
                                        <span className="text-accent-purple/60 text-4xl sm:text-5xl md:text-6xl font-extralight animate-pulse-slow">×</span>
                                        <span className="gradient-text-premium inline-block drop-shadow-[0_0_50px_rgba(20,241,149,0.4)] text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem]">
                                            <SplitText text="Trade" isAnimated={isAnimated} />
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <ShinyText
                                            text="Build"
                                            disabled={false}
                                            speed={3}
                                            shineColor="#ffffff"
                                            color="#e5e5e5"
                                            className="text-white mt-[-10px] inline-block drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem]"
                                        />
                                        <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-accent-purple/30 animate-ping-slow opacity-50" />
                                    </div>
                                </div>
                            </h1>
                        </div>

                        <p
                            ref={subtitleRef}
                            className="text-lg sm:text-xl md:text-[1.35rem] text-text-secondary mb-8 max-w-xl leading-[1.8] font-light"
                        >
                            Hi, I&apos;m <ShinyText text="Pranay Gajbhiye" speed={3} shineColor="#ffffff" color="#ffffff" className="text-white font-semibold inline-block" />.
                            I engineer high-performance systems for{' '}
                            <span className="relative inline-block group cursor-pointer">
                                <ShinyText
                                    text="Quantitative Trading"
                                    link="/quantitative-trading"
                                    speed={3}
                                    color="#14F195"
                                    shineColor="#5BFFB5"
                                    className="font-semibold hover:drop-shadow-[0_0_12px_rgba(20,241,149,0.5)] transition-all duration-300"
                                />
                                <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-gradient-to-r from-accent-green/80 to-accent-green/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                            </span>{' '}
                            and{' '}
                            <span className="relative inline-block group cursor-pointer">
                                <ShinyText
                                    text="Modern Web"
                                    link="/modern-web"
                                    speed={3}
                                    color="#9945FF"
                                    shineColor="#C99FFF"
                                    className="font-semibold hover:drop-shadow-[0_0_12px_rgba(153,69,255,0.5)] transition-all duration-300"
                                />
                                <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-gradient-to-r from-accent-purple/80 to-accent-purple/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                            </span>.
                        </p>

                        <div className="hero-tagline mb-12">
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-12 h-px bg-gradient-to-r from-accent-purple/50 to-transparent" />
                                <p className="text-xs sm:text-sm text-text-muted font-mono tracking-[0.25em] uppercase flex items-center gap-3">
                                    <span className="text-accent-green/80">Systematic Research</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-purple/60" />
                                    <span className="text-accent-purple/80">Disciplined Execution</span>
                                </p>
                            </div>
                        </div>

                        <div
                            ref={buttonsRef}
                            className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto"
                        >
                            <MagneticButton strength={40}>
                                <a
                                    href="#projects"
                                    className="btn-primary min-w-[200px] text-lg h-16 inline-flex items-center justify-center gap-3 group hover:gap-5 transition-all shadow-[0_0_20px_rgba(153,69,255,0.3)] hover:shadow-[0_0_30px_rgba(20,241,149,0.4)]"
                                >
                                    <span className="font-semibold tracking-wide">Explore Work</span>
                                    <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </MagneticButton>
                            <MagneticButton strength={40}>
                                <a
                                    href="#contact"
                                    className="btn-secondary min-w-[200px] text-lg h-16 inline-flex items-center justify-center gap-3 group hover:gap-5 transition-all glass-button-white bg-white/[0.05] border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-xl"
                                >
                                    <span className="font-semibold tracking-wide">Contact Me</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </a>
                            </MagneticButton>
                        </div>
                    </div>

                    {/* Premium 3D Visualization - Background/Behind */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] pointer-events-none z-0 opacity-40"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        {/* Multi-layer Animated Glow Effects */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(153,69,255,0.25) 0%, rgba(153,69,255,0.1) 40%, transparent 70%)',
                                filter: 'blur(120px)'
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.6, 0.8, 0.6]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 60%)',
                                filter: 'blur(80px)'
                            }}
                            animate={{
                                scale: [1, 1.15, 1],
                                rotate: [0, 180, 360]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(20,241,149,0.1) 0%, transparent 60%)',
                                filter: 'blur(60px)'
                            }}
                            animate={{
                                scale: [1, 1.2, 1],
                                x: [0, 20, -20, 0],
                                y: [0, -20, 20, 0]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Decorative Rings with Framer Motion */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-white/[0.08] rounded-full"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/[0.03] rounded-full"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.8, delay: 0.6 }}
                        />
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] border border-dashed border-white/[0.06] rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] border border-dotted border-accent-purple/20 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Orbital dots removed */}
                    </motion.div>

                </div>

                {/* Premium Stats Strip with Enhanced Animations */}
                <motion.div
                    ref={statsRef}
                    className="mt-24 lg:mt-36 w-full relative"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    {/* Animated Top Border */}
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(153,69,255,0.3), rgba(20,241,149,0.3), transparent)'
                        }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                    <div className="pt-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.6,
                                        delay: i * 0.1,
                                        ease: [0.25, 0.1, 0.25, 1]
                                    }}
                                >
                                    <AnimatedStat
                                        value={stat.value}
                                        label={stat.label}
                                        delay={i * 0.15}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Premium Scroll Indicator with Framer Motion */}
            <motion.div
                className="absolute bottom-12 right-12 flex flex-col items-center gap-4 hidden lg:flex group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.4, y: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2 }}
            >
                <motion.span
                    className="text-[10px] uppercase tracking-[0.35em] font-light writing-mode-vertical text-white/80 group-hover:text-accent-green transition-colors duration-300"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    Scroll
                </motion.span>
                <div className="relative">
                    <motion.div
                        className="w-px h-14 bg-gradient-to-b from-white/50 via-white/20 to-transparent"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 1, delay: 2.2 }}
                        style={{ transformOrigin: 'top' }}
                    />
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-accent-green"
                        animate={{
                            top: ['0%', '100%', '0%'],
                            opacity: [1, 0.3, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            </motion.div>
        </section>
    );
}
