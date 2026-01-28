'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';

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

    // Velocity-based tilt effect
    useEffect(() => {
        if (!lenis || !skillsRef.current) return;

        const handleScroll = () => {
            const velocity = lenis.velocity;
            gsap.to(skillsRef.current, {
                skewY: velocity * 0.3,
                duration: 0.3
            });
        };

        lenis.on('scroll', handleScroll);
        return () => lenis.off('scroll', handleScroll);
    }, [lenis]);

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
            {/* Decorative Elements with parallax */}
            <div className="about-orb-1 absolute top-1/2 -left-64 w-96 h-96 bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="about-orb-2 absolute bottom-0 right-0 w-80 h-80 bg-accent-green/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* Text Content */}
                    <div ref={textRef}>
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
                    <div ref={skillsRef} className="relative transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
                        {/* Decorative Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-accent-purple/10 via-accent-blue/10 to-accent-green/10 rounded-3xl blur-2xl opacity-50" />

                        <div className="relative bg-gradient-to-b from-[#0A0A0A] to-[#0F0F0F] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                    <span className="w-1 h-8 bg-gradient-to-b from-accent-green to-accent-purple rounded-full" />
                                    Technical Arsenal
                                </h3>
                                <span className="text-xs text-text-muted font-mono bg-white/5 px-3 py-1 rounded-full">
                                    {skills.length} Skills
                                </span>
                            </div>

                            <div className="space-y-5">
                                {skills.map((skill, index) => (
                                    <div key={skill.name} className="group skill-item" style={{ '--skill-index': index } as React.CSSProperties}>
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
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Decoration */}
                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                                    Always learning
                                </span>
                                <span className="font-mono">2024</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
