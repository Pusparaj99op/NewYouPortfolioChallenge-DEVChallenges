"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
    volume: number;
    setVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);

    useEffect(() => {
        // Initialize from local storage if available
        const storedMuted = localStorage.getItem("sound-muted");
        if (storedMuted !== null) {
            setIsMuted(JSON.parse(storedMuted));
        }
    }, []);

    const toggleMute = () => {
        setIsMuted((prev) => {
            const newState = !prev;
            localStorage.setItem("sound-muted", JSON.stringify(newState));
            return newState;
        });
    };

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, volume, setVolume }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSoundContext = () => {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error("useSoundContext must be used within a SoundProvider");
    }
    return context;
};
