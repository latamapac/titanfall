import type { Unit } from '../../types/game';
import { StatusEffects } from './StatusEffects';

interface UnitTokenProps {
  unit: Unit;
}

const KW_ICONS: Record<string, string> = {
  taunt: '🛡️', flying: '✈️', stealth: '👤', rush: '⚡', charge: '🐎',
  divine_shield: '🔰', windfury: '🌪️', guard: '🛡️', swift: '💨',
  poisonous: '☠️', lifesteal: '🩸', trample: '🦶', elusive: '👻',
  ward: '📿', haste: '⚡', ranged: '🏹', regen: '🌿', armor: '🛡️',
};

// Map unit effects to status effect types
const mapEffectToStatus = (effect: { type: string }): { type: string; duration?: number } | null => {
  const mapping: Record<string, string> = {
    poison: 'poison',
    burn: 'burn',
    freeze: 'freeze',
    stun: 'stun',
    shield: 'shield',
    regen: 'regen',
  };
  
  if (mapping[effect.type]) {
    return { type: mapping[effect.type], duration: 1 };
  }
  return null;
};

export function UnitTokenEnhanced({ unit }: UnitTokenProps) {
  const isStructure = unit.type === 'structure';
  const isExhausted = !unit.ready && !unit.hasAttacked;
  const stars = unit.vetLv > 0 ? '★'.repeat(unit.vetLv) : '';

  // Build status effects array
  const statusEffects: Array<{ type: string; duration?: number; stacks?: number }> = [];
  
  if (unit._divine_shield) statusEffects.push({ type: 'shield', duration: 1 });
  if (unit._frozen) statusEffects.push({ type: 'freeze', duration: 1 });
  if (unit._stealthed) statusEffects.push({ type: 'buff', duration: 1 });
  if (unit._ward) statusEffects.push({ type: 'buff', duration: 1 });
  if (unit.effects) {
    unit.effects.forEach(e => {
      const mapped = mapEffectToStatus(e);
      if (mapped) statusEffects.push(mapped);
    });
  }

  // Element color mapping
  const elemColors: Record<string, string> = {
    fire: '#EF4444',
    earth: '#22C55E',
    wind: '#06B6D4',
    shadow: '#8B5CF6',
    arcane: '#3B82F6',
  };
  const elemColor = elemColors[unit.elem] || '#888';

  return (
    <div
      className={`unit-token-enhanced owner-${unit.owner} ${isStructure ? 'is-structure' : ''} ${isExhausted ? 'exhausted' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${elemColor}30, ${elemColor}10)`,
        border: `2px solid ${unit.owner === 0 ? '#4ADE80' : '#F87171'}`,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px',
        boxShadow: isExhausted ? 'none' : `0 0 10px ${elemColor}40`,
        opacity: isExhausted ? 0.6 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Top row: Name and Stars */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
      }}>
        <span style={{
          fontSize: '8px',
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '60%',
        }}>
          {unit.name}
        </span>
        {stars && (
          <span style={{
            fontSize: '10px',
            color: '#FFD700',
            textShadow: '0 0 4px rgba(255,215,0,0.8)',
          }}>
            {stars}
          </span>
        )}
      </div>

      {/* Middle: Art/Icon and Keywords */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
      }}>
        {/* Unit Icon based on type */}
        <div style={{
          fontSize: '24px',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }}>
          {isStructure ? '🏛️' : unit.type === 'spell' ? '✨' : '⚔️'}
        </div>

        {/* Keywords */}
        {unit.kw.length > 0 && (
          <div style={{
            display: 'flex',
            gap: '2px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {unit.kw.slice(0, 3).map((kw, i) => (
              <span 
                key={i} 
                title={kw}
                style={{
                  fontSize: '10px',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '1px 3px',
                  borderRadius: '3px',
                }}
              >
                {KW_ICONS[kw] || kw[0].toUpperCase()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom: Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
      }}>
        {/* Attack */}
        <span style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#FCA5A5',
          textShadow: '0 0 4px rgba(252, 165, 165, 0.6), 0 1px 2px rgba(0,0,0,0.8)',
        }}>
          {unit.atk}
        </span>

        {/* Element indicator */}
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: elemColor,
          boxShadow: `0 0 6px ${elemColor}`,
        }} />

        {/* Health */}
        <span style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#86EFAC',
          textShadow: '0 0 4px rgba(134, 239, 172, 0.6), 0 1px 2px rgba(0,0,0,0.8)',
        }}>
          {unit.hp}
        </span>
      </div>

      {/* Status Effects Overlay */}
      {statusEffects.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '2px',
          zIndex: 10,
        }}>
          <StatusEffects effects={statusEffects} size="sm" />
        </div>
      )}

      {/* Ready indicator */}
      {!isExhausted && unit.ready && (
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          right: '-2px',
          width: '8px',
          height: '8px',
          background: '#4ADE80',
          borderRadius: '50%',
          boxShadow: '0 0 6px #4ADE80',
        }} />
      )}
    </div>
  );
}
