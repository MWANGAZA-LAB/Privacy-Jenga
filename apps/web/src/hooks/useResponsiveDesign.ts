import { useState, useEffect } from 'react';

export const useResponsiveDesign = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  const [isLargeMobile, setIsLargeMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenWidth(width);
      setScreenHeight(height);
      
      // Small mobile: < 480px (iPhone SE, small Android)
      setIsSmallMobile(width < 480);
      
      // Large mobile: 480px - 767px (iPhone 12/13/14, larger Android)
      setIsLargeMobile(width >= 480 && width < 768);
      
      // Mobile: < 768px (all mobile devices)
      setIsMobile(width < 768);
      
      // Tablet: 768px - 1023px (iPad, small laptops)
      setIsTablet(width >= 768 && width < 1024);
      
      // Desktop: >= 1024px (laptops, desktops)
      setIsDesktop(width >= 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { 
    isMobile, 
    isTablet, 
    isDesktop, 
    isSmallMobile, 
    isLargeMobile,
    screenWidth,
    screenHeight
  };
};
