'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ModernWebHero from '@/components/sections/ModernWebHero';
import { ArrowRight, Layers, Box, Cpu, Zap, Globe, Palette } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// GSAP Register
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const features = [
    {
        icon: <Box className="w-6 h-6 text-purple-400" />,
        title: "3D Immersion",
        description: "Seamlessly integrate WebGL content with React Three Fiber ecosystem."
    },
    {
        icon: <Zap className="w-6 h-6 text-yellow-400" />,
        title: "High Performance",
        description: "Optimized for 60FPS experiences with hardware acceleration."
    },
    {
        icon: <Layers className="w-6 h-6 text-blue-400" />,
        title: "Advanced Animation",
        description: "Complex choreographies using GSAP and Framer Motion."
    },
    {
        icon: <Palette className="w-6 h-6 text-pink-400" />,
        title: "Creative Coding",
        description: "Generative art and interactive shaders for unique visuals."
    },
    {
        icon: <Cpu className="w-6 h-6 text-emerald-400" />,
        title: "State Management",
        description: "Robust data handling with modern React patterns."
    },
    {
        icon: <Globe className="w-6 h-6 text-cyan-400" />,
        title: "Global Reach",
        description: "Responsive, accessible, and performant across all devices."
    }
];

export default function ModernWebPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Parallax
            gsap.to(heroRef.current, {
                y: 100,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Grid Stagger
            const cards = gsap.utils.toArray('.feature-card');
            gsap.fromTo(cards,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 80%",
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">

            <div className="container mx-auto px-4 md:px-8 pt-24 pb-12">
                {/* Hero Section */}
                <header className="mb-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-zinc-500">
                            The Modern Web<br />
                            Experience.
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
                            Crafting immersive digital realities where design meets engineering.
                            Pushing the boundaries of what's possible in the browser.
                        </p>
                    </motion.div>

                    <div ref={heroRef}>
                        <ModernWebHero />
                    </div>
                </header>

                {/* Features Grid */}
                <section ref={gridRef} className="mb-32">
                    <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-4">
                        <h2 className="text-3xl font-bold">Capabilities</h2>
                        <div className="text-sm font-mono text-zinc-500">STACK OVERVIEW</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="feature-card group p-6 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-300">
                                <div className="mb-4 p-3 rounded-lg bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 p-12 md:p-24 text-center">
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to elevate your digital presence?</h2>
                        <p className="text-lg text-zinc-300 mb-8">
                            Let's build something extraordinary together. High-performance, accessible, and stunning web applications tailored to your vision.
                        </p>
                        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform duration-300">
                            Contact Me <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
                </section>
            </div>
        </div>
    );
}
