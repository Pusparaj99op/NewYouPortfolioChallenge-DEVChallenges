'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import MagneticButton from '@/components/ui/MagneticButton';
import ShinyText from '@/components/ShinyText';

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
    // ... (stat component logic unchanged)
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
                    duration: 2,
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
        <div ref={containerRef} className="text-center group cursor-default relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/0 via-accent-purple/5 to-accent-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
            <div className="relative p-4 rounded-xl transition-all duration-300 group-hover:bg-white/[0.02]">
                <div
                    ref={valueRef}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-accent-green transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-mono), "Fira Code", monospace', fontVariantNumeric: 'tabular-nums' }}
                >
                    0{value.replace(/[0-9.]/g, '')}
                </div>
                <div className="text-xs sm:text-sm text-text-muted uppercase tracking-[0.2em] font-medium">
                    {label}
                </div>
            </div>
        </div>
    );
}

export default function Hero() {
    const heroRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const centerOrbRef = useRef<HTMLDivElement>(null);
    const [isAnimated, setIsAnimated] = useState(false);

    // Lenis scroll velocity for parallax
    const lenis = useLenis();

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
                    from: 'center' // Changed to center for symmetry
                },
                duration: 1,
                ease: 'power4.out',
                onComplete: () => setIsAnimated(true)
            }, '-=0.4');

            // Subtitle with blur reveal
            tl.from(subtitleRef.current, {
                y: 60,
                opacity: 0,
                filter: 'blur(10px)',
                duration: 1.2,
            }, '-=0.6');

            // Tagline slide (centered)
            tl.from('.hero-tagline', {
                y: 40,
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

            // Geometric Background Animations
            if (centerOrbRef.current) {
                gsap.to(centerOrbRef.current, {
                    scale: 1.1,
                    opacity: 0.8,
                    duration: 4,
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true
                });
            }

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
                y: 100,
                opacity: 0.2,
                scale: 0.95,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: '50% top',
                    scrub: 1
                }
            });

            // Buttons parallax
            gsap.to(buttonsRef.current, {
                y: 80,
                opacity: 0,
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: '30% top',
                    end: '60% top',
                    scrub: 1
                }
            });

        }, heroRef);

        return () => ctx.revert();
    }, []);

    // Scroll Interactivity
    useEffect(() => {
        if (!lenis) return;

        const handleScroll = () => {
            const velocity = lenis.velocity;
            // Add subtle rotation based on scroll velocity
            if (centerOrbRef.current) {
                gsap.to(centerOrbRef.current, {
                    rotation: velocity * 2,
                    duration: 0.5,
                    overwrite: 'auto'
                });
            }
        };

        lenis.on('scroll', handleScroll);
        return () => lenis.off('scroll', handleScroll);
    }, [lenis]);

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
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background-primary pt-40 pb-20"
        >
            {/* Geometric Symmetric Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                {/* 1. Strict Grid Background */}
                <div
                    ref={gridRef}
                    className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] opacity-60"
                />

                {/* 2. Central Symmetric Orb/Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-accent-purple/5 rounded-full blur-[120px]" />

                <div
                    ref={centerOrbRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full flex items-center justify-center opacity-40 shadow-[0_0_100px_rgba(153,69,255,0.1)]"
                >
                    <div className="w-[400px] h-[400px] border border-white/5 rounded-full flex items-center justify-center">
                        <div className="w-[200px] h-[200px] border border-white/5 rounded-full bg-accent-purple/5 blur-3xl animate-pulse" />
                    </div>
                </div>

                {/* 3. Balanced Side Accents */}
                <div className="absolute top-1/4 left-10 w-px h-64 bg-gradient-to-b from-transparent via-accent-purple/20 to-transparent" />
                <div className="absolute top-1/4 right-10 w-px h-64 bg-gradient-to-b from-transparent via-accent-green/20 to-transparent" />

                <div className="absolute bottom-1/4 left-20 w-32 h-32 border border-accent-purple/10 rounded-full blur-[60px]" />
                <div className="absolute bottom-1/4 right-20 w-32 h-32 border border-accent-green/10 rounded-full blur-[60px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                <div className="max-w-5xl mx-auto w-full">
                    {/* Enhanced Badge - Centered */}
                    <div className="flex justify-center w-full mb-12">
                        <div className="hero-badge inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-accent-purple text-sm font-medium hover:bg-white/[0.05] hover:border-accent-purple/30 transition-all duration-300 cursor-default group backdrop-blur-sm">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green"></span>
                            </span>
                            <span className="group-hover:text-white transition-colors">Available for new projects</span>
                        </div>
                    </div>

                    <h1
                        ref={titleRef}
                        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-10 leading-[0.85] perspective-1000 select-none"
                    >

                        <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-4 sm:gap-8 hover:scale-[1.02] transition-transform duration-500">
                                <div className="inline-block relative">
                                    <ShinyText
                                        text="Design"
                                        disabled={false}
                                        speed={2}
                                        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter"
                                    />
                                    <span className="absolute -bottom-2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></span>
                                </div>
                                <span className="text-accent-purple/50 text-4xl sm:text-6xl font-light">×</span>
                                <span className="gradient-text inline-block">
                                    <SplitText text="Trade" isAnimated={isAnimated} />
                                </span>
                            </div>
                            <ShinyText
                                text="Build"
                                disabled={false}
                                speed={2}
                                className="text-white mt-2 inline-block hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                    </h1>

                    <p
                        ref={subtitleRef}
                        className="text-lg sm:text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        Hi, I&apos;m <ShinyText text="Pranay Gajbhiye" speed={2} className="text-white font-medium inline-block" />.
                        I engineer high-performance systems for{' '}
                        <span className="relative inline-block group cursor-help">
                            <ShinyText
                                text="quantitative trading"
                                speed={2}
                                color="#14F195"
                                className="font-medium"
                            />
                            <span className="absolute bottom-0 left-0 w-full h-px bg-accent-green/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </span>{' '}
                        and{' '}
                        <span className="relative inline-block group cursor-help">
                            <ShinyText
                                text="modern web"
                                speed={2}
                                color="#9945FF"
                                className="font-medium"
                            />
                            <span className="absolute bottom-0 left-0 w-full h-px bg-accent-purple/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </span>.
                    </p>

                    <div className="hero-tagline mb-14 flex justify-center w-full">
                        <p className="text-xs sm:text-sm text-text-muted font-mono tracking-[0.2em] uppercase py-2 border-y border-white/5 inline-block px-8">
                            Systematic Research • Disciplined Execution
                        </p>
                    </div>

                    <div
                        ref={buttonsRef}
                        className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full"
                    >
                        <MagneticButton strength={40}>
                            <a
                                href="#projects"
                                className="btn-primary min-w-[200px] text-lg h-14 inline-flex items-center justify-center gap-2 group hover:gap-4 transition-all"
                            >
                                <span>Explore Work</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </MagneticButton>
                        <MagneticButton strength={40}>
                            <a
                                href="#contact"
                                className="btn-secondary min-w-[200px] text-lg h-14 inline-flex items-center justify-center gap-2 group hover:gap-4 transition-all backdrop-blur-sm bg-white/[0.02]"
                            >
                                <span>Contact Me</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </a>
                        </MagneticButton>
                    </div>
                </div>

                {/* Enhanced Stats Strip - Symmetric */}
                <div
                    ref={statsRef}
                    className="mt-28 w-full max-w-6xl border-t border-white/5 pt-12"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
                        {stats.map((stat, i) => (
                            <AnimatedStat
                                key={stat.label}
                                value={stat.value}
                                label={stat.label}
                                delay={i * 0.1}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Bottom Fixed */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] uppercase tracking-[0.3em] font-light">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
            </div>
        </section>
    );
}
