import { useState, useEffect } from 'react';

interface ResponsiveBreakpoints {
  xs: number;  // 0px
  sm: number;  // 640px
  md: number;  // 768px
  lg: number;  // 1024px
  xl: number;  // 1280px
  '2xl': number; // 1536px
}

type BreakpointKey = keyof ResponsiveBreakpoints;

interface UseResponsiveDesignReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: BreakpointKey;
  orientation: 'portrait' | 'landscape';
  windowSize: {
    width: number;
    height: number;
  };
  isTouchDevice: boolean;
  devicePixelRatio: number;
}

const defaultBreakpoints: ResponsiveBreakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsiveDesign = (
  breakpoints: ResponsiveBreakpoints = defaultBreakpoints
): UseResponsiveDesignReturn => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight
      ? 'landscape'
      : 'portrait'
  );

  const [isTouchDevice, setIsTouchDevice] = useState(
    typeof window !== 'undefined' && 'ontouchstart' in window
  );

  const [devicePixelRatio, setDevicePixelRatio] = useState(
    typeof window !== 'undefined' ? window.devicePixelRatio : 1
  );

  // Determine current screen size
  const getScreenSize = (width: number): BreakpointKey => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const screenSize = getScreenSize(windowSize.width);

  // Device type detection
  const isMobile = screenSize === 'xs' || screenSize === 'sm';
  const isTablet = screenSize === 'md';
  const isDesktop = screenSize === 'lg' || screenSize === 'xl' || screenSize === '2xl';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      setWindowSize({
        width: newWidth,
        height: newHeight,
      });

      setOrientation(newWidth > newHeight ? 'landscape' : 'portrait');
    };

    const handleOrientationChange = () => {
      // Delay to ensure accurate dimensions after orientation change
      setTimeout(() => {
        handleResize();
      }, 100);
    };

    const handleDevicePixelRatioChange = () => {
      setDevicePixelRatio(window.devicePixelRatio);
    };

    // Touch device detection
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      );
    };

    // Initial check
    handleResize();
    checkTouchDevice();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Monitor device pixel ratio changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
      mediaQuery.addEventListener('change', handleDevicePixelRatioChange);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
        mediaQuery.removeEventListener('change', handleDevicePixelRatioChange);
      };
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [devicePixelRatio]);

  return {
    isMobile,
    isTablet,
    isDesktop,
    screenSize,
    orientation,
    windowSize,
    isTouchDevice,
    devicePixelRatio,
  };
};
