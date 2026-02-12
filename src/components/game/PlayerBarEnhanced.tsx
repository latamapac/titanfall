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

// Map element to faction for HUD selection
const elementToFaction: Record<string, string> = {
  fire: 'kargath',
  earth: 'thalor',
  wind: 'sylara',
  shadow: 'nyx',
  arcane: 'elandor',
};

export function PlayerBarEnhanced({ player, playerIdx, isActive, onActivateTitan, phase, deployLeft }: PlayerBarProps) {
  const titan = player.titan;
  const maxHp = titan?.hp ?? 30;
  const hpPct = Math.max(0, Math.min(100, (player.hp / maxHp) * 100));
  const elemInfo = titan ? ELEMENTS[titan.elem as keyof typeof ELEMENTS] : null;
  
  // Determine faction from titan element
  const faction = titan ? elementToFaction[titan.elem] || 'kargath' : 'kargath';
  
  // HUD image path
  const healthbarPath = `/assets/ui/hud_healthbar_${faction}.png`;
  
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
    <div className={`player-bar-enhanced p${playerIdx + 1} ${isActive ? 'active' : ''}`}>
      {/* Background HUD Frame */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, ${elemInfo?.color}20, transparent 30%, transparent 70%, ${elemInfo?.color}20)`,
          borderRadius: '12px',
          border: `2px solid ${elemInfo?.color || '#444'}${isActive ? 'FF' : '40'}`,
          boxShadow: isActive ? `0 0 20px ${elemInfo?.color || 'var(--gold)'}40` : 'none',
        }}
      />
      
      {/* Titan Portrait with faction styling */}
      <div 
        className="titan-portrait-enhanced"
        style={{ 
          background: `linear-gradient(135deg, ${elemInfo?.color || '#444'}, ${elemInfo?.color ? adjustBrightness(elemInfo.color, -30) : '#222'})`,
          boxShadow: isActive ? `0 0 20px ${elemInfo?.color || 'var(--gold)'}60, inset 0 0 20px rgba(0,0,0,0.3)` : 'inset 0 0 10px rgba(0,0,0,0.5)',
          border: `3px solid ${elemInfo?.color || '#666'}`,
        }}
      >
        <span style={{ fontSize: '28px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
          {titan?.icon ?? '?'}
        </span>
        {isActive && (
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '14px',
            height: '14px',
            background: '#4ADE80',
            borderRadius: '50%',
            border: '3px solid var(--bg)',
            boxShadow: '0 0 10px #4ADE80',
          }} />
        )}
      </div>
      
      {/* Player Info */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        gap: '8px',
        zIndex: 1,
      }}>
        {/* Name Row */}
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '1.1em',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ 
            background: elemInfo?.color || '#444',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.8em',
          }}>
            P{playerIdx + 1}
          </span>
          <span style={{ 
            color: elemInfo?.color || '#fff',
            textShadow: `0 0 10px ${elemInfo?.color || '#fff'}40`,
          }}>
            {titan?.name ?? 'No Titan'}
          </span>
          {isActive && (
            <span style={{
              fontSize: '10px',
              background: 'linear-gradient(90deg, var(--gold), #E8C97A)',
              color: '#000',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
              animation: 'pulse 2s infinite',
            }}>
              YOUR TURN
            </span>
          )}
        </div>

        {/* Health Bar with Image Frame */}
        <div
          style={{
            position: 'relative',
            width: '240px',
            height: '32px',
          }}
        >
          {/* Health bar background image */}
          <img
            src={healthbarPath}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'fill',
            }}
          />
          
          {/* HP fill overlay */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              left: '15%',
              right: '15%',
              height: '60%',
              background: `linear-gradient(90deg, 
                ${hpPct < 30 ? '#DC2626' : hpPct < 60 ? '#F59E0B' : '#22C55E'} 0%, 
                ${hpPct < 30 ? '#EF4444' : hpPct < 60 ? '#FBBF24' : '#4ADE80'} 100%)`,
              width: `${hpPct * 0.7}%`,
              transition: 'width 0.3s ease',
              borderRadius: '2px',
              boxShadow: hpPct < 30 ? '0 0 10px #DC2626' : 'none',
            }}
          />
          
          {/* HP Text */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {player.hp} / {maxHp} HP
          </div>
        </div>
      </div>

      {/* Energy Display with Visual Bar */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '100px',
        zIndex: 1,
      }}>
        {/* Energy Icon and Value */}
        <div 
          className="energy-display-enhanced"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0,0,0,0.4)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <img 
            src={`/assets/ui/icon_${faction === 'kargath' ? 'attack' : 'deck'}_${faction}.png`}
            alt=""
            style={{ width: '20px', height: '20px', objectFit: 'contain' }}
          />
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#60A5FA' }}>
            {player.energy}
          </span>
          <span style={{ fontSize: '12px', color: '#888' }}>/10</span>
        </div>
        
        {/* Energy bar */}
        <div style={{
          width: '80px',
          height: '8px',
          background: '#1a1a2e',
          borderRadius: '4px',
          marginTop: '6px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            width: `${player.energy * 10}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #2563EB, #60A5FA, #93C5FD)',
            boxShadow: player.energy >= 10 ? '0 0 10px #60A5FA' : 'none',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Deploy Counter with Icon */}
      <div 
        className={`deploy-display-enhanced ${(!isActive || !hasDeploys) ? 'deploy-empty' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isActive && hasDeploys ? 'rgba(74, 222, 128, 0.2)' : 'rgba(100,100,100,0.2)',
          padding: '8px 16px',
          borderRadius: '8px',
          border: isActive && hasDeploys ? '1px solid #4ADE80' : '1px solid rgba(255,255,255,0.1)',
          zIndex: 1,
        }}
      >
        <img 
          src="/assets/ui/icon_deploy_kargath.png" 
          alt=""
          style={{ 
            width: '32px', 
            height: '32px', 
            objectFit: 'contain',
            opacity: isActive && hasDeploys ? 1 : 0.5,
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: isActive && hasDeploys ? '#4ADE80' : '#888' }}>
            {deployLeft ?? 0}
          </div>
          <div style={{ fontSize: '9px', color: '#888', textTransform: 'uppercase' }}>Deploys</div>
        </div>
      </div>

      {/* Titan Ability Button */}
      {titan && onActivateTitan && (
        <button
          className="titan-ability-btn-enhanced"
          disabled={!canActivate}
          onClick={onActivateTitan}
          title={canActivate ? titan.activeText : getDisabledReason()}
          style={{
            position: 'relative',
            opacity: canActivate ? 1 : 0.5,
            background: canActivate 
              ? `linear-gradient(135deg, ${elemInfo?.color || '#444'}, ${elemInfo?.color ? adjustBrightness(elemInfo.color, -20) : '#222'})`
              : 'linear-gradient(135deg, #444, #222)',
            border: `2px solid ${canActivate ? elemInfo?.color || '#4ADE80' : '#666'}`,
            boxShadow: canActivate ? `0 0 20px ${elemInfo?.color || '#4ADE80'}60` : 'none',
            zIndex: 1,
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
            {titan.activeText.split('.')[0]}
          </div>
          <div style={{ fontSize: '10px', opacity: 0.8 }}>
            {titan.activeCost}E
          </div>
          {!canActivate && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '18px',
              opacity: 0.5,
            }}>
              🔒
            </div>
          )}
        </button>
      )}
    </div>
  );
}

// Helper function to adjust color brightness
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}
