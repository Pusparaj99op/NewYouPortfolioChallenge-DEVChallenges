'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import dynamic from 'next/dynamic';
import LogoLoop from '@/components/ui/LogoLoop';

// Lazy load D3 chart for performance
const D3PerformanceChart = dynamic(() => import('@/components/charts/D3PerformanceChart'), {
    ssr: false,
    loading: () => (
        <div className="h-[350px] bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-2xl border border-white/5 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
        </div>
    )
});

gsap.registerPlugin(ScrollTrigger);

const skills = [
    { name: 'Python', level: 95, category: 'Languages' },
    { name: 'TypeScript', level: 90, category: 'Languages' },
    { name: 'Rust', level: 70, category: 'Languages' },
    { name: 'Solidity', level: 65, category: 'Languages' },
    { name: 'React/Next.js', level: 90, category: 'Frontend' },
    { name: 'Tailwind CSS', level: 95, category: 'Frontend' },
    { name: 'Node.js', level: 85, category: 'Backend' },
    { name: 'PostgreSQL', level: 80, category: 'Backend' },
    { name: 'Algorithmic Trading', level: 88, category: 'Finance' },
    { name: 'Market Microstructure', level: 85, category: 'Finance' },
];

// SVG icon paths
const icons = {
    rocket: 'M13.13 22.19L11.5 18.36C13.07 17.78 14.54 17 15.9 16.09L13.13 22.19M5.64 12.5L1.81 10.87L7.91 8.1C7 9.46 6.22 10.93 5.64 12.5M21.61 2.39C21.61 2.39 16.66 .269 11 5.93C8.81 8.12 7.5 10.53 6.65 12.64C6.37 13.39 6.56 14.21 7.11 14.77L9.24 16.89C9.79 17.45 10.61 17.63 11.36 17.35C13.5 16.53 15.88 15.19 18.07 13C23.73 7.34 21.61 2.39 21.61 2.39M14.54 9.46C13.76 8.68 13.76 7.41 14.54 6.63S16.59 5.85 17.37 6.63C18.14 7.41 18.15 8.68 17.37 9.46C16.59 10.24 15.32 10.24 14.54 9.46M8.88 16.53L7.47 15.12L8.88 16.53M6.24 22L9.88 18.36C9.54 18.27 9.21 18.12 8.91 17.91L4.83 22H6.24M2 22H3.41L8.18 17.24L6.76 15.83L2 20.59V22M2 19.17L6.09 15.09C5.88 14.79 5.73 14.47 5.64 14.12L2 17.76V19.17Z',
    lightning: 'M11 15H6L13 1V9H18L11 23V15Z',
    globe: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
    chart: 'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z',
};

const highlights = [
    { icon: 'rocket', title: 'Founder', subtitle: 'Building BlackObsidian AMC', color: 'purple' },
    { icon: 'lightning', title: 'Quant', subtitle: 'Systematic Strategies', color: 'green' },
    { icon: 'globe', title: 'Web3', subtitle: 'DeFi & NFT Systems', color: 'blue' },
    { icon: 'chart', title: 'Analytics', subtitle: 'Data-Driven Decisions', color: 'purple' },
];

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const skillsRef = useRef<HTMLDivElement>(null);
    const highlightsRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);

    // Lenis for velocity-based effects
    const lenis = useLenis();

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading character animation
            if (headingRef.current) {
                const headingChars = headingRef.current.querySelectorAll('.heading-char');
                gsap.fromTo(headingChars,
                    {
                        opacity: 0,
                        y: 50,
                        rotateY: 90
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotateY: 0,
                        stagger: 0.05,
                        duration: 0.8,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: headingRef.current,
                            start: 'top 80%',
                        }
                    }
                );
            }

            // Text content reveal with slide and blur
            gsap.fromTo(textRef.current,
                {
                    x: -80,
                    opacity: 0,
                    filter: 'blur(8px)'
                },
                {
                    x: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: 'top 80%',
                    },
                }
            );

            // Skills panel with 3D rotation entrance
            gsap.fromTo(skillsRef.current,
                {
                    x: 80,
                    opacity: 0,
                    rotateY: 15,
                    transformPerspective: 1000
                },
                {
                    x: 0,
                    opacity: 1,
                    rotateY: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: skillsRef.current,
                        start: 'top 80%',
                    },
                }
            );

            // Skill bars with wave effect
            const skillBars = gsap.utils.toArray('.skill-progress') as HTMLElement[];
            skillBars.forEach((bar, index) => {
                const targetWidth = bar.dataset.width || "0%";

                gsap.fromTo(bar,
                    {
                        width: 0,
                        opacity: 0
                    },
                    {
                        width: targetWidth,
                        opacity: 1,
                        duration: 1.5,
                        delay: index * 0.08, // Wave stagger
                        ease: 'elastic.out(1, 0.5)',
                        scrollTrigger: {
                            trigger: skillsRef.current,
                            start: 'top 75%',
                        },
                    }
                );

                // Glow pulse on completion
                gsap.to(bar, {
                    boxShadow: '0 0 20px rgba(153, 69, 255, 0.5)',
                    duration: 0.3,
                    delay: 1.5 + index * 0.08,
                    scrollTrigger: {
                        trigger: skillsRef.current,
                        start: 'top 75%',
                    },
                    onComplete: () => {
                        gsap.to(bar, {
                            boxShadow: 'none',
                            duration: 0.5
                        });
                    }
                });
            });

            // Highlight cards with staggered 3D flip
            const highlightCards = gsap.utils.toArray('.highlight-card') as HTMLElement[];
            gsap.fromTo(highlightCards,
                {
                    opacity: 0,
                    y: 60,
                    scale: 0.8,
                    rotateX: -30
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: 0,
                    stagger: {
                        each: 0.1,
                        from: 'start'
                    },
                    duration: 0.8,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: highlightsRef.current,
                        start: 'top 85%',
                    },
                }
            );

            // Parallax effect on scroll for decorative elements
            gsap.to('.about-orb-1', {
                y: -100,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                }
            });

            gsap.to('.about-orb-2', {
                y: 80,
                x: -50,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);



    // Split text helper
    const splitText = (text: string) => {
        return text.split('').map((char, i) => (
            <span key={i} className="heading-char inline-block" style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    };

    return (
        <section ref={sectionRef} id="about" className="section bg-transparent relative overflow-hidden">
            {/* Enhanced Decorative Elements with Framer Motion */}
            <motion.div
                className="about-orb-1 absolute top-1/2 -left-64 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(153,69,255,0.1) 0%, transparent 70%)' }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="about-orb-2 absolute bottom-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(20,241,149,0.08) 0%, transparent 70%)' }}
                animate={{
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                    scale: [1, 1.15, 1]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            <motion.div
                className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }}
                animate={{
                    x: [0, 30, -30, 0],
                    y: [0, 20, -20, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* Text Content */}
                    <div ref={textRef}>
                        {/* About Me Card Button - 3D Glassmorphism */}
                        <motion.a
                            href="/about-me"
                            className="group relative block mb-8 p-6 rounded-2xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent border border-green-500/20 backdrop-blur-xl overflow-hidden cursor-pointer"
                            initial={{ opacity: 0, y: -20, rotateX: -15 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                            whileHover={{
                                scale: 1.02,
                                rotateX: 2,
                                borderColor: 'rgba(20, 241, 149, 0.4)',
                                transition: { duration: 0.3 }
                            }}
                            style={{
                                transformStyle: 'preserve-3d',
                                perspective: '1000px'
                            }}
                        >
                            {/* Animated gradient background */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-emerald-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100"
                                transition={{ duration: 0.5 }}
                            />

                            {/* Glow effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Content */}
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 group-hover:scale-110 transition-transform duration-300"
                                        whileHover={{ rotate: 5 }}
                                    >
                                        <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </motion.div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                            About Me
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">Personal</span>
                                        </h3>
                                        <p className="text-sm text-text-muted">Learn more about the founder</p>
                                    </div>
                                </div>
                                <motion.div
                                    className="text-green-400 group-hover:translate-x-1 transition-transform duration-300"
                                    whileHover={{ x: 5 }}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.div>
                            </div>

                            {/* Shine effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full"
                                transition={{ duration: 0.8 }}
                            />
                        </motion.a>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-semibold uppercase tracking-wider mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                            About The Firm
                        </div>

                        <h2 ref={headingRef} className="text-4xl sm:text-5xl font-bold mb-8 leading-tight">
                            <span className="text-white">{splitText('BlackObsidian')}</span>
                            <span className="gradient-text">{splitText(' AMC')}</span>
                        </h2>

                        <div className="space-y-6 text-base sm:text-lg text-text-secondary leading-relaxed prose">
                            <p className="font-medium text-lg text-white/90">
                                UAE-based systematic asset manager building research-driven trading systems across digital assets, derivatives, and global markets.
                            </p>

                            <div className="pl-4 border-l-2 border-accent-green/30 my-6">
                                <p className="text-sm font-mono text-accent-green/80 mb-2">INSPIRATION</p>
                                <p className="italic text-text-muted">
                                    &quot;BlackRock, leading systematic funds, and long-term, client-first investing principles.&quot;
                                </p>
                            </div>

                            <p>
                                <span className="text-accent-purple font-semibold">Black Obsidian</span> is a trading company that trades in every market through every exchange in the world. We have no product to sell and no clients, yet remain profitable through pure alpha generation.
                            </p>

                            <p className="text-sm text-text-muted bg-white/5 p-4 rounded-lg border border-white/5">
                                <strong className="text-white block mb-1">PRIVACY NOTICE:</strong>
                                Black Obsidian is a private company with no public information. The firm operates in strict stealth, leveraging proprietary systems that may interact with market dynamics in complex ways.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                <div>
                                    <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Trading Systems</h4>
                                    <ul className="text-sm space-y-1 text-text-muted list-disc pl-4 marker:text-accent-green">
                                        <li>Algorithmic Trading</li>
                                        <li>High Frequency Trading (HFT)</li>
                                        <li>Quantitative Trading</li>
                                        <li>Market Metrics Trading</li>
                                        <li>Crypto (BTC, ETH, BNB)</li>
                                        <li>Forex, Commodities, Derivatives</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-2 text-sm uppercase tracking-wider">Corporate Structure</h4>
                                    <ul className="text-sm space-y-2 text-text-muted">
                                        <li className="flex flex-col">
                                            <span className="text-white pb-0.5">Start Up Firm (Current)</span>
                                            <span className="text-xs">Owned by Pranay Gajbhiye. Not listed. Registered in U.A.E. Currently active in Sensex Options.</span>
                                        </li>
                                        <li className="flex flex-col">
                                            <span className="text-white pb-0.5">Start Up Company (Future)</span>
                                            <span className="text-xs">Target Entities: BlackOnyx, BlackObsidian, BlackStreets. Minimum Investment: Rs. 10L.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Highlight Cards */}
                        <div ref={highlightsRef} className="pt-10 grid grid-cols-2 gap-4">
                            {highlights.map((item, i) => (
                                <div
                                    key={i}
                                    className={`
                                        highlight-card relative p-4 rounded-xl bg-white/[0.02] border border-white/10
                                        hover:border-${item.color === 'purple' ? 'accent-purple' : item.color === 'green' ? 'accent-green' : 'accent-blue'}/50
                                        transition-all duration-300 group cursor-default overflow-hidden
                                        transform-gpu
                                    `}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br from-accent-${item.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    <div className="relative">
                                        <div className={`w-10 h-10 mb-3 rounded-lg flex items-center justify-center bg-accent-${item.color}/10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                                            <svg className={`w-5 h-5 text-accent-${item.color}`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d={icons[item.icon as keyof typeof icons]} />
                                            </svg>
                                        </div>
                                        <h3 className="font-bold text-white mb-1 group-hover:text-accent-purple transition-colors">{item.title}</h3>
                                        <p className="text-sm text-text-muted">{item.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <a
                                href="/resume.pdf"
                                className="inline-flex items-center gap-3 text-white hover:text-accent-purple font-semibold transition-all group"
                            >
                                <span className="relative">
                                    Download Resume
                                    <span className="absolute bottom-0 left-0 w-full h-px bg-white/20 group-hover:bg-accent-purple transition-colors" />
                                </span>
                                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-purple/20 transition-all">
                                    <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Skills Visualization */}
                    <div ref={skillsRef} className="relative">
                        {/* Decorative Glow */}
                        <motion.div
                            className="absolute -inset-4 bg-gradient-to-r from-accent-purple/10 via-accent-blue/10 to-accent-green/10 rounded-3xl blur-2xl"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />

                        <div className="relative bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <motion.span
                                        className="w-1 h-8 bg-gradient-to-b from-accent-green to-accent-purple rounded-full"
                                        animate={{ scaleY: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    Technical Arsenal
                                </h3>
                                <span className="text-xs text-text-muted font-mono bg-white/5 px-3 py-1 rounded-full">
                                    {skills.length} Skills
                                </span>
                            </div>

                            <div className="space-y-5">
                                {skills.map((skill, index) => (
                                    <motion.div
                                        key={skill.name}
                                        className="group skill-item"
                                        style={{ '--skill-index': index } as React.CSSProperties}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05, duration: 0.5 }}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-text-secondary font-medium group-hover:text-white transition-colors text-sm sm:text-base">
                                                {skill.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-text-muted uppercase tracking-wider hidden sm:inline">
                                                    {skill.category}
                                                </span>
                                                <span className="text-xs font-mono text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded-full">
                                                    {skill.level}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden group-hover:bg-white/10 transition-colors">
                                            <div
                                                className="skill-progress h-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-green rounded-full relative"
                                                data-width={`${skill.level}%`}
                                                style={{ width: 0 }}
                                            >
                                                <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-sm" />
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bottom Decoration */}
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
                                <span className="flex items-center gap-2">
                                    <motion.span
                                        className="w-2 h-2 rounded-full bg-accent-green"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    Always learning
                                </span>
                                <span className="font-mono">2024</span>
                            </div>
                        </div>

                        {/* D3 Performance Chart */}
                        <div className="mt-8">
                            <D3PerformanceChart />
                        </div>
                    </div>

                </div>

                {/* Tech Stack Logo Loop */}
                <motion.div
                    className="mt-24 pt-16 border-t border-white/5"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <LogoLoop
                        logos={[
                            {
                                text: 'React',
                                href: 'https://react.dev',
                                title: 'React',
                                icon: <svg viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#61DAFB]"><circle cx="0" cy="0" r="2" fill="currentColor"></circle><g stroke="currentColor" strokeWidth="1" fill="none"><ellipse rx="10" ry="4.5"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse></g></svg>
                            },
                            {
                                text: 'Next.js',
                                href: 'https://nextjs.org',
                                title: 'Next.js',
                                icon: <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white"><mask id="mask0_next" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180"><circle cx="90" cy="90" r="90" fill="black" /></mask><g mask="url(#mask0_next)"><circle cx="90" cy="90" r="90" fill="black" stroke="white" strokeWidth="6" /><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_next)" /><rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_next)" /></g><defs><linearGradient id="paint0_linear_next" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse"><stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient><linearGradient id="paint1_linear_next" x1="121" y1="54" x2="120.791" y2="106.888" gradientUnits="userSpaceOnUse"><stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" /></linearGradient></defs></svg>
                            },
                            {
                                text: 'TypeScript',
                                href: 'https://www.typescriptlang.org',
                                title: 'TypeScript',
                                icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#3178C6]"><path d="M0 0H24V24H0V0Z" fill="currentColor" /><path d="M11.8864 12.0163H9.86364V18.5H8V12.0163H5.97727V10.5H11.8864V12.0163ZM18.3636 12.6074C18.3636 12.0162 18.0682 11.6662 17.3864 11.4587L16.2955 11.0837C15.8182 10.9312 15.6818 10.8337 15.6818 10.5837C15.6818 10.3762 15.8636 10.1862 16.25 10.1862C16.6364 10.1862 16.8864 10.3937 16.9091 10.5837H18.25C18.1591 9.77123 17.3409 9.06373 16.2045 9.06373C14.9318 9.06373 14.1136 9.87123 14.1136 10.9837C14.1136 12.3562 15.1136 12.6937 15.9318 12.9862L16.7045 13.2537C17.3636 13.4837 17.5 13.6337 17.5 13.9162C17.5 14.2862 17.1364 14.5087 16.6818 14.5087C16.1591 14.5087 15.7955 14.2937 15.75 13.9012H14.3636C14.4773 15.0237 15.4318 15.6312 16.6818 15.6312C18.0455 15.6312 19.0455 14.8812 19.0455 13.7262V12.6074H18.3636Z" fill="white" /></svg>
                            },
                            {
                                text: 'Tailwind CSS',
                                href: 'https://tailwindcss.com',
                                title: 'Tailwind CSS',
                                icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#38B2AC]"><path d="M12.0002 6C12.0002 6 15.2943 2.11765 17.6472 2.11765C20.0002 2.11765 21 3.88235 21 6.5C21 7.61793 20.6695 8.61836 20.218 9.42334C19.7891 10.1879 19.349 10.8252 18.2581 12.2266C16.9248 13.9397 16.4851 16.2932 17.1766 18.2936C17.3514 18.7992 16.9534 19.2941 16.4255 19.16C15.9754 19.0455 15.5458 18.8927 15.1311 18.6657C13.229 17.6242 12 15.3411 12 13.0033C12 13 12 13 12 12.9967C12 10.8788 10.3773 8.35626 7.94225 7.02293C6.30599 6.12698 4.29528 6.00282 2.64673 6.94056C2.19327 7.1984 1.76569 7.64166 1.96803 8.12574C2.76813 10.0397 5.12165 11.5163 6.94225 12.2266C7.94225 12.6167 9.1766 12.5594 10.0579 12.5002C10.5752 12.4655 11.0825 12.3952 11.5836 12.2475C12.4497 11.9922 13.2678 11.3912 13.7943 10.5884C14.7649 9.1088 12.0002 6 12.0002 6Z" fill="currentColor" /></svg>
                            },
                            {
                                text: 'GSAP',
                                href: 'https://greensock.com/gsap',
                                title: 'GSAP',
                                icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#88CE02]"><path d="M12 2C6.47 2 2 6.47 2 12C2 17.53 6.47 22 12 22C17.53 22 22 17.53 22 12C22 6.47 17.53 2 12 2ZM15.5 16.5C15.5 16.5 14 18 11.5 18C9.5 18 8 16.5 8 14V14.5H6.5V14C6.5 11.5 8.5 9.5 11 9.5C13.5 9.5 15.5 11.5 15.5 14H14C14 12.5 13 11 11.5 11C10 11 9.5 12.5 9.5 14C9.5 15.5 10.5 16.5 12 16.5C13.5 16.5 14.5 15.5 14.5 15.5V16.5H15.5Z" fill="currentColor" /><path d="M16 8.5C16 8.5 14.5 7 12 7C11.1716 7 10.413 7.16839 9.77588 7.4646L10.3794 8.84155C10.8249 8.68335 11.3655 8.5 12 8.5C13.5 8.5 14.5 9.5 14.5 9.5V8.5H16Z" fill="currentColor" /></svg>
                            },
                            {
                                text: 'Three.js',
                                href: 'https://threejs.org',
                                title: 'Three.js',
                                icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M6 18L12 21.5L18 18V11.5L12 8L6 11.5V18Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M12 8V15L18 18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M12 15L6 18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /><path d="M12 2.5L16.5 5L12 7.5L7.5 5L12 2.5Z" fill="currentColor" /></svg>
                            },
                            {
                                text: 'Framer Motion',
                                href: 'https://www.framer.com/motion',
                                title: 'Framer Motion',
                                icon: <svg viewBox="0 0 14 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white"><path d="M0 0H14V7H7L0 0Z" fill="currentColor" /><path d="M14 7H7L0 14H14V7Z" fill="currentColor" opacity="0.5" /><path d="M0 14H7L14 21H0V14Z" fill="currentColor" /></svg>
                            },
                            {
                                text: 'PostgreSQL',
                                href: 'https://www.postgresql.org',
                                title: 'PostgreSQL',
                                icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#336791]"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM18.5 14.5C18.5 14.5 17.5 17.5 13 17.5C10.5 17.5 8.5 15.5 8.5 12C8.5 9.5 10 7.5 13 7.5C15.5 7.5 17 9 17 9L15.5 10C15.5 10 14.5 9 13 9C11.5 9 10 10.5 10 12C10 13.5 11 15.5 13 15.5C15 15.5 16 14.5 16 14.5H13V13H18.5V14.5Z" fill="currentColor" /></svg>
                            },
                            {
                                text: 'Lenis',
                                href: 'https://lenis.studiofreight.com',
                                title: 'Lenis',
                                icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C9B6A1]"><path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" /><path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M11 7L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            },
                        ]}
                        speed={80}
                        direction="left"
                        logoHeight={60}
                        gap={40}
                        pauseOnHover={true}
                        scaleOnHover={true}
                        fadeOut={true}
                        fadeOutColor="#000000"
                        ariaLabel="Technologies used in this portfolio"
                    />
                </motion.div>
            </div>
        </section>
    );
}
