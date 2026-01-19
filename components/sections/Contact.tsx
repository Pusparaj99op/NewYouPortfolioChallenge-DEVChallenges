'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    const { showToast } = useToast();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(formRef.current, {
                y: 60,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: formRef.current,
                    start: 'top 85%',
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate simple delay for effect
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            showToast('Message broadcasted successfully!', 'success');
        }, 1500);
    };

    return (
        <section ref={sectionRef} id="contact" className="section bg-black relative overflow-hidden">
            {/* Enhanced Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] bg-accent-purple/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute top-1/4 -right-32 w-64 h-64 bg-accent-green/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent-blue/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-semibold uppercase tracking-wider mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                        Get in Touch
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                        Let&apos;s <span className="gradient-text">Build</span> Together
                    </h2>
                    <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
                        Interested in high-frequency trading systems, Web3 infrastructure, or just want to connect? Drop a message.
                    </p>
                </div>

                <div className="max-w-xl mx-auto">
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Field */}
                        <div className="group relative">
                            <label
                                htmlFor="name"
                                className={`absolute left-5 transition-all duration-300 pointer-events-none ${focusedField === 'name' || formData.name
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
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-4 bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-purple focus:bg-white/[0.03] transition-all duration-300 placeholder-transparent"
                                placeholder="Your Name"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-purple/0 via-accent-purple/5 to-accent-purple/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                        </div>

                        {/* Email Field */}
                        <div className="group relative">
                            <label
                                htmlFor="email"
                                className={`absolute left-5 transition-all duration-300 pointer-events-none ${focusedField === 'email' || formData.email
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
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-5 py-4 bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-purple focus:bg-white/[0.03] transition-all duration-300 placeholder-transparent"
                                placeholder="Email Address"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-purple/0 via-accent-purple/5 to-accent-purple/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                        </div>

                        {/* Message Field */}
                        <div className="group relative">
                            <label
                                htmlFor="message"
                                className={`absolute left-5 transition-all duration-300 pointer-events-none ${focusedField === 'message' || formData.message
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
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-5 py-4 bg-white/[0.02] border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-purple focus:bg-white/[0.03] transition-all duration-300 resize-none placeholder-transparent"
                                placeholder="Your Message"
                            />
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-purple/0 via-accent-purple/5 to-accent-purple/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full btn-primary text-lg relative overflow-hidden group"
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
                    <div className="mt-12 pt-8 border-t border-white/5">
                        <p className="text-center text-sm text-text-muted mb-6">Or connect with me on</p>
                        <div className="flex justify-center gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-purple hover:bg-accent-purple/10 transition-all duration-300 group"
                                    aria-label={social.name}
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d={social.icon} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
