"use client";

import { useEffect, useState } from "react";

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    // Check for low performance device
    const checkPerformance = () => {
      try {
        const connection = (navigator as any).connection;
        const isSlowConnection = connection?.effectiveType === 'slow-2g' || 
                                connection?.effectiveType === '2g' ||
                                connection?.effectiveType === '3g';
        
        const isLowEndDevice = navigator.hardwareConcurrency <= 2 || 
                              (navigator as any).deviceMemory <= 2;

        setIsLowPerformance(isSlowConnection || isLowEndDevice);
      } catch (error) {
        // Fallback if APIs aren't available
        setIsLowPerformance(false);
      }
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

  // Add performance optimizations to body only on client side
  useEffect(() => {
    if (!isClient) return;
    
    if (isReducedMotion || isLowPerformance) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [isReducedMotion, isLowPerformance, isClient]);

  return <>{children}</>;
}
