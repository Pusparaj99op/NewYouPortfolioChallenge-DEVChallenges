'use client';

import { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory?: number;
  isLowPerformance: boolean;
}

/**
 * Hook to monitor performance and detect low-performance devices
 * Returns current FPS and whether device is low-performance
 */
export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: undefined,
    isLowPerformance: false,
  });

  const [fpsHistory, setFpsHistory] = useState<number[]>([]);

  const detectLowPerformance = useCallback((avgFps: number) => {
    // Consider low performance if avg FPS is below 30
    return avgFps < 30;
  }, []);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      // Update FPS every second
      if (delta >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / delta);

        setFpsHistory((prev) => {
          const newHistory = [...prev, currentFps].slice(-10); // Keep last 10 samples
          const avgFps = newHistory.reduce((a, b) => a + b, 0) / newHistory.length;

          setMetrics({
            fps: currentFps,
            memory: (performance as any).memory?.usedJSHeapSize
              ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
              : undefined,
            isLowPerformance: detectLowPerformance(avgFps),
          });

          return newHistory;
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [detectLowPerformance]);

  return metrics;
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to detect device capabilities
 */
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowEndDevice: false,
    hasGPU: true,
    cores: navigator.hardwareConcurrency || 4,
  });

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory;

    // Heuristic for low-end device
    const isLowEndDevice = cores <= 2 || (memory && memory <= 4) || isMobile;

    setCapabilities({
      isMobile,
      isLowEndDevice,
      hasGPU: true, // Assume GPU support
      cores,
    });
  }, []);

  return capabilities;
}
