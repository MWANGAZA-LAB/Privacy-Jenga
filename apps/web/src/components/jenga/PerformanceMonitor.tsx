import React from 'react';
import { usePerformanceMonitoring } from './hooks/usePerformanceMonitoring';

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
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