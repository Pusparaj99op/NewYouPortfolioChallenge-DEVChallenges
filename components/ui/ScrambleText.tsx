'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrambleTextProps {
    text: string;
    className?: string;
    hover?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+';

export default function ScrambleText({ text, className = '', hover = true }: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    const scramble = () => {
        let iteration = 0;

        clearInterval(intervalRef.current!);

        intervalRef.current = setInterval(() => {
            setDisplayText(
                text
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join('')
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current!);
            }

            iteration += 1 / 3;
        }, 30);
    };

    useEffect(() => {
        // Initial scramble on mount
        scramble();
        return () => clearInterval(intervalRef.current!);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleMouseEnter = () => {
        if (hover) {
            setIsHovering(true);
            scramble();
        }
    };

    return (
        <span
            className={`inline-block font-mono cursor-default ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => setIsHovering(false)}
        >
            {displayText}
        </span>
    );
}
