"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { useSoundContext } from "@/components/context/SoundContext";

export function useSoundEffects() {
    const { isMuted, volume } = useSoundContext();
    const audioContextRef = useRef<AudioContext | null>(null);
    const buffersRef = useRef<{ [key: string]: AudioBuffer | null }>({
        hover: null,
        click: null,
    });

    useEffect(() => {
        // Initialize AudioContext
        const initAudio = () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            if (audioContextRef.current.state === "suspended") {
                audioContextRef.current.resume();
            }
        };

        const loadSound = async (url: string, key: string) => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                if (audioContextRef.current) {
                    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
                    buffersRef.current[key] = audioBuffer;
                }
            } catch (error) {
                console.error(`Failed to load sound: ${url}`, error);
            }
        };

        const initAndLoad = async () => {
            initAudio();
            // Load sounds if context is ready
            if (audioContextRef.current && !buffersRef.current.hover) {
                await Promise.all([
                    loadSound('/sounds/hover.wav', 'hover'),
                    loadSound('/sounds/click.wav', 'click')
                ]);
            }
        };

        window.addEventListener("click", initAndLoad, { once: true });
        window.addEventListener("keydown", initAndLoad, { once: true });
        // Also try to load immediately if context exists (e.g. navigation)
        if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
            // Silent init attempt or just prep
        }

        return () => {
            window.removeEventListener("click", initAndLoad);
            window.removeEventListener("keydown", initAndLoad);
        }
    }, []);


    const playBuffer = useCallback((bufferName: string, playbackRate: number = 1, volumeOverride?: number) => {
        if (isMuted || !audioContextRef.current || !buffersRef.current[bufferName]) return;

        try {
            const ctx = audioContextRef.current;
            const source = ctx.createBufferSource();
            const gainNode = ctx.createGain();

            source.buffer = buffersRef.current[bufferName];
            source.playbackRate.value = playbackRate;

            // Randomize pitch slightly for organic feel
            // source.playbackRate.value = playbackRate + (Math.random() * 0.1 - 0.05);

            gainNode.gain.value = (volumeOverride ?? volume);

            source.connect(gainNode);
            gainNode.connect(ctx.destination);

            source.start(0);
        } catch (e) {
            console.error("Audio playback error", e);
        }
    }, [isMuted, volume]);

    const playHover = useCallback(() => {
        // Play tink sound, maybe pitched down slightly for "hover" feel if it's too high
        playBuffer('hover', 0.8, 0.2);
    }, [playBuffer]);

    const playClick = useCallback(() => {
        // Play hihat/click
        playBuffer('click', 1.0, 0.3);
    }, [playBuffer]);

    return { playHover, playClick };
}
