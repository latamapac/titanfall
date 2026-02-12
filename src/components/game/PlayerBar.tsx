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
  const canActivate = isActive && onActivateTitan && phase === 2 && (deployLeft ?? 0) > 0 && player.energy >= (titan?.activeCost ?? 99);

  return (
    <div className={`player-bar p${playerIdx + 1}`}>
      <div className="titan-portrait" style={{ background: elemInfo?.color ?? '#444' }}>
        {titan?.icon ?? '?'}
      </div>
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '1em' }}>
          P{playerIdx + 1} {titan?.name ?? 'No Titan'}
        </div>
        <div className="hp-bar-outer">
          <div className="hp-bar-inner" style={{ width: `${hpPct}%` }}>
            {player.hp}/{maxHp}
          </div>
        </div>
      </div>
      <div className="energy-display" title="Available Energy">
        <span className="energy-icon">⚡</span>
        <span className="energy-current">{player.energy}</span>
        <span className="energy-separator">/</span>
        <span className="energy-max">10</span>
      </div>
      <div className={`deploy-display ${(!isActive || (deployLeft ?? 0) <= 0) ? 'deploy-empty' : ''}`}>
        {isActive && (deployLeft ?? 0) > 0 ? `${deployLeft} deploys left` : '\u00A0'}
      </div>
      {titan && onActivateTitan && (
        <button
          className="titan-ability-btn"
          disabled={!canActivate}
          onClick={onActivateTitan}
          title={titan.activeText}
        >
          {titan.activeText.split('.')[0]} ({titan.activeCost}E)
        </button>
      )}
    </div>
  );
}
