'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StripedLogo from '@/components/ui/StripedLogo';
import WireframeHole from '@/components/ui/WireframeHole';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
    {
        name: 'GitHub',
        href: 'https://github.com/Pusparaj99op',
        icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
    },
    {
        name: 'LinkedIn',
        href: 'https://www.linkedin.com/in/pranaygajbhiye/',
        icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    },
    {
        name: 'X (Twitter)',
        href: 'https://twitter.com/pranaygajbhiye7',
        icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/pranaygajbhiye777/',
        icon: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
    },
    {
        name: 'DEV.to',
        href: 'https://dev.to/pusparaj99op',
        icon: 'M7.42 10.05c-.18-.16-.46-.23-.84-.23H6v4.36h.58c.37 0 .65-.08.83-.23.18-.15.27-.38.27-.69v-2.52c0-.31-.09-.54-.27-.69zM0 2.8v18.4C0 22.76 1.24 24 2.8 24h18.4c1.56 0 2.8-1.24 2.8-2.8V2.8C24 1.24 22.76 0 21.2 0H2.8C1.24 0 0 1.24 0 2.8zm6 5.67h1.77c.83 0 1.5.27 2.02.8.52.53.78 1.22.78 2.07v2.52c0 .85-.26 1.54-.78 2.07-.52.53-1.19.8-2.02.8H6V8.47zm6.97.02c0-.11.04-.22.12-.29.08-.07.18-.11.29-.11h1.8c.11 0 .21.04.29.11a.4.4 0 01.12.29v5.47c0 .11-.04.21-.12.29a.4.4 0 01-.29.11h-1.8c-.11 0-.21-.04-.29-.11a.393.393 0 01-.12-.29V8.49zm5.29-.02l1.83 6.8h.01l1.72-6.8h1.18l-2.19 7.1c-.16.52-.39.91-.69 1.17-.3.26-.7.39-1.21.39h-.5c-.11 0-.21-.04-.29-.11a.393.393 0 01-.12-.29v-.61c0-.11.04-.21.12-.29a.4.4 0 01.29-.11h.26c.28 0 .52-.09.71-.26.19-.17.34-.4.46-.7l-2.35-6.29h1.77z',
    },
];

const quickLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
];

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // GSAP Staggered Entrance
    useEffect(() => {
        const footerElements = document.querySelectorAll('.footer-animate');

        gsap.fromTo(footerElements,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1, // Golden ratio approx 0.1 for fast stagger? or 0.1618
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: 'footer',
                    start: 'top 80%', // Start animating when top of footer hits 80% viewport
                }
            }
        );
    }, []);

    return (
        <footer className="bg-black relative overflow-hidden bg-golden-spiral">
            {/* Mathematical Grid Background */}
            <div className="absolute inset-0 bg-math-grid opacity-10 pointer-events-none" />

            {/* Animated Wireframe Hole - Full Width Bottom */}
            <div className="absolute bottom-[-10%] left-0 w-full h-[800px] pointer-events-none opacity-60 z-0 mix-blend-screen">
                <WireframeHole speed={0.8} gridScale={25} depth={8} />
            </div>

            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/50 to-transparent" />

            {/* Large Striped Logo */}
            <StripedLogo />

            <div className="max-w-7xl mx-auto px-[var(--space-phi-lg)] sm:px-[var(--space-phi-xl)] lg:px-[var(--space-phi-2xl)] py-[var(--space-phi-3xl)] relative">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-phi-2xl)]">
                    {/* Brand */}
                    <div className="space-y-[var(--space-phi-base)]">
                        <Link href="/" className="flex items-center gap-[var(--space-phi-sm)] group">
                            <div className="w-[var(--space-phi-xl)] h-[var(--space-phi-xl)] rounded-xl bg-gradient-to-br from-accent-purple via-accent-blue to-accent-green p-[1px] group-hover:shadow-lg group-hover:shadow-accent-purple/20 transition-all duration-300">
                                <div className="w-full h-full rounded-xl bg-black flex items-center justify-center text-white font-bold text-sm group-hover:bg-transparent transition-all duration-300">
                                    BO
                                </div>
                            </div>
                            <div>
                                <span className="text-[length:var(--text-phi-lg)] font-bold text-text-primary group-hover:text-accent-purple transition-colors">BlackObsidian</span>
                                <span className="text-sm text-text-muted ml-1 font-medium">AMC</span>
                            </div>
                        </Link>
                        <p className="text-text-muted text-sm max-w-xs leading-relaxed">
                            Quantitative trading and asset management. Systematic strategies, order flow analytics, and market microstructure research.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-text-primary font-semibold mb-[var(--space-phi-base)] text-sm uppercase tracking-wider">Navigation</h3>
                        <ul className="space-y-[var(--space-phi-sm)]">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        className="text-text-muted hover:text-white transition-colors text-sm flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-accent-purple transition-colors" />
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-text-primary font-semibold mb-[var(--space-phi-base)] text-sm uppercase tracking-wider">Connect</h3>
                        <a
                            href="mailto:pranaykgajbhiye@gmail.com"
                            className="text-text-muted text-sm mb-[var(--space-phi-base)] block hover:text-accent-purple transition-colors"
                        >
                            pranaykgajbhiye@gmail.com
                        </a>
                        <div className="flex flex-wrap gap-[var(--space-phi-sm)]">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-[var(--space-phi-xl)] h-[var(--space-phi-xl)] rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-purple hover:bg-accent-purple/10 transition-all duration-300 group"
                                    aria-label={social.name}
                                >
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social.icon} fillRule="evenodd" clipRule="evenodd" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-[var(--space-phi-3xl)] pt-[var(--space-phi-lg)] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-text-muted text-sm">
                        © 2026 BlackObsidian AMC. All rights reserved.
                    </p>

                    <div className="flex flex-col items-center relative group/button">
                        <button
                            onClick={scrollToTop}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-text-muted hover:text-white hover:border-accent-purple transition-all text-sm relative z-10"
                        >
                            <span>Back to top</span>
                            <svg className="w-4 h-4 group-hover/button:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

