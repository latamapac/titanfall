import { useState, useCallback, useRef } from 'react';
import type { GameState } from '../types/game';
import { GameEngine, type GameCallback } from '../engine/GameEngine';
import { sfx } from '../audio/SFX';
import { anim } from '../animations/Anim';
import { deepClone } from '../engine/utils';

export function useGameEngine() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showTurnOverlay, setShowTurnOverlay] = useState(false);
  const [victory, setVictory] = useState<{ winner: number } | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const getEngine = useCallback(() => {
    if (engineRef.current) return engineRef.current;

    const cb: GameCallback = {
      onLog: (msg: string) => {
        setLogs(prev => {
          const next = [...prev, msg];
          if (next.length > 80) next.shift();
          return next;
        });
      },
      onPopup: () => {
        // Popups are handled by the board component via game state
      },
      onVetPopup: () => {
        // Vet popups handled similarly
      },
      onRender: () => {
        if (engineRef.current) {
          setGameState(deepClone(engineRef.current.G));
        }
      },
      onShowTurnOverlay: () => {
        setShowTurnOverlay(true);
      },
      onVictory: (winner: number) => {
        setVictory({ winner });
      },
      onPlaySFX: (name: string) => {
        sfx.play(name);
      },
      onAnimate: (type: string, ...args: unknown[]) => {
        anim.dispatch(type, ...args);
      },
    };

    const engine = new GameEngine(cb);
    engineRef.current = engine;
    return engine;
  }, []);

  const startGame = useCallback((p1TitanId: string, p2TitanId: string, mapIdx: number, p1DeckIds: string[], p2DeckIds: string[]) => {
    const engine = getEngine();
    engine.startGame(p1TitanId, p2TitanId, mapIdx, p1DeckIds, p2DeckIds);
    setGameState(deepClone(engine.G));
    setLogs([]);
    setVictory(null);
    sfx.ensure();
    sfx.ambientLoop();
  }, [getEngine]);

  const nextPhase = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.nextPhase();
    setGameState(deepClone(engine.G));
  }, []);

  const cellClick = useCallback((r: number, c: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.onCellClick(r, c);
    setGameState(deepClone(engine.G));
  }, []);

  const cardClick = useCallback((idx: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.onCardClick(idx);
    setGameState(deepClone(engine.G));
  }, []);

  const activateTitan = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.activateTitan();
    setGameState(deepClone(engine.G));
  }, []);

  const dismissTurnOverlay = useCallback(() => {
    setShowTurnOverlay(false);
    // After dismissing the turn overlay, run the current phase to start the turn
    const engine = engineRef.current;
    if (engine) {
      engine.runPhase();
      setGameState(deepClone(engine.G));
    }
  }, []);

  const resetGame = useCallback(() => {
    engineRef.current = null;
    setGameState(null);
    setLogs([]);
    setVictory(null);
    setShowTurnOverlay(false);
  }, []);

  return {
    gameState,
    logs,
    showTurnOverlay,
    victory,
    startGame,
    nextPhase,
    cellClick,
    cardClick,
    activateTitan,
    dismissTurnOverlay,
    resetGame,
  };
}
