'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Activity, Zap, Cpu, Signal } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

gsap.registerPlugin(ScrollTrigger);

// Lazy load chart for performance
const TradingChart = dynamic(() => import('@/components/charts/TradingChart'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-zinc-900/50 rounded-2xl animate-pulse" />
});

export default function Quant() {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [price, setPrice] = useState<string>("96,432.50");

    // Simulate live price updates
    useEffect(() => {
        const interval = setInterval(() => {
            const basePrice = 96432.50;
            const variance = (Math.random() - 0.5) * 100;
            setPrice((basePrice + variance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.fromTo('.quant-header',
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

            // Chart Container Animation
            gsap.fromTo('.quant-chart',
                { scale: 0.95, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 80%',
                    }
                }
            );

            // Stats Cards Animation
            gsap.fromTo('.quant-stat',
                { x: 50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 80%',
                    }
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="quant" className="section relative overflow-hidden py-24 bg-black/20">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div ref={contentRef} className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="quant-header inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Systematic Trading
                        </div>

                        <h2 className="quant-header text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                            <span className="text-white">Quantitative</span>{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Intelligence</span>
                        </h2>

                        <p className="quant-header text-zinc-400 text-lg leading-relaxed max-w-xl">
                            High-frequency algorithmic execution engines leveraging machine learning for alpha generation in crypto and derivatives markets.
                        </p>
                    </div>

                    <div className="quant-header">
                        <Link
                            href="/quantitative-trading"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 transition-all duration-300 group"
                        >
                            <Zap size={18} />
                            Launch Terminal
                            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>

                <div ref={gridRef} className="grid lg:grid-cols-3 gap-8">
                    {/* Main Chart Area */}
                    <div className="quant-chart lg:col-span-2 h-[450px] sm:h-[550px] rounded-3xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-2xl overflow-hidden relative group shadow-2xl shadow-black/40">
                        <div className="absolute top-8 left-8 z-10">
                            <div className="flex items-center gap-3 text-xs text-emerald-400 font-mono mb-2 tracking-widest uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Live Feed
                            </div>
                            <div className="flex items-baseline gap-3">
                                <div className="text-4xl sm:text-5xl font-mono font-bold text-white tracking-tighter">
                                    ${price}
                                </div>
                                <span className="text-sm font-medium text-zinc-400">BTC/USDT</span>
                            </div>
                        </div>
                        <div className="w-full h-full pt-20 px-2 pb-2">
                            <TradingChart />
                        </div>

                        {/* Enhanced Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Corner Accents */}
                        <div className="absolute top-0 right-0 p-8 opacity-50">
                            <ArrowUpRight className="text-white/20" size={24} />
                        </div>
                    </div>

                    {/* Stats Column */}
                    <div className="space-y-6 flex flex-col h-full">
                        {/* AI Sentiment Card */}
                        <div className="quant-stat relative p-8 rounded-3xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-500 group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                                        <Cpu size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">AI Sentiment</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-zinc-400 text-sm font-medium">Model Confidence</span>
                                        <span className="text-emerald-400 font-mono text-xl font-bold">87%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[87%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] relative">
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-zinc-500 leading-relaxed mt-2 border-l-2 border-emerald-500/20 pl-3">
                                        Bullish divergence detected on 4H timeframe. Strong accumulation phase identified.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Performance Card */}
                        <div className="quant-stat flex-1 relative p-8 rounded-3xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-500 group overflow-hidden flex flex-col justify-center">
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-[60px] -ml-10 -mb-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                                        <Activity size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">24h Performance</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-medium">Volume</div>
                                        <div className="text-3xl font-mono font-bold text-white tracking-tight">$4.2B</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-medium">PnL</div>
                                        <div className="text-3xl font-mono font-bold text-emerald-400 tracking-tight flex items-center gap-1">
                                            +12.4%
                                            <TrendingUp size={16} className="text-emerald-500/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
