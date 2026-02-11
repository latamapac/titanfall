import { useState } from 'react';
import { TITANS } from '../../data/titans';
import { ELEMENTS } from '../../data/constants';
import { MAPS } from '../../data/maps';

interface CharacterSelectProps {
  onStart: (p1TitanId: string, p2TitanId: string, mapIdx: number) => void;
  onBack: () => void;
}

export function CharacterSelect({ onStart, onBack }: CharacterSelectProps) {
  const [p1Titan, setP1Titan] = useState<string>(TITANS[0].id);
  const [p2Titan, setP2Titan] = useState<string>(TITANS[1].id);
  const [mapIdx, setMapIdx] = useState(0);
  const [selecting, setSelecting] = useState<'p1' | 'p2' | 'map'>('p1');

  const p1Data = TITANS.find(t => t.id === p1Titan)!;
  const p2Data = TITANS.find(t => t.id === p2Titan)!;
  const map = MAPS[mapIdx];

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: '10px 24px',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            color: '#888',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <h1
          style={{
            fontFamily: 'var(--font-header)',
            fontSize: '32px',
            color: 'var(--color-gold)',
          }}
        >
          CHOOSE YOUR TITAN
        </h1>
        <button
          onClick={() => onStart(p1Titan, p2Titan, mapIdx)}
          style={{
            padding: '12px 32px',
            background: 'var(--color-gold)',
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          FIGHT! ⚔️
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          padding: '20px',
          gap: '20px',
        }}
      >
        {/* Player 1 Side */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '16px',
            background: selecting === 'p1' 
              ? 'linear-gradient(180deg, rgba(74,158,255,0.2), transparent)'
              : 'transparent',
            border: selecting === 'p1' 
              ? '2px solid var(--color-p1)' 
              : '1px solid var(--color-border)',
            transition: 'all 0.3s',
          }}
          onClick={() => setSelecting('p1')}
        >
          <div
            style={{
              fontSize: '14px',
              color: 'var(--color-p1)',
              fontWeight: 'bold',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            PLAYER 1
          </div>
          
          {/* Big Character Image */}
          <div
            style={{
              width: '300px',
              height: '400px',
              borderRadius: '16px',
              background: `linear-gradient(180deg, ${ELEMENTS[p1Data.elem as keyof typeof ELEMENTS]?.color}40, transparent)`,
              border: `3px solid ${ELEMENTS[p1Data.elem as keyof typeof ELEMENTS]?.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {p1Data.icon}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: '24px',
                  color: 'var(--color-gold)',
                }}
              >
                {p1Data.name}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                {p1Data.passiveText}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '20px',
              padding: '16px 24px',
              background: 'var(--color-surface)',
              borderRadius: '12px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: 'var(--color-danger)' }}>❤️ {p1Data.hp}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Health</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: 'var(--color-mana)' }}>⚡ 10</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Energy</div>
            </div>
          </div>
        </div>

        {/* VS + Map Selection */}
        <div
          style={{
            width: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-header)',
              fontSize: '64px',
              color: 'var(--color-gold)',
              textShadow: '0 0 30px rgba(212,168,67,0.5)',
            }}
          >
            VS
          </div>

          {/* Map Selection */}
          <div
            style={{
              width: '100%',
              padding: '16px',
              background: selecting === 'map' 
                ? 'var(--color-surface-light)'
                : 'var(--color-surface)',
              borderRadius: '12px',
              border: selecting === 'map' 
                ? '2px solid var(--color-gold)'
                : '1px solid var(--color-border)',
              cursor: 'pointer',
            }}
            onClick={() => setSelecting('map')}
          >
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>
              BATTLEFIELD
            </div>
            <div style={{ fontWeight: 'bold', color: 'var(--color-gold)' }}>
              {map.name}
            </div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
              {map.desc}
            </div>
          </div>

          {/* Map Selector (when selected) */}
          {selecting === 'map' && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {MAPS.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setMapIdx(i)}
                  style={{
                    padding: '8px 12px',
                    background: mapIdx === i ? 'var(--color-gold)' : 'var(--color-surface)',
                    border: 'none',
                    borderRadius: '6px',
                    color: mapIdx === i ? '#000' : '#fff',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Player 2 Side */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '16px',
            background: selecting === 'p2' 
              ? 'linear-gradient(180deg, rgba(248,113,113,0.2), transparent)'
              : 'transparent',
            border: selecting === 'p2' 
              ? '2px solid var(--color-p2)' 
              : '1px solid var(--color-border)',
            transition: 'all 0.3s',
          }}
          onClick={() => setSelecting('p2')}
        >
          <div
            style={{
              fontSize: '14px',
              color: 'var(--color-p2)',
              fontWeight: 'bold',
              letterSpacing: '2px',
              marginBottom: '10px',
            }}
          >
            PLAYER 2
          </div>
          
          {/* Big Character Image */}
          <div
            style={{
              width: '300px',
              height: '400px',
              borderRadius: '16px',
              background: `linear-gradient(180deg, ${ELEMENTS[p2Data.elem as keyof typeof ELEMENTS]?.color}40, transparent)`,
              border: `3px solid ${ELEMENTS[p2Data.elem as keyof typeof ELEMENTS]?.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {p2Data.icon}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: '24px',
                  color: 'var(--color-gold)',
                }}
              >
                {p2Data.name}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                {p2Data.passiveText}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '20px',
              padding: '16px 24px',
              background: 'var(--color-surface)',
              borderRadius: '12px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: 'var(--color-danger)' }}>❤️ {p2Data.hp}</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Health</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', color: 'var(--color-mana)' }}>⚡ 10</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Energy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Grid - Bottom */}
      <div
        style={{
          padding: '20px 40px',
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {TITANS.map((titan) => {
            const isP1 = p1Titan === titan.id;
            const isP2 = p2Titan === titan.id;
            const elem = ELEMENTS[titan.elem as keyof typeof ELEMENTS];
            
            return (
              <button
                key={titan.id}
                onClick={() => {
                  if (selecting === 'p1') setP1Titan(titan.id);
                  else if (selecting === 'p2') setP2Titan(titan.id);
                }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  border: isP1 
                    ? '3px solid var(--color-p1)'
                    : isP2
                    ? '3px solid var(--color-p2)'
                    : '2px solid var(--color-border)',
                  background: elem?.color || '#444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  cursor: 'pointer',
                  position: 'relative',
                  transform: isP1 || isP2 ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isP1 
                    ? '0 0 20px var(--color-p1)'
                    : isP2
                    ? '0 0 20px var(--color-p2)'
                    : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {titan.icon}
                
                {/* Player indicator */}
                {(isP1 || isP2) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isP1 ? 'var(--color-p1)' : 'var(--color-p2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#fff',
                    }}
                  >
                    {isP1 ? '1' : '2'}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        
        <div
          style={{
            textAlign: 'center',
            marginTop: '12px',
            fontSize: '12px',
            color: '#888',
          }}
        >
          Click a character to assign to {selecting === 'p1' ? 'Player 1' : selecting === 'p2' ? 'Player 2' : 'change map'}
        </div>
      </div>
    </div>
  );
}
