import type { StatusEffect } from '../../types/game';

interface StatusEffectsProps {
  effects: StatusEffect[];
  size?: 'sm' | 'md' | 'lg';
}

// Map status effect types to icon names
const effectToIcon: Record<string, string> = {
  stun: 'status_stun',
  poison: 'status_poison',
  burn: 'status_burn',
  freeze: 'status_freeze',
  shield: 'status_shield',
  regen: 'status_regen',
  buff: 'status_buff',
  debuff: 'status_debuff',
  // Aliases
  stunned: 'status_stun',
  poisoned: 'status_poison',
  burning: 'status_burn',
  frozen: 'status_freeze',
  protected: 'status_shield',
  regeneration: 'status_regen',
};

// Effect display names
const effectNames: Record<string, string> = {
  stun: 'Stunned',
  poison: 'Poisoned',
  burn: 'Burning',
  freeze: 'Frozen',
  shield: 'Shielded',
  regen: 'Regenerating',
  buff: 'Buffed',
  debuff: 'Weakened',
};

// Effect colors for tooltips
const effectColors: Record<string, string> = {
  stun: '#FCD34D',
  poison: '#4ADE80',
  burn: '#F97316',
  freeze: '#60A5FA',
  shield: '#3B82F6',
  regen: '#4ADE80',
  buff: '#FCD34D',
  debuff: '#A78BFA',
};

export function StatusEffects({ effects, size = 'md' }: StatusEffectsProps) {
  if (!effects || effects.length === 0) return null;
  
  const sizeMap = {
    sm: 20,
    md: 28,
    lg: 40,
  };
  
  const iconSize = sizeMap[size];
  
  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap',
      }}
    >
      {effects.map((effect, idx) => {
        const iconName = effectToIcon[effect.type] || 'status_buff';
        const iconPath = `/assets/ui/${iconName}.png`;
        const effectName = effectNames[effect.type] || effect.type;
        const effectColor = effectColors[effect.type] || '#fff';
        
        return (
          <div
            key={`${effect.type}-${idx}`}
            className="status-effect-icon"
            style={{
              position: 'relative',
              width: iconSize,
              height: iconSize,
            }}
            title={`${effectName}${effect.duration ? ` (${effect.duration} turns)` : ''}`}
          >
            {/* Icon background glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-2px',
                borderRadius: '50%',
                background: effectColor,
                opacity: 0.3,
                filter: 'blur(4px)',
              }}
            />
            
            {/* Icon image */}
            <img
              src={iconPath}
              alt={effectName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: `drop-shadow(0 0 4px ${effectColor})`,
              }}
            />
            
            {/* Duration badge */}
            {effect.duration && effect.duration > 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  minWidth: '14px',
                  height: '14px',
                  padding: '0 3px',
                  background: '#000',
                  border: `1px solid ${effectColor}`,
                  borderRadius: '7px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  color: effectColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {effect.duration}
              </div>
            )}
            
            {/* Stack count badge */}
            {effect.stacks && effect.stacks > 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  minWidth: '14px',
                  height: '14px',
                  padding: '0 3px',
                  background: effectColor,
                  borderRadius: '7px',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {effect.stacks}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Single status effect display (for tooltips or detailed views)
interface StatusEffectDetailProps {
  effect: StatusEffect;
}

export function StatusEffectDetail({ effect }: StatusEffectDetailProps) {
  const iconName = effectToIcon[effect.type] || 'status_buff';
  const iconPath = `/assets/ui/${iconName}.png`;
  const effectName = effectNames[effect.type] || effect.type;
  const effectColor = effectColors[effect.type] || '#fff';
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        background: 'rgba(0,0,0,0.6)',
        borderRadius: '8px',
        border: `1px solid ${effectColor}40`,
      }}
    >
      <img
        src={iconPath}
        alt={effectName}
        style={{
          width: '40px',
          height: '40px',
          objectFit: 'contain',
          filter: `drop-shadow(0 0 8px ${effectColor})`,
        }}
      />
      <div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: effectColor,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {effectName}
        </div>
        <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>
          {effect.description || `${effectName} effect active`}
        </div>
        {(effect.duration || effect.stacks) && (
          <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
            {effect.duration && `Duration: ${effect.duration} turns`}
            {effect.duration && effect.stacks && ' • '}
            {effect.stacks && `Stacks: ${effect.stacks}`}
          </div>
        )}
      </div>
    </div>
  );
}
