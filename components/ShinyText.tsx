import React, { useEffect, useState } from 'react';

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
}

const ShinyText: React.FC<ShinyTextProps> = ({
    text,
    disabled = false,
    speed = 3,
    delay = 0,
    spread = 120, // Not explicitly used in simplified gradient but concept remains
    direction = 'left',
    color = '#b5b5b5',
    shineColor = '#ffffff',
    yoyo = false,
    pauseOnHover = false,
    className = '',
}) => {
    // State to handle hydration-safe randomization
    const [randomDelay, setRandomDelay] = useState(0);

    useEffect(() => {
        // Calculate a random start point (negative delay) to desynchronize animations
        // and add any user-specified delay.
        // We use a negative delay so the animation seems like it's already running at different phases.
        const randomStart = Math.random() * -5; // Random number between -5 and 0
        setRandomDelay(randomStart);
    }, []);

    const animationDuration = `${speed}s`;
    const totalDelay = `${delay + randomDelay}s`;

    // Improved gradient logic
    const gradientDegree = direction === 'left' ? '120deg' : '-60deg';

    return (
        <span
            className={`shiny-text ${className} ${disabled ? '' : 'animate-shine'} ${pauseOnHover ? 'hover:pause-animation' : ''}`}
            style={{
                color: 'transparent',
                backgroundImage: `linear-gradient(${gradientDegree}, ${color} 40%, ${shineColor} 50%, ${color} 60%)`,
                backgroundSize: '200% 100%',
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
                }
                .animate-shine {
                    animation-name: shine;
                    animation-duration: var(--animation-duration);
                    animation-delay: var(--animation-delay);
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
                .hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
                @keyframes shine {
                    0% {
                        background-position: 100%;
                    }
                    100% {
                        background-position: -100%;
                    }
                }
            `}</style>
        </span>
    );
};

export default ShinyText;
