import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './LogoLoop.css';

export type LogoItem = {
    text: string;
    href?: string;
    title?: string;
    icon?: React.ReactNode;
    src?: string;
};

export interface LogoLoopProps {
    logos: LogoItem[];
    speed?: number;
    direction?: 'left' | 'right';
    width?: number | string;
    logoHeight?: number;
    gap?: number;
    pauseOnHover?: boolean;
    hoverSpeed?: number;
    fadeOut?: boolean;
    fadeOutColor?: string;
    scaleOnHover?: boolean;
    ariaLabel?: string;
    className?: string;
    style?: React.CSSProperties;
}

const ANIMATION_CONFIG = {
    SMOOTH_TAU: 0.25,
    MIN_COPIES: 2,
    COPY_HEADROOM: 2
} as const;

const toCssLength = (value?: number | string): string | undefined =>
    typeof value === 'number' ? `${value}px` : (value ?? undefined);

export const LogoLoop = React.memo<LogoLoopProps>(
    ({
        logos,
        speed = 100,
        direction = 'left',
        width = '100%',
        logoHeight = 40,
        gap = 48,
        pauseOnHover = true,
        hoverSpeed,
        fadeOut = true,
        fadeOutColor,
        scaleOnHover = true,
        ariaLabel = 'Technology stack',
        className,
        style
    }) => {
        const containerRef = useRef<HTMLDivElement>(null);
        const trackRef = useRef<HTMLDivElement>(null);
        const seqRef = useRef<HTMLUListElement>(null);

        const [seqWidth, setSeqWidth] = useState<number>(0);
        const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
        const [isHovered, setIsHovered] = useState<boolean>(false);

        const effectiveHoverSpeed = useMemo(() => {
            if (hoverSpeed !== undefined) return hoverSpeed;
            if (pauseOnHover === true) return 0;
            if (pauseOnHover === false) return undefined;
            return 0;
        }, [hoverSpeed, pauseOnHover]);

        const targetVelocity = useMemo(() => {
            const magnitude = Math.abs(speed);
            const directionMultiplier = direction === 'left' ? 1 : -1;
            const speedMultiplier = speed < 0 ? -1 : 1;
            return magnitude * directionMultiplier * speedMultiplier;
        }, [speed, direction]);

        const updateDimensions = useCallback(() => {
            const containerWidth = containerRef.current?.clientWidth ?? 0;
            const sequenceRect = seqRef.current?.getBoundingClientRect?.();
            const sequenceWidth = sequenceRect?.width ?? 0;

            if (sequenceWidth > 0) {
                setSeqWidth(Math.ceil(sequenceWidth));
                const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
                setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
            }
        }, []);

        // Resize observer
        useEffect(() => {
            if (!window.ResizeObserver) {
                const handleResize = () => updateDimensions();
                window.addEventListener('resize', handleResize);
                updateDimensions();
                return () => window.removeEventListener('resize', handleResize);
            }

            const observers = [containerRef, seqRef].map(ref => {
                if (!ref.current) return null;
                const observer = new ResizeObserver(updateDimensions);
                observer.observe(ref.current);
                return observer;
            });

            updateDimensions();

            return () => {
                observers.forEach(observer => observer?.disconnect());
            };
        }, [logos, gap, logoHeight, updateDimensions]);

        // Animation loop
        useEffect(() => {
            const track = trackRef.current;
            if (!track) return;

            const rafRef = { current: null as number | null };
            const lastTimestampRef = { current: null as number | null };
            const offsetRef = { current: 0 };
            const velocityRef = { current: 0 };

            if (seqWidth > 0) {
                offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
                track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
            }

            const animate = (timestamp: number) => {
                if (lastTimestampRef.current === null) {
                    lastTimestampRef.current = timestamp;
                }

                const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
                lastTimestampRef.current = timestamp;

                const target = isHovered && effectiveHoverSpeed !== undefined ? effectiveHoverSpeed : targetVelocity;

                const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
                velocityRef.current += (target - velocityRef.current) * easingFactor;

                if (seqWidth > 0) {
                    let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
                    nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
                    offsetRef.current = nextOffset;

                    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
                }

                rafRef.current = requestAnimationFrame(animate);
            };

            rafRef.current = requestAnimationFrame(animate);

            return () => {
                if (rafRef.current !== null) {
                    cancelAnimationFrame(rafRef.current);
                }
            };
        }, [targetVelocity, seqWidth, isHovered, effectiveHoverSpeed]);

        const cssVariables = useMemo(
            () =>
                ({
                    '--logoloop-gap': `${gap}px`,
                    '--logoloop-logoHeight': `${logoHeight}px`,
                    ...(fadeOutColor && { '--logoloop-fadeColor': fadeOutColor })
                }) as React.CSSProperties,
            [gap, logoHeight, fadeOutColor]
        );

        const rootClassName = useMemo(
            () =>
                [
                    'logoloop',
                    'logoloop--horizontal',
                    fadeOut && 'logoloop--fade',
                    scaleOnHover && 'logoloop--scale-hover',
                    className
                ]
                    .filter(Boolean)
                    .join(' '),
            [fadeOut, scaleOnHover, className]
        );

        const handleMouseEnter = useCallback(() => {
            if (effectiveHoverSpeed !== undefined) setIsHovered(true);
        }, [effectiveHoverSpeed]);

        const handleMouseLeave = useCallback(() => {
            if (effectiveHoverSpeed !== undefined) setIsHovered(false);
        }, [effectiveHoverSpeed]);

        const renderLogoItem = useCallback(
            (item: LogoItem, key: React.Key) => {
                const content = (
                    <span className="logoloop__content">
                        {item.icon && <span className="logoloop__icon">{item.icon}</span>}
                        {item.src && <img src={item.src} alt={item.text || item.title || ''} className="logoloop__image" />}
                        {(!item.icon && !item.src) && <span className="logoloop__text">{item.text}</span>}
                    </span>
                );

                const itemContent = item.href ? (
                    <a
                        className="logoloop__link"
                        href={item.href}
                        aria-label={item.title || item.text}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {content}
                    </a>
                ) : (
                    content
                );

                return (
                    <li className="logoloop__item" key={key} role="listitem">
                        {itemContent}
                    </li>
                );
            },
            []
        );

        const logoLists = useMemo(
            () =>
                Array.from({ length: copyCount }, (_, copyIndex) => (
                    <ul
                        className="logoloop__list"
                        key={`copy-${copyIndex}`}
                        role="list"
                        aria-hidden={copyIndex > 0}
                        ref={copyIndex === 0 ? seqRef : undefined}
                    >
                        {logos.map((item, itemIndex) => renderLogoItem(item, `${copyIndex}-${itemIndex}`))}
                    </ul>
                )),
            [copyCount, logos, renderLogoItem]
        );

        const containerStyle = useMemo(
            (): React.CSSProperties => ({
                width: toCssLength(width) ?? '100%',
                ...cssVariables,
                ...style
            }),
            [width, cssVariables, style]
        );

        return (
            <div ref={containerRef} className={rootClassName} style={containerStyle} role="region" aria-label={ariaLabel}>
                <div className="logoloop__track" ref={trackRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {logoLists}
                </div>
            </div>
        );
    }
);

LogoLoop.displayName = 'LogoLoop';

export default LogoLoop;
