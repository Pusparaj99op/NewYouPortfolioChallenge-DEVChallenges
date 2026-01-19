'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function StripedLogo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        // Animate container in
        gsap.fromTo(
            containerRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 90%',
                },
            }
        );

        // Animate lines drawing in
        const lines = svgRef.current.querySelectorAll('.stripe-line');
        gsap.fromTo(
            lines,
            { strokeDashoffset: 1000 },
            {
                strokeDashoffset: 0,
                duration: 2,
                stagger: 0.05,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                },
            }
        );
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !svgRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Magnetic effect on container text/content
        gsap.to(svgRef.current, {
            x: (x - centerX) * 0.1, // Move slightly towards mouse
            y: (y - centerY) * 0.1,
            rotation: (x - centerX) * 0.01,
            duration: 0.5,
            ease: 'power2.out',
        });

        // Distort lines based on mouse Y position
        const lines = svgRef.current.querySelectorAll('.stripe-line');
        lines.forEach((line, i) => {
            const lineY = startY + i * lineSpacing;
            // Calculate distance from mouse Y to this line (scaled to SVG coordinates approx)
            // This is a rough approximation since SVG viewbox != pixel size, but visual effect is what matters
            const dist = Math.abs((y / rect.height * 120) - lineY);

            if (dist < 20) {
                gsap.to(line, {
                    scaleX: 1.05 + (20 - dist) * 0.01,
                    stroke: (20 - dist) > 10 ? '#FFFFFF' : '#14F195', // Highlight color on hover
                    duration: 0.3,
                    ease: 'power1.out'
                });
            } else {
                gsap.to(line, {
                    scaleX: 1,
                    stroke: 'url(#lineGradient)',
                    duration: 0.5,
                    ease: 'power1.out'
                });
            }
        });
    };

    const handleMouseLeave = () => {
        if (!svgRef.current) return;

        // Reset container
        gsap.to(svgRef.current, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)',
        });

        // Reset lines
        const lines = svgRef.current.querySelectorAll('.stripe-line');
        gsap.to(lines, {
            scaleX: 1,
            stroke: 'url(#lineGradient)',
            duration: 0.5,
            ease: 'power2.out'
        });
    };

    // Generate stripe lines
    const lineCount = 12;
    const lineSpacing = 8;
    const startY = 15;

    return (
        <div
            ref={containerRef}
            className="relative py-24 overflow-hidden bg-black cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Glow Effects */}
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-50 hover:opacity-100">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[30vw] h-[30vh] bg-[#9945FF]/20 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[30vw] h-[30vh] bg-[#14F195]/15 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            {/* Striped Text */}
            <div className="relative flex flex-col items-center justify-center">
                <svg
                    ref={svgRef}
                    viewBox="0 0 900 120"
                    className="w-full max-w-5xl px-4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Gradient for lines */}
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#9945FF" />
                            <stop offset="30%" stopColor="#19FB9B" />
                            <stop offset="70%" stopColor="#19FB9B" />
                            <stop offset="100%" stopColor="#9945FF" />
                        </linearGradient>

                        {/* Glow filter */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Text mask */}
                        <mask id="textMask">
                            <text
                                x="50%"
                                y="60"
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fill="white"
                                fontSize="85"
                                fontWeight="900"
                                fontFamily="system-ui, -apple-system, sans-serif"
                                letterSpacing="0.05em"
                            >
                                BLACK OBSIDIAN
                            </text>
                        </mask>
                    </defs>

                    {/* Horizontal stripe lines through text */}
                    <g mask="url(#textMask)" filter="url(#glow)">
                        {Array.from({ length: lineCount }).map((_, i) => (
                            <line
                                key={i}
                                className="stripe-line"
                                x1="0"
                                y1={startY + i * lineSpacing}
                                x2="900"
                                y2={startY + i * lineSpacing}
                                stroke="url(#lineGradient)"
                                strokeWidth="3"
                                strokeDasharray="1000"
                                opacity={0.9}
                            />
                        ))}
                    </g>

                    {/* Subtle text outline for definition */}
                    <text
                        x="50%"
                        y="60"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="0.3"
                        fontSize="85"
                        fontWeight="900"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        letterSpacing="0.05em"
                        opacity="0.4"
                    >
                        BLACK OBSIDIAN
                    </text>
                </svg>

                {/* Subtitle */}
                <p className="mt-6 text-[#A1A1AA] text-xs sm:text-sm tracking-[0.4em] uppercase font-medium">
                    Asset Management Company
                </p>
            </div>
        </div>
    );
}
