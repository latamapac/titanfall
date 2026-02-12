import type { TerrainType, Unit, Highlight } from '../../types/game';
import { TerrainSVG } from '../../art/TerrainSVG';
import { UnitTokenEnhanced } from './UnitTokenEnhanced';

interface CellProps {
  r: number;
  c: number;
  terrain: TerrainType;
  height: number;
  unit: Unit | null;
  highlight: Highlight | null;
  selected: boolean;
  onClick: () => void;
}

export function CellEnhanced({ r, c, terrain, height, unit, highlight, selected, onClick }: CellProps) {
  const terrainClass = `t-${terrain}`;
  const heightClass = height > 0 ? `h-${Math.min(height, 3)}` : '';
  let hlClass = '';
  if (selected) hlClass = 'hl-selected';
  else if (highlight) hlClass = `hl-${highlight.type}`;

  const terrainSvg = TerrainSVG[terrain]?.();

  // Highlight colors
  const getHighlightStyle = () => {
    if (selected) {
      return {
        boxShadow: 'inset 0 0 0 3px #FFD700, 0 0 20px rgba(255,215,0,0.5)',
        transform: 'scale(1.02)',
        zIndex: 10,
      };
    }
    if (highlight?.type === 'move') {
      return {
        boxShadow: 'inset 0 0 0 2px #4ADE80, 0 0 10px rgba(74,222,128,0.4)',
      };
    }
    if (highlight?.type === 'attack') {
      return {
        boxShadow: 'inset 0 0 0 2px #EF4444, 0 0 10px rgba(239,68,68,0.4)',
      };
    }
    if (highlight?.type === 'deploy') {
      return {
        boxShadow: 'inset 0 0 0 2px #3B82F6, 0 0 10px rgba(59,130,246,0.4)',
      };
    }
    return {};
  };

  return (
    <div
      className={`cell ${terrainClass} ${heightClass} ${hlClass}`}
      data-r={r}
      data-c={c}
      onClick={onClick}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: highlight || unit ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        borderRadius: '6px',
        ...getHighlightStyle(),
      }}
    >
      {/* Terrain Background */}
      {terrainSvg && (
        <div
          className="terrain-icon"
          dangerouslySetInnerHTML={{ __html: terrainSvg }}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      )}

      {/* Height indicator */}
      {height > 0 && (
        <div style={{
          position: 'absolute',
          top: '2px',
          left: '2px',
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#FFD700',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        }}>
          {'▲'.repeat(height)}
        </div>
      )}

      {/* Unit with enhanced token */}
      {unit && (
        <div style={{
          width: '90%',
          height: '90%',
          zIndex: 2,
        }}>
          <UnitTokenEnhanced unit={unit} />
        </div>
      )}

      {/* Highlight overlay for empty cells */}
      {highlight && !unit && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: '40%',
            height: '40%',
            borderRadius: '50%',
            background: highlight.type === 'move' ? 'rgba(74,222,128,0.3)' : 
                       highlight.type === 'attack' ? 'rgba(239,68,68,0.3)' :
                       highlight.type === 'deploy' ? 'rgba(59,130,246,0.3)' : 'transparent',
            boxShadow: highlight.type === 'move' ? '0 0 10px #4ADE80' :
                      highlight.type === 'attack' ? '0 0 10px #EF4444' :
                      highlight.type === 'deploy' ? '0 0 10px #3B82F6' : 'none',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        </div>
      )}

      {/* Selection ring animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
