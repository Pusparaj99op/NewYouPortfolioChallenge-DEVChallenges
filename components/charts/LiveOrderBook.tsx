'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface Order {
    price: number;
    amount: number;
    total: number;
}

export default function LiveOrderBook() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Mock Data
        const generateData = () => {
            const buys: Order[] = [];
            const sells: Order[] = [];
            let currentPrice = 45000;

            for (let i = 0; i < 20; i++) {
                const buyPrice = currentPrice - (i * 10) - Math.random() * 5;
                const buyAmount = Math.random() * 2 + 0.1;
                buys.push({ price: buyPrice, amount: buyAmount, total: 0 });

                const sellPrice = currentPrice + (i * 10) + Math.random() * 5;
                const sellAmount = Math.random() * 2 + 0.1;
                sells.push({ price: sellPrice, amount: sellAmount, total: 0 });
            }

            // Calculate totals
            let buyTotal = 0;
            buys.forEach(b => { buyTotal += b.amount; b.total = buyTotal; });

            let sellTotal = 0;
            sells.forEach(s => { sellTotal += s.amount; s.total = sellTotal; });

            return { buys, sells };
        };

        const updateChart = () => {
            const { buys, sells } = generateData();
            const allOrders = [...buys, ...sells];

            const x = d3.scaleLinear()
                .domain([d3.min(buys, d => d.price) || 0, d3.max(sells, d => d.price) || 0])
                .range([0, innerWidth]);

            const y = d3.scaleLinear()
                .domain([0, Math.max(d3.max(buys, d => d.total) || 0, d3.max(sells, d => d.total) || 0)])
                .range([innerHeight, 0]);

            const areaBuy = d3.area<Order>()
                .x(d => x(d.price))
                .y0(innerHeight)
                .y1(d => y(d.total))
                .curve(d3.curveStepAfter);

            const areaSell = d3.area<Order>()
                .x(d => x(d.price))
                .y0(innerHeight)
                .y1(d => y(d.total))
                .curve(d3.curveStepBefore);

            // Removing old paths for simple redraw (could be optimized with D3 enter/update/exit pattern for smoother animation)
            g.selectAll('.area-buy').remove();
            g.selectAll('.area-sell').remove();

            g.append('path')
                .datum(buys)
                .attr('class', 'area-buy')
                .attr('fill', 'rgba(16, 185, 129, 0.2)')
                .attr('stroke', '#10B981')
                .attr('d', areaBuy);

            g.append('path')
                .datum(sells)
                .attr('class', 'area-sell')
                .attr('fill', 'rgba(239, 68, 68, 0.2)')
                .attr('stroke', '#EF4444')
                .attr('d', areaSell);

            // Axes
            g.selectAll('.axis').remove();
            g.append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(0,${innerHeight})`)
                .call(d3.axisBottom(x).ticks(5).tickFormat(d => `$${d}`))
                .attr('color', '#666');

            g.append('g')
                .attr('class', 'axis')
                .call(d3.axisLeft(y).ticks(5))
                .attr('color', '#666');
        };

        updateChart();
        const interval = setInterval(updateChart, 2000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div ref={containerRef} className="w-full h-full glass-panel border border-white/10 bg-black/40 backdrop-blur-md p-4 rounded-xl flex flex-col">
            <h3 className="text-white font-mono text-sm tracking-wider mb-2 flex items-center justify-between">
                <span>ORDER BOOK DEPTH</span>
                <span className="text-[10px] text-zinc-500">BTC/USDT</span>
            </h3>
            <div className="flex-1 w-full min-h-0">
                <svg ref={svgRef} className="w-full h-full overflow-visible" />
            </div>
        </div>
    );
}
