'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';

interface DataPoint {
    month: string;
    value: number;
    growth: number;
}

const performanceData: DataPoint[] = [
    { month: 'Jan', value: 12, growth: 15 },
    { month: 'Feb', value: 19, growth: 22 },
    { month: 'Mar', value: 28, growth: 35 },
    { month: 'Apr', value: 35, growth: 28 },
    { month: 'May', value: 42, growth: 45 },
    { month: 'Jun', value: 55, growth: 52 },
    { month: 'Jul', value: 48, growth: 38 },
    { month: 'Aug', value: 62, growth: 58 },
    { month: 'Sep', value: 71, growth: 65 },
    { month: 'Oct', value: 78, growth: 72 },
    { month: 'Nov', value: 85, growth: 80 },
    { month: 'Dec', value: 95, growth: 88 },
];

export default function D3PerformanceChart() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });
    const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
    const [dimensions, setDimensions] = useState({ width: 400, height: 250 });

    // Responsive dimensions
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width } = containerRef.current.getBoundingClientRect();
                setDimensions({
                    width: Math.min(width - 40, 500),
                    height: Math.min(width * 0.5, 280)
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!svgRef.current || !isInView) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const { width, height } = dimensions;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scalePoint()
            .domain(performanceData.map(d => d.month))
            .range([0, innerWidth])
            .padding(0.5);

        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([innerHeight, 0]);

        // Gradient definition
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'areaGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#9945FF')
            .attr('stop-opacity', 0.4);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#14F195')
            .attr('stop-opacity', 0.05);

        // Grid lines
        g.selectAll('.grid-line-y')
            .data([0, 25, 50, 75, 100])
            .enter()
            .append('line')
            .attr('class', 'grid-line-y')
            .attr('x1', 0)
            .attr('x2', innerWidth)
            .attr('y1', d => yScale(d))
            .attr('y2', d => yScale(d))
            .attr('stroke', 'rgba(255,255,255,0.05)')
            .attr('stroke-dasharray', '4,4');

        // Area generator
        const area = d3.area<DataPoint>()
            .x(d => xScale(d.month) || 0)
            .y0(innerHeight)
            .y1(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // Line generator
        const line = d3.line<DataPoint>()
            .x(d => xScale(d.month) || 0)
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // Growth line generator
        const growthLine = d3.line<DataPoint>()
            .x(d => xScale(d.month) || 0)
            .y(d => yScale(d.growth))
            .curve(d3.curveMonotoneX);

        // Draw area with animation
        const areaPath = g.append('path')
            .datum(performanceData)
            .attr('fill', 'url(#areaGradient)')
            .attr('d', area)
            .attr('opacity', 0);

        areaPath.transition()
            .duration(1500)
            .delay(500)
            .attr('opacity', 1);

        // Draw main line with animation
        const linePath = g.append('path')
            .datum(performanceData)
            .attr('fill', 'none')
            .attr('stroke', 'url(#lineGradient)')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Line gradient
        const lineGradient = svg.select('defs')
            .append('linearGradient')
            .attr('id', 'lineGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');

        lineGradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#9945FF');

        lineGradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#14F195');

        // Animate line drawing
        const totalLength = linePath.node()?.getTotalLength() || 0;
        linePath
            .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeCubicInOut)
            .attr('stroke-dashoffset', 0);

        // Draw growth line (secondary)
        const growthPath = g.append('path')
            .datum(performanceData)
            .attr('fill', 'none')
            .attr('stroke', '#00D4FF')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '6,4')
            .attr('opacity', 0.6)
            .attr('d', growthLine);

        const growthLength = growthPath.node()?.getTotalLength() || 0;
        growthPath
            .attr('stroke-dasharray', `${growthLength} ${growthLength}`)
            .attr('stroke-dashoffset', growthLength)
            .transition()
            .duration(2000)
            .delay(500)
            .ease(d3.easeCubicInOut)
            .attr('stroke-dashoffset', 0)
            .on('end', function() {
                d3.select(this).attr('stroke-dasharray', '6,4');
            });

        // Data points with glow effect
        g.selectAll('.data-point')
            .data(performanceData)
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('cx', d => xScale(d.month) || 0)
            .attr('cy', d => yScale(d.value))
            .attr('r', 0)
            .attr('fill', '#9945FF')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 0 6px rgba(153,69,255,0.5))')
            .style('cursor', 'pointer')
            .on('mouseenter', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 8)
                    .style('filter', 'drop-shadow(0 0 12px rgba(153,69,255,0.8))');
                setHoveredPoint(d);
            })
            .on('mouseleave', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 5)
                    .style('filter', 'drop-shadow(0 0 6px rgba(153,69,255,0.5))');
                setHoveredPoint(null);
            })
            .transition()
            .duration(500)
            .delay((_, i) => 1500 + i * 100)
            .attr('r', 5);

        // X Axis
        const xAxis = g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).tickSize(0))
            .attr('opacity', 0);

        xAxis.select('.domain').remove();
        xAxis.selectAll('text')
            .attr('fill', 'rgba(255,255,255,0.5)')
            .attr('font-size', '10px')
            .attr('dy', '1em');

        xAxis.transition().duration(1000).attr('opacity', 1);

        // Y Axis labels
        g.selectAll('.y-label')
            .data([0, 50, 100])
            .enter()
            .append('text')
            .attr('class', 'y-label')
            .attr('x', -10)
            .attr('y', d => yScale(d))
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'rgba(255,255,255,0.4)')
            .attr('font-size', '10px')
            .text(d => `${d}%`)
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .delay(500)
            .attr('opacity', 1);

    }, [isInView, dimensions]);

    return (
        <motion.div
            ref={containerRef}
            className="relative bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-2xl border border-white/5 p-6 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple/10 via-transparent to-accent-green/10 rounded-2xl blur-xl opacity-50" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="w-1 h-6 bg-gradient-to-b from-accent-purple to-accent-green rounded-full" />
                            Performance Metrics
                        </h3>
                        <p className="text-xs text-text-muted mt-1">12-month portfolio analysis</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-[2px] bg-gradient-to-r from-accent-purple to-accent-green rounded" />
                            <span className="text-text-muted">Returns</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-[2px] bg-accent-blue rounded" style={{ borderStyle: 'dashed' }} />
                            <span className="text-text-muted">Growth</span>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <svg ref={svgRef} className="w-full" />

                {/* Tooltip */}
                <AnimatePresence>
                    {hoveredPoint && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3"
                        >
                            <p className="text-xs text-text-muted">{hoveredPoint.month}</p>
                            <p className="text-lg font-bold text-white">{hoveredPoint.value}%</p>
                            <p className="text-xs text-accent-green">+{hoveredPoint.growth}% growth</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/5">
                    {[
                        { label: 'Avg Return', value: '52.3%', color: 'text-accent-purple' },
                        { label: 'Max Growth', value: '88%', color: 'text-accent-green' },
                        { label: 'Consistency', value: '94%', color: 'text-accent-blue' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="text-center"
                        >
                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-wider">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
