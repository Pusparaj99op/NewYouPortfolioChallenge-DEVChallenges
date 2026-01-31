'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { usePerformance, useDeviceCapabilities, usePrefersReducedMotion } from '@/hooks/use-performance';

interface PerformanceContextType {
  fps: number;
  isLowPerformance: boolean;
  isMobile: boolean;
  isLowEndDevice: boolean;
  prefersReducedMotion: boolean;
  shouldReduceAnimations: boolean;
}

const PerformanceContext = createContext<PerformanceContextType>({
  fps: 60,
  isLowPerformance: false,
  isMobile: false,
  isLowEndDevice: false,
  prefersReducedMotion: false,
  shouldReduceAnimations: false,
});

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const { fps, isLowPerformance } = usePerformance();
  const { isMobile, isLowEndDevice } = useDeviceCapabilities();
  const prefersReducedMotion = usePrefersReducedMotion();

  const shouldReduceAnimations = isLowPerformance || isLowEndDevice || prefersReducedMotion;

  // Log performance warnings in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isLowPerformance) {
      console.warn(`⚠️ Low performance detected (${fps} FPS). Consider reducing animation complexity.`);
    }
  }, [isLowPerformance, fps]);

  return (
    <PerformanceContext.Provider
      value={{
        fps,
        isLowPerformance,
        isMobile,
        isLowEndDevice,
        prefersReducedMotion,
        shouldReduceAnimations,
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformanceContext() {
  return useContext(PerformanceContext);
}
