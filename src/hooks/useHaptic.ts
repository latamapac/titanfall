import { useCallback, useRef, useEffect, useState } from 'react';

// Haptic feedback patterns
export type HapticPattern = 
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection'
  | 'impact'
  | 'drag'
  | 'drop'
  | 'tap'
  | 'cardPlay'
  | 'phaseChange'
  | 'victory'
  | 'damage'
  | 'custom';

export interface HapticOptions {
  duration?: number;
  intensity?: number;
  pattern?: number[];
}

// Vibration patterns (in milliseconds)
const VIBRATION_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [50, 50, 50],
  warning: [100, 50, 100],
  error: [200, 100, 200],
  selection: 5,
  impact: 30,
  drag: 15,
  drop: [20, 30, 40],
  tap: 10,
  cardPlay: [30, 50, 80],
  phaseChange: [40, 60, 40],
  victory: [50, 100, 50, 100, 200],
  damage: [100, 50],
  custom: 50,
};

// iOS Haptic Engine patterns (for Capacitor/Cordova apps)
const IOS_HAPTIC_PATTERNS: Record<HapticPattern, string> = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
  warning: 'warning',
  error: 'error',
  selection: 'selection',
  impact: 'medium',
  drag: 'light',
  drop: 'medium',
  tap: 'selection',
  cardPlay: 'success',
  phaseChange: 'medium',
  victory: 'success',
  damage: 'error',
  custom: 'medium',
};

// Check if device supports haptic feedback
function supportsHaptic(): boolean {
  return 'vibrate' in navigator;
}

// Check if running in iOS WebView with haptic support
function supportsIOSHaptic(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return (
    w.webkit &&
    w.webkit.messageHandlers &&
    w.webkit.messageHandlers.hapticFeedback
  );
}

export function useHaptic() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const lastVibrationRef = useRef<number>(0);
  const cooldownRef = useRef<number>(50); // Minimum ms between vibrations
  
  useEffect(() => {
    setIsSupported(supportsHaptic() || supportsIOSHaptic());
    
    // Check user preference from localStorage
    const stored = localStorage.getItem('titanfall-haptic-enabled');
    if (stored !== null) {
      setIsEnabled(stored === 'true');
    }
  }, []);
  
  const trigger = useCallback((pattern: HapticPattern, options?: HapticOptions) => {
    if (!isSupported || !isEnabled) return;
    
    // Cooldown check to prevent spam
    const now = Date.now();
    if (now - lastVibrationRef.current < cooldownRef.current) return;
    lastVibrationRef.current = now;
    
    try {
      // iOS Haptic via WebView bridge
      if (supportsIOSHaptic()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        w.webkit.messageHandlers.hapticFeedback.postMessage({
          type: IOS_HAPTIC_PATTERNS[pattern],
        });
        return;
      }
      
      // Standard Vibration API
      if (supportsHaptic()) {
        let vibrationPattern: number | number[];
        
        if (options?.pattern) {
          vibrationPattern = options.pattern;
        } else if (pattern === 'custom' && options?.duration) {
          vibrationPattern = options.duration;
        } else {
          vibrationPattern = VIBRATION_PATTERNS[pattern];
        }
        
        navigator.vibrate(vibrationPattern);
      }
    } catch (error) {
      // Silently fail - haptic is not critical
      console.warn('Haptic feedback failed:', error);
    }
  }, [isSupported, isEnabled]);
  
  // Convenience methods for common actions
  const tap = useCallback(() => trigger('tap'), [trigger]);
  const light = useCallback(() => trigger('light'), [trigger]);
  const medium = useCallback(() => trigger('medium'), [trigger]);
  const heavy = useCallback(() => trigger('heavy'), [trigger]);
  const success = useCallback(() => trigger('success'), [trigger]);
  const warning = useCallback(() => trigger('warning'), [trigger]);
  const error = useCallback(() => trigger('error'), [trigger]);
  
  const drag = useCallback(() => trigger('drag'), [trigger]);
  const drop = useCallback(() => trigger('drop'), [trigger]);
  const cardPlay = useCallback(() => trigger('cardPlay'), [trigger]);
  const phaseChange = useCallback(() => trigger('phaseChange'), [trigger]);
  const victory = useCallback(() => trigger('victory'), [trigger]);
  const damage = useCallback(() => trigger('damage'), [trigger]);
  
  // Selection feedback for UI interactions
  const selection = useCallback(() => {
    trigger('selection');
  }, [trigger]);
  
  // Impact feedback for buttons
  const impact = useCallback(() => {
    trigger('impact');
  }, [trigger]);
  
  const enable = useCallback(() => {
    setIsEnabled(true);
    localStorage.setItem('titanfall-haptic-enabled', 'true');
  }, []);
  
  const disable = useCallback(() => {
    setIsEnabled(false);
    localStorage.setItem('titanfall-haptic-enabled', 'false');
  }, []);
  
  const toggle = useCallback(() => {
    setIsEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('titanfall-haptic-enabled', String(newValue));
      return newValue;
    });
  }, []);
  
  return {
    isSupported,
    isEnabled,
    trigger,
    tap,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    drag,
    drop,
    cardPlay,
    phaseChange,
    victory,
    damage,
    selection,
    impact,
    enable,
    disable,
    toggle,
  };
}

// Hook for batching haptic feedback to prevent spam
export function useThrottledHaptic(delay = 100) {
  const haptic = useHaptic();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canTriggerRef = useRef(true);
  
  const throttledTrigger = useCallback((pattern: HapticPattern) => {
    if (!canTriggerRef.current) return;
    
    haptic.trigger(pattern);
    canTriggerRef.current = false;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      canTriggerRef.current = true;
    }, delay);
  }, [haptic, delay]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return {
    ...haptic,
    trigger: throttledTrigger,
  };
}

// Hook for distance-based haptic (useful for drag operations)
export function useDistanceHaptic(threshold = 50) {
  const haptic = useHaptic();
  const lastTriggerRef = useRef({ x: 0, y: 0 });
  
  const checkDistance = useCallback((x: number, y: number) => {
    const dx = x - lastTriggerRef.current.x;
    const dy = y - lastTriggerRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance >= threshold) {
      haptic.light();
      lastTriggerRef.current = { x, y };
      return true;
    }
    return false;
  }, [haptic, threshold]);
  
  const reset = useCallback(() => {
    lastTriggerRef.current = { x: 0, y: 0 };
  }, []);
  
  return {
    checkDistance,
    reset,
    haptic,
  };
}
