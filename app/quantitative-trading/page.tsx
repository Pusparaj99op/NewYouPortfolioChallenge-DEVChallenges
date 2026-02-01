'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Activity, Zap, Layers, Cpu, RefreshCw, DollarSign, Wallet, BarChart3, LineChart, PieChart, Signal } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TradingChart = dynamic(() => import('@/components/charts/TradingChart'), { ssr: false });
const LiveOrderBook = dynamic(() => import('@/components/charts/LiveOrderBook'), { ssr: false });

export default function QuantitativeTradingPage() {
    const [price, setPrice] = useState<number | null>(null);
    const [portfolio, setPortfolio] = useState<{ usdt_balance: number; btc_balance: number }>({ usdt_balance: 10000, btc_balance: 0.5 });
    const [loading, setLoading] = useState(true);
    const [tradeAmount, setTradeAmount] = useState<string>('0.01');
    const [tradeStatus, setTradeStatus] = useState<string | null>(null);
    const [priceChange, setPriceChange] = useState<number>(0);
    const [isTrading, setIsTrading] = useState(false);

    // Fake Terminal State
    const [terminalLogs, setTerminalLogs] = useState<Array<{ id: number; type: 'BUY' | 'SELL' | 'INFO' | 'SUCCESS' | 'SYSTEM'; message: string; timestamp: string; amount?: number; price?: number }>>([]);
    const [isTerminalRunning, setIsTerminalRunning] = useState(true);
    const terminalRef = useRef<HTMLDivElement>(null);

    // Refs for GSAP animations
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const priceRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const statsRefs = useRef<HTMLDivElement[]>([]);

    // Animation controls
    const controls = useAnimation();

    // Fetch Market Data
    const fetchPrice = useCallback(async () => {
        try {
            const res = await fetch('/api/market-data');
            if (res.ok) {
                const data = await res.json();
                const newPrice = parseFloat(data.price);

                // Calculate price change for animations
                if (price) {
                    const change = ((newPrice - price) / price) * 100;
                    setPriceChange(change);

                    // Animate price change with GSAP
                    if (priceRef.current) {
                        gsap.fromTo(priceRef.current,
                            { scale: 1 },
                            {
                                scale: 1.05,
                                duration: 0.2,
                                yoyo: true,
                                repeat: 1,
                                ease: 'power2.inOut'
                            }
                        );
                    }

                    // Glow effect based on price movement
                    if (glowRef.current) {
                        gsap.to(glowRef.current, {
                            opacity: change > 0 ? 0.3 : 0.2,
                            scale: 1.2,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    }
                }

                setPrice(newPrice);
            }
        } catch (error) {
            console.error('Failed to fetch price', error);
        }
    }, [price]);

    // Fetch Portfolio
    const fetchPortfolio = useCallback(async () => {
        try {
            const res = await fetch('/api/portfolio');
            if (res.ok) {
                const data = await res.json();
                setPortfolio({
                    usdt_balance: parseFloat(data.usdt_balance),
                    btc_balance: parseFloat(data.btc_balance)
                });
            }
        } catch (error) {
            console.error('Failed to fetch portfolio', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPortfolio();
        fetchPrice();
        const interval = setInterval(fetchPrice, 3000); // Update price every 3s

        // GSAP entrance animations - run once on mount
        const ctx = gsap.context(() => {
            // Header fade in with stagger
            if (headerRef.current?.children) {
                gsap.fromTo(headerRef.current.children,
                    {
                        opacity: 0,
                        y: -30
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power3.out',
                        clearProps: 'all'
                    }
                );
            }

            // Grid items entrance animation
            gsap.fromTo('.trading-panel',
                {
                    opacity: 0,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'back.out(1.2)',
                    delay: 0.3,
                    clearProps: 'all'
                }
            );

            // Floating animation for decorative elements - infinite
            gsap.to('.float-element', {
                y: -20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 0.3
            });

            // Pulse effect for live indicators - infinite
            gsap.to('.pulse-dot', {
                scale: 1.5,
                opacity: 0.3,
                duration: 1.5,
                repeat: -1,
                ease: 'power1.inOut'
            });

        }, containerRef);

        return () => {
            clearInterval(interval);
            ctx.revert();
        };
    }, [fetchPortfolio, fetchPrice]);

    // Fake Terminal Auto Trading Effect
    useEffect(() => {
        if (!isTerminalRunning) return;

        const initialLogs = [
            { id: 0, type: 'SYSTEM' as const, message: '> Initializing BlackObsidian Trading Engine v2.4.1...', timestamp: new Date().toLocaleTimeString() },
            { id: 1, type: 'INFO' as const, message: '> Connected to Binance WebSocket API', timestamp: new Date().toLocaleTimeString() },
            { id: 2, type: 'INFO' as const, message: '> Loading market microstructure models...', timestamp: new Date().toLocaleTimeString() },
            { id: 3, type: 'SUCCESS' as const, message: '> System ready. Starting automated execution...', timestamp: new Date().toLocaleTimeString() },
        ];
        setTerminalLogs(initialLogs);

        let logId = 4;
        const executeRandomOrder = () => {
            if (!price) return;

            const isBuy = Math.random() > 0.45; // Slightly bullish bias
            const amount = parseFloat((Math.random() * 0.05 + 0.001).toFixed(4));
            const orderType = isBuy ? 'BUY' : 'SELL';
            const colors = isBuy ? 'text-emerald-400' : 'text-rose-400';

            // Add processing log
            const processingLog = {
                id: logId++,
                type: 'INFO' as const,
                message: `> Analyzing order flow... Signal strength: ${(Math.random() * 30 + 70).toFixed(1)}%`,
                timestamp: new Date().toLocaleTimeString()
            };
            setTerminalLogs(prev => [...prev.slice(-15), processingLog]);

            // Execute order after brief delay
            setTimeout(() => {
                const execPrice = price + (Math.random() * 100 - 50);
                const orderLog = {
                    id: logId++,
                    type: orderType as 'BUY' | 'SELL',
                    message: `> EXECUTED: ${orderType} ${amount} BTC @ $${execPrice.toFixed(2)}`,
                    timestamp: new Date().toLocaleTimeString(),
                    amount,
                    price: execPrice
                };

                setTerminalLogs(prev => [...prev.slice(-15), orderLog]);

                // Update portfolio
                setPortfolio(prev => {
                    if (isBuy) {
                        const cost = amount * execPrice;
                        return {
                            usdt_balance: Math.max(0, prev.usdt_balance - cost),
                            btc_balance: prev.btc_balance + amount
                        };
                    } else {
                        const revenue = amount * execPrice;
                        return {
                            usdt_balance: prev.usdt_balance + revenue,
                            btc_balance: Math.max(0, prev.btc_balance - amount)
                        };
                    }
                });

                // Add success log
                setTimeout(() => {
                    const successLog = {
                        id: logId++,
                        type: 'SUCCESS' as const,
                        message: `> Order filled. P&L: ${isBuy ? '-' : '+'}$${(amount * execPrice).toFixed(2)}`,
                        timestamp: new Date().toLocaleTimeString()
                    };
                    setTerminalLogs(prev => [...prev.slice(-15), successLog]);

                    // Scroll terminal to bottom
                    if (terminalRef.current) {
                        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
                    }
                }, 300);
            }, 500);
        };

        // Execute orders at random intervals
        const tradingInterval = setInterval(() => {
            executeRandomOrder();
        }, Math.random() * 3000 + 2000);

        return () => clearInterval(tradingInterval);
    }, [isTerminalRunning, price]);

    const handleTrade = async (action: 'BUY' | 'SELL') => {
        if (!price) return;
        setIsTrading(true);
        setTradeStatus('Processing...');

        // Trading animation
        controls.start({
            scale: [1, 0.95, 1],
            transition: { duration: 0.3 }
        });

        try {
            const quantity = parseFloat(tradeAmount);
            const res = await fetch('/api/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, price, quantity })
            });
            const data = await res.json();

            if (res.ok) {
                setPortfolio({
                    usdt_balance: parseFloat(data.usdt_balance),
                    btc_balance: parseFloat(data.btc_balance)
                });
                setTradeStatus(`Success: ${action} ${quantity} BTC`);

                // Success burst animation
                if (glowRef.current) {
                    gsap.fromTo(glowRef.current,
                        { opacity: 0, scale: 0.5 },
                        {
                            opacity: 0.6,
                            scale: 1.5,
                            duration: 0.8,
                            ease: 'power2.out',
                            onComplete: () => {
                                gsap.to(glowRef.current, { opacity: 0, duration: 0.5 });
                            }
                        }
                    );
                }

                setTimeout(() => setTradeStatus(null), 3000);
            } else {
                setTradeStatus(`Error: ${data.error}`);
            }
        } catch (error) {
            setTradeStatus('Trade Failed');
        } finally {
            setIsTrading(false);
        }
    };

    const totalValue = (portfolio.usdt_balance + (portfolio.btc_balance * (price || 0))).toFixed(2);

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] text-white p-4 md:p-8 pt-24 font-sans selection:bg-emerald-500/30 relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 animated-grid" />
            </div>

            {/* Radial Glow Effect */}
            <div ref={glowRef} className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none opacity-0" />

            {/* Floating Orbs */}
            <div className="fixed top-20 right-20 w-64 h-64 bg-violet-500/10 rounded-full blur-[100px] float-element pointer-events-none" />
            <div className="fixed bottom-40 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] float-element pointer-events-none" />

            {/* Header */}
            <header ref={headerRef} className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 relative z-10">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 text-emerald-400 mb-3"
                    >
                        <div className="relative">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 pulse-dot" />
                            <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <span className="font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                            <Signal size={16} className="animate-pulse" />
                            System Online • Live Trading
                        </span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-2"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-white">
                            QUANTITATIVE
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 animate-gradient">
                            TRADING
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 text-sm font-mono mt-2"
                    >
                        Real-time algorithmic execution • BTC/USDT Perpetual
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-end gap-3"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass-panel px-6 py-4 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent backdrop-blur-xl relative overflow-hidden group"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="text-xs text-emerald-400 uppercase tracking-wider mb-1 font-semibold flex items-center gap-2">
                            <Wallet size={14} />
                            Total Portfolio Value
                        </div>
                        <div ref={priceRef} className="text-3xl font-mono font-bold text-white flex items-center justify-end gap-2 relative">
                            ${totalValue}
                            <motion.div
                                animate={{
                                    y: [0, -5, 0],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <TrendingUp size={20} className="text-emerald-400" />
                            </motion.div>
                        </div>
                        {priceChange !== 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-xs font-mono mt-1 ${priceChange > 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                            >
                                {priceChange > 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
                            </motion.div>
                        )}
                    </motion.div>

                    <div className="flex gap-4 text-xs font-mono">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
                        >
                            <span className="text-zinc-500">USDT:</span>
                            <span className="text-zinc-300 ml-2 font-bold">${portfolio.usdt_balance.toFixed(2)}</span>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm"
                        >
                            <span className="text-zinc-500">BTC:</span>
                            <span className="text-zinc-300 ml-2 font-bold">{portfolio.btc_balance.toFixed(6)}</span>
                        </motion.div>
                    </div>
                </motion.div>
            </header>

            {/* Grid Layout */}
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-4 gap-4 min-h-[800px] relative z-10">

                {/* Main Chart - Large Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.005 }}
                    className="trading-panel col-span-1 md:col-span-2 lg:col-span-3 row-span-2 relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5 rounded-2xl" />

                    {/* Price Header with enhanced design */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="absolute top-6 left-6 z-10 glass-panel backdrop-blur-2xl p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-black/80 via-black/60 to-black/80 shadow-2xl"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                <LineChart size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-xs text-zinc-400 font-mono">BTC/USDT Perpetual</div>
                                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                    Live Feed
                                </div>
                            </div>
                        </div>
                        <div className="text-4xl font-mono font-bold text-white mb-1">
                            ${price?.toLocaleString()}
                        </div>
                        {priceChange !== 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${priceChange > 0
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-rose-500/20 text-rose-400'
                                    }`}
                            >
                                {priceChange > 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(3)}%
                            </motion.div>
                        )}
                    </motion.div>

                    <TradingChart />

                    {/* Enhanced corner accents with glow */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500/50 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-violet-500/50 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500/50 rounded-br-2xl" />

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-violet-500/10 to-cyan-500/10 rounded-2xl blur-xl" />
                    </div>
                </motion.div>

                {/* Trade Panel - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.01 }}
                    className="trading-panel col-span-1 row-span-2 rounded-2xl glass-panel border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80 backdrop-blur-xl p-6 flex flex-col gap-6 relative overflow-hidden group"
                >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-center justify-between relative z-10">
                        <h3 className="font-semibold flex items-center gap-2 text-lg">
                            <motion.div
                                animate={{ rotate: isTrading ? 360 : 0 }}
                                transition={{ duration: 1, repeat: isTrading ? Infinity : 0, ease: "linear" }}
                                className="p-2 rounded-lg bg-emerald-500/20"
                            >
                                <RefreshCw size={18} className="text-emerald-400" />
                            </motion.div>
                            <div>
                                <div>Trade Execution</div>
                                <div className="text-xs text-zinc-500 font-normal">Instant Settlement</div>
                            </div>
                        </h3>
                    </div>

                    <div className="space-y-5 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="relative"
                        >
                            <label className="text-xs text-emerald-400 uppercase block mb-3 font-semibold tracking-wider flex items-center gap-2">
                                <Layers size={14} />
                                Amount (BTC)
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={tradeAmount}
                                    onChange={(e) => setTradeAmount(e.target.value)}
                                    className="w-full bg-black/60 border-2 border-white/10 rounded-xl p-4 text-white font-mono text-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all backdrop-blur-sm"
                                    placeholder="0.01"
                                    step="0.001"
                                    min="0"
                                    aria-label="Trade amount in BTC"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono">
                                    BTC
                                </div>
                            </div>
                            {price && (
                                <div className="mt-2 text-xs text-zinc-500 font-mono">
                                    ≈ ${(parseFloat(tradeAmount || '0') * price).toFixed(2)} USDT
                                </div>
                            )}
                        </motion.div>

                        <div className="grid grid-cols-2 gap-3">
                            <motion.button
                                onClick={() => handleTrade('BUY')}
                                disabled={isTrading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative py-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 hover:from-emerald-500/30 hover:to-emerald-600/20 border-2 border-emerald-500/50 text-emerald-400 font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <TrendingUp size={18} />
                                    BUY
                                </span>
                                <div className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </motion.button>
                            <motion.button
                                onClick={() => handleTrade('SELL')}
                                disabled={isTrading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative py-4 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 hover:from-rose-500/30 hover:to-rose-600/20 border-2 border-rose-500/50 text-rose-400 font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Activity size={18} />
                                    SELL
                                </span>
                                <div className="absolute inset-0 bg-rose-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {tradeStatus && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className={`text-sm p-4 rounded-xl font-mono backdrop-blur-sm ${tradeStatus.startsWith('Error')
                                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                            : tradeStatus.startsWith('Success')
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                        }`}
                                >
                                    {tradeStatus}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="mt-auto pt-6 border-t border-white/10 space-y-3 relative z-10">
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-zinc-500 flex items-center gap-2">
                                <DollarSign size={14} />
                                Available USDT
                            </span>
                            <span className="font-mono text-emerald-400 font-semibold">${portfolio.usdt_balance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-zinc-500 flex items-center gap-2">
                                <Activity size={14} />
                                Available BTC
                            </span>
                            <span className="font-mono text-cyan-400 font-semibold">{portfolio.btc_balance.toFixed(6)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Live Order Book - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.005 }}
                    className="trading-panel col-span-1 md:col-span-1 row-span-2 relative group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 rounded-2xl" />
                    <LiveOrderBook />

                    {/* Corner indicators */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono text-cyan-400">
                        <BarChart3 size={14} />
                        <span>Live Depth</span>
                        <span className="w-2 h-2 bg-cyan-500 rounded-full pulse-dot" />
                    </div>
                </motion.div>

                {/* Fake Trading Terminal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="trading-panel col-span-1 row-span-2 rounded-2xl glass-panel border border-white/10 bg-gradient-to-br from-zinc-900/90 via-black/95 to-zinc-900/90 backdrop-blur-xl overflow-hidden relative group"
                >
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/50">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                            </div>
                            <span className="text-xs font-mono text-zinc-400">algo-trader@blackobsidian:~</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.button
                                onClick={() => setIsTerminalRunning(!isTerminalRunning)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all ${isTerminalRunning
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                    }`}
                            >
                                {isTerminalRunning ? '● LIVE' : '○ PAUSED'}
                            </motion.button>
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div
                        ref={terminalRef}
                        className="p-4 h-[calc(100%-48px)] overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed"
                        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(10,10,10,0.95) 100%)' }}
                    >
                        <AnimatePresence>
                            {terminalLogs.map((log, index) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`py-1.5 flex items-start gap-2 border-b border-white/5 last:border-0 ${log.type === 'BUY' ? 'text-emerald-400' :
                                            log.type === 'SELL' ? 'text-rose-400' :
                                                log.type === 'SUCCESS' ? 'text-cyan-400' :
                                                    log.type === 'SYSTEM' ? 'text-violet-400' :
                                                        'text-zinc-400'
                                        }`}
                                >
                                    <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                                    <span className="break-all">
                                        {log.type === 'BUY' && <span className="mr-1">▲</span>}
                                        {log.type === 'SELL' && <span className="mr-1">▼</span>}
                                        {log.message}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Blinking cursor */}
                        <div className="flex items-center gap-2 mt-2 text-emerald-400">
                            <span>&gt;</span>
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-2 h-4 bg-emerald-400"
                            />
                        </div>
                    </div>

                    {/* Terminal glow effect */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-emerald-500/5 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-emerald-500/5 to-transparent" />
                    </div>
                </motion.div>

                {/* AI Sentiment Analysis - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.01 }}
                    className="trading-panel col-span-1 md:col-span-2 lg:col-span-1 row-span-2 rounded-2xl glass-panel border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80 backdrop-blur-xl p-6 flex flex-col gap-4 relative overflow-hidden group"
                >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-cyan-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-center gap-3 mb-2 relative z-10">
                        <motion.div
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(236, 72, 153, 0.3)',
                                    '0 0 40px rgba(236, 72, 153, 0.5)',
                                    '0 0 20px rgba(236, 72, 153, 0.3)'
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20"
                        >
                            <Cpu size={22} className="text-pink-400" />
                        </motion.div>
                        <div>
                            <h3 className="font-semibold text-base">AI Market Sentiment</h3>
                            <p className="text-[10px] text-zinc-500 font-mono">Powered by Gemini AI</p>
                        </div>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10">
                        {[
                            { text: "Bullish divergence detected on 4H timeframe. Strong accumulation phase identified.", sentiment: "positive", time: "2m ago", confidence: 87 },
                            { text: "Large whale movement detected. Possible support level impact at $95,800.", sentiment: "neutral", time: "15m ago", confidence: 72 },
                            { text: "Volume spike suggests incoming volatility. Breakout probability: 68%", sentiment: "warning", time: "32m ago", confidence: 81 },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 text-xs backdrop-blur-sm relative overflow-hidden group/item"
                            >
                                {/* Hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity" />

                                <div className="flex justify-between mb-2 relative z-10">
                                    <span className={`
                                        ${item.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}
                                        ${item.sentiment === 'neutral' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                                        ${item.sentiment === 'warning' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : ''}
                                        px-2 py-1 rounded-md uppercase font-bold tracking-wider text-[10px] border
                                    `}>
                                        {item.sentiment}
                                    </span>
                                    <span className="text-zinc-600 font-mono text-[10px]">{item.time}</span>
                                </div>
                                <p className="text-zinc-300 leading-relaxed mb-2 relative z-10">{item.text}</p>
                                <div className="flex items-center gap-2 relative z-10">
                                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.confidence}%` }}
                                            transition={{ delay: 1 + i * 0.1, duration: 0.8 }}
                                            className={`h-full ${item.sentiment === 'positive' ? 'bg-emerald-500' :
                                                    item.sentiment === 'neutral' ? 'bg-blue-500' :
                                                        'bg-amber-500'
                                                }`}
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-500 font-mono">{item.confidence}%</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 transition-all text-sm font-semibold text-white border border-pink-500/30 backdrop-blur-sm relative overflow-hidden group/btn relative z-10"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Zap size={16} />
                            Generate Full AI Report
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300" />
                    </motion.button>
                </motion.div>

                {/* Bottom Stats Row - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    className="trading-panel col-span-1 rounded-2xl glass-panel border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80 backdrop-blur-xl p-5 flex flex-col justify-center gap-2 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold relative z-10 flex items-center gap-2">
                        <PieChart size={14} className="text-emerald-400" />
                        24h Volume
                    </div>
                    <div className="text-3xl font-mono font-bold text-white relative z-10">$4.2B</div>
                    <div className="text-xs text-emerald-400 font-mono relative z-10">↑ 12.4%</div>
                </motion.div>

                {/* Additional Stats Panels */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.85 }}
                    whileHover={{ scale: 1.02 }}
                    className="trading-panel col-span-1 rounded-2xl glass-panel border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80 backdrop-blur-xl p-5 flex flex-col justify-center gap-2 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold relative z-10 flex items-center gap-2">
                        <Activity size={14} className="text-violet-400" />
                        Open Interest
                    </div>
                    <div className="text-3xl font-mono font-bold text-white relative z-10">$8.7B</div>
                    <div className="text-xs text-violet-400 font-mono relative z-10">Long/Short: 52/48</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    className="trading-panel col-span-1 rounded-2xl glass-panel border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80 backdrop-blur-xl p-5 flex flex-col justify-center gap-2 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold relative z-10 flex items-center gap-2">
                        <Zap size={14} className="text-cyan-400" />
                        Funding Rate
                    </div>
                    <div className="text-3xl font-mono font-bold text-white relative z-10">0.0125%</div>
                    <div className="text-xs text-cyan-400 font-mono relative z-10">Next: 4h 23m</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className="trading-panel col-span-1 rounded-2xl glass-panel border border-white/10 bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80 backdrop-blur-xl p-5 flex flex-col justify-center gap-2 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold relative z-10 flex items-center gap-2">
                        <BarChart3 size={14} className="text-amber-400" />
                        24h High/Low
                    </div>
                    <div className="text-xl font-mono font-bold text-white relative z-10 flex items-baseline gap-2">
                        <span className="text-emerald-400">97.2K</span>
                        <span className="text-xs text-zinc-600">/</span>
                        <span className="text-rose-400">94.1K</span>
                    </div>
                    <div className="text-xs text-amber-400 font-mono relative z-10">Range: 3.29%</div>
                </motion.div>
            </div>

            <style jsx global>{`
                .animated-grid {
                    background-image:
                        linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: gridMove 20s linear infinite;
                }

                @keyframes gridMove {
                    0% {
                        transform: translateY(0);
                    }
                    100% {
                        transform: translateY(50px);
                    }
                }

                @keyframes gradientShift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradientShift 8s ease infinite;
                }

                .glass-panel {
                    box-shadow:
                        0 8px 32px 0 rgba(0, 0, 0, 0.37),
                        inset 0 1px 1px 0 rgba(255, 255, 255, 0.05);
                }

                .glass-panel:hover {
                    box-shadow:
                        0 12px 48px 0 rgba(16, 185, 129, 0.2),
                        inset 0 1px 1px 0 rgba(255, 255, 255, 0.08);
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, rgba(16, 185, 129, 0.5), rgba(139, 92, 246, 0.5));
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(180deg, rgba(16, 185, 129, 0.8), rgba(139, 92, 246, 0.8));
                }

                /* Glow effects for interactive elements */
                .trading-panel {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .trading-panel:hover {
                    transform: translateY(-2px);
                }

                /* Shimmer effect */
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }

                .pulse-dot {
                    animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse-ring {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>
        </div>
    );
}
