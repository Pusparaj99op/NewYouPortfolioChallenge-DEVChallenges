'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Layers, Box, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import MagneticButton from '@/components/ui/MagneticButton';
import ModernWebHero from '@/components/sections/ModernWebHero';

gsap.registerPlugin(ScrollTrigger);

const features = [
    {
        icon: <Box className="w-6 h-6 text-purple-400" />,
        title: "3D Immersion",
        description: "WebGL & React Three Fiber integration."
    },
    {
        icon: <Zap className="w-6 h-6 text-pink-400" />,
        title: "High Octane",
        description: "60FPS hardware accelerated animations."
    },
    {
        icon: <Layers className="w-6 h-6 text-blue-400" />,
        title: "Creative Motion",
        description: "Complex choreographies with GSAP."
    }
];

export default function Modern() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.fromTo('.modern-header',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    }
                }
            );

            // Feature Cards Animation
            gsap.fromTo('.modern-card',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: contentRef.current,
                        start: 'top 80%',
                    }
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="modern" className="section relative overflow-hidden py-32 bg-[#030305]">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/[0.08] to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">

                    {/* Content Side */}
                    <div ref={contentRef} className="lg:w-1/2 order-2 lg:order-1">
                        <div className="modern-header mb-8">
                            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/[0.08] border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                </span>
                                Next-Gen Experience
                            </div>
                        </div>

                        <h2 className="modern-header text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                            The <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-[size:200%] animate-[gradient_8s_ease-in-out_infinite]">Modern Web</span><br />
                            <span className="relative inline-block text-white">
                                Standard
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-purple-500 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                </svg>
                            </span>
                        </h2>

                        <p className="modern-header text-zinc-400 text-lg sm:text-xl leading-relaxed mb-12 max-w-xl">
                            Crafting immersive digital realities where design meets engineering. Pushing the boundaries of what is possible in the browser with WebGL, shaders, and physics-based interactions.
                        </p>

                        <div className="modern-header grid sm:grid-cols-3 gap-5 mb-14">
                            {features.map((feature, i) => (
                                <div key={i} className="modern-card p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl hover:bg-white/[0.06] hover:border-purple-500/30 transition-all duration-500 group">
                                    <div className="mb-4 p-3 rounded-xl bg-white/[0.05] w-fit group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/10 group-hover:ring-purple-500/40">
                                        {feature.icon}
                                    </div>
                                    <h4 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{feature.title}</h4>
                                    <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="modern-header">
                            <MagneticButton strength={30}>
                                <Link
                                    href="/modern-web"
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 group"
                                >
                                    Explore Experience
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </MagneticButton>
                        </div>
                    </div>

                    {/* Visual Side */}
                    <div className="lg:w-1/2 order-1 lg:order-2 w-full h-[500px] lg:h-[600px] relative">
                        <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden border border-white/[0.08] bg-[#0A0A0A] shadow-2xl shadow-purple-900/20 group">
                            {/* Decorative Portal Effect */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)] opacity-50" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

                            {/* Inner Border Glow */}
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
                            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent opacity-50" />

                            <div className="relative h-full w-full">
                                <ModernWebHero />
                            </div>

                            {/* Interactive Badge within Viewer */}
                            <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center gap-2 text-[10px] sm:text-xs text-white/70 font-mono tracking-wider z-20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                INTERACTIVE 3D SCENE
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
