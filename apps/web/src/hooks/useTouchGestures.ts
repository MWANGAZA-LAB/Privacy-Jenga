import { useState, useEffect, useCallback } from 'react';

interface TouchGesture {
  type: 'tap' | 'swipe' | 'pinch' | 'long-press';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
  distance: number;
  duration: number;
  scale?: number;
}

interface UseTouchGesturesOptions {
  onTap?: (gesture: TouchGesture) => void;
  onSwipe?: (gesture: TouchGesture) => void;
  onPinch?: (gesture: TouchGesture) => void;
  onLongPress?: (gesture: TouchGesture) => void;
  swipeThreshold?: number;
  longPressDelay?: number;
  pinchThreshold?: number;
}

export const useTouchGestures = ({
  onTap,
  onSwipe,
  onPinch,
  onLongPress,
  swipeThreshold = 50,
  longPressDelay = 500,
  pinchThreshold = 10,
}: UseTouchGesturesOptions = {}) => {
  const [touchState, setTouchState] = useState<{
    startTime: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isPressed: boolean;
    initialDistance?: number;
    longPressTimer?: ReturnType<typeof setTimeout>;
  } | null>(null);

  const calculateDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const createGesture = useCallback((
    type: TouchGesture['type'],
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    startTime: number,
    scale?: number
  ): TouchGesture => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - startTime;

    return {
      type,
      startX,
      startY,
      endX,
      endY,
      deltaX,
      deltaY,
      distance,
      duration,
      scale,
    };
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    const now = Date.now();

    // Clear any existing long press timer
    if (touchState?.longPressTimer) {
      clearTimeout(touchState.longPressTimer);
    }

    // Handle multi-touch (pinch)
    if (event.touches.length === 2) {
      const distance = calculateDistance(event.touches[0], event.touches[1]);
      setTouchState({
        startTime: now,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        isPressed: true,
        initialDistance: distance,
      });
      return;
    }

    // Set up long press timer
    const longPressTimer = setTimeout(() => {
      if (touchState?.isPressed && onLongPress) {
        const gesture = createGesture(
          'long-press',
          touch.clientX,
          touch.clientY,
          touch.clientX,
          touch.clientY,
          now
        );
        onLongPress(gesture);
      }
    }, longPressDelay);

    setTouchState({
      startTime: now,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      isPressed: true,
      longPressTimer,
    });
  }, [touchState, onLongPress, createGesture, longPressDelay]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!touchState || !touchState.isPressed) return;

    const touch = event.touches[0];

    // Handle pinch gesture
    if (event.touches.length === 2 && touchState.initialDistance) {
      const currentDistance = calculateDistance(event.touches[0], event.touches[1]);
      const scale = currentDistance / touchState.initialDistance;
      
      if (Math.abs(scale - 1) > pinchThreshold / 100 && onPinch) {
        const gesture = createGesture(
          'pinch',
          touchState.startX,
          touchState.startY,
          touch.clientX,
          touch.clientY,
          touchState.startTime,
          scale
        );
        onPinch(gesture);
      }
      return;
    }

    setTouchState(prev => prev ? {
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
    } : null);
  }, [touchState, onPinch, createGesture, pinchThreshold]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!touchState) return;

    // Clear long press timer
    if (touchState.longPressTimer) {
      clearTimeout(touchState.longPressTimer);
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - touchState.startTime;

    // Determine gesture type
    if (distance > swipeThreshold) {
      // Swipe gesture
      if (onSwipe) {
        const gesture = createGesture(
          'swipe',
          touchState.startX,
          touchState.startY,
          touch.clientX,
          touch.clientY,
          touchState.startTime
        );
        onSwipe(gesture);
      }
    } else if (duration < longPressDelay) {
      // Tap gesture
      if (onTap) {
        const gesture = createGesture(
          'tap',
          touchState.startX,
          touchState.startY,
          touch.clientX,
          touch.clientY,
          touchState.startTime
        );
        onTap(gesture);
      }
    }

    setTouchState(null);
  }, [touchState, onSwipe, onTap, createGesture, swipeThreshold, longPressDelay]);

  const handlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (touchState?.longPressTimer) {
        clearTimeout(touchState.longPressTimer);
      }
    };
  }, [touchState]);

  return {
    handlers,
    isPressed: touchState?.isPressed || false,
    currentPosition: touchState ? {
      x: touchState.currentX,
      y: touchState.currentY,
    } : null,
  };
};
