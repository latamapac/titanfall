import { useRef, useEffect } from 'react';
import type { GameState } from '../../types/game';
import { BoardEnhanced } from '../game/BoardEnhanced';
import { PlayerBarEnhanced } from '../game/PlayerBarEnhanced';
import { HandAreaEnhanced } from '../game/HandAreaEnhanced';
import { SidebarEnhanced } from '../game/SidebarEnhanced';
import { TurnOverlay } from '../overlays/TurnOverlay';
import { VictoryOverlayEnhanced } from '../overlays/VictoryOverlayEnhanced';
import { DefeatOverlayEnhanced } from '../overlays/DefeatOverlayEnhanced';
import { anim } from '../../animations/Anim';

interface GameScreenProps {
  gameState: GameState;
  logs: string[];
  showTurnOverlay: boolean;
  victory: { winner: number } | null;
  onNextPhase: () => void;
  onCellClick: (r: number, c: number) => void;
  onCardClick: (idx: number) => void;
  onActivateTitan: () => void;
  onDismissTurnOverlay: () => void;
  onBackToMenu: () => void;
  myPlayerIdx?: number;
  isMultiplayer?: boolean;
  isAI?: boolean;
  aiDifficulty?: 'easy' | 'medium' | 'hard';
}

export function GameScreen({
  gameState, logs, showTurnOverlay, victory,
  onNextPhase, onCellClick, onCardClick, onActivateTitan,
  onDismissTurnOverlay, onBackToMenu,
  myPlayerIdx = 0, isMultiplayer = false, isAI = false, aiDifficulty = 'medium',
}: GameScreenProps) {
  const animLayerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    anim.setRefs(animLayerRef.current, boardRef.current);
  }, []);

  const G = gameState;
  const ap = G.ap;
  const isMyTurn = !isMultiplayer || ap === myPlayerIdx;

  // In multiplayer: show own hand. In local: show active player's hand.
  const handPlayerIdx = isMultiplayer ? myPlayerIdx : ap;
  const handPlayer = G.p[handPlayerIdx];
  
  // Debug logging for local games
  if (!isMultiplayer && import.meta.env.DEV) {
    console.log('Local game - Active Player:', ap, 'Hand showing:', handPlayerIdx, 'Cards:', handPlayer.hand.length);
  }

  return (
    <div className="game-screen">
      <PlayerBarEnhanced player={G.p[1]} playerIdx={1} isActive={ap === 1} onActivateTitan={ap === 1 && isMyTurn ? onActivateTitan : undefined} phase={G.phase} deployLeft={G.deployLeft} />

      <div className="game-middle">
        <div className="board-wrap">
          <BoardEnhanced
            ref={boardRef}
            gameState={G}
            onCellClick={onCellClick}
          />
          <div className="anim-layer" ref={animLayerRef} />
        </div>
        <SidebarEnhanced
          turn={G.turn}
          phase={G.phase}
          faction={G.p[ap].titan?.elem || 'kargath'}
          logs={logs}
          onNextPhase={onNextPhase}
        />
      </div>

      <PlayerBarEnhanced player={G.p[0]} playerIdx={0} isActive={ap === 0} onActivateTitan={ap === 0 && isMyTurn ? onActivateTitan : undefined} phase={G.phase} deployLeft={G.deployLeft} />

      <HandAreaEnhanced
        hand={handPlayer.hand}
        activePlayer={handPlayerIdx}
        playerFaction={handPlayer.titan?.elem}
        energy={handPlayer.energy}
        phase={isMyTurn ? G.phase : -1}
        selectedIdx={G.sel?.type === 'card' ? (G.sel.idx ?? null) : null}
        onCardClick={onCardClick}
      />

      {showTurnOverlay && (
        <TurnOverlay
          playerIdx={ap}
          onDismiss={onDismissTurnOverlay}
        />
      )}

      {victory && (
        victory.winner === myPlayerIdx ? (
          <VictoryOverlayEnhanced
            winner={G.p[victory.winner].titan?.name || `Player ${victory.winner + 1}`}
            winnerFaction={G.p[victory.winner].titan?.elem || 'kargath'}
            stats={{ turns: G.turn }}
            onPlayAgain={() => window.location.reload()}
            onMainMenu={onBackToMenu}
          />
        ) : (
          <DefeatOverlayEnhanced
            loser={G.p[myPlayerIdx].titan?.name || `Player ${myPlayerIdx + 1}`}
            loserFaction={G.p[myPlayerIdx].titan?.elem || 'kargath'}
            winner={G.p[victory.winner].titan?.name || `Player ${victory.winner + 1}`}
            onRetry={() => window.location.reload()}
            onMainMenu={onBackToMenu}
          />
        )
      )}

      {/* Enhanced Turn Indicator */}
      {!isMultiplayer && !showTurnOverlay && !victory && (
        <div className={`turn-indicator-mythic ${ap === 0 ? 'player-1' : 'player-2'}`}>
          <div className="indicator-glow" />
          <div className="indicator-content">
            <span className="indicator-icon">{ap === 0 ? '👤' : isAI ? '🤖' : '👥'}</span>
            <div className="indicator-text">
              <span className="indicator-label">{ap === 0 ? 'YOUR TURN' : isAI ? 'AI TURN' : 'OPPONENT TURN'}</span>
              <span className="indicator-sub">{ap === 0 ? 'Command the battlefield' : isAI ? `${aiDifficulty} difficulty` : 'Awaiting moves'}</span>
            </div>
            <div className={`indicator-pulse ${ap === 0 ? 'active' : ''}`} />
          </div>
        </div>
      )}

      {/* AI thinking indicator */}
      {isAI && ap === 1 && !showTurnOverlay && !victory && (
        <div style={{
          position: 'fixed',
          bottom: '160px',
          right: '20px',
          background: 'rgba(0,0,0,0.85)',
          padding: '10px 20px',
          borderRadius: '20px',
          border: '2px solid var(--gold)',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '20px' }}>🤖</span>
          <span>AI is thinking...</span>
          <span style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid var(--gold)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {isMultiplayer && !isMyTurn && !showTurnOverlay && !victory && (
        <div style={{
          position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,.8)', padding: '8px 20px', borderRadius: '20px',
          border: '1px solid #555', zIndex: 50, fontSize: '13px', color: 'var(--dim)',
        }}>
          Opponent's turn...
        </div>
      )}
    </div>
  );
}
