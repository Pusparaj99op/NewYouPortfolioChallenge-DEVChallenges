'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Code, Layers, Zap } from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ProjectDetailsProps {
    fullDescription: string;
    features: string[];
    tech: string[];
    architecture: {
        frontend?: string[];
        backend?: string[];
        infrastructure?: string[];
    };
    challenges: string[];
    outcomes: string[];
    timeline: string;
    status: string;
    colorScheme: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

export default function ProjectDetails({
    fullDescription,
    features,
    tech,
    architecture,
    challenges,
    outcomes,
    timeline,
    status,
    colorScheme
}: ProjectDetailsProps) {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate feature cards
            gsap.fromTo('.feature-item',
                { opacity: 0, y: 50, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.features-grid',
                        start: 'top 80%',
                    }
                }
            );

            // Animate tech stack badges
            gsap.fromTo('.tech-badge',
                { opacity: 0, scale: 0 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: '.tech-stack',
                        start: 'top 80%',
                    }
                }
            );

            // Animate architecture sections
            gsap.fromTo('.arch-section',
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.architecture-grid',
                        start: 'top 80%',
                    }
                }
            );

            // Animate outcomes with check icons
            gsap.fromTo('.outcome-item',
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.outcomes-list',
                        start: 'top 80%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative py-24 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-20"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Project Overview</h2>
                    <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-4xl">
                        {fullDescription}
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="text-sm text-white/60">Timeline: </span>
                            <span className="text-sm font-semibold text-white">{timeline}</span>
                        </div>
                        <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="text-sm text-white/60">Status: </span>
                            <span className="text-sm font-semibold" style={{ color: colorScheme.accent }}>{status}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="mb-20">
                    <h3 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                        <Zap className="w-8 h-8" style={{ color: colorScheme.primary }} />
                        Key Features
                    </h3>
                    <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="feature-item group relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
                            >
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                                    backgroundImage: `linear-gradient(135deg, ${colorScheme.primary}10, ${colorScheme.accent}10)`
                                }} />
                                <div className="relative z-10">
                                    <Check className="w-5 h-5 mb-3" style={{ color: colorScheme.accent }} />
                                    <p className="text-white/90 leading-relaxed">{feature}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-20">
                    <h3 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                        <Code className="w-8 h-8" style={{ color: colorScheme.secondary }} />
                        Technology Stack
                    </h3>
                    <div className="tech-stack flex flex-wrap gap-3">
                        {tech.map((technology, idx) => (
                            <span
                                key={idx}
                                className="tech-badge px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white font-mono text-sm hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-default"
                            >
                                {technology}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Architecture */}
                {(architecture.frontend || architecture.backend || architecture.infrastructure) && (
                    <div className="mb-20">
                        <h3 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                            <Layers className="w-8 h-8" style={{ color: colorScheme.accent }} />
                            Architecture
                        </h3>
                        <div className="architecture-grid grid md:grid-cols-3 gap-6">
                            {architecture.frontend && (
                                <div className="arch-section p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                                    <h4 className="text-xl font-semibold mb-4 text-blue-400">Frontend</h4>
                                    <ul className="space-y-2">
                                        {architecture.frontend.map((item, idx) => (
                                            <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {architecture.backend && (
                                <div className="arch-section p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20">
                                    <h4 className="text-xl font-semibold mb-4 text-green-400">Backend</h4>
                                    <ul className="space-y-2">
                                        {architecture.backend.map((item, idx) => (
                                            <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {architecture.infrastructure && (
                                <div className="arch-section p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                                    <h4 className="text-xl font-semibold mb-4 text-purple-400">Infrastructure</h4>
                                    <ul className="space-y-2">
                                        {architecture.infrastructure.map((item, idx) => (
                                            <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Challenges & Outcomes */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Challenges */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-white">Challenges Overcome</h3>
                        <div className="space-y-4">
                            {challenges.map((challenge, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-white/70 leading-relaxed"
                                >
                                    {challenge}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Outcomes */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-white">Key Outcomes</h3>
                        <div className="outcomes-list space-y-4">
                            {outcomes.map((outcome, idx) => (
                                <div
                                    key={idx}
                                    className="outcome-item flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10"
                                >
                                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colorScheme.accent }} />
                                    <span className="text-white/90 leading-relaxed">{outcome}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
