import { useEffect, useState, useCallback } from 'react';

export interface Particle {
  id: string;
  x: number;
  y: number;
  type: 'dust' | 'spark' | 'magic' | 'confetti' | 'ember' | 'ice' | 'poison';
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
}

export interface DamageNumber {
  id: string;
  x: number;
  y: number;
  value: number;
  type: 'damage' | 'heal' | 'critical' | 'miss';
  isCritical?: boolean;
}

interface ParticleSystemState {
  particles: Particle[];
  damageNumbers: DamageNumber[];
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Particle configuration by type
const PARTICLE_CONFIG = {
  dust: {
    colors: ['#8B7355', '#A0926D', '#6B5B45', '#C4B49C'],
    minSize: 2,
    maxSize: 6,
    minVelocity: -1,
    maxVelocity: 1,
    gravity: 0.05,
    drag: 0.98,
  },
  spark: {
    colors: ['#FFD700', '#FFA500', '#FF6347', '#FFE4B5'],
    minSize: 2,
    maxSize: 4,
    minVelocity: -3,
    maxVelocity: 3,
    gravity: 0.15,
    drag: 0.95,
  },
  magic: {
    colors: ['#A78BFA', '#F472B6', '#60A5FA', '#34D399'],
    minSize: 3,
    maxSize: 8,
    minVelocity: -2,
    maxVelocity: 2,
    gravity: -0.02,
    drag: 0.97,
  },
  confetti: {
    colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#FFA07A', '#98D8C8'],
    minSize: 6,
    maxSize: 12,
    minVelocity: -5,
    maxVelocity: 5,
    gravity: 0.2,
    drag: 0.99,
  },
  ember: {
    colors: ['#FF4500', '#FF6347', '#FFA500', '#FFD700'],
    minSize: 2,
    maxSize: 5,
    minVelocity: -1.5,
    maxVelocity: 1.5,
    gravity: -0.08,
    drag: 0.96,
  },
  ice: {
    colors: ['#A5F3FC', '#67E8F9', '#22D3EE', '#06B6D4'],
    minSize: 3,
    maxSize: 7,
    minVelocity: -2,
    maxVelocity: 2,
    gravity: 0.03,
    drag: 0.99,
  },
  poison: {
    colors: ['#86EFAC', '#4ADE80', '#22C55E', '#16A34A'],
    minSize: 3,
    maxSize: 6,
    minVelocity: -1,
    maxVelocity: 1,
    gravity: -0.03,
    drag: 0.98,
  },
};

// Hook to manage particle system
export function useParticleSystem() {
  const [state, setState] = useState<ParticleSystemState>({
    particles: [],
    damageNumbers: [],
  });

  // Spawn particles at a location
  const spawnParticles = useCallback((
    x: number,
    y: number,
    type: Particle['type'],
    count: number = 10,
    spread: number = 30
  ) => {
    const config = PARTICLE_CONFIG[type];
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = Math.random() * 3 + 1;
      const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
      
      newParticles.push({
        id: generateId(),
        x: x + (Math.random() - 0.5) * spread,
        y: y + (Math.random() - 0.5) * spread,
        type,
        size,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        velocityX: Math.cos(angle) * speed * (Math.random() * 2 + 0.5),
        velocityY: Math.sin(angle) * speed * (Math.random() * 2 + 0.5),
        life: 1,
        maxLife: Math.random() * 30 + 30,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      });
    }

    setState(prev => ({
      ...prev,
      particles: [...prev.particles, ...newParticles],
    }));
  }, []);

  // Spawn damage number
  const spawnDamageNumber = useCallback((
    x: number,
    y: number,
    value: number,
    type: DamageNumber['type'] = 'damage',
    isCritical: boolean = false
  ) => {
    const damageNumber: DamageNumber = {
      id: generateId(),
      x,
      y,
      value,
      type,
      isCritical,
    };

    setState(prev => ({
      ...prev,
      damageNumbers: [...prev.damageNumbers, damageNumber],
    }));

    // Auto-remove after animation
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        damageNumbers: prev.damageNumbers.filter(dn => dn.id !== damageNumber.id),
      }));
    }, 1500);
  }, []);

  // Spawn explosion effect (combo of sparks and dust)
  const spawnExplosion = useCallback((x: number, y: number, intensity: 'small' | 'medium' | 'large' = 'medium') => {
    const counts = { small: 8, medium: 15, large: 30 };
    spawnParticles(x, y, 'spark', counts[intensity], 40);
    spawnParticles(x, y, 'dust', Math.floor(counts[intensity] / 2), 50);
  }, [spawnParticles]);

  // Spawn element-specific effect
  const spawnElementEffect = useCallback((x: number, y: number, element: 'fire' | 'ice' | 'nature' | 'arcane' | 'shadow') => {
    const typeMap: Record<string, Particle['type']> = {
      fire: 'ember',
      ice: 'ice',
      nature: 'poison',
      arcane: 'magic',
      shadow: 'dust',
    };
    spawnParticles(x, y, typeMap[element] || 'magic', 20, 40);
  }, [spawnParticles]);

  // Spawn victory confetti
  const spawnVictoryConfetti = useCallback((centerX: number, centerY: number) => {
    // Spawn from multiple points
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 200;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      setTimeout(() => {
        spawnParticles(x, y, 'confetti', 25, 100);
      }, i * 100);
    }
    // Center burst
    spawnParticles(centerX, centerY, 'confetti', 50, 150);
    spawnParticles(centerX, centerY, 'magic', 30, 100);
  }, [spawnParticles]);

  // Update particles (call this in animation frame)
  useEffect(() => {
    let animationId: number;

    const update = () => {
      setState(prev => ({
        ...prev,
        particles: prev.particles
          .map(p => {
            const config = PARTICLE_CONFIG[p.type];
            return {
              ...p,
              x: p.x + p.velocityX,
              y: p.y + p.velocityY,
              velocityX: p.velocityX * config.drag,
              velocityY: p.velocityY * config.drag + config.gravity,
              rotation: p.rotation + p.rotationSpeed,
              life: p.life - 1 / p.maxLife,
            };
          })
          .filter(p => p.life > 0),
      }));
      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return {
    particles: state.particles,
    damageNumbers: state.damageNumbers,
    spawnParticles,
    spawnDamageNumber,
    spawnExplosion,
    spawnElementEffect,
    spawnVictoryConfetti,
  };
}

// Particle Renderer Component
interface ParticleRendererProps {
  particles: Particle[];
  damageNumbers: DamageNumber[];
}

export function ParticleRenderer({ particles, damageNumbers }: ParticleRendererProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Particles */}
      {particles.map(p => {
        const opacity = p.life;
        const scale = p.type === 'confetti' ? 1 : 0.5 + p.life * 0.5;
        
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.type === 'confetti' ? p.size * 0.6 : p.size,
              backgroundColor: p.color,
              borderRadius: p.type === 'confetti' ? '2px' : '50%',
              opacity,
              transform: `translate(-50%, -50%) rotate(${p.rotation}deg) scale(${scale})`,
              boxShadow: p.type === 'magic' || p.type === 'ember' 
                ? `0 0 ${p.size * 2}px ${p.color}` 
                : 'none',
              transition: 'none',
            }}
          />
        );
      })}

      {/* Damage Numbers */}
      {damageNumbers.map(dn => {
        const colors = {
          damage: '#F87171',
          heal: '#4ADE80',
          critical: '#FFD700',
          miss: '#9CA3AF',
        };

        const fontSizes = {
          damage: dn.isCritical ? 32 : 24,
          heal: 28,
          critical: 48,
          miss: 20,
        };

        return (
          <div
            key={dn.id}
            className={`damage-number damage-number-${dn.type}`}
            style={{
              position: 'absolute',
              left: dn.x,
              top: dn.y,
              color: colors[dn.type],
              fontSize: fontSizes[dn.type],
              fontWeight: 'bold',
              fontFamily: 'var(--font-header), Cinzel, Georgia, serif',
              textShadow: `0 0 20px ${colors[dn.type]}`,
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {dn.type === 'miss' ? 'MISS' : 
             dn.type === 'heal' ? `+${dn.value}` : 
             dn.type === 'critical' ? `${dn.value}!` : 
             `-${dn.value}`}
          </div>
        );
      })}
    </div>
  );
}

// Screen shake component
interface ScreenShakeProps {
  intensity?: 'light' | 'medium' | 'heavy';
  duration?: number;
  trigger: boolean;
  children: React.ReactNode;
}

export function ScreenShake({ 
  intensity = 'medium', 
  duration = 500, 
  trigger, 
  children 
}: ScreenShakeProps) {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  const intensityMap = {
    light: 'screen-shake-light',
    medium: 'screen-shake-medium',
    heavy: 'screen-shake-heavy',
  };

  return (
    <div
      className={isShaking ? intensityMap[intensity] : ''}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
}

// Turn transition overlay
interface TurnTransitionProps {
  player: number;
  isVisible: boolean;
  onComplete?: () => void;
}

export function TurnTransition({ player, isVisible, onComplete }: TurnTransitionProps) {
  useEffect(() => {
    if (isVisible && onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const colors = ['#4A9EFF', '#F87171'];
  const playerNames = ['Player 1', 'Player 2'];
  const playerColors = ['var(--color-p1)', 'var(--color-p2)'];

  return (
    <div
      className="turn-transition-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        pointerEvents: 'none',
      }}
    >
      {/* Background flash */}
      <div
        className="turn-transition-flash"
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, ${colors[player]}40 0%, transparent 70%)`,
        }}
      />
      
      {/* Turn text */}
      <div
        className="turn-transition-text"
        style={{
          fontFamily: 'var(--font-header), Cinzel, Georgia, serif',
          fontSize: '72px',
          fontWeight: 'bold',
          color: playerColors[player],
          textShadow: `0 0 40px ${colors[player]}, 0 0 80px ${colors[player]}80`,
          textAlign: 'center',
        }}
      >
        {playerNames[player]}&apos;s Turn
      </div>
      
      {/* Decorative lines */}
      <div className="turn-transition-lines" style={{ marginTop: '20px' }}>
        <div
          style={{
            width: '300px',
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${colors[player]}, transparent)`,
            margin: '0 auto',
          }}
        />
      </div>
    </div>
  );
}

// Selection highlight component
interface SelectionHighlightProps {
  isSelected: boolean;
  isValidTarget?: boolean;
  isEnemy?: boolean;
  children: React.ReactNode;
}

export function SelectionHighlight({ 
  isSelected, 
  isValidTarget = false, 
  isEnemy = false,
  children 
}: SelectionHighlightProps) {
  let glowColor = 'transparent';
  let glowIntensity = 0;

  if (isSelected) {
    glowColor = '#D4A843';
    glowIntensity = 20;
  } else if (isValidTarget) {
    glowColor = isEnemy ? '#F87171' : '#4ADE80';
    glowIntensity = 15;
  }

  return (
    <div
      style={{
        position: 'relative',
        boxShadow: glowIntensity > 0 
          ? `0 0 ${glowIntensity}px ${glowColor}, 0 0 ${glowIntensity * 2}px ${glowColor}40, inset 0 0 ${glowIntensity / 2}px ${glowColor}20`
          : 'none',
        borderRadius: '8px',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Animated border for selected state */}
      {isSelected && (
        <div
          className="selection-ring"
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '12px',
            border: '2px solid transparent',
            background: 'linear-gradient(90deg, #D4A843, #E8C97A, #D4A843) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'selectionRotate 3s linear infinite',
          }}
        />
      )}
      {children}
    </div>
  );
}
