'use client';

import { useState } from 'react';
import TiltCard from '@/components/ui/TiltCard';
import Reveal from '@/components/ui/Reveal';
import ScrambleText from '@/components/ui/ScrambleText';
import LiquidGlass from '@/components/ui/LiquidGlass';

// SVG icon paths for projects
const projectIcons = {
    chart: 'M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z',
    lightning: 'M11 15H6L13 1V9H18L11 23V15Z',
    briefcase: 'M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 5h4v2h-4V5zm10 15H4V9h16v11z',
    target: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
};

const projects = [
    {
        id: 1,
        title: 'Sensex Options AI',
        description: 'AI-driven algorithmic trading system for Sensex options execution on AngelOne platform. Leverages ML for strike selection.',
        category: 'Trading',
        tech: ['Python', 'AngelOne API', 'ML'],
        metrics: { label: 'Win Rate', value: 'Est. 68%' },
        link: 'https://github.com/Pusparaj99op/AngleOneSensexOptionsAIAlgo',
        gradient: 'from-purple-500/20 to-blue-500/20',
        icon: 'chart',
    },
    {
        id: 2,
        title: 'BXOTS System',
        description: 'Binance X Option Trading System. Automated low-latency crypto options execution engine for high-volatility environments.',
        category: 'Trading',
        tech: ['Python', 'Binance API', 'WebSockets'],
        metrics: { label: 'Latency', value: '<50ms' },
        link: 'https://github.com/Pusparaj99op/BXOTS',
        gradient: 'from-green-500/20 to-emerald-500/20',
        icon: 'lightning',
    },
    {
        id: 3,
        title: 'QSCI Indicator',
        description: 'Quantum Sentiment Composite Indicator. Advanced market sentiment analysis tool fusing multiple data streams.',
        category: 'Finance',
        tech: ['Python', 'NLP', 'QuantLib'],
        metrics: { label: 'Signals', value: 'Real-time' },
        link: 'https://github.com/Pusparaj99op/QUANTUM-SENTIMENT-COMPOSITE-INDICATOR--QSCI-',
        gradient: 'from-blue-500/20 to-cyan-500/20',
        icon: 'target',
    },
    {
        id: 4,
        title: 'Wealth Manager',
        description: 'Mutual Fund Wealth Management System. Comprehensive portfolio tracking, risk analysis, and reporting dashboard.',
        category: 'Finance',
        tech: ['Full Stack', 'PostgreSQL', 'Analytics'],
        metrics: { label: 'Assets', value: 'Tracked' },
        link: 'https://github.com/Pusparaj99op/Mutual-Fund-Wealth-Management-System',
        gradient: 'from-purple-500/20 to-pink-500/20',
        icon: 'briefcase',
    },
    {
        id: 5,
        title: 'Ripple Scaler',
        description: 'High-frequency scalping system designed specifically for XRP market microstructure and volatility patterns.',
        category: 'Trading',
        tech: ['Python', 'HFT', 'AsyncIO'],
        metrics: { label: 'Freq', value: 'High' },
        link: 'https://github.com/Pusparaj99op/RippleScalerSystem',
        gradient: 'from-orange-500/20 to-red-500/20',
        icon: 'lightning',
    },
    {
        id: 6,
        title: 'BTC Options Algo',
        description: 'Specialized algorithmic trading bot for Bitcoin options on Binance. Implements Black-Scholes pricing models.',
        category: 'Trading',
        tech: ['Python', 'Options', 'Derivatives'],
        metrics: { label: 'Model', value: 'BSM' },
        link: 'https://github.com/Pusparaj99op/BinanceBitcionOptionTradingSystem',
        gradient: 'from-yellow-500/20 to-orange-500/20',
        icon: 'chart',
    },
];

const categories = ['All', 'Trading', 'Finance', 'Web3'];

const categoryColors: { [key: string]: string } = {
    'Trading': 'text-accent-green border-accent-green/30 bg-accent-green/10',
    'Finance': 'text-accent-blue border-accent-blue/30 bg-accent-blue/10',
    'Web3': 'text-accent-purple border-accent-purple/30 bg-accent-purple/10',
};

export default function Projects() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const filtered = activeCategory === 'All'
        ? projects
        : projects.filter(p => p.category === activeCategory);

    return (
        <section id="projects" className="section bg-gradient-to-b from-transparent via-black/80 to-transparent relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-accent-purple/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-accent-green/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs font-semibold uppercase tracking-wider mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                            Portfolio
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                            <span className="text-white">Selected</span>{' '}
                            <span className="gradient-text">Works</span>
                        </h2>
                        <p className="text-text-secondary max-w-xl text-base sm:text-lg leading-relaxed">
                            A collection of high-performance trading systems and web applications deployed in production.
                        </p>
                    </div>

                    {/* Enhanced Filters */}
                    <div className="flex flex-wrap gap-2 p-1.5 bg-white/[0.02] rounded-full border border-white/5">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${activeCategory === cat
                                    ? 'bg-white text-black shadow-lg shadow-white/10'
                                    : 'bg-transparent text-text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="relative z-10">{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Project Grid */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {filtered.map((project, idx) => (
                        <Reveal key={project.id} delay={idx * 0.1}>
                            <TiltCard intensity={6} className="h-full">
                                <LiquidGlass className="h-full rounded-2xl">
                                    <div
                                        className="group relative h-full bg-gradient-to-b from-[#0F0F0F] to-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-accent-purple/30"
                                        onMouseEnter={() => setHoveredId(project.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    >
                                        {/* Gradient Background on Hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                        {/* Glow Effect */}
                                        <div className="absolute -inset-px bg-gradient-to-r from-accent-purple/0 via-accent-purple/20 to-accent-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

                                        <div className="relative p-6 sm:p-8 h-full flex flex-col">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        <svg className="w-5 h-5 text-accent-purple" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d={projectIcons[project.icon as keyof typeof projectIcons]} />
                                                        </svg>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-mono border ${categoryColors[project.category] || 'text-text-muted border-white/10 bg-white/5'}`}>
                                                        {project.category}
                                                    </span>
                                                </div>
                                                <a
                                                    href={project.link}
                                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-accent-purple group-hover:border-accent-purple group-hover:rotate-45 transition-all duration-300"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </a>
                                            </div>

                                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-accent-purple transition-colors duration-300">
                                                <ScrambleText text={project.title} />
                                            </h3>

                                            <p className="text-text-secondary mb-6 flex-grow text-sm sm:text-base leading-relaxed">
                                                {project.description}
                                            </p>

                                            <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tech.map(t => (
                                                        <span
                                                            key={t}
                                                            className="text-xs text-text-muted font-mono px-2 py-1 bg-white/[0.03] rounded-md border border-white/5 group-hover:border-white/10 transition-colors"
                                                        >
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-[10px] text-text-muted uppercase tracking-wider mb-0.5">
                                                        {project.metrics.label}
                                                    </span>
                                                    <span className="font-mono text-accent-green font-bold text-lg group-hover:text-white transition-colors">
                                                        {project.metrics.value}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Corner Accent */}
                                        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                                            <div className="absolute -right-10 -top-10 w-20 h-20 bg-gradient-to-br from-accent-purple/10 to-transparent rotate-45 group-hover:from-accent-purple/20 transition-colors duration-300" />
                                        </div>
                                    </div>
                                </LiquidGlass>
                            </TiltCard>
                        </Reveal>
                    ))}
                </div>

                {/* View All Link */}
                <div className="mt-16 text-center">
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-3 text-text-secondary hover:text-white font-medium transition-all group"
                    >
                        <span className="relative">
                            Want to discuss a project?
                            <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-purple group-hover:w-full transition-all duration-300" />
                        </span>
                        <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent-purple/20 transition-all">
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </a>
                </div>
            </div>
        </section>
    );
}
