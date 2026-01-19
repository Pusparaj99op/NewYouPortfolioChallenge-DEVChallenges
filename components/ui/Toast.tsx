'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3s
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto min-w-[300px] p-4 rounded-xl border backdrop-blur-md shadow-lg animate-slide-in-right transform transition-all duration-300 ${toast.type === 'success'
                                ? 'bg-accent-green/10 border-accent-green/20 text-accent-green'
                                : toast.type === 'error'
                                    ? 'bg-financial-bearish/10 border-financial-bearish/20 text-financial-bearish'
                                    : 'bg-accent-purple/10 border-accent-purple/20 text-accent-purple'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">
                                {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
                            </span>
                            <p className="font-medium text-sm">{toast.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
