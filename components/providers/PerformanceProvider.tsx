"use client";

import { useEffect, useState } from "react";

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    // Check for low performance device
    const checkPerformance = () => {
      const connection = (navigator as any).connection;
      const isSlowConnection = connection?.effectiveType === 'slow-2g' || 
                              connection?.effectiveType === '2g' ||
                              connection?.effectiveType === '3g';
      
      const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                            (navigator as any).deviceMemory <= 2;

      setIsLowPerformance(isSlowConnection || isLowEndDevice);
    };

    checkPerformance();

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  // Add performance optimizations to body
  useEffect(() => {
    if (isReducedMotion || isLowPerformance) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [isReducedMotion, isLowPerformance]);

  return <>{children}</>;
}
