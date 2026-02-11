// Titanfall Chronicles - Custom Hooks

// Game Engine
export { useGameEngine } from './useGameEngine';

// Touch & Mobile
export { 
  useTouch, 
  useTouchDevice, 
  useViewport,
  type TouchState,
  type GestureType,
  type SwipeDirection,
  type UseTouchOptions,
} from './useTouch';

// Haptic Feedback
export { 
  useHaptic, 
  useThrottledHaptic, 
  useDistanceHaptic,
  type HapticPattern,
  type HapticOptions,
} from './useHaptic';

// Animations
export { useAnimations } from './useAnimations';
