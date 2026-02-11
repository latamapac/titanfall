import { useState, useCallback, useRef, useEffect } from 'react';

// Touch gesture types
export type GestureType = 'tap' | 'doubleTap' | 'longPress' | 'swipe' | 'pinch' | 'drag' | 'none';

export interface TouchState {
  isDragging: boolean;
  isPinching: boolean;
  dragStart: { x: number; y: number } | null;
  dragCurrent: { x: number; y: number } | null;
  dragDelta: { x: number; y: number };
  pinchStart: number | null;
  pinchScale: number;
  gesture: GestureType;
}

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

export interface UseTouchOptions {
  // Gesture detection thresholds
  swipeThreshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
  dragThreshold?: number;
  pinchThreshold?: number;
  
  // Callbacks
  onTap?: (e: TouchEvent | MouseEvent) => void;
  onDoubleTap?: (e: TouchEvent | MouseEvent) => void;
  onLongPress?: (e: TouchEvent | MouseEvent) => void;
  onSwipe?: (direction: SwipeDirection, e: TouchEvent | MouseEvent) => void;
  onDragStart?: (pos: { x: number; y: number }, e: TouchEvent | MouseEvent) => void;
  onDragMove?: (delta: { x: number; y: number }, pos: { x: number; y: number }, e: TouchEvent | MouseEvent) => void;
  onDragEnd?: (delta: { x: number; y: number }, e: TouchEvent | MouseEvent) => void;
  onPinchStart?: (scale: number, e: TouchEvent) => void;
  onPinchMove?: (scale: number, e: TouchEvent) => void;
  onPinchEnd?: (scale: number, e: TouchEvent) => void;
}

const DEFAULT_OPTIONS: Required<Pick<UseTouchOptions, 'swipeThreshold' | 'longPressDelay' | 'doubleTapDelay' | 'dragThreshold' | 'pinchThreshold'>> = {
  swipeThreshold: 50,
  longPressDelay: 500,
  doubleTapDelay: 300,
  dragThreshold: 10,
  pinchThreshold: 0.1,
};

export function useTouch(options: UseTouchOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const [touchState, setTouchState] = useState<TouchState>({
    isDragging: false,
    isPinching: false,
    dragStart: null,
    dragCurrent: null,
    dragDelta: { x: 0, y: 0 },
    pinchStart: null,
    pinchScale: 1,
    gesture: 'none',
  });
  
  const touchRef = useRef<{
    startTime: number;
    startPos: { x: number; y: number } | null;
    lastTapTime: number;
    longPressTimer: ReturnType<typeof setTimeout> | null;
    isTouch: boolean;
    initialDistance: number | null;
    initialScale: number;
    pointers: Map<number, { x: number; y: number }>;
  }>({
    startTime: 0,
    startPos: null,
    lastTapTime: 0,
    longPressTimer: null,
    isTouch: false,
    initialDistance: null,
    initialScale: 1,
    pointers: new Map(),
  });
  
  const getPointerPos = useCallback((e: TouchEvent | MouseEvent | Touch | MouseEvent): { x: number; y: number } => {
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  }, []);
  
  const getDistance = useCallback((p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }, []);
  
  const detectSwipe = useCallback((start: { x: number; y: number }, end: { x: number; y: number }, duration: number): SwipeDirection | null => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < opts.swipeThreshold) return null;
    
    const velocity = distance / (duration || 1);
    
    // Determine primary direction
    if (Math.abs(dx) > Math.abs(dy)) {
      return { direction: dx > 0 ? 'right' : 'left', distance: Math.abs(dx), velocity };
    }
    return { direction: dy > 0 ? 'down' : 'up', distance: Math.abs(dy), velocity };
  }, [opts.swipeThreshold]);
  
  // Touch event handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchRef.current.isTouch = true;
    const pos = getPointerPos(e);
    const now = Date.now();
    
    // Handle multi-touch for pinch
    if (e.touches.length === 2) {
      const p1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const p2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
      touchRef.current.initialDistance = getDistance(p1, p2);
      touchRef.current.initialScale = touchState.pinchScale;
      
      setTouchState(prev => ({
        ...prev,
        isPinching: true,
        gesture: 'pinch',
      }));
      
      opts.onPinchStart?.(touchState.pinchScale, e);
      return;
    }
    
    // Single touch - check for double tap
    if (now - touchRef.current.lastTapTime < opts.doubleTapDelay) {
      opts.onDoubleTap?.(e);
      touchRef.current.lastTapTime = 0;
      clearTimeout(touchRef.current.longPressTimer!);
      touchRef.current.longPressTimer = null;
      setTouchState(prev => ({ ...prev, gesture: 'doubleTap' }));
      return;
    }
    
    touchRef.current.startTime = now;
    touchRef.current.startPos = pos;
    touchRef.current.lastTapTime = now;
    
    // Set up long press timer
    touchRef.current.longPressTimer = setTimeout(() => {
      opts.onLongPress?.(e);
      setTouchState(prev => ({ ...prev, gesture: 'longPress' }));
    }, opts.longPressDelay);
    
    setTouchState(prev => ({
      ...prev,
      dragStart: pos,
      dragCurrent: pos,
      dragDelta: { x: 0, y: 0 },
      gesture: 'none',
    }));
  }, [getPointerPos, getDistance, opts, touchState.pinchScale]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault(); // Prevent scrolling during gestures
    
    // Handle pinch
    if (e.touches.length === 2 && touchState.isPinching) {
      const p1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      const p2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };
      const distance = getDistance(p1, p2);
      
      if (touchRef.current.initialDistance) {
        const scale = (distance / touchRef.current.initialDistance) * touchRef.current.initialScale;
        setTouchState(prev => ({ ...prev, pinchScale: scale }));
        opts.onPinchMove?.(scale, e);
      }
      return;
    }
    
    // Handle drag
    if (touchRef.current.startPos && e.touches.length === 1) {
      const pos = getPointerPos(e);
      const delta = {
        x: pos.x - touchRef.current.startPos.x,
        y: pos.y - touchRef.current.startPos.y,
      };
      
      // Check if we've moved enough to start dragging
      const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
      
      if (!touchState.isDragging && distance > opts.dragThreshold) {
        // Cancel long press if dragging
        clearTimeout(touchRef.current.longPressTimer!);
        touchRef.current.longPressTimer = null;
        
        setTouchState(prev => ({
          ...prev,
          isDragging: true,
          gesture: 'drag',
        }));
        opts.onDragStart?.(touchRef.current.startPos!, e);
      }
      
      if (touchState.isDragging) {
        setTouchState(prev => ({
          ...prev,
          dragCurrent: pos,
          dragDelta: delta,
        }));
        opts.onDragMove?.(delta, pos, e);
      }
    }
  }, [getPointerPos, getDistance, opts, touchState.isDragging, touchState.isPinching]);
  
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const now = Date.now();
    const duration = now - touchRef.current.startTime;
    
    // Handle pinch end
    if (touchState.isPinching) {
      setTouchState(prev => ({
        ...prev,
        isPinching: false,
        pinchStart: null,
      }));
      opts.onPinchEnd?.(touchState.pinchScale, e);
      touchRef.current.initialDistance = null;
      return;
    }
    
    // Handle drag end
    if (touchState.isDragging) {
      const delta = touchState.dragDelta;
      opts.onDragEnd?.(delta, e);
      setTouchState(prev => ({
        ...prev,
        isDragging: false,
        dragStart: null,
        dragCurrent: null,
        dragDelta: { x: 0, y: 0 },
        gesture: 'none',
      }));
      touchRef.current.startPos = null;
      return;
    }
    
    // Check for tap or swipe
    if (touchRef.current.startPos && !touchState.isDragging) {
      const endPos = getPointerPos(e.changedTouches[0] as Touch);
      
      // Check for swipe
      const swipe = detectSwipe(touchRef.current.startPos, endPos, duration);
      if (swipe) {
        opts.onSwipe?.(swipe, e);
        setTouchState(prev => ({ ...prev, gesture: 'swipe' }));
      } else if (duration < opts.longPressDelay) {
        // It's a tap (longPress timer hasn't fired yet)
        clearTimeout(touchRef.current.longPressTimer!);
        touchRef.current.longPressTimer = null;
        opts.onTap?.(e);
        setTouchState(prev => ({ ...prev, gesture: 'tap' }));
      }
    }
    
    touchRef.current.startPos = null;
  }, [getPointerPos, detectSwipe, opts, touchState.isDragging, touchState.isPinching, touchState.dragDelta, touchState.pinchScale]);
  
  // Mouse event handlers (for desktop compatibility)
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (touchRef.current.isTouch) return; // Ignore mouse if touch is being used
    
    const pos = getPointerPos(e);
    const now = Date.now();
    
    // Check for double click
    if (now - touchRef.current.lastTapTime < opts.doubleTapDelay) {
      opts.onDoubleTap?.(e);
      touchRef.current.lastTapTime = 0;
      clearTimeout(touchRef.current.longPressTimer!);
      touchRef.current.longPressTimer = null;
      return;
    }
    
    touchRef.current.startTime = now;
    touchRef.current.startPos = pos;
    touchRef.current.lastTapTime = now;
    
    touchRef.current.longPressTimer = setTimeout(() => {
      opts.onLongPress?.(e);
    }, opts.longPressDelay);
    
    setTouchState(prev => ({
      ...prev,
      dragStart: pos,
      dragCurrent: pos,
      dragDelta: { x: 0, y: 0 },
    }));
  }, [getPointerPos, opts]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!touchRef.current.startPos) return;
    
    const pos = getPointerPos(e);
    const delta = {
      x: pos.x - touchRef.current.startPos.x,
      y: pos.y - touchRef.current.startPos.y,
    };
    
    const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
    
    if (!touchState.isDragging && distance > opts.dragThreshold) {
      clearTimeout(touchRef.current.longPressTimer!);
      touchRef.current.longPressTimer = null;
      
      setTouchState(prev => ({
        ...prev,
        isDragging: true,
      }));
      opts.onDragStart?.(touchRef.current.startPos, e);
    }
    
    if (touchState.isDragging) {
      setTouchState(prev => ({
        ...prev,
        dragCurrent: pos,
        dragDelta: delta,
      }));
      opts.onDragMove?.(delta, pos, e);
    }
  }, [getPointerPos, opts, touchState.isDragging]);
  
  const handleMouseUp = useCallback((e: MouseEvent) => {
    const now = Date.now();
    const duration = now - touchRef.current.startTime;
    
    if (touchState.isDragging) {
      opts.onDragEnd?.(touchState.dragDelta, e);
      setTouchState(prev => ({
        ...prev,
        isDragging: false,
        dragStart: null,
        dragCurrent: null,
        dragDelta: { x: 0, y: 0 },
      }));
    } else if (touchRef.current.startPos) {
      const endPos = getPointerPos(e);
      const swipe = detectSwipe(touchRef.current.startPos, endPos, duration);
      
      if (swipe) {
        opts.onSwipe?.(swipe, e);
      } else if (duration < opts.longPressDelay) {
        clearTimeout(touchRef.current.longPressTimer!);
        touchRef.current.longPressTimer = null;
        opts.onTap?.(e);
      }
    }
    
    touchRef.current.startPos = null;
  }, [getPointerPos, detectSwipe, opts, touchState.isDragging, touchState.dragDelta]);
  
  // Attach global mouse listeners for drag continuation
  useEffect(() => {
    if (touchState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: false });
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [touchState.isDragging, handleMouseMove, handleMouseUp]);
  
  // Clean up timers
  useEffect(() => {
    return () => {
      if (touchRef.current.longPressTimer) {
        clearTimeout(touchRef.current.longPressTimer);
      }
    };
  }, []);
  
  return {
    touchState,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
  };
}

// Hook for detecting if device supports touch
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0
      );
    };
    
    checkTouch();
  }, []);
  
  return isTouchDevice;
}

// Hook for viewport size detection
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  });
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewport({
        width,
        height: window.innerHeight,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);
  
  return viewport;
}
