import React, { useState, useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memory: number;
  renders: number;
  mountTime: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  enabled = true, 
  position = 'top-right' 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memory: 0,
    renders: 0,
    mountTime: 0
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const mountTimeRef = useRef(performance.now());
  const renderCountRef = useRef(0);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    if (!enabled) return;

    mountTimeRef.current = performance.now();
    renderCountRef.current = 0;

    // FPS Counter
    const countFrames = () => {
      frameCountRef.current++;
      animationIdRef.current = requestAnimationFrame(countFrames);
    };

    // Metrics calculation
    const calculateMetrics = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;
      
      if (deltaTime >= 1000) { // Update every second
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
        const frameTime = deltaTime / frameCountRef.current;
        
        // Memory usage (if available)
        const memory = (performance as any).memory 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
          : 0;

        const mountTime = currentTime - mountTimeRef.current;

        setMetrics({
          fps: isFinite(fps) ? fps : 0,
          frameTime: isFinite(frameTime) ? frameTime : 0,
          memory,
          renders: renderCountRef.current,
          mountTime
        });

        // Reset counters
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }
    };

    // Start monitoring
    countFrames();
    const intervalId = setInterval(calculateMetrics, 1000);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      clearInterval(intervalId);
    };
  }, [enabled]);

  // Increment render count on each render
  renderCountRef.current++;

  if (!enabled) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      default: return 'top-4 right-4';
    }
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'text-green-400';
    if (memory < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 bg-black/80 text-white p-3 rounded-lg font-mono text-xs`}>
      <div className="font-bold mb-2 text-center">Performance</div>
      
      <div className="space-y-1">
        <div className={`flex justify-between ${getFpsColor(metrics.fps)}`}>
          <span>FPS:</span>
          <span>{metrics.fps}</span>
        </div>
        
        <div className="flex justify-between text-gray-300">
          <span>Frame:</span>
          <span>{metrics.frameTime.toFixed(1)}ms</span>
        </div>
        
        <div className={`flex justify-between ${getMemoryColor(metrics.memory)}`}>
          <span>Memory:</span>
          <span>{metrics.memory}MB</span>
        </div>
        
        <div className="flex justify-between text-gray-300">
          <span>Renders:</span>
          <span>{metrics.renders}</span>
        </div>
        
        <div className="flex justify-between text-gray-300">
          <span>Mount:</span>
          <span>{Math.round(metrics.mountTime)}ms</span>
        </div>
      </div>

      {/* Performance Warnings */}
      {metrics.fps < 30 && (
        <div className="mt-2 p-1 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-center text-xs">
          ⚠️ Low FPS
        </div>
      )}
      
      {metrics.memory > 100 && (
        <div className="mt-1 p-1 bg-yellow-500/20 border border-yellow-500/30 rounded text-yellow-300 text-center text-xs">
          ⚠️ High Memory
        </div>
      )}
    </div>
  );
};