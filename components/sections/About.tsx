'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate text content
            gsap.from(textRef.current, {
                x: -50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: textRef.current,
                    start: 'top 80%',
                },
            });

            // Animate skills panel
            gsap.from(skillsRef.current, {
                x: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: skillsRef.current,
                    start: 'top 80%',
                },
            });

            // Animate skill bars with stagger
            const skills = gsap.utils.toArray('.skill-progress');
            gsap.fromTo(skills,
                { width: 0 },
                {
                    width: (i, target) => (target as HTMLElement).dataset.width || "0%",
                    duration: 1.5,
                    ease: 'power3.out',
                    stagger: 0.1, // Cascade effect
                    scrollTrigger: {
                        trigger: skillsRef.current, // Trigger when the whole container enters
                        start: 'top 80%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="about" className="section bg-black relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-1/2 -left-64 w-96 h-96 bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-green/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                    {/* Text Content */}
                    <div ref={textRef}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-semibold uppercase tracking-wider mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                            About Me
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-bold mb-8 leading-tight">
                            <span className="text-white">Crafting </span>
                            <span className="gradient-text">Excellence</span>
                            <br />
                            <span className="text-text-muted text-3xl sm:text-4xl">in Every Line of Code</span>
                        </h2>

                        <div className="space-y-5 text-base sm:text-lg text-text-secondary leading-relaxed prose">
                            <p>
                                I&apos;m the Founder of <span className="text-accent-purple font-semibold hover:text-white transition-colors cursor-default">BlackObsidian AMC</span>.
                                My work lies at the intersection of <span className="text-accent-green font-medium">high-frequency trading</span> and elegant software engineering.
                            </p>
                            <p>
                                I don&apos;t just write code; I design systems that handle millions of dollars in transaction volume.
                                Whether it&apos;s optimizing order execution latency or building immersive web interfaces,
                                I obsess over <span className="text-white font-medium">performance</span> and <span className="text-white font-medium">user experience</span>.
                            </p>
                        </div>

                        {/* Highlight Cards */}
                        <div className="pt-10 grid grid-cols-2 gap-4">
                            {highlights.map((item, i) => (
                                <div
                                    key={i}
                                    className={`
                                        relative p-4 rounded-xl bg-white/[0.02] border border-white/10
                                        hover:border-${item.color === 'purple' ? 'accent-purple' : item.color === 'green' ? 'accent-green' : 'accent-blue'}/50
                                        transition-all duration-300 group cursor-default overflow-hidden
                                    `}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br from-accent-${item.color}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    <div className="relative">
                                        <div className={`w-10 h-10 mb-3 rounded-lg flex items-center justify-center bg-accent-${item.color}/10 group-hover:scale-110 transition-transform duration-300`}>
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
                                {skills.map((skill) => (
                                    <div key={skill.name} className="group">
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
                                                style={{ width: 0 }} // Initial state handled by GSAP
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
