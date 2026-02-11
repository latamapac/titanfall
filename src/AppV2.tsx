/**
 * Titanfall Chronicles V2 - Main Entry Point
 * 
 * Features:
 * - FLUX-generated art assets
 * - Code splitting with React.lazy
 * - Optimized rendering with memoization
 * - Smooth 60fps animations
 */

import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { generateDefaultDeck, loadCustomCardsFromStorage } from './engine/utils';
import { TITANS } from './data/titans';

// Import V2 styles
import './styles/v2/tokens.css';
import './styles/v2/animations.css';
import './styles/v2/touch.css';
import './styles/v2/performance.css';

// Lazy load heavy components for code splitting
const CharacterSelectV2 = lazy(() => import('./components/v2/CharacterSelectV2'));
const BattleScreen = lazy(() => import('./components/v2/BattleScreen'));

// Loading fallback
function ScreenLoader() {
  return (
    <div className="screen-loader">
      <div className="loader-spinner" />
      <div className="loader-text">Loading...</div>
    </div>
  );
}

export default function AppV2() {
  const engine = useGameEngine();
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');

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

  const handleBackToMenu = useCallback(() => {
    engine.resetGame();
    setScreen('menu');
  }, [engine]);

  const handleBack = useCallback(() => {
    window.location.href = '/';
  }, []);

  // Character Select Screen
  if (screen === 'menu') {
    return (
      <Suspense fallback={<ScreenLoader />}>
        <CharacterSelectV2
          onStart={handleStartGame}
          onBack={handleBack}
        />
      </Suspense>
    );
  }

  if (screen === 'game' && engine.gameState) {
    return (
      <Suspense fallback={<ScreenLoader />}>
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
          onBackToMenu={handleBackToMenu}
          isMultiplayer={false}
        />
      </Suspense>
    );
  }

  return null;
}
