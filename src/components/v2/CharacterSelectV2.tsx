import { useState, useCallback, useMemo, memo } from 'react';
import { TITANS } from '../../data/titans';
import { ELEMENTS } from '../../data/constants';
import { MAPS } from '../../data/maps';
import { TitanArt, BackgroundArt } from './ArtAsset';

interface CharacterSelectV2Props {
  onStart: (p1TitanId: string, p2TitanId: string, mapIdx: number) => void;
  onBack: () => void;
}

// ============================================================================
// MEMOIZED SUB-COMPONENTS
// ============================================================================

const TitanDisplay = memo(function TitanDisplay({
  player,
  titanId,
  isSelecting,
  onClick,
}: {
  player: 'p1' | 'p2';
  titanId: string;
  isSelecting: boolean;
  onClick: () => void;
}) {
  const titanData = useMemo(() => TITANS.find(t => t.id === titanId)!, [titanId]);
  const element = ELEMENTS[titanData.elem as keyof typeof ELEMENTS];

  const containerStyle = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 20,
    opacity: isSelecting ? 1 : 0.6,
    transform: isSelecting ? 'scale(1)' : 'scale(0.95)',
    transition: 'all 0.3s',
  }), [isSelecting]);

  const playerColor = player === 'p1' ? 'var(--color-p1)' : 'var(--color-p2)';
  const playerShadow = player === 'p1' 
    ? '0 0 20px rgba(74,158,255,0.5)' 
    : '0 0 20px rgba(248,113,113,0.5)';

  return (
    <div style={containerStyle} onClick={onClick}>
      <div
        style={{
          fontSize: 14,
          color: playerColor,
          fontWeight: 'bold',
          letterSpacing: 3,
          textShadow: playerShadow,
        }}
      >
        PLAYER {player === 'p1' ? '1' : '2'}
      </div>
      
      <TitanArt titanId={titanId} size="xl" isActive={isSelecting} />
      
      <div
        style={{
          textAlign: 'center',
          background: 'rgba(0,0,0,0.6)',
          padding: '16px 32px',
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-header)',
            fontSize: 28,
            color: 'var(--color-gold)',
            marginBottom: 4,
          }}
        >
          {titanData.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: element?.color,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          {titanData.elem}
        </div>
      </div>
    </div>
  );
});

const MapSelector = memo(function MapSelector({
  mapIdx,
  onSelect,
}: {
  mapIdx: number;
  onSelect: (idx: number) => void;
}) {
  const map = MAPS[mapIdx];
  const mapIcons = useMemo(() => ['🌲', '⛰️', '🌊', '🏔️', '🐉'], []);

  return (
    <div
      style={{
        background: 'rgba(0,0,0,0.6)',
        padding: '20px',
        borderRadius: 12,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        width: 250,
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: '#888',
          textTransform: 'uppercase',
          letterSpacing: 2,
          marginBottom: 12,
        }}
      >
        Battlefield
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: 'var(--color-gold)',
          marginBottom: 4,
        }}
      >
        {map.name}
      </div>
      <div
        style={{
          fontSize: 12,
          color: '#888',
          marginBottom: 12,
        }}
      >
        {map.desc}
      </div>
      
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {MAPS.map((m, i) => (
          <button
            key={m.name}
            onClick={() => onSelect(i)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              border: mapIdx === i ? '2px solid var(--color-gold)' : '1px solid rgba(255,255,255,0.2)',
              background: mapIdx === i ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
              cursor: 'pointer',
              fontSize: 16,
            }}
            title={m.name}
          >
            {mapIcons[i]}
          </button>
        ))}
      </div>
    </div>
  );
});

const CharacterGridItem = memo(function CharacterGridItem({
  titan,
  isP1,
  isP2,
  onClick,
}: {
  titan: typeof TITANS[0];
  isP1: boolean;
  isP2: boolean;
  onClick: () => void;
}) {
  const isSelected = isP1 || isP2;

  const borderStyle = useMemo(() => {
    if (isP1) return '4px solid var(--color-p1)';
    if (isP2) return '4px solid var(--color-p2)';
    return '2px solid rgba(255,255,255,0.2)';
  }, [isP1, isP2]);

  const boxShadow = useMemo(() => {
    if (isP1) return '0 0 30px rgba(74,158,255,0.6)';
    if (isP2) return '0 0 30px rgba(248,113,113,0.6)';
    return 'none';
  }, [isP1, isP2]);

  return (
    <button
      onClick={onClick}
      style={{
        width: 100,
        height: 100,
        borderRadius: 12,
        border: borderStyle,
        background: 'rgba(0,0,0,0.5)',
        cursor: 'pointer',
        position: 'relative',
        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
        boxShadow,
        transition: 'all 0.2s',
        overflow: 'hidden',
        padding: 0,
      }}
    >
      <TitanArt titanId={titan.id} size="sm" isActive={isSelected} />
      
      {isP1 && <PlayerIndicator player={1} />}
      {isP2 && <PlayerIndicator player={2} />}
    </button>
  );
});

const PlayerIndicator = memo(function PlayerIndicator({ player }: { player: 1 | 2 }) {
  const bg = player === 1 ? 'var(--color-p1)' : 'var(--color-p2)';
  
  return (
    <div
      style={{
        position: 'absolute',
        top: -8,
        right: -8,
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        border: '2px solid #000',
      }}
    >
      {player}
    </div>
  );
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CharacterSelectV2({ onStart, onBack }: CharacterSelectV2Props) {
  const [p1Titan, setP1Titan] = useState<string>(TITANS[0].id);
  const [p2Titan, setP2Titan] = useState<string>(TITANS[1].id);
  const [mapIdx, setMapIdx] = useState(0);
  const [selecting, setSelecting] = useState<'p1' | 'p2'>('p1');

  // Memoized callbacks
  const handleStart = useCallback(() => {
    onStart(p1Titan, p2Titan, mapIdx);
  }, [onStart, p1Titan, p2Titan, mapIdx]);

  const handleSelectP1 = useCallback(() => setSelecting('p1'), []);
  const handleSelectP2 = useCallback(() => setSelecting('p2'), []);
  const handleMapSelect = useCallback((idx: number) => setMapIdx(idx), []);

  const handleTitanSelect = useCallback((titanId: string) => {
    if (selecting === 'p1') {
      setP1Titan(titanId);
    } else {
      setP2Titan(titanId);
    }
  }, [selecting]);

  // Memoized character grid
  const characterGrid = useMemo(() => {
    return TITANS.map((titan) => {
      const isP1 = p1Titan === titan.id;
      const isP2 = p2Titan === titan.id;
      
      return (
        <CharacterGridItem
          key={titan.id}
          titan={titan}
          isP1={isP1}
          isP2={isP2}
          onClick={() => handleTitanSelect(titan.id)}
        />
      );
    });
  }, [p1Titan, p2Titan, handleTitanSelect]);

  return (
    <BackgroundArt type="character-select">
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 40px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#fff',
              fontSize: 14,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
            }}
          >
            ← Back
          </button>
          
          <h1
            style={{
              fontFamily: 'var(--font-header)',
              fontSize: 48,
              color: 'var(--color-gold)',
              textShadow: '0 0 40px rgba(212,168,67,0.5)',
              margin: 0,
            }}
          >
            CHOOSE YOUR TITAN
          </h1>
          
          <button
            onClick={handleStart}
            style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, var(--color-gold), #e8c97a)',
              border: 'none',
              borderRadius: 8,
              color: '#000',
              fontWeight: 'bold',
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: '0 0 30px rgba(212,168,67,0.4)',
            }}
            className="btn-pulse"
          >
            ⚔️ FIGHT!
          </button>
        </div>

        {/* Main Character Display */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 60,
            padding: '40px 0',
          }}
        >
          <TitanDisplay
            player="p1"
            titanId={p1Titan}
            isSelecting={selecting === 'p1'}
            onClick={handleSelectP1}
          />

          {/* VS */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 30,
            }}
          >
            <div
              className="vs-pulse"
              style={{
                fontFamily: 'var(--font-header)',
                fontSize: 120,
                fontWeight: 'bold',
                color: 'var(--color-gold)',
                textShadow: '0 0 60px rgba(212,168,67,0.8)',
              }}
            >
              VS
            </div>
            
            <MapSelector mapIdx={mapIdx} onSelect={handleMapSelect} />
          </div>

          <TitanDisplay
            player="p2"
            titanId={p2Titan}
            isSelecting={selecting === 'p2'}
            onClick={handleSelectP2}
          />
        </div>

        {/* Character Grid */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            padding: '20px 0',
          }}
        >
          {characterGrid}
        </div>
      </div>
    </BackgroundArt>
  );
}
