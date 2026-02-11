import { useRef, useEffect } from 'react';
import type { GameState } from '../../types/game';
import { TitanPortrait } from './TitanPortrait';
import { Card } from './Card';


interface BattleScreenProps {
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
}

const PHASE_NAMES = ['Refresh', 'Draw', 'Deploy', 'Movement', 'Combat', 'End'];

export function BattleScreen({
  gameState: G,
  logs,
  showTurnOverlay,
  victory,
  onNextPhase,
  onCellClick,
  onCardClick,
  onActivateTitan,
  onDismissTurnOverlay,
  onBackToMenu,
  myPlayerIdx = 0,
  isMultiplayer = false,
}: BattleScreenProps) {
  const logEndRef = useRef<HTMLDivElement>(null);
  const ap = G.ap; // Active player
  const isMyTurn = !isMultiplayer || ap === myPlayerIdx;
  const activeP = G.p[ap];

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  // Render terrain grid
  const renderGrid = () => {
    const grid = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 7; c++) {
        const unit = G.board[r][c];
        const isDeployZone = ap === 0 ? r >= 3 : r <= 1;
        const canDeploy = isDeployZone && G.phase === 2 && !unit;
        
        grid.push(
          <div
            key={`${r}-${c}`}
            className="grid-cell"
            style={{
              aspectRatio: '1',
              background: canDeploy 
                ? 'rgba(74, 222, 128, 0.2)' 
                : 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              position: 'relative',
              cursor: canDeploy ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
            onClick={() => onCellClick(r, c)}
          >
            {unit && (
              <div
                style={{
                  position: 'absolute',
                  inset: 4,
                  borderRadius: '6px',
                  background: 'var(--color-surface-light)',
                  border: '2px solid var(--color-gold)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  overflow: 'hidden',
                }}
              >
                <span style={{ fontSize: '20px' }}>
                  {unit.type === 'structure' ? '🏛️' : '⚔️'}
                </span>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    left: 2,
                    right: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                >
                  <span>{unit.atk}</span>
                  <span>{unit.hp}</span>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div
      className="battle-screen-v2"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg)',
        overflow: 'hidden',
      }}
    >
      {/* Top Bar - Enemy Titan */}
      <div
        style={{
          height: '80px',
          background: 'linear-gradient(180deg, var(--color-surface), transparent)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '20px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <TitanPortrait 
          titanId={G.p[1].titan?.id || 'kargath'} 
          size="sm"
          isActive={ap === 1}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-header)', color: 'var(--color-gold)' }}>
            Player 2
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            {/* HP Bar */}
            <div
              style={{
                width: '150px',
                height: '12px',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${(G.p[1].hp / 40) * 100}%`,
                  height: '100%',
                  background: 'var(--color-danger)',
                  transition: 'width 0.3s',
                }}
              />
            </div>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {G.p[1].hp}/40
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '24px', color: 'var(--color-mana)' }}>
            {G.p[1].energy} ⚡
          </div>
        </div>
      </div>

      {/* Middle - Battlefield */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: '20px',
          padding: '20px',
        }}
      >
        {/* Battle Grid */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(5, 1fr)',
            gap: '8px',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {renderGrid()}
        </div>

        {/* Sidebar */}
        <div
          style={{
            width: '250px',
            background: 'var(--color-surface)',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Phase Display */}
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
              TURN {G.turn}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-header)',
                fontSize: '18px',
                color: 'var(--color-gold)',
              }}
            >
              {PHASE_NAMES[G.phase]}
            </div>
            
            {/* Phase Progress */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
              {PHASE_NAMES.map((name, i) => (
                <div
                  key={name}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    background: i === G.phase 
                      ? 'var(--color-gold)' 
                      : i < G.phase 
                      ? '#555' 
                      : 'var(--color-border)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Action Button */}
          {isMyTurn && (
            <div style={{ padding: '12px 16px' }}>
              <button
                onClick={onNextPhase}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: G.phase === 5 
                    ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-light))'
                    : 'var(--color-blue)',
                  border: 'none',
                  borderRadius: '8px',
                  color: G.phase === 5 ? '#000' : '#fff',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: G.phase === 5 
                    ? '0 0 20px rgba(212,168,67,0.4)'
                    : 'none',
                  animation: G.phase === 5 ? 'pulse 1.5s infinite' : 'none',
                }}
              >
                {G.phase === 5 ? '🔄 END TURN' : 'Next Phase →'}
              </button>
            </div>
          )}

          {/* Log */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '12px 16px',
              fontSize: '12px',
              lineHeight: 1.5,
            }}
            className="scrollbar-hide"
          >
            {logs.map((log, i) => (
              <div
                key={i}
                style={{
                  padding: '4px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  color: i === logs.length - 1 ? '#fff' : '#888',
                }}
              >
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>

          {/* Back Button */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
            <button
              onClick={onBackToMenu}
              style={{
                width: '100%',
                padding: '8px',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                color: '#888',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              ← Back to Menu
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Player Titan & Hand */}
      <div
        style={{
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        {/* Player Info Bar */}
        <div
          style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 20px',
            gap: '20px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <TitanPortrait 
            titanId={G.p[0].titan?.id || 'kargath'} 
            size="sm"
            isActive={ap === 0}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-header)', color: 'var(--color-gold)' }}>
              Player 1
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <div
                style={{
                  width: '150px',
                  height: '12px',
                  background: 'rgba(0,0,0,0.5)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${(G.p[0].hp / 40) * 100}%`,
                    height: '100%',
                    background: 'var(--color-success)',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>
                {G.p[0].hp}/40
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', color: 'var(--color-mana)' }}>
              {G.p[0].energy} ⚡
            </div>
          </div>
          
          {/* Titan Ability Button */}
          <button
            onClick={onActivateTitan}
            disabled={!isMyTurn}
            style={{
              padding: '8px 16px',
              background: 'var(--color-arcane)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: isMyTurn ? 'pointer' : 'not-allowed',
              opacity: isMyTurn ? 1 : 0.5,
            }}
          >
            Ability
          </button>
        </div>

        {/* Hand */}
        {isMyTurn && (
          <div
            style={{
              height: '220px',
              padding: '16px 20px',
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              overflowY: 'hidden',
              alignItems: 'center',
            }}
            className="scrollbar-hide"
          >
            {activeP.hand.map((card, i) => (
              <Card
                key={i}
                card={card}
                canPlay={G.phase === 2 && activeP.energy >= card.cost}
                isSelected={G.sel?.type === 'card' && G.sel.idx === i}
                onClick={() => onCardClick(i)}
              />
            ))}
          </div>
        )}
        
        {!isMyTurn && (
          <div
            style={{
              height: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontSize: '14px',
            }}
          >
            Waiting for opponent...
          </div>
        )}
      </div>

      {/* Turn Overlay */}
      {showTurnOverlay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer',
          }}
          onClick={onDismissTurnOverlay}
        >
          <div
            style={{
              fontSize: '64px',
              marginBottom: '20px',
            }}
          >
            {ap === 0 ? '🔵' : '🔴'}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-header)',
              fontSize: '48px',
              color: 'var(--color-gold)',
              marginBottom: '20px',
            }}
          >
            Player {ap + 1}'s Turn
          </h1>
          <p style={{ color: '#888', fontSize: '18px' }}>
            Click anywhere to start
          </p>
          <button
            style={{
              marginTop: '40px',
              padding: '16px 48px',
              background: 'var(--color-gold)',
              border: 'none',
              borderRadius: '8px',
              color: '#000',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={(e) => { e.stopPropagation(); onDismissTurnOverlay(); }}
          >
            Start Turn
          </button>
        </div>
      )}

      {/* Victory Overlay */}
      {victory && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-header)',
              fontSize: '72px',
              color: 'var(--color-gold)',
              marginBottom: '20px',
            }}
          >
            🏆 Victory!
          </h1>
          <p style={{ fontSize: '32px', color: '#fff', marginBottom: '40px' }}>
            Player {victory.winner + 1} Wins!
          </p>
          <button
            onClick={onBackToMenu}
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
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}
