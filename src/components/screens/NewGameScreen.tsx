import { useState } from 'react';
import { TITANS } from '../../data/titans';
import { MAPS } from '../../data/maps';

type GameMode = 'local' | 'ai';
type AIDifficulty = 'easy' | 'medium' | 'hard';

interface NewGameScreenProps {
  onStart: (p1TitanId: string, p2TitanId: string, mapIdx: number) => void;
  onBack: () => void;
  mode: GameMode;
  aiDifficulty?: AIDifficulty;
}

export function NewGameScreen({ onStart, onBack, mode, aiDifficulty }: NewGameScreenProps) {
  const [p1Titan, setP1Titan] = useState<string>(TITANS[0].id);
  const [p2Titan, setP2Titan] = useState<string>(TITANS[1].id);
  const [mapIdx, setMapIdx] = useState<number>(0);

  const handleStart = () => {
    onStart(p1Titan, p2Titan, mapIdx);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f1f 100%)',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px',
      overflow: 'auto',
    }}>
      <h2 style={{
        fontFamily: '"Cinzel", serif',
        fontSize: '48px',
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        Choose Your Titan
      </h2>

      {/* Player 1 Selection */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>Player 1 (You)</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {TITANS.map(titan => (
            <button
              key={titan.id}
              onClick={() => setP1Titan(titan.id)}
              style={{
                padding: '24px',
                background: p1Titan === titan.id 
                  ? `linear-gradient(135deg, ${titan.color}, ${titan.color}88)`
                  : 'rgba(0,0,0,0.5)',
                border: `3px solid ${p1Titan === titan.id ? titan.color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '16px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                {titan.icon}
              </div>
              <div style={{
                fontFamily: '"Cinzel", serif',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '4px',
              }}>
                {titan.name}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {titan.elem}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Player 2 / AI Selection */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>
          {mode === 'ai' ? `AI Opponent (${aiDifficulty})` : 'Player 2'}
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {TITANS.map(titan => (
            <button
              key={titan.id}
              onClick={() => setP2Titan(titan.id)}
              style={{
                padding: '24px',
                background: p2Titan === titan.id 
                  ? `linear-gradient(135deg, ${titan.color}, ${titan.color}88)`
                  : 'rgba(0,0,0,0.5)',
                border: `3px solid ${p2Titan === titan.id ? titan.color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '16px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                {titan.icon}
              </div>
              <div style={{
                fontFamily: '"Cinzel", serif',
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '4px',
              }}>
                {titan.name}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {titan.elem}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map Selection */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>Battlefield</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}>
          {MAPS.map((map, idx) => (
            <button
              key={idx}
              onClick={() => setMapIdx(idx)}
              style={{
                padding: '20px',
                background: mapIdx === idx
                  ? 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,215,0,0.1))'
                  : 'rgba(0,0,0,0.5)',
                border: `2px solid ${mapIdx === idx ? '#FFD700' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                color: '#fff',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                {map.name}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {map.desc}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '16px 32px',
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <button
          onClick={handleStart}
          style={{
            padding: '20px 48px',
            fontSize: '20px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #E84430, #8B2E1C)',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 10px 40px rgba(232, 68, 48, 0.4)',
          }}
        >
          ⚔️ Start Battle!
        </button>
      </div>
    </div>
  );
}
