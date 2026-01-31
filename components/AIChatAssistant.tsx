'use client';

import { useState, useRef, useEffect, useCallback, memo } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const quickQuestions = [
    'Tell me about your trading experience',
    'What technologies do you use?',
    'How do you approach order flow analysis?',
    'What projects are you working on?',
];

// SVG Icons as components for better performance
const AIBotIcon = memo(({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" opacity="0.2" />
        <path d="M12 6a2 2 0 100 4 2 2 0 000-4z" fill="currentColor" />
        <path d="M12 12c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor" opacity="0.6" />
        <circle cx="8" cy="9" r="1" fill="currentColor" />
        <circle cx="16" cy="9" r="1" fill="currentColor" />
        <path d="M9 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 3l1 2M17 3l-1 2M12 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
));
AIBotIcon.displayName = 'AIBotIcon';

const SparkleIcon = memo(({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor" />
    </svg>
));
SparkleIcon.displayName = 'SparkleIcon';

const ChatBubbleIcon = memo(({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor" opacity="0.3" />
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="currentColor" />
        <circle cx="8" cy="10" r="1.5" fill="currentColor" />
        <circle cx="12" cy="10" r="1.5" fill="currentColor" />
        <circle cx="16" cy="10" r="1.5" fill="currentColor" />
    </svg>
));
ChatBubbleIcon.displayName = 'ChatBubbleIcon';

const CloseIcon = memo(({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
));
CloseIcon.displayName = 'CloseIcon';

const SendIcon = memo(({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
));
SendIcon.displayName = 'SendIcon';

const MinimizeIcon = memo(({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
));
MinimizeIcon.displayName = 'MinimizeIcon';

const UserIcon = memo(({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4" fill="currentColor" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" opacity="0.6" />
    </svg>
));
UserIcon.displayName = 'UserIcon';

export default function AIChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm Pranay's AI assistant powered by Gemini. Ask me anything about quantitative trading, projects, or technical skills!",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized]);

    // Hide pulse after first open
    useEffect(() => {
        if (isOpen) setShowPulse(false);
    }, [isOpen]);

    const sendMessage = async (messageText: string) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/gemini/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: messageText }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply || "I'm sorry, I couldn't process that request. Please try again.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I'm having trouble connecting. Please try again later or contact Pranay directly at pranaykgajbhiye@gmail.com.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickQuestion = (question: string) => {
        sendMessage(question);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Floating Button with Pulse Animation */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setIsMinimized(false);
                }}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ease-out group ${
                    isOpen
                        ? 'bg-background-elevated border border-border-default rotate-0 shadow-lg'
                        : 'bg-gradient-to-br from-accent-purple via-accent-blue to-accent-purple shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95'
                }`}
                aria-label={isOpen ? 'Close chat' : 'Open AI chat assistant'}
            >
                {/* Pulse ring animation */}
                {!isOpen && showPulse && (
                    <>
                        <span className="absolute inset-0 rounded-2xl bg-accent-purple/40 animate-ping" />
                        <span className="absolute inset-0 rounded-2xl bg-accent-purple/20 animate-pulse" />
                    </>
                )}

                {isOpen ? (
                    <CloseIcon className="w-6 h-6 text-text-primary transition-transform duration-300 group-hover:rotate-90" />
                ) : (
                    <ChatBubbleIcon className="w-7 h-7 text-white drop-shadow-sm" />
                )}
            </button>

            {/* Chat Modal */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] transition-all duration-500 ease-out ${
                    isOpen
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                        : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                }`}
            >
                <div className={`bg-background-elevated/95 backdrop-blur-xl border border-border-default rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
                    isMinimized ? 'h-[72px]' : 'h-auto'
                }`}>
                    {/* Header */}
                    <div className="relative overflow-hidden">
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-purple via-accent-blue to-accent-purple bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]" />

                        <div className="relative p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
                                        <SparkleIcon className="w-6 h-6 text-white" />
                                    </div>
                                    {/* Online indicator */}
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent-green rounded-full border-2 border-accent-purple" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-base tracking-tight">AI Assistant</h3>
                                    <p className="text-white/70 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                                        Powered by Gemini
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                            >
                                <MinimizeIcon className={`w-4 h-4 text-white transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Collapsible Content */}
                    <div className={`transition-all duration-300 ease-out overflow-hidden ${isMinimized ? 'max-h-0 opacity-0' : 'max-h-[600px] opacity-100'}`}>
                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-4 space-y-4 scroll-smooth">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                                        message.role === 'user'
                                            ? 'bg-accent-purple/10'
                                            : 'bg-gradient-to-br from-accent-purple/20 to-accent-blue/20'
                                    }`}>
                                        {message.role === 'user' ? (
                                            <UserIcon className="w-4 h-4 text-accent-purple" />
                                        ) : (
                                            <AIBotIcon className="w-4 h-4 text-accent-purple" />
                                        )}
                                    </div>

                                    {/* Message bubble */}
                                    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                        <div
                                            className={`rounded-2xl px-4 py-2.5 ${
                                                message.role === 'user'
                                                    ? 'bg-gradient-to-br from-accent-purple to-accent-blue text-white rounded-tr-md shadow-md shadow-accent-purple/20'
                                                    : 'bg-background-secondary/80 backdrop-blur-sm text-text-primary rounded-tl-md border border-border-subtle'
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                        <span className="text-[10px] text-text-muted mt-1 px-1">
                                            {formatTime(message.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isLoading && (
                                <div className="flex gap-2.5">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 flex items-center justify-center">
                                        <AIBotIcon className="w-4 h-4 text-accent-purple" />
                                    </div>
                                    <div className="bg-background-secondary/80 backdrop-blur-sm rounded-2xl rounded-tl-md px-4 py-3 border border-border-subtle">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-accent-purple animate-bounce [animation-delay:0ms]" />
                                            <span className="w-2 h-2 rounded-full bg-accent-purple animate-bounce [animation-delay:150ms]" />
                                            <span className="w-2 h-2 rounded-full bg-accent-purple animate-bounce [animation-delay:300ms]" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length <= 2 && (
                            <div className="px-4 pb-3 border-t border-border-subtle/50">
                                <p className="text-text-muted text-xs mb-2.5 mt-3 font-medium uppercase tracking-wider">Suggested questions</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickQuestions.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => handleQuickQuestion(q)}
                                            className="text-xs px-3 py-1.5 rounded-full bg-background-secondary/60 border border-border-subtle text-text-secondary hover:border-accent-purple hover:text-accent-purple hover:bg-accent-purple/5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-border-subtle/50 bg-background-secondary/30">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendMessage(input);
                                }}
                                className="flex gap-2 items-center"
                            >
                                <div className="relative flex-1">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask me anything..."
                                        className="w-full px-4 py-2.5 rounded-xl bg-background-elevated border border-border-subtle text-text-primary placeholder-text-muted text-sm focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 focus:outline-none transition-all duration-200"
                                        disabled={isLoading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-accent-purple/30 hover:scale-105 active:scale-95 transition-all duration-200"
                                    aria-label="Send message"
                                >
                                    <SendIcon className="w-4 h-4" />
                                </button>
                            </form>

                            {/* Footer hint */}
                            <p className="text-[10px] text-text-muted text-center mt-2.5 opacity-60">
                                Press Enter to send • AI responses may vary
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
