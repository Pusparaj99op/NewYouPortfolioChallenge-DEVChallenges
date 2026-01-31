'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
    id: string;
    group: number;
    val: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
    value: number;
}

const data = {
    nodes: [
        { id: "React", group: 1, val: 20 },
        { id: "Next.js", group: 1, val: 15 },
        { id: "TypeScript", group: 1, val: 15 },
        { id: "Tailwind", group: 2, val: 10 },
        { id: "Three.js", group: 3, val: 15 },
        { id: "R3F", group: 3, val: 12 },
        { id: "GSAP", group: 4, val: 12 },
        { id: "Framer", group: 4, val: 10 },
        { id: "WebGL", group: 3, val: 18 },
        { id: "D3.js", group: 5, val: 12 },
        { id: "Node.js", group: 6, val: 10 },
        { id: "PostgreSQL", group: 6, val: 10 },
    ],
    links: [
        { source: "React", target: "Next.js", value: 10 },
        { source: "React", target: "Three.js", value: 5 },
        { source: "React", target: "TypeScript", value: 8 },
        { source: "Next.js", target: "TypeScript", value: 8 },
        { source: "Next.js", target: "Tailwind", value: 6 },
        { source: "Three.js", target: "R3F", value: 15 },
        { source: "Three.js", target: "WebGL", value: 20 },
        { source: "GSAP", target: "Three.js", value: 5 },
        { source: "Framer", target: "React", value: 8 },
        { source: "D3.js", target: "React", value: 5 },
        { source: "Node.js", target: "Next.js", value: 5 },
        { source: "PostgreSQL", target: "Node.js", value: 8 },
    ]
};

export default function D3PerformanceChart() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const width = 800;
        const height = 600;

        // Clear previous
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        // Simulation
        const simulation = d3.forceSimulation(data.nodes as Node[])
            .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius((d: any) => d.val * 2));

        // Links
        const link = svg.append("g")
            .selectAll("line")
            .data(data.links)
            .join("line")
            .attr("stroke", "#ffffff")
            .attr("stroke-opacity", 0.2)
            .attr("stroke-width", (d) => Math.sqrt(d.value));

        // Nodes
        const node = svg.append("g")
            .selectAll("circle")
            .data(data.nodes)
            .join("circle")
            .attr("r", (d) => d.val)
            .attr("fill", (d) => {
                const colors = ["#ff0000", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899", "#6366f1"];
                return colors[d.group % colors.length];
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended) as any);

        // Labels
        const labels = svg.append("g")
            .selectAll("text")
            .data(data.nodes)
            .join("text")
            .text((d) => d.id)
            .attr("text-anchor", "middle")
            .attr("dy", (d) => -d.val - 5)
            .attr("fill", "#ffffff")
            .attr("font-size", "12px")
            .attr("font-family", "monospace")
            .style("pointer-events", "none");

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node
                .attr("cx", (d: any) => d.x)
                .attr("cy", (d: any) => d.y);

            labels
                .attr("x", (d: any) => d.x)
                .attr("y", (d: any) => d.y);
        });

        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, []);

    return (
        <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-zinc-900/30 rounded-3xl border border-white/5 overflow-hidden">
            <svg ref={svgRef} className="w-full h-full" />
        </div>
    );
}
