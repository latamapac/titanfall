import type { Player } from '../../types/game';
import { ELEMENTS } from '../../data/constants';

interface PlayerBarProps {
  player: Player;
  playerIdx: number;
  isActive?: boolean;
  onActivateTitan?: () => void;
  phase?: number;
  deployLeft?: number;
}

export function PlayerBar({ player, playerIdx, isActive, onActivateTitan, phase, deployLeft }: PlayerBarProps) {
  const titan = player.titan;
  const maxHp = titan?.hp ?? 30;
  const hpPct = Math.max(0, Math.min(100, (player.hp / maxHp) * 100));
  const elemInfo = titan ? ELEMENTS[titan.elem as keyof typeof ELEMENTS] : null;
  
  // Titan ability activation checks
  const hasEnergy = player.energy >= (titan?.activeCost ?? 99);
  const isDeployPhase = phase === 2;
  const hasDeploys = (deployLeft ?? 0) > 0;
  const canActivate = isActive && onActivateTitan && isDeployPhase && hasDeploys && hasEnergy;
  
  // Determine why ability is disabled
  const getDisabledReason = () => {
    if (!isActive) return 'Not your turn';
    if (!isDeployPhase) return 'Deploy phase only';
    if (!hasDeploys) return 'No deploys left';
    if (!hasEnergy) return `Need ${(titan?.activeCost ?? 0) - player.energy} more energy`;
    return '';
  };

  return (
    <div className={`player-bar p${playerIdx + 1}`}>
      {/* Titan Portrait */}
      <div 
        className="titan-portrait" 
        style={{ 
          background: elemInfo?.color ?? '#444',
          boxShadow: isActive ? `0 0 15px ${elemInfo?.color || 'var(--gold)'}` : 'none',
        }}
      >
        {titan?.icon ?? '?'}
        {isActive && (
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '12px',
            height: '12px',
            background: '#4f4',
            borderRadius: '50%',
            border: '2px solid var(--bg)',
          }} />
        )}
      </div>
      
      {/* Player Info */}
      <div style={{ flex: 1 }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '1em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span>P{playerIdx + 1}</span>
          <span>{titan?.name ?? 'No Titan'}</span>
          {isActive && (
            <span style={{
              fontSize: '10px',
              background: 'var(--gold)',
              color: '#000',
              padding: '2px 6px',
              borderRadius: '4px',
            }}>
              YOUR TURN
            </span>
          )}
        </div>
        <div className="hp-bar-outer">
          <div className="hp-bar-inner" style={{ width: `${hpPct}%` }}>
            {player.hp}/{maxHp}
          </div>
        </div>
      </div>

      {/* Energy Display with Visual Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '80px',
      }}>
        <div className="energy-display" title="Available Energy">
          <span className="energy-icon">⚡</span>
          <span className="energy-current">{player.energy}</span>
          <span className="energy-separator">/</span>
          <span className="energy-max">10</span>
        </div>
        {/* Energy bar visual */}
        <div style={{
          width: '60px',
          height: '6px',
          background: '#222',
          borderRadius: '3px',
          marginTop: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${player.energy * 10}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #2980b9, #3498db)',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Deploy Counter */}
      <div className={`deploy-display ${(!isActive || !hasDeploys) ? 'deploy-empty' : ''}`}>
        {isActive && hasDeploys ? (
          <>
            <span style={{ fontSize: '14px' }}>🚀</span>
            <span>{deployLeft} deploys</span>
          </>
        ) : '\u00A0'}
      </div>

      {/* Titan Ability Button */}
      {titan && onActivateTitan && (
        <button
          className="titan-ability-btn"
          disabled={!canActivate}
          onClick={onActivateTitan}
          title={canActivate ? titan.activeText : getDisabledReason()}
          style={{
            position: 'relative',
            opacity: canActivate ? 1 : 0.5,
          }}
        >
          <div style={{ fontWeight: 'bold' }}>
            {titan.activeText.split('.')[0]}
          </div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            {titan.activeCost}E
          </div>
          {!canActivate && !isActive && (
            <div style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              fontSize: '10px',
            }}>⏳</div>
          )}
          {!canActivate && isActive && !isDeployPhase && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '14px',
            }}>🔒</div>
          )}
        </button>
      )}
    </div>
  );
}
