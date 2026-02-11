import { useState, useCallback, memo, useMemo } from 'react';

// ============================================================================
// ART ASSET - Base image component with loading states
// ============================================================================

interface ArtAssetProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}

export const ArtAsset = memo(function ArtAsset({ src, alt, className, style, fallback }: ArtAssetProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  if (error && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div style={{ position: 'relative', ...style }} className={className}>
      {!loaded && !error && (
        <div
          className="art-shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: style?.borderRadius,
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          display: error ? 'none' : 'block',
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
});

// ============================================================================
// TITAN ART - Character portrait with element theming
// ============================================================================

interface TitanArtProps {
  titanId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
}

const sizeMap = {
  sm: { width: 80, height: 80 },
  md: { width: 120, height: 120 },
  lg: { width: 200, height: 200 },
  xl: { width: 300, height: 400 },
} as const;

export const TitanArt = memo(function TitanArt({ titanId, size = 'md', isActive }: TitanArtProps) {
  const dims = sizeMap[size];
  const artPath = useMemo(() => `/art/titans/${titanId.toLowerCase()}.png`, [titanId]);
  const borderRadius = size === 'xl' ? 16 : '50%';

  const containerStyle = useMemo(() => ({
    width: dims.width,
    height: dims.height,
    borderRadius,
    overflow: 'hidden' as const,
    position: 'relative' as const,
    border: isActive ? '4px solid var(--color-gold)' : '2px solid var(--color-border)',
    boxShadow: isActive
      ? '0 0 30px rgba(212, 168, 67, 0.6)'
      : '0 4px 20px rgba(0, 0, 0, 0.5)',
  }), [dims.width, dims.height, borderRadius, isActive]);

  const fallback = useMemo(() => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: dims.width * 0.4,
        background: 'var(--color-surface)',
      }}
    >
      🛡️
    </div>
  ), [dims.width]);

  return (
    <div style={containerStyle}>
      <ArtAsset
        src={artPath}
        alt={`Titan ${titanId}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        fallback={fallback}
      />
      {isActive && (
        <div
          className="pulse-glow"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius,
            boxShadow: 'inset 0 0 40px rgba(212, 168, 67, 0.3)',
          }}
        />
      )}
    </div>
  );
});

// ============================================================================
// TERRAIN ART - Grid cell background
// ============================================================================

interface TerrainArtProps {
  terrain: string;
  highlight?: 'deploy' | 'move' | 'attack' | 'selected' | null;
  onClick?: () => void;
}

const highlightStyles = {
  deploy: { boxShadow: 'inset 0 0 0 3px #4ade80, 0 0 20px rgba(74, 222, 128, 0.4)' },
  move: { boxShadow: 'inset 0 0 0 3px #4a9eff, 0 0 20px rgba(74, 158, 255, 0.4)' },
  attack: { boxShadow: 'inset 0 0 0 3px #f87171, 0 0 20px rgba(248, 113, 113, 0.4)' },
  selected: { boxShadow: 'inset 0 0 0 3px #d4a843, 0 0 20px rgba(212, 168, 67, 0.4)' },
} as const;

export const TerrainArt = memo(function TerrainArt({ terrain, highlight, onClick }: TerrainArtProps) {
  const artPath = useMemo(() => `/art/terrain/${terrain.toLowerCase()}.jpg`, [terrain]);

  const containerStyle = useMemo(() => ({
    aspectRatio: '1' as const,
    borderRadius: 8,
    overflow: 'hidden' as const,
    position: 'relative' as const,
    cursor: onClick ? 'pointer' as const : 'default' as const,
    transition: 'transform 0.2s, box-shadow 0.2s',
    ...(highlight ? highlightStyles[highlight] : {}),
  }), [highlight, onClick]);

  const fallbackColor = useMemo(() => {
    const t = terrain.toLowerCase();
    if (t === 'forest') return 'var(--color-success)';
    if (t === 'volcano') return 'var(--color-danger)';
    return 'var(--color-surface)';
  }, [terrain]);

  return (
    <div onClick={onClick} style={containerStyle}>
      <ArtAsset
        src={artPath}
        alt={`${terrain} terrain`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        fallback={
          <div
            style={{
              width: '100%',
              height: '100%',
              background: fallbackColor,
              opacity: 0.5,
            }}
          />
        }
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
});

// ============================================================================
// CARD ART - Unit card illustration
// ============================================================================

interface CardArtProps {
  cardId: string;
  element: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  isPlayable?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const rarityBorders = {
  common: '#6b7280',
  rare: '#4a9eff',
  epic: '#a855f7',
  legendary: '#d4a843',
} as const;

export const CardArt = memo(function CardArt({
  cardId,
  element: _element,
  rarity = 'common',
  isPlayable,
  isSelected,
  onClick,
}: CardArtProps) {
  const artPath = useMemo(() => `/art/cards/${cardId}.jpg`, [cardId]);

  const containerStyle = useMemo(() => ({
    width: 140,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden' as const,
    position: 'relative' as const,
    cursor: onClick ? 'pointer' as const : 'default' as const,
    border: `3px solid ${isSelected ? '#d4a843' : rarityBorders[rarity]}`,
    boxShadow: isSelected
      ? '0 0 30px rgba(212, 168, 67, 0.6)'
      : isPlayable
      ? `0 0 20px ${rarityBorders[rarity]}40`
      : '0 4px 15px rgba(0, 0, 0, 0.3)',
    opacity: isPlayable || !onClick ? 1 : 0.6,
    transform: isSelected ? 'translateY(-10px) scale(1.05)' : 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  }), [isSelected, isPlayable, onClick, rarity]);

  const cardName = useMemo(() => 
    cardId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    [cardId]
  );

  return (
    <div onClick={onClick} style={containerStyle}>
      <ArtAsset
        src={artPath}
        alt={`Card ${cardId}`}
        style={{
          width: '100%',
          height: '70%',
          objectFit: 'cover',
        }}
        fallback={
          <div
            style={{
              width: '100%',
              height: '70%',
              background: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 48,
            }}
          >
            ⚔️
          </div>
        }
      />
      <div
        style={{
          height: '30%',
          background: 'var(--color-surface)',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 'bold', color: 'var(--color-gold)' }}>
          {cardName}
        </div>
        <div
          style={{
            fontSize: 10,
            color: rarityBorders[rarity],
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {rarity}
        </div>
      </div>
    </div>
  );
});

// ============================================================================
// BACKGROUND ART - Full-screen background with fallback
// ============================================================================

interface BackgroundArtProps {
  type: 'menu' | 'character-select' | 'battle' | 'victory';
  children: React.ReactNode;
}

export const BackgroundArt = memo(function BackgroundArt({ type, children }: BackgroundArtProps) {
  const artPath = useMemo(() => `/art/bg/${type}.jpg`, [type]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      <ArtAsset
        src={artPath}
        alt={`${type} background`}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        fallback={
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, #1a1b2e 0%, #0a0b14 100%)',
            }}
          />
        }
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(2px)',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
});
