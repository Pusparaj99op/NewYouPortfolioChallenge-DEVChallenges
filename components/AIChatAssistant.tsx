'use client';

import { useState, useRef, useEffect } from 'react';

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

export default function AIChatAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm Pranay's AI assistant. Ask me anything about quantitative trading, my projects, or technical skills!",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                        ? 'bg-background-elevated border border-border-default'
                        : 'bg-gradient-to-br from-accent-purple to-accent-blue shadow-lg hover:shadow-xl hover:scale-105'
                    }`}
                aria-label={isOpen ? 'Close chat' : 'Open AI chat'}
            >
                {isOpen ? (
                    <svg className="w-6 h-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>

            {/* Chat Modal */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] transition-all duration-300 ${isOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                <div className="bg-background-elevated border border-border-default rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-accent-purple to-accent-blue p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="text-lg">🤖</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">AI Assistant</h3>
                                <p className="text-white/80 text-xs">Powered by Gemini</p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-80 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.role === 'user'
                                            ? 'bg-accent-purple text-white rounded-br-md'
                                            : 'bg-background-secondary text-text-primary rounded-bl-md'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-background-secondary rounded-2xl rounded-bl-md px-4 py-2">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    {messages.length <= 2 && (
                        <div className="px-4 pb-2">
                            <p className="text-text-muted text-xs mb-2">Quick questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.slice(0, 2).map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => handleQuickQuestion(q)}
                                        className="text-xs px-3 py-1 rounded-full bg-background-secondary border border-border-subtle text-text-secondary hover:border-accent-purple transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-border-subtle">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                sendMessage(input);
                            }}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 rounded-full bg-background-secondary border border-border-subtle text-text-primary placeholder-text-muted text-sm focus:border-accent-purple focus:outline-none transition-colors"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 rounded-full bg-accent-purple text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-purple/90 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
