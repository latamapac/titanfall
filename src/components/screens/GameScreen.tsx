import { useRef } from 'react';
import type { GameState } from '../../types/game';
import { Card3D } from '../game/Card3D';
import { PlayerBarCinematic } from '../game/PlayerBarCinematic';

interface GameScreenProps {
  gameState: GameState;
  logs: string[];
  showTurnOverlay?: boolean;
  victory?: { winner: number } | null;
  onNextPhase: () => void;
  onCellClick: (r: number, c: number) => void;
  onCardClick: (idx: number) => void;
  onActivateTitan: () => void;
  onDismissTurnOverlay?: () => void;
  onBackToMenu?: () => void;
  myPlayerIdx?: number;
  isMultiplayer?: boolean;
  isAI?: boolean;
  aiDifficulty?: 'easy' | 'medium' | 'hard';
}

export function GameScreen({
  gameState, logs, 
  showTurnOverlay: _showTurnOverlay, 
  victory: _victory,
  onNextPhase, onCellClick, onCardClick, onActivateTitan,
  onDismissTurnOverlay: _onDismissTurnOverlay, 
  onBackToMenu: _onBackToMenu,
  myPlayerIdx = 0, isMultiplayer = false, 
  isAI: _isAI, 
  aiDifficulty: _aiDifficulty,
}: GameScreenProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const G = gameState;
  const ap = G.ap;
  const isMyTurn = !isMultiplayer || ap === myPlayerIdx;
  const handPlayerIdx = isMultiplayer ? myPlayerIdx : ap;
  const handPlayer = G.p[handPlayerIdx];

  return (
    <div 
      className="game-screen"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f1f 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '16px',
      }}
    >
      {/* Enemy Player Bar */}
      <PlayerBarCinematic 
        player={G.p[1]} 
        playerIdx={1} 
        isActive={ap === 1}
        onActivateTitan={ap === 1 && isMyTurn ? onActivateTitan : undefined}
        phase={G.phase}
        deployLeft={G.deployLeft}
      />

      {/* Main Game Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: '20px',
        minHeight: 0,
      }}>
        {/* Board Area */}
        <div 
          ref={boardRef}
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Placeholder Board */}
          <div style={{
            width: '100%',
            height: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(5, 1fr)',
            gap: '8px',
            padding: '20px',
          }}>
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                onClick={() => onCellClick(Math.floor(i / 7), i % 7)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
              />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          width: '280px',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Turn Info */}
          <div style={{
            padding: '16px',
            background: 'rgba(255,215,0,0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255,215,0,0.3)',
          }}>
            <div style={{
              fontSize: '12px',
              color: '#FFD700',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '4px',
            }}>
              Turn {G.turn}
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#fff',
            }}>
              {['Refresh', 'Draw', 'Deploy', 'Movement', 'Combat', 'End'][G.phase]} Phase
            </div>
          </div>

          {/* Phase Button */}
          <button
            onClick={onNextPhase}
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, #EAB308, #F59E0B)',
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(234, 179, 8, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            {G.phase === 5 ? '🔄 End Turn' : 'Next Phase →'}
          </button>

          {/* Combat Log */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{
              fontSize: '12px',
              color: '#888',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Combat Log
            </div>
            {logs.slice(-10).map((log, i) => (
              <div
                key={i}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#CCC',
                  borderLeft: '2px solid rgba(255,215,0,0.5)',
                }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <PlayerBarCinematic 
        player={G.p[0]} 
        playerIdx={0} 
        isActive={ap === 0}
        onActivateTitan={ap === 0 && isMyTurn ? onActivateTitan : undefined}
        phase={G.phase}
        deployLeft={G.deployLeft}
      />

      {/* Hand Area with 3D Cards */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        overflowX: 'auto',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 20px',
          borderRight: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            fontSize: '12px',
            color: '#FFD700',
            fontWeight: 'bold',
          }}>
            P{handPlayerIdx + 1}
          </div>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff',
          }}>
            {handPlayer.hand.length}
          </div>
          <div style={{
            fontSize: '10px',
            color: '#888',
          }}>
            cards
          </div>
        </div>

        {handPlayer.hand.map((card, i) => (
          <div
            key={i}
            style={{
              transform: G.sel?.type === 'card' && G.sel.idx === i 
                ? 'translateY(-40px)' 
                : 'translateY(0)',
              transition: 'transform 0.3s ease',
              zIndex: G.sel?.type === 'card' && G.sel.idx === i ? 100 : handPlayer.hand.length - i,
            }}
          >
            <Card3D
              card={card}
              faction={handPlayer.titan?.elem}
              isSelected={G.sel?.type === 'card' && G.sel.idx === i}
              canPlay={isMyTurn && G.phase === 2 && handPlayer.energy >= card.cost}
              onClick={() => onCardClick(i)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
