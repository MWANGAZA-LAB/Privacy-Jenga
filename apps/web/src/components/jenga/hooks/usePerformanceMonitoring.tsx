import React, { useEffect, useRef, useState } from 'react';

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
    let intervalId: NodeJS.Timeout;

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
    intervalId = setInterval(calculateMetrics, sampleInterval);

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

// Performance Monitoring Component
export const PerformanceMonitor: React.FC<{
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ 
  enabled = process.env.NODE_ENV === 'development', 
  position = 'top-left' 
}) => {
  const metrics = usePerformanceMonitoring({ enabled });

  if (!enabled) return null;

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const getFpsColor = (framesPerSecond: number) => {
    if (framesPerSecond >= 55) return 'text-green-400';
    if (framesPerSecond >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-600/50 text-xs font-mono`}>
      <div className="space-y-1">
        <div className="text-white font-semibold">Performance</div>
        <div className={getFpsColor(metrics.framesPerSecond)}>
          FPS: {metrics.framesPerSecond}
        </div>
        <div className="text-gray-300">
          Frame: {metrics.frameTime.toFixed(1)}ms
        </div>
        <div className="text-gray-300">
          Memory: {metrics.memoryUsage}MB
        </div>
        <div className="text-gray-300">
          Renders: {metrics.renderCount}
        </div>
        <div className="text-gray-300">
          Mount: {metrics.componentMountTime.toFixed(0)}ms
        </div>
      </div>
    </div>
  );
};
