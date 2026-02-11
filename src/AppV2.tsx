/**
 * Titanfall Chronicles V2 - Main Entry Point
 * 
 * This is the new version with:
 * - FLUX-generated art assets
 * - Improved UI/UX
 * - Smooth animations
 * - Fixed viewport (no scrolling)
 * - Industry-standard battle layout
 */

import { useState, useEffect, useCallback } from 'react';
import { BattleScreen } from './components/v2/BattleScreen';
import { useGameEngine } from './hooks/useGameEngine';
import { generateDefaultDeck, loadCustomCardsFromStorage } from './engine/utils';
import { TITANS } from './data/titans';

// Import V2 styles
import './styles/v2/tokens.css';
import './styles/v2/animations.css';

export default function AppV2() {
  const engine = useGameEngine();
  const [screen, setScreen] = useState<'menu' | 'setup' | 'game'>('menu');

  useEffect(() => {
    loadCustomCardsFromStorage();
  }, []);

  const handleStartGame = useCallback((p1TitanId: string, p2TitanId: string, mapIdx: number) => {
    const t1 = TITANS.find(t => t.id === p1TitanId);
    const t2 = TITANS.find(t => t.id === p2TitanId);
    const p1Deck = generateDefaultDeck(t1?.elem || 'fire');
    const p2Deck = generateDefaultDeck(t2?.elem || 'earth');
    engine.startGame(p1TitanId, p2TitanId, mapIdx, p1Deck, p2Deck);
    setScreen('game');
  }, [engine]);

  // Simple menu for now
  if (screen === 'menu') {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg)',
          gap: '20px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-header)',
            fontSize: '48px',
            color: 'var(--color-gold)',
            textAlign: 'center',
          }}
        >
          Titanfall Chronicles
        </h1>
        <p style={{ color: '#888', marginBottom: '20px' }}>V2 - Visual Overhaul</p>
        
        <button
          onClick={() => handleStartGame('kargath', 'thalor', 0)}
          style={{
            padding: '16px 48px',
            background: 'var(--color-gold)',
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Quick Start (V2)
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '12px 32px',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            color: '#888',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Back to V1
        </button>
      </div>
    );
  }

  if (screen === 'game' && engine.gameState) {
    return (
      <BattleScreen
        gameState={engine.gameState}
        logs={engine.logs}
        showTurnOverlay={engine.showTurnOverlay}
        victory={engine.victory}
        onNextPhase={engine.nextPhase}
        onCellClick={engine.cellClick}
        onCardClick={engine.cardClick}
        onActivateTitan={engine.activateTitan}
        onDismissTurnOverlay={engine.dismissTurnOverlay}
        onBackToMenu={() => {
          engine.resetGame();
          setScreen('menu');
        }}
        isMultiplayer={false}
      />
    );
  }

  return null;
}
