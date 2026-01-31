'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { useSoundEffects } from '@/hooks/use-sound-effects';
import { useSoundContext } from './context/SoundContext';
import { gsap } from 'gsap';

const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#quant', label: 'Quant' },
    { href: '#modern', label: 'Modern' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
];

const MagneticNav = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = (e.clientX - (left + width / 2)) * 0.35; // Magnet strength
        const y = (e.clientY - (top + height / 2)) * 0.35;

        gsap.to(ref.current, { x, y, duration: 0.6, ease: 'power3.out' });
    };

    const handleMouseLeave = () => {
        if (!ref.current) return;
        gsap.to(ref.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={className}
        >
            {children}
        </div>
    );
};

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const { playHover, playClick } = useSoundEffects();
    const { isMuted, toggleMute } = useSoundContext();
    const navRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);

    // Entrance Animation
    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(headerRef.current,
            { y: -100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 }
        );
    }, []);

    // Spotlight Effect
    const handleNavMouseMove = (e: React.MouseEvent) => {
        if (!navRef.current) return;
        const rect = navRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        navRef.current.style.setProperty('--mouse-x', `${x}px`);
        navRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            // Detect active section
            const sections = navLinks.map(link => link.href.replace('#', ''));
            for (const section of sections.reverse()) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            ref={headerRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out opacity-0 ${isScrolled
                ? 'bg-white/70 dark:bg-black/10 backdrop-blur-md py-4 border-b border-black/5 dark:border-white/5'
                : 'py-6 bg-transparent'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo - Magnetic */}
                    <MagneticNav className="relative z-10">
                        <Link
                            href="/"
                            className="flex items-center gap-3 group"
                            onMouseEnter={() => playHover()}
                            onClick={() => playClick()}
                        >
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-purple via-accent-blue to-accent-green p-[1px] group-hover:shadow-[0_0_20px_rgba(153,69,255,0.3)] transition-all duration-300">
                                <div className="w-full h-full rounded-2xl bg-background-primary flex items-center justify-center text-text-primary font-bold text-base group-hover:bg-transparent group-hover:text-white transition-all duration-300">
                                    BO
                                </div>
                            </div>
                            <div className="hidden sm:flex flex-col">
                                <span className="text-xl font-bold font-display tracking-tight text-text-primary group-hover:text-accent-purple transition-colors">BlackObsidian</span>
                                <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold group-hover:text-accent-blue transition-colors">AMC Portfolio</span>
                            </div>
                        </Link>
                    </MagneticNav>

                    {/* Desktop Navigation - Glass Pill with Spotlight */}
                    <div
                        ref={navRef}
                        onMouseMove={handleNavMouseMove}
                        className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center p-1.5 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg shadow-black/10 dark:shadow-black/20 hover:border-black/20 dark:hover:border-white/20 transition-all duration-300 group/nav overflow-hidden"
                    >
                        {/* Spotlight Gradient */}
                        <div
                            className="absolute pointer-events-none -inset-px opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300"
                            style={{
                                background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(153, 69, 255, 0.1), transparent 40%)`
                            }}
                        />

                        {navLinks.map((link) => {
                            const isActive = activeSection === link.href.replace('#', '');
                            return (
                                <MagneticNav key={link.href}>
                                    <a
                                        href={link.href}
                                        onMouseEnter={() => playHover()}
                                        onClick={() => playClick()}
                                        className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 block ${isActive
                                            ? 'text-text-primary dark:text-white bg-black/10 dark:bg-white/10 shadow-[0_0_10px_rgba(0,0,0,0.05)] dark:shadow-[0_0_10px_rgba(255,255,255,0.1)]'
                                            : 'text-text-secondary hover:text-text-primary dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                                            }`}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-purple rounded-full shadow-[0_0_8px_rgba(153,69,255,0.8)]" />
                                        )}
                                    </a>
                                </MagneticNav>
                            );
                        })}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3 z-10">
                        {/* Sound Toggle */}
                        <MagneticNav>
                            <button
                                onClick={() => {
                                    toggleMute();
                                    if (isMuted) playClick();
                                }}
                                onMouseEnter={() => !isMuted && playHover()}
                                className="w-11 h-11 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 hover:border-accent-purple/50 hover:bg-accent-purple/10 hover:shadow-[0_0_15px_rgba(153,69,255,0.2)] transition-all duration-300 group"
                                aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                            >
                                {isMuted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-text-muted group-hover:text-text-primary dark:group-hover:text-white transition-colors" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                        <line x1="23" y1="9" x2="17" y2="15" />
                                        <line x1="17" y1="9" x2="23" y2="15" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent-purple group-hover:scale-110 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    </svg>
                                )}
                            </button>
                        </MagneticNav>

                        {/* Theme Toggle */}
                        <MagneticNav>
                            <button
                                onClick={() => {
                                    toggleTheme();
                                    playClick();
                                }}
                                onMouseEnter={() => playHover()}
                                className="w-11 h-11 rounded-full flex items-center justify-center bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 hover:border-accent-purple/50 hover:bg-accent-purple/10 hover:shadow-[0_0_15px_rgba(153,69,255,0.2)] transition-all duration-300 group"
                                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            >
                                {theme === 'dark' ? (
                                    <svg className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-accent-purple group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>
                        </MagneticNav>

                        {/* CTA Button (Desktop) */}
                        <MagneticNav>
                            <a
                                href="#contact"
                                onMouseEnter={() => playHover()}
                                onClick={() => playClick()}
                                className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue text-white text-sm font-semibold shadow-lg shadow-accent-purple/20 hover:shadow-accent-purple/40 hover:scale-105 transition-all duration-300"
                            >
                                <span>Get in Touch</span>
                                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </MagneticNav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => {
                                setIsMobileMenuOpen(!isMobileMenuOpen);
                                playClick();
                            }}
                            className="md:hidden w-11 h-11 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-1.5 hover:border-accent-purple/50 transition-all z-50"
                            aria-label="Toggle mobile menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2 bg-accent-purple' : ''}`} />
                            <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                            <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2 bg-accent-purple' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="flex flex-col gap-2 py-4 px-2 border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 rounded-2xl backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl">
                        {navLinks.map((link, index) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    playClick();
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeSection === link.href.replace('#', '')
                                    ? 'bg-white/10 text-white border border-white/5'
                                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${activeSection === link.href.replace('#', '')
                                    ? 'bg-accent-purple shadow-[0_0_8px_rgba(153,69,255,0.8)]'
                                    : 'bg-white/20'
                                    }`} />
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                playClick();
                            }}
                            className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-white font-semibold mt-2 shadow-lg shadow-accent-purple/20 active:scale-95 transition-all"
                        >
                            Get in Touch
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
}
