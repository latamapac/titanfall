import { useState } from 'react';
import { TITANS } from '../../data/titans';
import { ELEMENTS } from '../../data/constants';
import { MAPS } from '../../data/maps';
import { TitanArt } from './ArtAsset';
import { BackgroundArt } from './ArtAsset';

interface CharacterSelectV2Props {
  onStart: (p1TitanId: string, p2TitanId: string, mapIdx: number) => void;
  onBack: () => void;
}

export function CharacterSelectV2({ onStart, onBack }: CharacterSelectV2Props) {
  const [p1Titan, setP1Titan] = useState<string>(TITANS[0].id);
  const [p2Titan, setP2Titan] = useState<string>(TITANS[1].id);
  const [mapIdx, setMapIdx] = useState(0);
  const [selecting, setSelecting] = useState<'p1' | 'p2'>('p1');

  const p1Data = TITANS.find(t => t.id === p1Titan)!;
  const p2Data = TITANS.find(t => t.id === p2Titan)!;
  const map = MAPS[mapIdx];

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
            onClick={() => onStart(p1Titan, p2Titan, mapIdx)}
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
              animation: 'pulse 2s infinite',
            }}
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
          {/* Player 1 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              opacity: selecting === 'p1' ? 1 : 0.6,
              transform: selecting === 'p1' ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 0.3s',
            }}
            onClick={() => setSelecting('p1')}
          >
            <div
              style={{
                fontSize: 14,
                color: 'var(--color-p1)',
                fontWeight: 'bold',
                letterSpacing: 3,
                textShadow: '0 0 20px rgba(74,158,255,0.5)',
              }}
            >
              PLAYER 1
            </div>
            
            <TitanArt titanId={p1Titan} size="xl" isActive={selecting === 'p1'} />
            
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
                {p1Data.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: ELEMENTS[p1Data.elem as keyof typeof ELEMENTS]?.color,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                {p1Data.elem}
              </div>
            </div>
          </div>

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
              style={{
                fontFamily: 'var(--font-header)',
                fontSize: 120,
                fontWeight: 'bold',
                color: 'var(--color-gold)',
                textShadow: '0 0 60px rgba(212,168,67,0.8)',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            >
              VS
            </div>
            
            {/* Map Selector */}
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
              
              {/* Map thumbnails */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {MAPS.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setMapIdx(i)}
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
                    {['🌲', '⛰️', '🌊', '🏔️', '🐉'][i] || '🏞️'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Player 2 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
              opacity: selecting === 'p2' ? 1 : 0.6,
              transform: selecting === 'p2' ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 0.3s',
            }}
            onClick={() => setSelecting('p2')}
          >
            <div
              style={{
                fontSize: 14,
                color: 'var(--color-p2)',
                fontWeight: 'bold',
                letterSpacing: 3,
                textShadow: '0 0 20px rgba(248,113,113,0.5)',
              }}
            >
              PLAYER 2
            </div>
            
            <TitanArt titanId={p2Titan} size="xl" isActive={selecting === 'p2'} />
            
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
                {p2Data.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: ELEMENTS[p2Data.elem as keyof typeof ELEMENTS]?.color,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                {p2Data.elem}
              </div>
            </div>
          </div>
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
          {TITANS.map((titan) => {
            const isP1 = p1Titan === titan.id;
            const isP2 = p2Titan === titan.id;
            const isSelected = isP1 || isP2;
            
            return (
              <button
                key={titan.id}
                onClick={() => {
                  if (selecting === 'p1') setP1Titan(titan.id);
                  else setP2Titan(titan.id);
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  border: isP1
                    ? '4px solid var(--color-p1)'
                    : isP2
                    ? '4px solid var(--color-p2)'
                    : '2px solid rgba(255,255,255,0.2)',
                  background: 'rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  position: 'relative',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isP1
                    ? '0 0 30px rgba(74,158,255,0.6)'
                    : isP2
                    ? '0 0 30px rgba(248,113,113,0.6)'
                    : 'none',
                  transition: 'all 0.2s',
                  overflow: 'hidden',
                  padding: 0,
                }}
              >
                <TitanArt titanId={titan.id} size="sm" isActive={isSelected} />
                
                {/* Player indicator */}
                {isP1 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--color-p1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#fff',
                      border: '2px solid #000',
                    }}
                  >
                    1
                  </div>
                )}
                {isP2 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--color-p2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 'bold',
                      color: '#fff',
                      border: '2px solid #000',
                    }}
                  >
                    2
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </BackgroundArt>
  );
}
