import { TITANS } from '../../data/titans';
import { ELEMENTS } from '../../data/constants';

interface TitanPortraitProps {
  titanId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
  showInfo?: boolean;
  onClick?: () => void;
}

const sizes = {
  sm: { container: 60, font: 24 },
  md: { container: 80, font: 32 },
  lg: { container: 120, font: 48 },
  xl: { container: 160, font: 64 },
};

export function TitanPortrait({ 
  titanId, 
  size = 'md', 
  isActive = false,
  showInfo = false,
  onClick 
}: TitanPortraitProps) {
  const titan = TITANS.find(t => t.id === titanId);
  const elem = titan ? ELEMENTS[titan.elem as keyof typeof ELEMENTS] : null;
  const dim = sizes[size];

  if (!titan) return null;

  // Check if we have generated art for this titan
  const artPath = `/art/titans/${titanId}.png`;
  const hasArt = false; // Will be true when we generate art

  return (
    <div 
      className="titan-portrait-v2"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {/* Portrait Circle */}
      <div
        style={{
          width: dim.container,
          height: dim.container,
          borderRadius: '50%',
          border: isActive 
            ? `4px solid var(--color-gold)` 
            : `3px solid ${elem?.color || '#888'}`,
          boxShadow: isActive 
            ? '0 0 30px rgba(212, 168, 67, 0.6), inset 0 0 20px rgba(0,0,0,0.5)'
            : `0 0 15px ${elem?.color}40, inset 0 0 20px rgba(0,0,0,0.5)`,
          background: hasArt 
            ? `url(${artPath}) center/cover`
            : `linear-gradient(135deg, ${elem?.color}40, ${elem?.color}20)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: dim.font,
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fallback to emoji if no art */}
        {!hasArt && titan.icon}
        
        {/* Active glow effect */}
        {isActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              boxShadow: 'inset 0 0 30px rgba(212, 168, 67, 0.3)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          />
        )}
        
        {/* Health indicator ring */}
        <svg
          style={{
            position: 'absolute',
            inset: -4,
            width: dim.container + 8,
            height: dim.container + 8,
            transform: 'rotate(-90deg)',
          }}
        >
          <circle
            cx={(dim.container + 8) / 2}
            cy={(dim.container + 8) / 2}
            r={dim.container / 2}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div
          style={{
            textAlign: 'center',
            background: 'rgba(0,0,0,0.6)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            minWidth: '120px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-header)',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'var(--color-gold)',
            }}
          >
            {titan.name}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: elem?.color || '#888',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {titan.elem}
          </div>
        </div>
      )}
    </div>
  );
}
