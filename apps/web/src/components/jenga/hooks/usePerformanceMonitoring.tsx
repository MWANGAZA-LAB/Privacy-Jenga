import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  framesPerSecond: number;
  frameTime: number;
  memoryUsage: number;
  renderCount: number;
  componentMountTime: number;
}

interface UsePerformanceMonitoringOptions {
  enabled?: boolean;
  sampleInterval?: number;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const usePerformanceMonitoring = ({
  enabled = process.env.NODE_ENV === 'development',
  sampleInterval = 1000,
  onMetricsUpdate
}: UsePerformanceMonitoringOptions = {}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    framesPerSecond: 0,
    frameTime: 0,
    memoryUsage: 0,
    renderCount: 0,
    componentMountTime: 0
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const mountTimeRef = useRef(performance.now());
  const renderCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    
    let animationId: number;

    // FPS Counter
    const countFrames = () => {
      frameCountRef.current++;
      animationId = requestAnimationFrame(countFrames);
    };

    // Metrics calculation
    const calculateMetrics = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;
      
      const framesPerSecond = Math.round((frameCountRef.current * 1000) / deltaTime);
      const frameTime = deltaTime / frameCountRef.current;
      
      // Memory usage (if available)
      const memoryUsage = (performance as any).memory 
        ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
        : 0;

      const componentMountTime = currentTime - mountTimeRef.current;

      const newMetrics: PerformanceMetrics = {
        framesPerSecond: isFinite(framesPerSecond) ? framesPerSecond : 0,
        frameTime: isFinite(frameTime) ? frameTime : 0,
        memoryUsage,
        renderCount: renderCountRef.current,
        componentMountTime
      };

      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);

      // Reset counters
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    };

    // Start monitoring
    countFrames();
    const intervalId = setInterval(calculateMetrics, sampleInterval);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(intervalId);
    };
  }, [enabled, sampleInterval, onMetricsUpdate]);

  // Track render count
  useEffect(() => {
    renderCountRef.current++;
  });

  return metrics;
};

