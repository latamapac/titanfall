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
import { CharacterSelectV2 } from './components/v2/CharacterSelectV2';
import { useGameEngine } from './hooks/useGameEngine';
import { generateDefaultDeck, loadCustomCardsFromStorage } from './engine/utils';
import { TITANS } from './data/titans';

// Import V2 styles
import './styles/v2/tokens.css';
import './styles/v2/animations.css';
import './styles/v2/touch.css';

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

  // Character Select Screen
  if (screen === 'menu') {
    return (
      <CharacterSelectV2
        onStart={handleStartGame}
        onBack={() => window.location.href = '/'}
      />
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
// Railway deploy check Tue Feb 10 23:49:48 -03 2026
