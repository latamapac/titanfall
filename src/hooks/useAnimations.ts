import { useRef, useCallback, useEffect, useState } from 'react';


// ============================================
// Animation Types & Interfaces
// ============================================

export type AnimationType = 
  | 'cardDraw' 
  | 'cardPlay' 
  | 'unitAttack' 
  | 'unitDamage' 
  | 'unitDeath' 
  | 'unitSpawn'
  | 'hpChange'
  | 'energyPulse'
  | 'energyGain'
  | 'phaseTransition';

export interface AnimationState {
  type: AnimationType | null;
  targetId: string | null;
  isPlaying: boolean;
  progress: number;
}

export interface CardAnimationData {
  cardIndex: number;
  fromRect?: DOMRect;
  toRect?: DOMRect;
}

export interface UnitAnimationData {
  unitId: string;
  fromPos: { r: number; c: number };
  toPos?: { r: number; c: number };
  damage?: number;
  isLethal?: boolean;
}

export interface HPChangeData {
  unitId: string;
  previousHP: number;
  currentHP: number;
  maxHP: number;
}

export interface PhaseTransitionData {
  fromPhase: number;
  toPhase: number;
  phaseName: string;
}

// ============================================
// Animation Durations (in ms)
// ============================================

const ANIMATION_DURATIONS: Record<AnimationType, number> = {
  cardDraw: 600,
  cardPlay: 700,
  unitAttack: 500,
  unitDamage: 600,
  unitDeath: 800,
  unitSpawn: 600,
  hpChange: 500,
  energyPulse: 2000,
  energyGain: 500,
  phaseTransition: 400,
};

// ============================================
// Easing Functions
// ============================================

const EASINGS = {
  // Cubic bezier approximations
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  easeIn: (t: number) => t * t * t,
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  bounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
};

// ============================================
// Main Hook
// ============================================

export function useAnimations() {
  // Refs for DOM elements
  const cardRefs = useRef<Map<number, HTMLElement>>(new Map());
  const unitRefs = useRef<Map<string, HTMLElement>>(new Map());
  const hpBarRefs = useRef<Map<string, HTMLElement>>(new Map());
  const energyRefs = useRef<Map<number, HTMLElement>>(new Map());
  const boardRef = useRef<HTMLElement | null>(null);
  const animationLayerRef = useRef<HTMLElement | null>(null);
  
  // Animation state
  const [activeAnimations, setActiveAnimations] = useState<Set<string>>(new Set());
  const [hpValues, setHpValues] = useState<Map<string, { current: number; previous: number }>>(new Map());
  const [energyValues, setEnergyValues] = useState<Map<number, { current: number; previous: number }>>(new Map());
  
  // RAF tracking
  const rafIds = useRef<Map<string, number>>(new Map());
  const timeouts = useRef<Map<string, number>>(new Map());

  // ============================================
  // Cleanup on unmount
  // ============================================
  useEffect(() => {
    return () => {
      // Cancel all RAFs
      rafIds.current.forEach((id) => cancelAnimationFrame(id));
      rafIds.current.clear();
      
      // Clear all timeouts
      timeouts.current.forEach((id) => clearTimeout(id));
      timeouts.current.clear();
    };
  }, []);

  // ============================================
  // Ref Registration
  // ============================================

  const registerCardRef = useCallback((index: number, el: HTMLElement | null) => {
    if (el) {
      cardRefs.current.set(index, el);
    } else {
      cardRefs.current.delete(index);
    }
  }, []);

  const registerUnitRef = useCallback((unitId: string, el: HTMLElement | null) => {
    if (el) {
      unitRefs.current.set(unitId, el);
    } else {
      unitRefs.current.delete(unitId);
    }
  }, []);

  const registerHPBarRef = useCallback((unitId: string, el: HTMLElement | null) => {
    if (el) {
      hpBarRefs.current.set(unitId, el);
    } else {
      hpBarRefs.current.delete(unitId);
    }
  }, []);

  const registerEnergyRef = useCallback((playerIdx: number, el: HTMLElement | null) => {
    if (el) {
      energyRefs.current.set(playerIdx, el);
    } else {
      energyRefs.current.delete(playerIdx);
    }
  }, []);

  const setBoardRef = useCallback((el: HTMLElement | null) => {
    boardRef.current = el;
  }, []);

  const setAnimationLayerRef = useCallback((el: HTMLElement | null) => {
    animationLayerRef.current = el;
  }, []);

  // ============================================
  // Animation Helpers
  // ============================================

  const addAnimationClass = useCallback((element: HTMLElement, className: string, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      const animationId = Math.random().toString(36).substr(2, 9);
      
      // Add animation class
      element.classList.add(className);
      element.classList.add('will-animate');
      
      setActiveAnimations(prev => new Set(prev).add(animationId));
      
      // Remove after animation completes
      const timeoutId = window.setTimeout(() => {
        element.classList.remove(className);
        element.classList.remove('will-animate');
        setActiveAnimations(prev => {
          const next = new Set(prev);
          next.delete(animationId);
          return next;
        });
        timeouts.current.delete(animationId);
        resolve();
      }, duration);
      
      timeouts.current.set(animationId, timeoutId);
    });
  }, []);

  const animateWithRAF = useCallback((
    id: string,
    duration: number,
    easing: keyof typeof EASINGS,
    onUpdate: (progress: number, easedProgress: number) => void,
    onComplete?: () => void
  ) => {
    const startTime = performance.now();
    const easingFn = EASINGS[easing];
    
    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(rawProgress);
      
      onUpdate(rawProgress, easedProgress);
      
      if (rawProgress < 1) {
        const rafId = requestAnimationFrame(tick);
        rafIds.current.set(id, rafId);
      } else {
        rafIds.current.delete(id);
        onComplete?.();
      }
    };
    
    const rafId = requestAnimationFrame(tick);
    rafIds.current.set(id, rafId);
  }, []);

  // ============================================
  // 1. Card Draw Animation
  // ============================================

  const animateCardDraw = useCallback(async (cardIndex: number): Promise<void> => {
    const cardEl = cardRefs.current.get(cardIndex);
    if (!cardEl) return;
    
    // Add animation class
    await addAnimationClass(cardEl, 'animate-card-draw-v2', ANIMATION_DURATIONS.cardDraw);
  }, [addAnimationClass]);

  // ============================================
  // 2. Card Play Animation
  // ============================================

  const animateCardPlay = useCallback(async (cardIndex: number): Promise<void> => {
    const cardEl = cardRefs.current.get(cardIndex);
    if (!cardEl) return;
    
    // Create trail effect
    const trail = document.createElement('div');
    trail.className = 'card-play-trail';
    cardEl.appendChild(trail);
    
    // Play animation
    await addAnimationClass(cardEl, 'animate-card-play-v2', ANIMATION_DURATIONS.cardPlay);
    
    // Cleanup trail
    trail.remove();
  }, [addAnimationClass]);

  // ============================================
  // 3. Unit Attack Animation
  // ============================================

  const animateUnitAttack = useCallback(async (unitId: string, direction: 'left' | 'right' = 'right'): Promise<void> => {
    const unitEl = unitRefs.current.get(unitId);
    if (!unitEl) return;
    
    // Add direction class
    unitEl.classList.add(`animate-unit-attack-${direction}`);
    
    // Create impact effect
    const impact = document.createElement('div');
    impact.className = 'attack-impact-effect';
    unitEl.appendChild(impact);
    
    // Play animation
    await addAnimationClass(unitEl, 'animate-unit-attack-v2', ANIMATION_DURATIONS.unitAttack);
    
    // Cleanup
    unitEl.classList.remove(`animate-unit-attack-${direction}`);
    impact.remove();
  }, [addAnimationClass]);

  // ============================================
  // 4. Unit Take Damage Animation
  // ============================================

  const animateUnitDamage = useCallback(async (unitId: string, damage: number, hasShield: boolean = false): Promise<void> => {
    const unitEl = unitRefs.current.get(unitId);
    if (!unitEl) return;
    
    // Create damage number
    const damageEl = document.createElement('div');
    damageEl.className = 'damage-number';
    damageEl.textContent = `-${damage}`;
    unitEl.appendChild(damageEl);
    
    // Add shield break effect if applicable
    if (hasShield) {
      const shieldEl = document.createElement('div');
      shieldEl.className = 'damage-shield-effect';
      unitEl.appendChild(shieldEl);
      setTimeout(() => shieldEl.remove(), 500);
    }
    
    // Play animation
    await addAnimationClass(unitEl, 'animate-unit-damage-v2', ANIMATION_DURATIONS.unitDamage);
    
    // Cleanup damage number
    setTimeout(() => damageEl.remove(), 1000);
  }, [addAnimationClass]);

  // ============================================
  // 5. Unit Death Animation
  // ============================================

  const animateUnitDeath = useCallback(async (unitId: string): Promise<void> => {
    const unitEl = unitRefs.current.get(unitId);
    if (!unitEl) return;
    
    // Create particles
    const particleCount = 8;
    const particles: HTMLElement[] = [];
    const colors = ['#ff6b6b', '#ffa500', '#ffcc00', '#888888', '#aaaaaa'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'death-particle';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 100}px`);
      particle.style.setProperty('--dy', `${-50 - Math.random() * 100}px`);
      particle.style.setProperty('--rot', `${Math.random() * 360}deg`);
      particle.style.left = `${20 + Math.random() * 40}%`;
      particle.style.top = `${20 + Math.random() * 40}%`;
      unitEl.appendChild(particle);
      particles.push(particle);
    }
    
    // Create soul effect
    const soul = document.createElement('div');
    soul.className = 'death-soul';
    unitEl.appendChild(soul);
    
    // Play animation
    await addAnimationClass(unitEl, 'animate-unit-death-v2', ANIMATION_DURATIONS.unitDeath);
    
    // Cleanup
    particles.forEach(p => p.remove());
    soul.remove();
  }, [addAnimationClass]);

  // ============================================
  // 6. HP Bar Smooth Transition
  // ============================================

  const animateHPChange = useCallback((unitId: string, previousHP: number, currentHP: number, maxHP: number) => {
    const hpBarEl = hpBarRefs.current.get(unitId);
    if (!hpBarEl) return;
    
    const animationId = `hp-${unitId}`;
    const duration = ANIMATION_DURATIONS.hpChange;
    const isDamage = currentHP < previousHP;
    
    // Store HP values
    setHpValues(prev => new Map(prev).set(unitId, { current: currentHP, previous: previousHP }));
    
    // Calculate percentages
    const prevPercent = (previousHP / maxHP) * 100;
    const currentPercent = (currentHP / maxHP) * 100;
    
    // Set CSS variables
    hpBarEl.style.setProperty('--hp-prev', `${prevPercent}%`);
    hpBarEl.style.setProperty('--hp-current', `${currentPercent}%`);
    hpBarEl.style.setProperty('--hp-color', currentHP <= maxHP * 0.25 ? '#ff4444' : currentHP <= maxHP * 0.5 ? '#ffaa00' : '#44ff44');
    
    // Add animation class
    hpBarEl.classList.remove('hp-bar-damage', 'hp-bar-heal');
    void hpBarEl.offsetHeight; // Force reflow
    hpBarEl.classList.add(isDamage ? 'hp-bar-damage' : 'hp-bar-heal');
    
    // Add low HP pulse if needed
    if (currentHP <= maxHP * 0.25) {
      hpBarEl.classList.add('hp-bar-low');
    } else {
      hpBarEl.classList.remove('hp-bar-low');
    }
    
    // Animate with RAF for smoothness
    animateWithRAF(
      animationId,
      duration,
      'easeOut',
      (progress) => {
        const interpolatedPercent = prevPercent + (currentPercent - prevPercent) * progress;
        hpBarEl.style.width = `${interpolatedPercent}%`;
      },
      () => {
        hpBarEl.classList.remove('hp-bar-damage', 'hp-bar-heal');
        hpBarEl.style.width = `${currentPercent}%`;
      }
    );
  }, [animateWithRAF]);

  // ============================================
  // 7. Energy Crystal Pulse Animation
  // ============================================

  const animateEnergyPulse = useCallback((playerIdx: number, isActive: boolean = true) => {
    const energyEl = energyRefs.current.get(playerIdx);
    if (!energyEl) return;
    
    if (isActive) {
      energyEl.classList.add('animate-energy-crystal-active');
      energyEl.classList.remove('animate-energy-crystal');
    } else {
      energyEl.classList.add('animate-energy-crystal');
      energyEl.classList.remove('animate-energy-crystal-active');
    }
  }, []);

  const animateEnergyGain = useCallback(async (playerIdx: number, previousEnergy: number, currentEnergy: number) => {
    const energyEl = energyRefs.current.get(playerIdx);
    if (!energyEl) return;
    
    // Store energy values
    setEnergyValues(prev => new Map(prev).set(playerIdx, { current: currentEnergy, previous: previousEnergy }));
    
    // Animate gain
    await addAnimationClass(energyEl, 'animate-energy-gain', ANIMATION_DURATIONS.energyGain);
  }, [addAnimationClass]);

  // ============================================
  // 8. Phase Transition Slide Effect
  // ============================================

  const animatePhaseTransition = useCallback(async (_fromPhase: number, _toPhase: number, phaseName: string): Promise<void> => {
    
    // Create phase overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      background: linear-gradient(90deg, transparent, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.9) 80%, transparent);
      padding: 30px 0;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
    `;
    
    const phaseText = document.createElement('div');
    phaseText.textContent = phaseName;
    phaseText.style.cssText = `
      font-family: var(--font-header);
      font-size: 36px;
      color: var(--color-gold);
      text-shadow: 0 0 20px rgba(212, 168, 67, 0.8);
    `;
    phaseText.className = 'animate-phase-name';
    
    const glowBar = document.createElement('div');
    glowBar.className = 'phase-transition-bar';
    glowBar.style.marginTop = '10px';
    
    overlay.appendChild(phaseText);
    overlay.appendChild(glowBar);
    document.body.appendChild(overlay);
    
    // Slide in
    overlay.classList.add('animate-phase-slide-in');
    
    // Wait and slide out
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    overlay.classList.remove('animate-phase-slide-in');
    overlay.classList.add('animate-phase-slide-out');
    
    // Cleanup
    setTimeout(() => overlay.remove(), 400);
  }, []);

  // ============================================
  // Unit Spawn Animation
  // ============================================

  const animateUnitSpawn = useCallback(async (unitId: string): Promise<void> => {
    const unitEl = unitRefs.current.get(unitId);
    if (!unitEl) return;
    
    await addAnimationClass(unitEl, 'animate-unit-spawn-v2', ANIMATION_DURATIONS.unitSpawn);
  }, [addAnimationClass]);

  // ============================================
  // Batch Animations
  // ============================================

  const animateBatch = useCallback(async (animations: Array<{ type: AnimationType; data: unknown }>): Promise<void> => {
    // Execute animations with small delays between them
    for (let i = 0; i < animations.length; i++) {
      const { type, data } = animations[i];
      
      switch (type) {
        case 'cardDraw':
          await animateCardDraw((data as CardAnimationData).cardIndex);
          break;
        case 'cardPlay':
          await animateCardPlay((data as CardAnimationData).cardIndex);
          break;
        case 'unitAttack':
          const attackData = data as UnitAnimationData;
          await animateUnitAttack(attackData.unitId);
          break;
        case 'unitDamage':
          const damageData = data as UnitAnimationData;
          if (damageData.damage) {
            await animateUnitDamage(damageData.unitId, damageData.damage);
          }
          break;
        case 'unitDeath':
          await animateUnitDeath((data as UnitAnimationData).unitId);
          break;
        case 'unitSpawn':
          await animateUnitSpawn((data as UnitAnimationData).unitId);
          break;
        case 'hpChange':
          const hpData = data as HPChangeData;
          animateHPChange(hpData.unitId, hpData.previousHP, hpData.currentHP, hpData.maxHP);
          break;
        case 'energyGain':
          const energyData = data as { playerIdx: number; previous: number; current: number };
          await animateEnergyGain(energyData.playerIdx, energyData.previous, energyData.current);
          break;
        case 'phaseTransition':
          const phaseData = data as PhaseTransitionData;
          await animatePhaseTransition(phaseData.fromPhase, phaseData.toPhase, phaseData.phaseName);
          break;
      }
      
      // Small delay between animations
      if (i < animations.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }, [animateCardDraw, animateCardPlay, animateUnitAttack, animateUnitDamage, animateUnitDeath, animateUnitSpawn, animateHPChange, animateEnergyGain, animatePhaseTransition]);

  // ============================================
  // Cancel All Animations
  // ============================================

  const cancelAllAnimations = useCallback(() => {
    // Cancel all RAFs
    rafIds.current.forEach((id) => cancelAnimationFrame(id));
    rafIds.current.clear();
    
    // Clear all timeouts
    timeouts.current.forEach((id) => clearTimeout(id));
    timeouts.current.clear();
    
    // Remove animation classes from all elements
    cardRefs.current.forEach((el) => {
      el.classList.remove('animate-card-draw-v2', 'animate-card-play-v2', 'will-animate');
    });
    unitRefs.current.forEach((el) => {
      el.classList.remove(
        'animate-unit-attack-v2', 'animate-unit-damage-v2', 
        'animate-unit-death-v2', 'animate-unit-spawn-v2', 'will-animate'
      );
    });
    hpBarRefs.current.forEach((el) => {
      el.classList.remove('hp-bar-damage', 'hp-bar-heal', 'hp-bar-low');
    });
    energyRefs.current.forEach((el) => {
      el.classList.remove('animate-energy-crystal', 'animate-energy-crystal-active', 'animate-energy-gain');
    });
    
    setActiveAnimations(new Set());
  }, []);

  // ============================================
  // Return API
  // ============================================

  return {
    // Ref registration
    registerCardRef,
    registerUnitRef,
    registerHPBarRef,
    registerEnergyRef,
    setBoardRef,
    setAnimationLayerRef,
    
    // Animation methods
    animateCardDraw,
    animateCardPlay,
    animateUnitAttack,
    animateUnitDamage,
    animateUnitDeath,
    animateUnitSpawn,
    animateHPChange,
    animateEnergyPulse,
    animateEnergyGain,
    animatePhaseTransition,
    animateBatch,
    
    // Utility
    cancelAllAnimations,
    
    // State
    activeAnimations,
    hpValues,
    energyValues,
    
    // Animation durations (for external sync)
    durations: ANIMATION_DURATIONS,
  };
}

export default useAnimations;
