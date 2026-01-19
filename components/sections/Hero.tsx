'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import MagneticButton from '@/components/ui/MagneticButton';

// Animated counter component
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
    const [displayValue, setDisplayValue] = useState('0');
    const statRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
        const suffix = value.replace(/[0-9.]/g, '');
        const duration = 2000;
        const startTime = Date.now() + delay * 1000;

        const animate = () => {
            const now = Date.now();
            if (now < startTime) {
                requestAnimationFrame(animate);
                return;
            }
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = numericValue * eased;

            if (value.includes('.')) {
                setDisplayValue(current.toFixed(1) + suffix);
            } else {
                setDisplayValue(Math.floor(current) + suffix);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value, delay]);

    return (
        <div ref={statRef} className="text-center group cursor-default relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/0 via-accent-purple/5 to-accent-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
            <div className="relative p-4 rounded-xl transition-all duration-300 group-hover:bg-white/[0.02]">
                <div
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-accent-green transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-mono), "Fira Code", monospace', fontVariantNumeric: 'tabular-nums' }}
                >
                    {displayValue}
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

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from(titleRef.current, {
                y: 80,
                opacity: 0,
                duration: 1.2,
                skewY: 5,
            })
                .from(
                    subtitleRef.current,
                    {
                        y: 40,
                        opacity: 0,
                        duration: 1,
                    },
                    '-=0.8'
                )
                .from(
                    buttonsRef.current?.children || [],
                    {
                        y: 30,
                        opacity: 0,
                        stagger: 0.2,
                        duration: 0.8,
                    },
                    '-=0.6'
                )
                .from(
                    statsRef.current,
                    {
                        y: 40,
                        opacity: 0,
                        duration: 0.8,
                    },
                    '-=0.4'
                );
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
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background-primary pt-20"
        >
            {/* Enhanced Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Grid Overlay with Fade */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_40%,transparent_100%)] pointer-events-none" />

                {/* Subtle Floating Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[100px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-green/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Enhanced Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-sm font-medium mb-10 animate-fade-in-up hover:bg-accent-purple/15 hover:border-accent-purple/30 transition-all duration-300 cursor-default group">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green"></span>
                        </span>
                        <span className="group-hover:text-white transition-colors">Available for new projects</span>
                    </div>

                    <h1
                        ref={titleRef}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
                    >
                        <span className="inline-block hover:scale-[1.02] transition-transform duration-300">Design.</span> <br className="sm:hidden" />
                        <span className="gradient-text glow-text inline-block hover:scale-[1.02] transition-transform duration-300">Trade.</span> <br />
                        <span className="text-white inline-block hover:scale-[1.02] transition-transform duration-300">Build.</span>
                    </h1>

                    <p
                        ref={subtitleRef}
                        className="text-lg sm:text-xl md:text-2xl text-text-secondary mb-14 max-w-2xl mx-auto leading-relaxed prose"
                    >
                        Hi, I&apos;m <span className="text-white font-semibold hover:text-accent-purple transition-colors cursor-default">Pranay Gajbhiye</span>.
                        I build high-performance systems for{' '}
                        <span className="text-accent-green font-medium relative inline-block group">
                            quantitative trading
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-green/30 group-hover:bg-accent-green transition-colors" />
                        </span>{' '}
                        and{' '}
                        <span className="text-accent-purple font-medium relative inline-block group">
                            Web3 interfaces
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-purple/30 group-hover:bg-accent-purple transition-colors" />
                        </span>.
                    </p>

                    <div
                        ref={buttonsRef}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
                    >
                        <MagneticButton strength={40}>
                            <a
                                href="#projects"
                                className="btn-primary min-w-[180px] text-lg inline-flex items-center justify-center gap-2 group"
                            >
                                <span>Explore Work</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </MagneticButton>
                        <MagneticButton strength={40}>
                            <a
                                href="#contact"
                                className="btn-secondary min-w-[180px] text-lg inline-flex items-center justify-center gap-2 group"
                            >
                                <span>Contact Me</span>
                                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </a>
                        </MagneticButton>
                    </div>
                </div>

                {/* Enhanced Stats Strip */}
                <div
                    ref={statsRef}
                    className="mt-20 sm:mt-24 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
                >
                    {stats.map((stat, i) => (
                        <AnimatedStat
                            key={stat.label}
                            value={stat.value}
                            label={stat.label}
                            delay={i * 0.15}
                        />
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hover:opacity-100 transition-opacity">
                <a href="#about" className="flex flex-col items-center gap-2 text-text-muted hover:text-white transition-colors">
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </a>
            </div>
        </section>
    );
}
