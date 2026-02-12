import type { Player } from '../../types/game';
import { factions } from '../../styles/theme';

interface PlayerBarCinematicProps {
  player: Player;
  playerIdx: number;
  isActive?: boolean;
  onActivateTitan?: () => void;
  phase?: number;
  deployLeft?: number;
}

const elementToFaction: Record<string, string> = {
  fire: 'kargath',
  earth: 'thalor',
  wind: 'sylara',
  shadow: 'nyx',
  arcane: 'elandor',
};

export function PlayerBarCinematic({ 
  player, 
  playerIdx, 
  isActive, 
  onActivateTitan, 
  phase, 
  deployLeft 
}: PlayerBarCinematicProps) {
  const titan = player.titan;
  const maxHp = titan?.hp ?? 30;
  const hpPct = Math.max(0, Math.min(100, (player.hp / maxHp) * 100));
  const faction = titan ? elementToFaction[titan.elem] || 'kargath' : 'kargath';
  const theme = factions[faction as keyof typeof factions];
  
  const hasEnergy = player.energy >= (titan?.activeCost ?? 99);
  const isDeployPhase = phase === 2;
  const hasDeploys = (deployLeft ?? 0) > 0;
  const canActivate = isActive && onActivateTitan && isDeployPhase && hasDeploys && hasEnergy;
  
  return (
    <div
      className={`player-bar-cinematic ${isActive ? 'active' : ''}`}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '16px 24px',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: `2px solid ${isActive ? theme.colors.primary : 'rgba(255,255,255,0.1)'}`,
        boxShadow: isActive 
          ? `0 0 40px ${theme.colors.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`
          : 'inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Titan Portrait */}
      <div
        style={{
          position: 'relative',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.colors.dark}, ${theme.colors.primary})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '36px',
          boxShadow: isActive 
            ? `0 0 30px ${theme.colors.glow}, inset 0 0 20px rgba(0,0,0,0.5)`
            : 'inset 0 0 20px rgba(0,0,0,0.5)',
          border: `3px solid ${isActive ? theme.colors.light : 'rgba(255,255,255,0.2)'}`,
        }}
      >
        {titan?.icon ?? '?'}
        
        {/* Active Indicator */}
        {isActive && (
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              background: '#4ADE80',
              borderRadius: '50%',
              border: '3px solid #000',
              boxShadow: '0 0 10px #4ADE80',
              animation: 'pulse 2s infinite',
            }}
          />
        )}
      </div>
      
      {/* Player Info */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}>
          <span style={{
            background: theme.colors.primary,
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#000',
          }}>
            P{playerIdx + 1}
          </span>
          <span style={{
            fontFamily: '"Cinzel", serif',
            fontSize: '18px',
            fontWeight: 'bold',
            color: theme.colors.light,
            textShadow: `0 0 20px ${theme.colors.glow}`,
          }}>
            {titan?.name ?? 'No Titan'}
          </span>
          {isActive && (
            <span style={{
              fontSize: '10px',
              background: 'linear-gradient(90deg, #FFD700, #FFA500)',
              color: '#000',
              padding: '4px 12px',
              borderRadius: '20px',
              fontWeight: 'bold',
              animation: 'pulse 2s infinite',
            }}>
              YOUR TURN
            </span>
          )}
        </div>
        
        {/* Health Bar */}
        <div
          style={{
            position: 'relative',
            height: '28px',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '14px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Health Fill */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${hpPct}%`,
              background: `linear-gradient(90deg, 
                ${hpPct < 30 ? '#DC2626' : hpPct < 60 ? '#F59E0B' : '#22C55E'}, 
                ${hpPct < 30 ? '#EF4444' : hpPct < 60 ? '#FBBF24' : '#4ADE80'})`,
              borderRadius: '12px',
              transition: 'width 0.5s ease',
              boxShadow: hpPct < 30 ? '0 0 20px rgba(220, 38, 38, 0.5)' : 'none',
            }}
          />
          
          {/* Health Text */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {player.hp} / {maxHp} HP
          </div>
        </div>
      </div>
      
      {/* Energy Display */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <span style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#60A5FA',
            textShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
          }}>
            {player.energy}
          </span>
          <span style={{ fontSize: '14px', color: '#888' }}>/10</span>
        </div>
        
        {/* Energy Bar */}
        <div style={{
          width: '80px',
          height: '6px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '3px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${player.energy * 10}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #2563EB, #60A5FA)',
            boxShadow: player.energy >= 10 ? '0 0 10px #60A5FA' : 'none',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
      
      {/* Deploy Counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: isActive && hasDeploys ? 'rgba(74, 222, 128, 0.1)' : 'rgba(100,100,100,0.1)',
          borderRadius: '12px',
          border: isActive && hasDeploys ? '1px solid rgba(74, 222, 128, 0.5)' : '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <span style={{ fontSize: '24px' }}>🚀</span>
        <div>
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: isActive && hasDeploys ? '#4ADE80' : '#888',
          }}>
            {deployLeft ?? 0}
          </div>
          <div style={{ fontSize: '10px', color: '#888' }}>DEPLOYS</div>
        </div>
      </div>
      
      {/* Titan Ability Button */}
      {titan && onActivateTitan && (
        <button
          onClick={onActivateTitan}
          disabled={!canActivate}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '12px 20px',
            background: canActivate
              ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.dark})`
              : 'linear-gradient(135deg, #444, #222)',
            border: `2px solid ${canActivate ? theme.colors.light : '#666'}`,
            borderRadius: '12px',
            cursor: canActivate ? 'pointer' : 'not-allowed',
            opacity: canActivate ? 1 : 0.5,
            boxShadow: canActivate ? `0 0 20px ${theme.colors.glow}` : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#fff',
          }}>
            {titan.activeText.split('.')[0]}
          </span>
          <span style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.7)',
          }}>
            {titan.activeCost}⚡
          </span>
        </button>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
