'use client';

import { useEffect, useRef } from 'react';

interface FlowNode {
    x: number;
    y: number;
    type: 'diamond' | 'rect' | 'circle' | 'parallelogram';
    size: number;
    alpha: number;
    speed: number;
    offset: number;
}

interface FlowLine {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    progress: number;
    speed: number;
    color: string;
}

interface DataParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    size: number;
    color: string;
}

export default function FluidBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const flowCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const flowCanvas = flowCanvasRef.current;
        if (!canvas || !flowCanvas) return;

        const ctx = canvas.getContext('2d');
        const flowCtx = flowCanvas.getContext('2d');
        if (!ctx || !flowCtx) return;

        let width = canvas.width = flowCanvas.width = window.innerWidth;
        let height = canvas.height = flowCanvas.height = window.innerHeight;

        // Orbs for fluid effect
        const orbs = [
            { x: Math.random() * width, y: Math.random() * height, r: 300, color: '#9945FF', vx: Math.random() * 2 - 1, vy: Math.random() * 2 - 1 },
            { x: Math.random() * width, y: Math.random() * height, r: 400, color: '#14F195', vx: Math.random() * 2 - 1, vy: Math.random() * 2 - 1 },
            { x: Math.random() * width, y: Math.random() * height, r: 350, color: '#00C2FF', vx: Math.random() * 2 - 1, vy: Math.random() * 2 - 1 },
        ];

        // Flowchart nodes
        const flowNodes: FlowNode[] = [];
        const flowLines: FlowLine[] = [];
        const dataParticles: DataParticle[] = [];

        // Create flowchart grid pattern
        const gridSpacing = 200;
        const nodeTypes: ('diamond' | 'rect' | 'circle' | 'parallelogram')[] = ['diamond', 'rect', 'circle', 'parallelogram'];

        for (let x = -gridSpacing; x < width + gridSpacing * 2; x += gridSpacing) {
            for (let y = -gridSpacing; y < height + gridSpacing * 2; y += gridSpacing) {
                if (Math.random() > 0.4) {
                    flowNodes.push({
                        x: x + (Math.random() - 0.5) * 60,
                        y,
                        type: nodeTypes[Math.floor(Math.random() * nodeTypes.length)],
                        size: 25 + Math.random() * 20,
                        alpha: 0.15 + Math.random() * 0.15,
                        speed: 0.2 + Math.random() * 0.3,
                        offset: Math.random() * Math.PI * 2,
                    });
                }
            }
        }

        // Create connecting lines between nearby nodes
        flowNodes.forEach((node, i) => {
            flowNodes.slice(i + 1).forEach(other => {
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < gridSpacing * 1.5 && Math.random() > 0.5) {
                    flowLines.push({
                        startX: node.x,
                        startY: node.y,
                        endX: other.x,
                        endY: other.y,
                        progress: Math.random(),
                        speed: 0.002 + Math.random() * 0.003,
                        color: ['#9945FF', '#14F195', '#00C2FF'][Math.floor(Math.random() * 3)],
                    });
                }
            });
        });

        // Create data particles that flow along paths
        for (let i = 0; i < 50; i++) {
            dataParticles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 2,
                vy: 0.5 + Math.random() * 1.5,
                alpha: 0.4 + Math.random() * 0.3,
                size: 2 + Math.random() * 3,
                color: ['#9945FF', '#14F195', '#00C2FF'][Math.floor(Math.random() * 3)],
            });
        }

        let mouseX = width / 2;
        let mouseY = height / 2;
        let time = 0;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleResize = () => {
            width = canvas.width = flowCanvas.width = window.innerWidth;
            height = canvas.height = flowCanvas.height = window.innerHeight;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        // Draw flowchart node shapes
        const drawNode = (ctx: CanvasRenderingContext2D, node: FlowNode, yOffset: number) => {
            const y = ((node.y + yOffset) % (height + gridSpacing * 2)) - gridSpacing;
            ctx.save();
            ctx.globalAlpha = node.alpha;
            ctx.strokeStyle = '#9945FF';
            ctx.shadowColor = '#9945FF';
            ctx.shadowBlur = 5;
            ctx.lineWidth = 1;
            ctx.translate(node.x, y);

            switch (node.type) {
                case 'diamond':
                    ctx.beginPath();
                    ctx.moveTo(0, -node.size);
                    ctx.lineTo(node.size, 0);
                    ctx.lineTo(0, node.size);
                    ctx.lineTo(-node.size, 0);
                    ctx.closePath();
                    ctx.stroke();
                    break;
                case 'rect':
                    ctx.strokeRect(-node.size, -node.size * 0.6, node.size * 2, node.size * 1.2);
                    break;
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(0, 0, node.size * 0.7, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 'parallelogram':
                    ctx.beginPath();
                    ctx.moveTo(-node.size + 8, -node.size * 0.5);
                    ctx.lineTo(node.size + 8, -node.size * 0.5);
                    ctx.lineTo(node.size - 8, node.size * 0.5);
                    ctx.lineTo(-node.size - 8, node.size * 0.5);
                    ctx.closePath();
                    ctx.stroke();
                    break;
            }
            ctx.restore();
        };

        // Draw flowing connection lines with animated data flow
        const drawFlowLine = (ctx: CanvasRenderingContext2D, line: FlowLine, yOffset: number) => {
            const startY = ((line.startY + yOffset) % (height + gridSpacing * 2)) - gridSpacing;
            const endY = ((line.endY + yOffset) % (height + gridSpacing * 2)) - gridSpacing;

            // Draw base line
            ctx.save();
            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(line.startX, startY);
            ctx.lineTo(line.endX, endY);
            ctx.stroke();

            // Draw animated glow point traveling along line
            const glowX = line.startX + (line.endX - line.startX) * line.progress;
            const glowY = startY + (endY - startY) * line.progress;

            const gradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 15);
            gradient.addColorStop(0, line.color);
            gradient.addColorStop(1, 'transparent');

            ctx.globalAlpha = 0.7;
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(glowX, glowY, 15, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        const animate = () => {
            time += 0.016;

            // Clear and draw fluid orbs
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);
            ctx.filter = 'blur(80px)';

            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;
                if (orb.x < -orb.r || orb.x > width + orb.r) orb.vx *= -1;
                if (orb.y < -orb.r || orb.y > height + orb.r) orb.vy *= -1;

                const dx = mouseX - orb.x;
                const dy = mouseY - orb.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 800) {
                    orb.x += dx * 0.002;
                    orb.y += dy * 0.002;
                }

                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
                ctx.fillStyle = orb.color;
                ctx.globalAlpha = 0.4;
                ctx.fill();
                ctx.closePath();
            });

            ctx.filter = 'none';

            // Clear flowchart canvas
            flowCtx.clearRect(0, 0, width, height);

            // Calculate continuous vertical offset for flowing effect
            const yOffset = (time * 30) % (gridSpacing * 2);

            // Draw flow lines with animation
            flowLines.forEach(line => {
                line.progress += line.speed;
                if (line.progress > 1) line.progress = 0;
                drawFlowLine(flowCtx, line, yOffset);
            });

            // Draw nodes
            flowNodes.forEach(node => {
                drawNode(flowCtx, node, yOffset);
            });

            // Update and draw data particles
            dataParticles.forEach(particle => {
                particle.y += particle.vy;
                particle.x += particle.vx + Math.sin(time + particle.y * 0.01) * 0.3;

                // Wrap around
                if (particle.y > height + 20) {
                    particle.y = -20;
                    particle.x = Math.random() * width;
                }
                if (particle.x < -20) particle.x = width + 20;
                if (particle.x > width + 20) particle.x = -20;

                flowCtx.save();
                flowCtx.globalAlpha = particle.alpha;
                flowCtx.fillStyle = particle.color;
                flowCtx.beginPath();
                flowCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                flowCtx.fill();
                flowCtx.restore();
            });

            // Draw some arrow indicators flowing downward
            const arrowCount = 8;
            for (let i = 0; i < arrowCount; i++) {
                const ax = (width / arrowCount) * i + width / arrowCount / 2;
                const ay = ((time * 50 + i * 150) % (height + 100)) - 50;

                flowCtx.save();
                flowCtx.globalAlpha = 0.2;
                flowCtx.strokeStyle = '#14F195';
                flowCtx.lineWidth = 2;
                flowCtx.translate(ax, ay);

                // Draw arrow
                flowCtx.beginPath();
                flowCtx.moveTo(0, -15);
                flowCtx.lineTo(0, 15);
                flowCtx.moveTo(-8, 5);
                flowCtx.lineTo(0, 15);
                flowCtx.lineTo(8, 5);
                flowCtx.stroke();
                flowCtx.restore();
            }

            requestAnimationFrame(animate);
        };

        const animId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full -z-50 pointer-events-none"
            />
            <canvas
                ref={flowCanvasRef}
                className="fixed inset-0 w-full h-full -z-40 pointer-events-none"
            />
        </>
    );
}
