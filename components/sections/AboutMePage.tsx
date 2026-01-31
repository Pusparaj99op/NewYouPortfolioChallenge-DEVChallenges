'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment, Float, TorusKnot, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import ShinyText from '@/components/ShinyText';
import { Calendar, Sparkles, Clock, User, MapPin, Heart, Star, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// 3D Dollar Symbol - TorusKnot based premium visualization
// 3D Dollar Symbol - TorusKnot based premium visualization with Parallax
function DollarSymbol3D() {
    const meshRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);
    const { viewport } = useThree();

    // GSAP Parallax Animation
    useEffect(() => {
        if (!groupRef.current) return;

        // Create parallax effect linked to page scroll
        const parallaxAnim = gsap.to(groupRef.current.position, {
            y: -5, // Move down as user scrolls
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1, // Smooth scrub
            }
        });

        // Add slight rotation on scroll for extra dynamism
        const rotateAnim = gsap.to(groupRef.current.rotation, {
            y: Math.PI * 2, // Full rotation over page scroll
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 2,
            }
        });

        return () => {
            parallaxAnim.kill();
            rotateAnim.kill();
        };
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.3;
            meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.15;
            // Removed internal bouncing Y position to avoid conflict with parallax
        }
        if (innerRef.current) {
            innerRef.current.rotation.y = -t * 0.4;
            innerRef.current.rotation.z = t * 0.2;
        }
    });

    const scale = viewport.width > 6 ? 0.4 : 0.3; // Reduced from 1/0.7 to 0.4/0.3

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={groupRef} scale={scale} position={[0, 0.5, 0]}>
                {/* Outer ring - glass transmission */}
                <TorusKnot ref={meshRef} args={[0.8, 0.25, 128, 32, 2, 3]}>
                    <MeshTransmissionMaterial
                        thickness={0.3}
                        roughness={0}
                        transmission={0.95}
                        ior={1.5}
                        chromaticAberration={0.08}
                        backside={true}
                        color="#14F195"
                        distortion={0.3}
                        distortionScale={0.4}
                        temporalDistortion={0.1}
                    />
                </TorusKnot>

                {/* Inner core - gold metallic */}
                <mesh ref={innerRef}>
                    <torusGeometry args={[0.5, 0.12, 32, 64]} />
                    <MeshDistortMaterial
                        color="#FFD700"
                        metalness={0.9}
                        roughness={0.1}
                        distort={0.2}
                        speed={2}
                    />
                </mesh>
            </group>
        </Float>
    );
}

// Floating Coins
function FloatingCoins() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const radius = 2.5;
                return (
                    <Float key={i} speed={1.5 + i * 0.2} rotationIntensity={1} floatIntensity={0.8}>
                        <mesh
                            position={[
                                Math.cos(angle) * radius,
                                Math.sin(i * 0.5) * 0.5,
                                Math.sin(angle) * radius
                            ]}
                            rotation={[Math.PI / 2, 0, angle]}
                        >
                            <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
                            <meshStandardMaterial
                                color="#FFD700"
                                metalness={0.9}
                                roughness={0.1}
                                emissive="#FF8C00"
                                emissiveIntensity={0.2}
                            />
                        </mesh>
                    </Float>
                );
            })}
        </group>
    );
}

// 3D Scene
function Scene3D() {
    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.6 }}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} intensity={1} color="#FFD700" />
                    <pointLight position={[-5, -5, -5]} intensity={0.5} color="#14F195" />
                    <DollarSymbol3D />
                    <FloatingCoins />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}

// Mouse follower gradient
function MouseGradient() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { damping: 25, stiffness: 100 });
    const springY = useSpring(mouseY, { damping: 25, stiffness: 100 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX - 250);
            mouseY.set(e.clientY - 250);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-20"
            style={{
                x: springX,
                y: springY,
                background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(20,241,149,0.1) 40%, transparent 70%)',
                filter: 'blur(60px)'
            }}
        />
    );
}

// Animated gradient orb
function GradientOrb({ className, color, delay = 0 }: { className: string; color: string; delay?: number }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.3, 1],
                x: [0, 40, -30, 0],
                y: [0, -30, 40, 0]
            }}
            transition={{
                duration: 10,
                delay,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
            style={{
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                filter: 'blur(80px)'
            }}
        />
    );
}

// D3 Timeline Component
function AgeTimeline({ birthDate }: { birthDate: Date }) {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 100 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: 100
                });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 30, left: 30 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const now = new Date();
        const yearsLived = now.getFullYear() - birthDate.getFullYear();

        const xScale = d3.scaleLinear()
            .domain([0, yearsLived + 1])
            .range([0, width]);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Gradient definition
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'timeline-gradient')
            .attr('x1', '0%')
            .attr('x2', '100%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#FFD700');

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#14F195');

        // Main line
        g.append('line')
            .attr('x1', 0)
            .attr('y1', height / 2)
            .attr('x2', width)
            .attr('y2', height / 2)
            .attr('stroke', 'rgba(255,255,255,0.1)')
            .attr('stroke-width', 4)
            .attr('stroke-linecap', 'round');

        // Animated progress line
        g.append('line')
            .attr('x1', 0)
            .attr('y1', height / 2)
            .attr('x2', 0)
            .attr('y2', height / 2)
            .attr('stroke', 'url(#timeline-gradient)')
            .attr('stroke-width', 4)
            .attr('stroke-linecap', 'round')
            .transition()
            .duration(2000)
            .ease(d3.easeCubicOut)
            .attr('x2', xScale(yearsLived));

        // Year markers
        const years = Array.from({ length: yearsLived + 1 }, (_, i) => i);

        years.forEach((year, i) => {
            const x = xScale(year);

            // Milestone circles
            g.append('circle')
                .attr('cx', x)
                .attr('cy', height / 2)
                .attr('r', 0)
                .attr('fill', year === 0 ? '#FFD700' : year === yearsLived ? '#14F195' : 'rgba(255,255,255,0.3)')
                .transition()
                .delay(i * 100)
                .duration(500)
                .attr('r', year % 5 === 0 || year === yearsLived ? 8 : 4);

            // Year labels for key milestones
            if (year % 5 === 0 || year === yearsLived) {
                g.append('text')
                    .attr('x', x)
                    .attr('y', height / 2 + 25)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'rgba(255,255,255,0.6)')
                    .attr('font-size', '10px')
                    .attr('font-family', 'monospace')
                    .text(year === 0 ? '2005' : year === yearsLived ? 'Now' : `${year}y`);
            }
        });

    }, [birthDate, dimensions]);

    return (
        <div ref={containerRef} className="w-full">
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
        </div>
    );
}

// Info Card Component
function InfoCard({ icon: Icon, title, value, color, delay }: {
    icon: typeof Clock;
    title: string;
    value: string;
    color: string;
    delay: number;
}) {
    return (
        <motion.div
            className="info-card relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden group"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.02, borderColor: `${color}40` }}
        >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to bottom right, ${color}08, transparent)` }} />
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-0 group-hover:opacity-50 transition-all duration-700"
                style={{ background: color }} />
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundColor: `${color}15` }}>
                        <Icon size={20} color={color} />
                    </div>
                    <span className="text-xs text-text-muted uppercase tracking-widest font-medium">{title}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                    {value}
                </div>
            </div>
        </motion.div>
    );
}

export default function AboutMePage() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Birth date
    const birthDate = new Date(2005, 8, 6); // September 6, 2005
    const now = new Date();
    const age = now.getFullYear() - birthDate.getFullYear();
    const ageMonths = now.getMonth() - birthDate.getMonth();
    const exactAge = ageMonths < 0 || (ageMonths === 0 && now.getDate() < birthDate.getDate()) ? age - 1 : age;

    // Lenis smooth scrolling
    const lenis = useLenis();

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading character animation
            if (headingRef.current) {
                const chars = headingRef.current.querySelectorAll('.heading-char');
                gsap.fromTo(chars,
                    { opacity: 0, y: 60, rotateY: -90, transformOrigin: 'center bottom' },
                    {
                        opacity: 1, y: 0, rotateY: 0,
                        stagger: 0.04,
                        duration: 1,
                        ease: 'back.out(1.7)',
                        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' }
                    }
                );
            }

            // Content reveal
            gsap.fromTo(contentRef.current,
                { y: 60, opacity: 0, filter: 'blur(10px)' },
                {
                    y: 0, opacity: 1, filter: 'blur(0px)',
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: contentRef.current, start: 'top 80%' }
                }
            );

            // Parallax for orbs
            gsap.to('.orb-parallax-1', {
                y: -150,
                scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2 }
            });
            gsap.to('.orb-parallax-2', {
                y: 100, x: -50,
                scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const splitText = (text: string) => {
        return text.split('').map((char, i) => (
            <span key={i} className="heading-char inline-block" style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
                {char === ' ' ? '\u00A0' : char}
            </span>
        ));
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    return (
        <section ref={sectionRef} className="min-h-screen relative overflow-hidden bg-background-primary py-24 lg:py-32">
            {/* Mouse Gradient */}
            <MouseGradient />

            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <GradientOrb
                    className="orb-parallax-1 absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full"
                    color="rgba(255,215,0,0.12)"
                    delay={0}
                />
                <GradientOrb
                    className="orb-parallax-2 absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full"
                    color="rgba(20,241,149,0.1)"
                    delay={1}
                />
                <GradientOrb
                    className="absolute top-[30%] left-[20%] w-[400px] h-[400px] rounded-full"
                    color="rgba(255,140,0,0.08)"
                    delay={2}
                />

                {/* Grid pattern */}
                <motion.div
                    className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_30%,transparent_100%)]"
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Noise texture */}
                <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />
            </div>

            {/* 3D Scene */}
            <Scene3D />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-20">
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'backOut' }}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.8)]"></span>
                        </span>
                        Personal Profile
                    </motion.div>

                    {/* Main Heading */}
                    <h1 ref={headingRef} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] mb-8 leading-[0.9]">
                        <span className="text-white">{splitText('About ')}</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 bg-[size:200%] animate-[gradient_8s_ease-in-out_infinite]">
                            {splitText('Me')}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-xl sm:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        Building the future of <ShinyText text="financial technology" speed={3} shineColor="#FFD700" color="#14F195" className="font-semibold" />
                        {' '}one algorithm at a time
                    </motion.p>
                </div>

                {/* Content Grid - Improved Alignment */}
                <div ref={contentRef} className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left Column - Personal Info */}
                    <div className="space-y-8">
                        {/* Main Info Card */}
                        <motion.div
                            className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 backdrop-blur-2xl overflow-hidden"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-green-500 to-yellow-500" />
                            <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-[60px]" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-green-500/10">
                                        <User size={28} className="text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Pranay Gajbhiye</h3>
                                        <p className="text-sm text-text-muted">Founder & Quant Developer</p>
                                    </div>
                                </div>

                                {/* Birth Date Display */}
                                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Calendar size={18} className="text-yellow-400" />
                                        <span className="text-xs uppercase tracking-widest text-text-muted">Date of Birth</span>
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
                                        {formatDate(birthDate)}
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-4">
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">About</h4>
                                    <p className="text-text-secondary leading-relaxed">
                                        Born and raised in India, I discovered my passion for technology at age 15 when I wrote my first
                                        Python script. What started as curiosity quickly evolved into an obsession with building elegant
                                        solutions to complex problems.
                                    </p>
                                    <p className="text-text-secondary leading-relaxed">
                                        At 17, I stumbled upon algorithmic trading and was immediately captivated by the intersection of
                                        mathematics, programming, and financial markets. I spent countless nights studying quantitative
                                        strategies, backtesting systems, and learning from the best minds in the industry.
                                    </p>
                                    <p className="text-text-secondary leading-relaxed">
                                        By 18, I had founded <span className="text-yellow-400 font-semibold">BlackObsidian AMC</span>, a systematic
                                        asset management company focused on building research-driven trading systems. Today, at 20, I'm working
                                        on high-frequency trading infrastructure, machine learning models for alpha generation, and creating
                                        beautiful web experiences that bridge finance and technology.
                                    </p>
                                    <p className="text-text-secondary leading-relaxed">
                                        When I'm not coding or analyzing markets, you'll find me exploring new technologies, reading research
                                        papers, or contributing to open-source projects. I believe in continuous learning and pushing the
                                        boundaries of what's possible with code.
                                    </p>
                                </div>

                                {/* Current Activities */}
                                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-500/5 to-cyan-500/5 border border-green-500/10">
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        Currently Working On
                                    </h4>
                                    <ul className="space-y-2 text-sm text-text-secondary">
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">▸</span>
                                            <span>Building a real-time options pricing engine using WebSocket streams</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">▸</span>
                                            <span>Developing ML models for market microstructure analysis</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-green-400 mt-1">▸</span>
                                            <span>Creating modern web dashboards with React Three Fiber</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Quote */}
                                <div className="pl-4 border-l-2 border-yellow-500/30 mt-6">
                                    <p className="text-text-secondary italic">
                                        "Success in markets comes from systematic thinking, disciplined execution, and continuous learning."
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Info Cards Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <InfoCard
                                icon={Clock}
                                title="Age"
                                value={`${exactAge} Years`}
                                color="#FFD700"
                                delay={0.1}
                            />
                            <InfoCard
                                icon={MapPin}
                                title="Location"
                                value="India"
                                color="#14F195"
                                delay={0.2}
                            />
                            <InfoCard
                                icon={Heart}
                                title="Passion"
                                value="Trading"
                                color="#FF6B6B"
                                delay={0.3}
                            />
                            <InfoCard
                                icon={Zap}
                                title="Focus"
                                value="Quant"
                                color="#00D4FF"
                                delay={0.4}
                            />
                        </div>

                        {/* Achievements & Stats */}
                        <motion.div
                            className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 backdrop-blur-2xl overflow-hidden"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <div className="absolute top-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[60px]" />

                            <div className="relative z-10">
                                <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                                    Achievements & Stats
                                </h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <div className="text-2xl font-bold text-yellow-400 mb-1">15+</div>
                                        <div className="text-xs text-text-muted">Projects Completed</div>
                                    </motion.div>

                                    <motion.div
                                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <div className="text-2xl font-bold text-green-400 mb-1">50K+</div>
                                        <div className="text-xs text-text-muted">Lines of Code</div>
                                    </motion.div>

                                    <motion.div
                                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <div className="text-2xl font-bold text-cyan-400 mb-1">500+</div>
                                        <div className="text-xs text-text-muted">GitHub Contributions</div>
                                    </motion.div>

                                    <motion.div
                                        className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.9 }}
                                    >
                                        <div className="text-2xl font-bold text-purple-400 mb-1">2000+</div>
                                        <div className="text-xs text-text-muted">Learning Hours</div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Education & Skills */}
                        <motion.div
                            className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 backdrop-blur-2xl overflow-hidden"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/10 rounded-full blur-[60px]" />

                            <div className="relative z-10 space-y-6">
                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-gradient-to-b from-yellow-500 to-green-500 rounded-full" />
                                        Education
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                                            <p className="text-white font-semibold">Self-Taught Developer</p>
                                            <p className="text-sm text-text-muted">2020 - Present</p>
                                            <p className="text-xs text-text-muted mt-1">Full-stack development, algorithms, data structures</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                                            <p className="text-white font-semibold">Quantitative Finance</p>
                                            <p className="text-sm text-text-muted">2022 - Present</p>
                                            <p className="text-xs text-text-muted mt-1">Options pricing, statistical arbitrage, risk management</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
                                            <p className="text-white font-semibold">Online Courses & Certifications</p>
                                            <p className="text-sm text-text-muted">Various Platforms</p>
                                            <p className="text-xs text-text-muted mt-1">Machine Learning, Financial Engineering, System Design</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-cyan-500 rounded-full" />
                                        Core Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Python', 'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Git', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'Algorithmic Trading', 'Options Pricing', 'Risk Management', 'System Design', 'WebGL', 'Three.js', 'GSAP', 'Tailwind CSS'].map((skill, i) => (
                                            <motion.span
                                                key={skill}
                                                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 text-green-400 text-xs font-medium"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.6 + i * 0.05 }}
                                            >
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                                        Interests
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { emoji: '📊', text: 'Market Analysis' },
                                            { emoji: '🤖', text: 'AI/ML' },
                                            { emoji: '🎨', text: 'UI/UX Design' },
                                            { emoji: '⚡', text: 'Performance' },
                                            { emoji: '📚', text: 'Reading' },
                                            { emoji: '🎮', text: 'Gaming' },
                                            { emoji: '🎵', text: 'Music' },
                                            { emoji: '🚀', text: 'Space Tech' }
                                        ].map((interest, i) => (
                                            <motion.div
                                                key={interest.text}
                                                className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.7 + i * 0.1 }}
                                            >
                                                <span className="text-2xl">{interest.emoji}</span>
                                                <span className="text-sm text-white">{interest.text}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Timeline & Stats */}
                    <div className="space-y-8">
                        {/* Age Timeline */}
                        <motion.div
                            className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 backdrop-blur-2xl"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-green-500/10">
                                    <Sparkles size={20} className="text-yellow-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Life Journey</h3>
                            </div>
                            <AgeTimeline birthDate={birthDate} />
                            <div className="mt-6 flex justify-between text-sm">
                                <div className="text-text-muted">
                                    <span className="text-yellow-400 font-bold">Born:</span> Sept 2005
                                </div>
                                <div className="text-text-muted">
                                    <span className="text-green-400 font-bold">Today:</span> {exactAge} years old
                                </div>
                            </div>
                        </motion.div>

                        {/* Achievements Card */}
                        <motion.div
                            className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 backdrop-blur-2xl overflow-hidden"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-[60px]" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/10">
                                        <Star size={20} className="text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Milestones</h3>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { year: '2020', event: 'Started coding journey with Python', color: '#FFD700', age: '15' },
                                        { year: '2021', event: 'Built first full-stack web application', color: '#FF6B6B', age: '16' },
                                        { year: '2022', event: 'Discovered quantitative trading', color: '#14F195', age: '17' },
                                        { year: '2023', event: 'Founded BlackObsidian AMC', color: '#00D4FF', age: '18' },
                                        { year: '2024', event: 'Launched first trading algorithm', color: '#9945FF', age: '19' },
                                        { year: '2025', event: 'Scaled to multi-strategy portfolio', color: '#FFD700', age: '19-20' },
                                        { year: '2026', event: 'Building next-gen trading infrastructure', color: '#14F195', age: '20' },
                                    ].map((milestone, i) => (
                                        <motion.div
                                            key={milestone.year}
                                            className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.4 + i * 0.1 }}
                                        >
                                            <div
                                                className="w-2 h-2 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: milestone.color, boxShadow: `0 0 10px ${milestone.color}` }}
                                            />
                                            <span className="text-sm font-mono text-text-muted">{milestone.year}</span>
                                            <span className="text-sm text-white">{milestone.event}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section >
    );
}
