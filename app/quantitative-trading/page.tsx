'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ArrowUpRight, TrendingUp, Activity, Zap, Layers, Cpu, RefreshCw, DollarSign, Wallet } from 'lucide-react';

const TradingChart = dynamic(() => import('@/components/charts/TradingChart'), { ssr: false });
const LiveOrderBook = dynamic(() => import('@/components/charts/LiveOrderBook'), { ssr: false });

export default function QuantitativeTradingPage() {
    const [price, setPrice] = useState<number | null>(null);
    const [portfolio, setPortfolio] = useState<{ usdt_balance: number; btc_balance: number }>({ usdt_balance: 0, btc_balance: 0 });
    const [loading, setLoading] = useState(true);
    const [tradeAmount, setTradeAmount] = useState<string>('0.01');
    const [tradeStatus, setTradeStatus] = useState<string | null>(null);

    // Fetch Market Data
    const fetchPrice = useCallback(async () => {
        try {
            const res = await fetch('/api/market-data');
            if (res.ok) {
                const data = await res.json();
                setPrice(parseFloat(data.price));
            }
        } catch (error) {
            console.error('Failed to fetch price', error);
        }
    }, []);

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
        return () => clearInterval(interval);
    }, [fetchPortfolio, fetchPrice]);

    const handleTrade = async (action: 'BUY' | 'SELL') => {
        if (!price) return;
        setTradeStatus('Processing...');
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
                setTimeout(() => setTradeStatus(null), 3000);
            } else {
                setTradeStatus(`Error: ${data.error}`);
            }
        } catch (error) {
            setTradeStatus('Trade Failed');
        }
    };

    const totalValue = (portfolio.usdt_balance + (portfolio.btc_balance * (price || 0))).toFixed(2);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pt-24 font-sans selection:bg-emerald-500/30">
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-emerald-400 mb-2"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-mono text-xs uppercase tracking-widest">System Online</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50"
                    >
                        QUANTITATIVE<br />TRADING
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-end gap-2"
                >
                    <div className="glass-panel px-4 py-2 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="text-xs text-zinc-400 uppercase tracking-wider mb-1">Total Equity</div>
                        <div className="text-2xl font-mono text-emerald-400 flex items-center justify-end gap-1">
                            ${totalValue} <ArrowUpRight size={16} />
                        </div>
                    </div>
                    <div className="flex gap-4 text-xs font-mono text-zinc-400">
                        <span>USDT: ${portfolio.usdt_balance.toFixed(2)}</span>
                        <span>BTC: {portfolio.btc_balance.toFixed(6)}</span>
                    </div>
                </motion.div>
            </header>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-rows-4 gap-4 min-h-[800px]">

                {/* Main Chart - Large Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-1 md:col-span-2 lg:col-span-3 row-span-2 relative group flex flex-col"
                >
                    {/* Price Header inside Chart Area */}
                    <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md p-3 rounded-lg border border-white/10">
                        <div className="text-xs text-zinc-400">BTC/USDT</div>
                        <div className="text-3xl font-mono font-bold text-white">
                            ${price?.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs mt-1">
                            <span className="text-emerald-400">Real-time Data</span>
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>
                    </div>

                    <TradingChart />
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-emerald-500/50 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-emerald-500/50 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-emerald-500/50 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-emerald-500/50 rounded-br-lg" />
                </motion.div>

                {/* Trade Panel (Replaces nice-to-have KPIs for now to prioritize core logic visibility, or add below) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="col-span-1 row-span-2 rounded-xl glass-panel border border-white/10 bg-zinc-900/50 p-6 flex flex-col gap-6"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold flex items-center gap-2">
                            <RefreshCw size={18} className="text-emerald-400" /> Trade Execution
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-zinc-500 uppercase block mb-2">Amount (BTC)</label>
                            <input
                                type="number"
                                value={tradeAmount}
                                onChange={(e) => setTradeAmount(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white font-mono focus:border-emerald-500 outline-none transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleTrade('BUY')}
                                className="py-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold transition-all active:scale-95"
                            >
                                BUY
                            </button>
                            <button
                                onClick={() => handleTrade('SELL')}
                                className="py-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/50 text-rose-400 font-bold transition-all active:scale-95"
                            >
                                SELL
                            </button>
                        </div>

                        {tradeStatus && (
                            <div className={`text-xs p-2 rounded ${tradeStatus.startsWith('Error') ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                {tradeStatus}
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Available USDT</span>
                            <span className="font-mono text-zinc-300">${portfolio.usdt_balance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-500">Available BTC</span>
                            <span className="font-mono text-zinc-300">{portfolio.btc_balance.toFixed(6)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Live Order Book */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="col-span-1 md:col-span-2 row-span-2 relative"
                >
                    <LiveOrderBook />
                </motion.div>

                {/* AI Sentiment Analysis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="col-span-1 md:col-span-2 lg:col-span-1 row-span-2 rounded-xl glass-panel border border-white/10 bg-zinc-900/50 p-6 flex flex-col gap-4"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">AI Sentiment</h3>
                            <p className="text-[10px] text-zinc-500">Model: GPT-4o-financial</p>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {[
                            { text: "Bullish divergence detected on 4H chart.", sentiment: "positive", time: "2m ago" },
                            { text: "Large whale movement likely to impact support levels.", sentiment: "neutral", time: "15m ago" },
                            { text: "Volume spike suggests incoming volatility.", sentiment: "warning", time: "32m ago" },
                        ].map((item, i) => (
                            <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs">
                                <div className="flex justify-between mb-1">
                                    <span className={`
                                        ${item.sentiment === 'positive' ? 'text-emerald-400' : ''}
                                        ${item.sentiment === 'neutral' ? 'text-blue-400' : ''}
                                        ${item.sentiment === 'warning' ? 'text-amber-400' : ''}
                                        uppercase font-bold tracking-wider text-[10px]
                                    `}>
                                        {item.sentiment}
                                    </span>
                                    <span className="text-zinc-600 font-mono">{item.time}</span>
                                </div>
                                <p className="text-zinc-300 leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto">
                        <button className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-semibold text-white border border-white/5">
                            Generate Full Report
                        </button>
                    </div>
                </motion.div>

                {/* Bottom Stats Row */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="col-span-1 rounded-xl glass-panel border border-white/10 bg-zinc-900/50 p-4 flex flex-col justify-center gap-2"
                >
                    <div className="text-xs text-zinc-500 uppercase">24h Volume</div>
                    <div className="text-2xl font-mono text-white">$4.2B</div>
                </motion.div>
            </div>

            <style jsx global>{`
                .glass-panel {
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}
