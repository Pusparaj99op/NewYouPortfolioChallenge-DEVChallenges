'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);


// Premium animated contact card — pure CSS/React, no WebGL
function ContactCard() {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * -18, y: x * 18 });
    };

    const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

    const cardStats = [
        { label: 'Projects', value: '12+' },
        { label: 'Strategies', value: '30+' },
        { label: 'Experience', value: '4yr' },
    ];

    return (
        <div
            ref={cardRef}
            className="relative w-[340px] group cursor-pointer"
            style={{ perspective: '1200px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Animated gradient glow border */}
            <div
                className="absolute -inset-0.5 rounded-2xl opacity-60 blur-sm group-hover:opacity-100 group-hover:blur-none transition-all duration-500"
                style={{
                    background: 'linear-gradient(135deg, #9945FF, #14F195, #2F7AF9, #9945FF)',
                    backgroundSize: '300% 300%',
                    animation: 'gradient-flow 4s ease-in-out infinite',
                }}
            />
            {/* Card body with 3D tilt */}
            <div
                className="relative rounded-2xl overflow-hidden transition-transform duration-150 ease-out"
                style={{
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    background: 'linear-gradient(145deg, rgba(12,12,18,0.99) 0%, rgba(8,8,14,0.97) 100%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                }}
            >
                {/* Dynamic shine highlight */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                    style={{
                        background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, rgba(153,69,255,0.12) 0%, transparent 55%)`,
                    }}
                />
                {/* Top color stripe */}
                <div className="h-1" style={{ background: 'linear-gradient(90deg,#9945FF,#14F195,#2F7AF9)' }} />
                <div className="p-7">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#9945FF]/40 group-hover:ring-[#9945FF]/70 transition-all">
                                <Image src="/logo.png" alt="BlackObsidian" fill className="object-cover" />
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm">Pranay Gajbhiye</div>
                                <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-0.5">BlackObsidian AMC</div>
                            </div>
                        </div>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#14F195]"
                            style={{ background: 'rgba(20,241,149,0.08)', border: '1px solid rgba(20,241,149,0.2)' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#14F195] animate-pulse" />
                            Open
                        </span>
                    </div>
                    {/* Divider */}
                    <div className="h-px mb-6 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                    {/* Role tags */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {['Quant Dev', 'Full Stack', 'Web3', 'AI/ML'].map((tag) => (
                            <span key={tag} className="px-2.5 py-1 rounded-md text-[11px] font-mono text-white/45"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2.5 mb-6">
                        {cardStats.map(({ label, value }) => (
                            <div key={label} className="rounded-xl p-3 text-center"
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="text-xl font-bold gradient-text leading-none mb-1">{value}</div>
                                <div className="text-[9px] text-white/30 font-mono uppercase tracking-wider">{label}</div>
                            </div>
                        ))}
                    </div>
                    {/* Divider */}
                    <div className="h-px mb-5 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                    {/* Socials + location */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            {socialLinks.map((s) => (
                                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all"
                                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                                    aria-label={s.name}>
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                                </a>
                            ))}
                        </div>
                        <span className="text-[10px] text-white/25 font-mono">UAE · Remote</span>
                    </div>
                </div>
                {/* Circuit pattern footer */}
                <div className="px-7 pb-5 opacity-15">
                    <svg width="100%" height="24" viewBox="0 0 300 24" fill="none">
                        <line x1="0" y1="12" x2="300" y2="12" stroke="#9945FF" strokeWidth="0.5" strokeDasharray="3 6" />
                        {[50, 110, 170, 230].map(cx => (
                            <circle key={cx} cx={cx} cy={12} r={3} stroke="#14F195" strokeWidth="0.5" />
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    );
}

const socialLinks = [
    { name: 'GitHub', icon: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z', href: 'https://github.com/pranaygajbhiye' },
    { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z', href: 'https://linkedin.com/in/pranaygajbhiye' },
    { name: 'Twitter', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z', href: 'https://twitter.com/pranaygajbhiye7' },
];

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const sectionRef = useRef<HTMLElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const socialsRef = useRef<HTMLDivElement>(null);
    const orbsRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Badge elastic animation
            gsap.fromTo('.contact-badge',
                { scale: 0, opacity: 0, rotation: -10 },
                {
                    scale: 1,
                    opacity: 1,
                    rotation: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)',
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: 'top 85%',
                    }
                }
            );

            // Heading word animation
            gsap.fromTo('.contact-title-word',
                { y: 80, opacity: 0, rotateX: -45 },
                {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    stagger: 0.15,
                    duration: 1,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: 'top 80%',
                    }
                }
            );

            // Subtitle fade
            gsap.fromTo('.contact-subtitle',
                { y: 40, opacity: 0, filter: 'blur(5px)' },
                {
                    y: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: 'top 75%',
                    }
                }
            );

            // Form with slide and scale
            gsap.fromTo(formRef.current,
                {
                    y: 80,
                    opacity: 0,
                    scale: 0.95,
                    rotateX: 10
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotateX: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: 'top 85%',
                    },
                }
            );

            // Form fields staggered entrance
            gsap.fromTo('.form-field',
                { x: -30, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: 'top 80%',
                    }
                }
            );

            // Submit button with bounce
            gsap.fromTo('.submit-button',
                { y: 30, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.7)',
                    scrollTrigger: {
                        trigger: formRef.current,
                        start: 'top 70%',
                    }
                }
            );

            // Social links orbital animation
            const socialIcons = gsap.utils.toArray('.social-icon') as HTMLElement[];
            socialIcons.forEach((icon, index) => {
                gsap.fromTo(icon,
                    {
                        scale: 0,
                        opacity: 0,
                        rotation: -180
                    },
                    {
                        scale: 1,
                        opacity: 1,
                        rotation: 0,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: 'back.out(2)',
                        scrollTrigger: {
                            trigger: socialsRef.current,
                            start: 'top 90%',
                        }
                    }
                );
            });

            // Background orbs parallax
            gsap.to('.contact-orb-1', {
                y: -60,
                x: 40,
                scale: 1.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                }
            });

            gsap.to('.contact-orb-2', {
                y: 40,
                x: -30,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });

            gsap.to('.contact-orb-3', {
                y: 80,
                x: 20,
                scale: 0.8,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2.5
                }
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        // Animate the button during sending
        gsap.to('.submit-button', {
            scale: 0.98,
            duration: 0.1
        });

        // Demo mode: Show success message without actual submission
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            showToast('Demo mode: Form data captured! In production, this would send an email.', 'success');

            // Success animation burst
            gsap.to('.submit-button', {
                scale: 1,
                duration: 0.3,
                ease: 'elastic.out(1, 0.5)'
            });

            // Confetti-like particles animation
            const particles = document.querySelectorAll('.success-particle');
            particles.forEach((particle, i) => {
                gsap.fromTo(particle,
                    { scale: 0, opacity: 1 },
                    {
                        scale: 1,
                        opacity: 0,
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                        rotation: Math.random() * 360,
                        duration: 0.8,
                        delay: i * 0.05,
                        ease: 'power2.out'
                    }
                );
            });
        }, 1500);
    };

    // Input focus animation
    const handleFocus = (field: string) => {
        setFocusedField(field);
        gsap.to(`.field-${field}`, {
            borderColor: 'rgba(153, 69, 255, 0.5)',
            boxShadow: '0 0 20px rgba(153, 69, 255, 0.2)',
            duration: 0.3
        });
    };

    const handleBlur = (field: string) => {
        setFocusedField(null);
        gsap.to(`.field-${field}`, {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'none',
            duration: 0.3
        });
    };

    return (
        <section ref={sectionRef} id="contact" className="section bg-transparent relative overflow-hidden">
            {/* Enhanced Background Glows with parallax */}
            <div ref={orbsRef}>
                <div className="contact-orb-1 absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] bg-accent-purple/10 blur-[150px] rounded-full pointer-events-none" />
                <div className="contact-orb-2 absolute top-1/4 -right-32 w-64 h-64 bg-accent-green/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="contact-orb-3 absolute top-1/4 -left-32 w-64 h-64 bg-accent-blue/10 blur-[100px] rounded-full pointer-events-none" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* Left Column: Premium Animated Contact Card */}
                    <div className="relative w-full hidden lg:flex items-center justify-center fade-in-left">
                        <ContactCard />
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="w-full">
                        <div ref={headerRef} className="text-left mb-8 sm:mb-10">
                            <div className="contact-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                                Get in Touch
                            </div>

                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight overflow-hidden">
                                <span className="contact-title-word inline-block">Let&apos;s</span>{' '}
                                <span className="contact-title-word inline-block gradient-text">Build</span>{' '}
                                <span className="contact-title-word inline-block">Together</span>
                            </h2>
                            <p className="contact-subtitle text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed max-w-lg">
                                Interested in high-frequency trading systems, Web3 infrastructure, or just want to connect? Drop a message.
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] sm:text-xs font-medium">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Demo mode - Form submissions shown in browser only
                            </div>
                        </div>

                        <div className="max-w-xl">
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 relative">
                                {/* Success Particles */}
                                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className={`success-particle absolute top-1/2 left-1/2 w-3 h-3 rounded-full ${i % 2 === 0 ? 'bg-accent-purple' : 'bg-accent-green'}`} style={{ opacity: 0 }} />
                                    ))}
                                </div>

                                {/* Name Field */}
                                <div className="form-field group relative">
                                    <label
                                        htmlFor="name"
                                        className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'name' || formData.name
                                            ? '-top-2.5 text-xs bg-black px-2 text-accent-purple'
                                            : 'top-4 text-text-muted'
                                            }`}
                                    >
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onFocus={() => handleFocus('name')}
                                        onBlur={() => handleBlur('name')}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="field-name w-full px-5 py-4 bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none transition-all duration-300 placeholder-transparent"
                                        placeholder="Your Name"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-purple/0 via-accent-purple/5 to-accent-purple/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                </div>

                                {/* Email Field */}
                                <div className="form-field group relative">
                                    <label
                                        htmlFor="email"
                                        className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'email' || formData.email
                                            ? '-top-2.5 text-xs bg-black px-2 text-accent-purple'
                                            : 'top-4 text-text-muted'
                                            }`}
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onFocus={() => handleFocus('email')}
                                        onBlur={() => handleBlur('email')}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="field-email w-full px-5 py-4 bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none transition-all duration-300 placeholder-transparent"
                                        placeholder="Email Address"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-purple/0 via-accent-purple/5 to-accent-purple/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                </div>

                                {/* Message Field */}
                                <div className="form-field group relative">
                                    <label
                                        htmlFor="message"
                                        className={`absolute left-5 transition-all duration-300 pointer-events-none z-10 ${focusedField === 'message' || formData.message
                                            ? '-top-2.5 text-xs bg-black px-2 text-accent-purple'
                                            : 'top-4 text-text-muted'
                                            }`}
                                    >
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onFocus={() => handleFocus('message')}
                                        onBlur={() => handleBlur('message')}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="field-message w-full px-5 py-4 bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none transition-all duration-300 resize-none placeholder-transparent"
                                        placeholder="Your Message"
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-purple/0 via-accent-purple/5 to-accent-purple/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="submit-button w-full btn-primary text-lg relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {status === 'sending' ? (
                                            <>
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Broadcasting...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                    {/* Shine effect on hover */}
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                </button>

                                {/* Success Message */}
                                {status === 'success' && (
                                    <div className="p-4 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green text-center animate-fade-in-up flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Message confirmed on the block. I&apos;ll get back to you soon.
                                    </div>
                                )}
                            </form>

                            {/* Social Links */}
                            <div ref={socialsRef} className="mt-12 pt-8 border-t border-white/5">
                                <p className="text-left text-sm text-text-muted mb-6">Or connect with me on</p>
                                <div className="flex justify-start gap-4">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-icon w-12 h-12 rounded-full glass-button-white flex items-center justify-center text-text-muted hover:text-white hover:border-accent-purple hover:bg-accent-purple/10 transition-all duration-300 group"
                                            aria-label={social.name}
                                            style={{ '--social-index': index } as React.CSSProperties}
                                        >
                                            <svg className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d={social.icon} />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
