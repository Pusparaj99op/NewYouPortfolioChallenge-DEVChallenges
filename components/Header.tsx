'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
];

export default function Header() {
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'glass shadow-lg shadow-black/20 py-3'
                    : 'py-5 bg-transparent'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple via-accent-blue to-accent-green p-[1px] group-hover:shadow-lg group-hover:shadow-accent-purple/20 transition-all duration-300">
                            <div className="w-full h-full rounded-xl bg-background-primary flex items-center justify-center text-white font-bold text-sm group-hover:bg-transparent transition-all duration-300">
                                BO
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-lg font-bold text-text-primary group-hover:text-accent-purple transition-colors">BlackObsidian</span>
                            <span className="text-sm text-text-muted ml-1 font-medium">AMC</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/[0.02] border border-white/5">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${activeSection === link.href.replace('#', '')
                                        ? 'text-white bg-white/10'
                                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                                {activeSection === link.href.replace('#', '') && (
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-purple rounded-full" />
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.03] border border-white/10 hover:border-accent-purple/50 hover:bg-accent-purple/10 transition-all duration-300 group"
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

                        {/* CTA Button (Desktop) */}
                        <a
                            href="#contact"
                            className="hidden md:inline-flex items-center gap-2 btn-primary text-sm group"
                        >
                            <span>Get in Touch</span>
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center gap-1.5 hover:border-accent-purple/50 transition-all"
                            aria-label="Toggle mobile menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span className={`w-5 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                            <span className={`w-5 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                            <span className={`w-5 h-0.5 bg-text-primary transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="flex flex-col gap-2 py-4 px-2 border-t border-white/5 bg-black/50 rounded-2xl backdrop-blur-xl">
                        {navLinks.map((link, index) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeSection === link.href.replace('#', '')
                                        ? 'bg-white/10 text-white'
                                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${activeSection === link.href.replace('#', '')
                                        ? 'bg-accent-purple'
                                        : 'bg-white/20'
                                    }`} />
                                {link.label}
                            </a>
                        ))}
                        <a
                            href="#contact"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="btn-primary text-center mt-2"
                        >
                            Get in Touch
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
}
