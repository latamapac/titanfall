import { useState } from 'react';
import { TITANS } from '../../data/titans';
import { MAPS } from '../../data/maps';
import { ELEMENTS } from '../../data/constants';

import type { AIDifficulty } from '../../ai/GameAI';

interface NewGameScreenProps {
  onStart: (p1TitanId: string, p2TitanId: string, mapIdx: number) => void;
  onBack: () => void;
  mode: 'local' | 'ai';
  aiDifficulty?: AIDifficulty;
}

export function NewGameScreen({ onStart, onBack, mode, aiDifficulty }: NewGameScreenProps) {
  const isAI = mode === 'ai';
  const [p1Titan, setP1Titan] = useState('');
  const [p2Titan, setP2Titan] = useState('');
  const [mapIdx, setMapIdx] = useState(0);

  const handleStart = () => {
    if (!p1Titan || !p2Titan) return;
    onStart(p1Titan, p2Titan, mapIdx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <h2>New Game Setup</h2>
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '1200px' }}>
        {[0, 1].map(pIdx => (
          <div key={pIdx} style={{ flex: 1, minWidth: '300px', maxWidth: '450px' }}>
            <h3>
              {pIdx === 0 
                ? 'Player 1' 
                : isAI 
                  ? `🤖 AI Opponent (${aiDifficulty || 'medium'})` 
                  : 'Player 2'} - Choose Titan
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {TITANS.map(t => {
                const elemInfo = ELEMENTS[t.elem as keyof typeof ELEMENTS];
                const selected = pIdx === 0 ? p1Titan === t.id : p2Titan === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => pIdx === 0 ? setP1Titan(t.id) : setP2Titan(t.id)}
                    style={{
                      background: selected ? 'var(--bg3)' : 'var(--bg2)',
                      border: `2px solid ${selected ? 'var(--gold)' : '#333'}`,
                      borderRadius: '8px',
                      padding: '12px',
                      cursor: 'pointer',
                      boxShadow: selected ? '0 0 12px rgba(212,168,67,.3)' : 'none',
                      transition: 'all .15s',
                    }}
                  >
                    <span style={{ fontWeight: 'bold', fontSize: '1.05em' }}>{t.icon} {t.name}</span>
                    <span style={{
                      fontSize: '.85em', marginLeft: '8px', padding: '2px 8px',
                      borderRadius: '10px', fontWeight: 'bold',
                      background: elemInfo?.color || '#888', color: '#fff',
                    }}>{t.elem}</span>
                    <div style={{ fontSize: '.85em', color: 'var(--dim)', marginTop: '4px' }}>
                      HP: {t.hp} | {t.passiveText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: '500px', marginTop: '20px' }}>
        <h3>Select Map</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '10px 0' }}>
          {MAPS.map((m, i) => (
            <div
              key={i}
              onClick={() => setMapIdx(i)}
              style={{
                background: mapIdx === i ? 'var(--bg3)' : 'var(--bg2)',
                border: `2px solid ${mapIdx === i ? 'var(--gold)' : '#333'}`,
                borderRadius: '8px',
                padding: '10px 18px',
                cursor: 'pointer',
                boxShadow: mapIdx === i ? '0 0 10px rgba(212,168,67,.2)' : 'none',
                transition: 'all .15s',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{m.name}</div>
              <div style={{ fontSize: '.85em', color: 'var(--dim)' }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn-primary"
        style={{ marginTop: '20px' }}
        onClick={handleStart}
        disabled={!p1Titan || !p2Titan}
      >
        Start Battle
      </button>
      <button className="btn-secondary" style={{ marginTop: '10px' }} onClick={onBack}>Back</button>
    </div>
  );
}
