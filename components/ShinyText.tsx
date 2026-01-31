import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    delay?: number;
    spread?: number;
    direction?: 'left' | 'right';
    color?: string;
    shineColor?: string;
    yoyo?: boolean;
    pauseOnHover?: boolean;
    className?: string;
    link?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
    text,
    disabled = false,
    speed = 3,
    delay = 0,
    spread = 120,
    direction = 'left',
    color = '#b5b5b5',
    shineColor = '#ffffff',
    yoyo = false,
    pauseOnHover = false,
    className = '',
    link,
}) => {
    // State to handle hydration-safe randomization
    const [randomDelay, setRandomDelay] = useState(0);

    useEffect(() => {
        // Calculate a random start point (negative delay) to desynchronize animations
        const randomStart = Math.random() * -5;
        setRandomDelay(randomStart);
    }, []);

    const animationDuration = `${speed}s`;
    const totalDelay = `${delay + randomDelay}s`;

    // Enhanced gradient for smoother shine effect
    const gradientDegree = direction === 'left' ? '110deg' : '-70deg';

    const content = (
        <span
            className={`shiny-text ${className} ${disabled ? '' : 'animate-shine'} ${pauseOnHover ? 'hover:pause-animation' : ''}`}
            style={{
                color: 'transparent',
                backgroundImage: `linear-gradient(${gradientDegree}, ${color} 35%, ${shineColor} 48%, ${shineColor} 52%, ${color} 65%)`,
                backgroundSize: '250% 100%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                textDecoration: 'none',
                ['--animation-duration' as any]: animationDuration,
                ['--animation-delay' as any]: totalDelay,
            }}
        >
            {text}
            <style jsx>{`
                .shiny-text {
                    will-change: background-position;
                }
                .animate-shine {
                    animation-name: shine;
                    animation-duration: var(--animation-duration);
                    animation-delay: var(--animation-delay);
                    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                    animation-iteration-count: infinite;
                }
                .hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
                @keyframes shine {
                    0% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: -100% 50%;
                    }
                }
            `}</style>
        </span>
    );

    if (link) {
        return <Link href={link}>{content}</Link>;
    }

    return content;
};

export default ShinyText;
