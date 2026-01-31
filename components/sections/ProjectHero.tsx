'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AnimatedText from '@/components/ui/AnimatedText';
import GradientOrb from '@/components/ui/GradientOrb';

const Scene3D = dynamic(() => import('@/components/canvas/Scene3D'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 animate-pulse" />
});

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ProjectHeroProps {
    projectId: number;
    title: string;
    category: 'Trading' | 'Finance' | 'Web3';
    shortDescription: string;
    colorScheme: {
        primary: string;
        secondary: string;
        accent: string;
    };
    gradient: string;
}

export default function ProjectHero({
    projectId,
    title,
    category,
    shortDescription,
    colorScheme,
    gradient
}: ProjectHeroProps) {
    const heroRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Parallax effect on scroll
            gsap.to(canvasRef.current, {
                y: 200,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // Fade out hero content on scroll
            gsap.to('.hero-content', {
                opacity: 0,
                y: -50,
                ease: 'power2.in',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top top',
                    end: '50% top',
                    scrub: true
                }
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
        >
            {/* 3D Background */}
            <div ref={canvasRef} className="absolute inset-0 z-0">
                <Scene3D colorScheme={colorScheme} category={category} projectId={projectId} />
            </div>

            {/* Gradient Orbs */}
            <GradientOrb
                colors={[colorScheme.primary, colorScheme.secondary, 'transparent']}
                size="xl"
                blur="xl"
                opacity={0.2}
                className="absolute top-20 right-20"
            />
            <GradientOrb
                colors={[colorScheme.accent, colorScheme.primary, 'transparent']}
                size="lg"
                blur="lg"
                opacity={0.15}
                className="absolute bottom-40 left-20"
            />

            {/* Animated Grid */}
            <motion.div
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity }}
            />

            {/* Content */}
            <div className="hero-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Projects</span>
                    </Link>
                </motion.div>

                {/* Category Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r" style={{
                        backgroundImage: `linear-gradient(to right, ${colorScheme.primary}, ${colorScheme.accent})`
                    }} />
                    <span className="text-sm font-semibold text-white uppercase tracking-wider">{category}</span>
                </motion.div>

                {/* Title */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                    <AnimatedText
                        text={title}
                        animation="cascade"
                        gradient={true}
                        className="gradient-text"
                        stagger={0.05}
                    />
                </h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed"
                >
                    {shortDescription}
                </motion.p>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
                    >
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-1.5 h-1.5 rounded-full bg-white"
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
        </section>
    );
}
