import { useRef, useEffect, useState, useCallback } from 'react';
import type { GameState } from '../../types/game';
import { TitanPortrait } from './TitanPortrait';
import { Card } from './Card';
import { 
  useParticleSystem, 
  ParticleRenderer, 
  ScreenShake,
  TurnTransition,
} from './ParticleEffects';


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

// Interface for tracking animated elements
interface AnimatedUnit {
  key: string;
  row: number;
  col: number;
  animState: 'idle' | 'spawn' | 'attack' | 'damage' | 'death';
}

export default function BattleScreen({
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
  
  // Particle system
  const {
    particles,
    damageNumbers,
    spawnParticles,
    spawnDamageNumber,
    spawnExplosion,
    spawnElementEffect,
    spawnVictoryConfetti,
  } = useParticleSystem();

  // Screen shake state
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState<'light' | 'medium' | 'heavy'>('medium');

  // Turn transition state
  const [showTurnTransition, setShowTurnTransition] = useState(false);
  const [turnTransitionPlayer, setTurnTransitionPlayer] = useState(0);

  // Track previous game state for animations
  const prevGameState = useRef<GameState | null>(null);
  const [animatedUnits, setAnimatedUnits] = useState<AnimatedUnit[]>([]);
  
  // Track selected unit/card for highlights
  const [hoveredCell, setHoveredCell] = useState<{r: number, c: number} | null>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  // Handle victory effect
  useEffect(() => {
    if (victory) {
      setTimeout(() => {
        spawnVictoryConfetti(window.innerWidth / 2, window.innerHeight / 2);
        setShakeIntensity('heavy');
        setShakeTrigger(true);
        setTimeout(() => setShakeTrigger(false), 800);
      }, 500);
    }
  }, [victory, spawnVictoryConfetti]);

  // Handle turn transition
  useEffect(() => {
    if (showTurnOverlay) {
      setTurnTransitionPlayer(ap);
      setShowTurnTransition(true);
    } else {
      setShowTurnTransition(false);
    }
  }, [showTurnOverlay, ap]);

  // Detect game state changes for animations
  useEffect(() => {
    if (!prevGameState.current) {
      prevGameState.current = G;
      return;
    }

    const prev = prevGameState.current;

    // Check for unit spawns
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 7; c++) {
        const currentUnit = G.board[r][c];
        const prevUnit = prev.board[r][c];
        
        if (currentUnit && !prevUnit) {
          // Unit spawned
          const key = `${currentUnit.owner}-${currentUnit.id || 'unknown'}-${Date.now()}`;
          setAnimatedUnits(prev => [...prev, { key, row: r, col: c, animState: 'spawn' }]);
          
          // Spawn magic particles
          setTimeout(() => {
            const rect = getCellPosition(r, c);
            if (rect) spawnParticles(rect.x, rect.y, 'magic', 15, 40);
          }, 100);

          // Remove spawn animation after it completes
          setTimeout(() => {
            setAnimatedUnits(prev => prev.filter(u => u.key !== key));
          }, 600);
        }
      }
    }

    // Check for HP changes (damage/healing)
    G.p.forEach((player, pIdx) => {
      const prevHp = prev.p[pIdx].hp;
      if (player.hp !== prevHp) {
        const damage = prevHp - player.hp;
        if (damage > 0) {
          // Titan took damage - trigger screen shake
          setShakeIntensity(damage >= 5 ? 'heavy' : damage >= 3 ? 'medium' : 'light');
          setShakeTrigger(true);
          setTimeout(() => setShakeTrigger(false), damage >= 5 ? 800 : 600);

          // Spawn damage number near titan portrait
          const rect = pIdx === 0 
            ? { x: 100, y: window.innerHeight - 100 }
            : { x: 100, y: 100 };
          spawnDamageNumber(rect.x, rect.y, damage, 'damage', damage >= 5);
          
          // Spawn sparks
          spawnExplosion(rect.x, rect.y, damage >= 5 ? 'large' : 'medium');
        }
      }
    });

    prevGameState.current = G;
  }, [G, spawnParticles, spawnDamageNumber, spawnExplosion]);

  // Helper to get cell position for particles
  const getCellPosition = useCallback((r: number, c: number) => {
    // Calculate approximate position based on grid layout
    const gridRect = document.querySelector('.battle-grid')?.getBoundingClientRect();
    if (!gridRect) return null;
    
    const cellWidth = gridRect.width / 7;
    const cellHeight = gridRect.height / 5;
    
    return {
      x: gridRect.left + c * cellWidth + cellWidth / 2,
      y: gridRect.top + r * cellHeight + cellHeight / 2,
    };
  }, []);

  // Handle cell click with effects
  const handleCellClick = useCallback((r: number, c: number) => {
    const rect = getCellPosition(r, c);
    if (rect) {
      spawnParticles(rect.x, rect.y, 'dust', 5, 20);
    }
    onCellClick(r, c);
  }, [onCellClick, getCellPosition, spawnParticles]);

  // Handle card play with effects
  const handleCardClick = useCallback((idx: number) => {
    // Get card position for particle effect
    const cardElements = document.querySelectorAll('.card-v2');
    const cardEl = cardElements[idx] as HTMLElement;
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect();
      spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 'magic', 10, 30);
    }
    onCardClick(idx);
  }, [onCardClick, spawnParticles]);

  // Handle titan ability with effects
  const handleActivateTitan = useCallback(() => {
    setShakeIntensity('medium');
    setShakeTrigger(true);
    setTimeout(() => setShakeTrigger(false), 600);
    
    // Spawn titan ability particles
    const rect = ap === 0 
      ? { x: 80, y: window.innerHeight - 150 }
      : { x: 80, y: 150 };
    spawnElementEffect(rect.x, rect.y, 'arcane');
    
    onActivateTitan();
  }, [onActivateTitan, ap, spawnElementEffect]);

  // Handle phase change with effects
  const handleNextPhase = useCallback(() => {
    // Spawn phase transition particles
    spawnParticles(window.innerWidth / 2, window.innerHeight / 2, 'spark', 8, 100);
    onNextPhase();
  }, [onNextPhase, spawnParticles]);

  // Render terrain grid
  const renderGrid = () => {
    const grid = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 7; c++) {
        const unit = G.board[r][c];
        const isDeployZone = ap === 0 ? r >= 3 : r <= 1;
        const canDeploy = isDeployZone && G.phase === 2 && !unit;
        const animatedUnit = animatedUnits.find(u => u.row === r && u.col === c);
        const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
        
        // Determine if this is a valid target for selection
        const isValidTarget = G.sel?.type === 'card' && canDeploy;
        
        grid.push(
          <div
            key={`${r}-${c}`}
            className={`grid-cell ${unit ? 'has-unit' : ''} ${G.sel?.type === 'unit' && G.sel.r === r && G.sel.c === c ? 'selected' : ''} ${isValidTarget ? 'valid-target-friendly' : ''}`}
            style={{
              aspectRatio: '1',
              background: canDeploy 
                ? 'rgba(74, 222, 128, 0.15)' 
                : isHovered && canDeploy
                ? 'rgba(74, 222, 128, 0.25)'
                : 'var(--color-surface)',
              border: '1px solid',
              borderColor: canDeploy 
                ? 'rgba(74, 222, 128, 0.5)'
                : isHovered 
                ? 'rgba(212, 168, 67, 0.5)'
                : 'var(--color-border)',
              borderRadius: '8px',
              position: 'relative',
              cursor: canDeploy ? 'pointer' : unit ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              transform: isHovered && canDeploy ? 'scale(1.02)' : 'scale(1)',
            }}
            onClick={() => handleCellClick(r, c)}
            onMouseEnter={() => setHoveredCell({r, c})}
            onMouseLeave={() => setHoveredCell(null)}
          >
            {/* Grid cell highlight effects */}
            {canDeploy && (
              <div
                style={{
                  position: 'absolute',
                  inset: '4px',
                  borderRadius: '6px',
                  border: '1px dashed rgba(74, 222, 128, 0.4)',
                  pointerEvents: 'none',
                }}
              />
            )}
            
            {/* Deployment zone indicator */}
            {isDeployZone && (
              <div
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '4px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: ap === 0 ? 'var(--color-p1)' : 'var(--color-p2)',
                  opacity: 0.5,
                }}
              />
            )}

            {unit && (
              <div
                className={animatedUnit?.animState === 'spawn' ? 'animate-unit-spawn' : ''}
                style={{
                  position: 'absolute',
                  inset: 4,
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, var(--color-surface-light), var(--color-surface))',
                  border: `2px solid ${unit.owner === 0 ? 'var(--color-p1)' : 'var(--color-p2)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  overflow: 'hidden',
                  boxShadow: G.sel?.type === 'unit' && G.sel.r === r && G.sel.c === c
                    ? `0 0 20px ${unit.owner === 0 ? 'rgba(74, 158, 255, 0.6)' : 'rgba(248, 113, 113, 0.6)'}, inset 0 0 20px ${unit.owner === 0 ? 'rgba(74, 158, 255, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`
                    : `0 2px 8px rgba(0,0,0,0.4)`,
                  animation: G.sel?.type === 'unit' && G.sel.r === r && G.sel.c === c
                    ? 'unitSelectedPulse 1.5s ease-in-out infinite'
                    : 'none',
                }}
              >
                {/* Unit icon */}
                <span style={{ 
                  fontSize: '22px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                }}>
                  {unit.type === 'structure' ? '🏛️' : '⚔️'}
                </span>
                
                {/* Unit stats bar */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '3px 6px',
                    background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.8))',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span style={{ 
                    color: 'var(--color-danger)',
                    textShadow: '0 0 5px rgba(248, 113, 113, 0.5)',
                  }}>
                    {unit.atk}
                  </span>
                  <span style={{ 
                    color: 'var(--color-success)',
                    textShadow: '0 0 5px rgba(74, 222, 128, 0.5)',
                  }}>
                    {unit.hp}
                  </span>
                </div>
                
                {/* Owner indicator */}
                <div
                  style={{
                    position: 'absolute',
                    top: '3px',
                    left: '3px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: unit.owner === 0 ? 'var(--color-p1)' : 'var(--color-p2)',
                    boxShadow: `0 0 5px ${unit.owner === 0 ? 'var(--color-p1)' : 'var(--color-p2)'}`,
                  }}
                />
              </div>
            )}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <>
      {/* Particle Effects Layer */}
      <ParticleRenderer particles={particles} damageNumbers={damageNumbers} />
      
      {/* Turn Transition Overlay */}
      <TurnTransition 
        player={turnTransitionPlayer}
        isVisible={showTurnTransition}
      />
      
      {/* Screen Shake Wrapper */}
      <ScreenShake intensity={shakeIntensity} duration={800} trigger={shakeTrigger}>
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
              position: 'relative',
            }}
          >
            {/* Active player indicator */}
            {ap === 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: 'linear-gradient(180deg, var(--color-p2), transparent)',
                  boxShadow: '0 0 20px var(--color-p2)',
                }}
              />
            )}
            
            <TitanPortrait 
              titanId={G.p[1].titan?.id || 'kargath'} 
              size="sm"
              isActive={ap === 1}
            />
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontFamily: 'var(--font-header)', 
                color: ap === 1 ? 'var(--color-p2)' : 'var(--color-gold)',
                textShadow: ap === 1 ? '0 0 10px var(--color-p2)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                Player 2
                {ap === 1 && <span style={{ marginLeft: '8px', fontSize: '12px' }}>◀ TURN</span>}
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
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div
                    className="hp-bar-fill"
                    style={{
                      width: `${(G.p[1].hp / 40) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-danger), #FF8888)',
                      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 0 10px rgba(248, 113, 113, 0.5)',
                    }}
                  />
                </div>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {G.p[1].hp}/40
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontSize: '24px', 
                color: 'var(--color-mana)',
                textShadow: '0 0 15px rgba(74, 158, 255, 0.5)',
              }}>
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
              className="battle-grid"
              style={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gridTemplateRows: 'repeat(5, 1fr)',
                gap: '8px',
                maxWidth: '800px',
                margin: '0 auto',
                padding: '10px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
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
                boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
              }}
            >
              {/* Phase Display */}
              <div
                style={{
                  padding: '16px',
                  borderBottom: '1px solid var(--color-border)',
                  background: 'linear-gradient(180deg, rgba(212,168,67,0.1), transparent)',
                }}
              >
                <div style={{ 
                  fontSize: '12px', 
                  color: '#888', 
                  marginBottom: '8px',
                  letterSpacing: '2px',
                }}>
                  TURN {G.turn}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-header)',
                    fontSize: '20px',
                    color: 'var(--color-gold)',
                    textShadow: '0 0 20px rgba(212, 168, 67, 0.4)',
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
                          ? 'linear-gradient(90deg, var(--color-gold), var(--color-gold-light))' 
                          : i < G.phase 
                          ? '#555' 
                          : 'var(--color-border)',
                        boxShadow: i === G.phase ? '0 0 10px rgba(212, 168, 67, 0.5)' : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Action Button - Always show in local games */}
              <div style={{ padding: '12px 16px' }}>
                <button
                  onClick={handleNextPhase}
                  style={{
                    width: '100%',
                    padding: G.phase === 5 ? '16px' : '12px',
                    background: G.phase === 5 
                      ? 'linear-gradient(135deg, var(--color-gold), var(--color-gold-light))'
                      : 'linear-gradient(135deg, var(--color-blue), var(--color-blue-light))',
                    border: 'none',
                    borderRadius: '8px',
                    color: G.phase === 5 ? '#000' : '#fff',
                    fontWeight: 'bold',
                    fontSize: G.phase === 5 ? '16px' : '14px',
                    cursor: 'pointer',
                    boxShadow: G.phase === 5 
                      ? '0 0 25px rgba(212,168,67,0.5), 0 4px 10px rgba(0,0,0,0.3)'
                      : '0 4px 10px rgba(0,0,0,0.3)',
                    animation: G.phase === 5 ? 'pulse-glow 1.5s infinite' : 'none',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = G.phase === 5 
                      ? '0 0 35px rgba(212,168,67,0.7), 0 6px 15px rgba(0,0,0,0.4)'
                      : '0 6px 15px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = G.phase === 5 
                      ? '0 0 25px rgba(212,168,67,0.5), 0 4px 10px rgba(0,0,0,0.3)'
                      : '0 4px 10px rgba(0,0,0,0.3)';
                  }}
                >
                  {G.phase === 5 ? '🔄 END TURN' : `Next: ${PHASE_NAMES[G.phase + 1] || 'New Turn'} →`}
                </button>
              </div>

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
                      padding: '6px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      color: i === logs.length - 1 ? '#fff' : '#888',
                      animation: i === logs.length - 1 ? 'phaseSlide 0.3s ease-out' : 'none',
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
                    padding: '10px',
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    color: '#888',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-gold)';
                    e.currentTarget.style.color = 'var(--color-gold)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = '#888';
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
              position: 'relative',
            }}
          >
            {/* Active player indicator */}
            {ap === 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, var(--color-p1), transparent 50%)',
                  boxShadow: '0 0 20px var(--color-p1)',
                }}
              />
            )}
            
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
                <div style={{ 
                  fontFamily: 'var(--font-header)', 
                  color: ap === 0 ? 'var(--color-p1)' : 'var(--color-gold)',
                  textShadow: ap === 0 ? '0 0 10px var(--color-p1)' : 'none',
                  transition: 'all 0.3s ease',
                }}>
                  Player 1
                  {ap === 0 && <span style={{ marginLeft: '8px', fontSize: '12px' }}>◀ YOUR TURN</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <div
                    style={{
                      width: '150px',
                      height: '12px',
                      background: 'rgba(0,0,0,0.5)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div
                      className="hp-bar-fill"
                      style={{
                        width: `${(G.p[0].hp / 40) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--color-success), #6EE89C)',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    {G.p[0].hp}/40
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: '24px', 
                  color: 'var(--color-mana)',
                  textShadow: '0 0 15px rgba(74, 158, 255, 0.5)',
                }}>
                  {G.p[0].energy} ⚡
                </div>
              </div>
              
              {/* Titan Ability Button */}
              <button
                onClick={handleActivateTitan}
                disabled={!isMyTurn}
                style={{
                  padding: '10px 20px',
                  background: isMyTurn 
                    ? 'linear-gradient(135deg, var(--color-arcane), #F9A8D4)' 
                    : 'var(--color-surface-light)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: isMyTurn ? 'pointer' : 'not-allowed',
                  opacity: isMyTurn ? 1 : 0.5,
                  boxShadow: isMyTurn ? '0 0 20px rgba(244, 114, 182, 0.4)' : 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (isMyTurn) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(244, 114, 182, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = isMyTurn ? '0 0 20px rgba(244, 114, 182, 0.4)' : 'none';
                }}
              >
                ✨ Ability
              </button>
            </div>

            {/* Hand */}
            {isMyTurn && (
              <div
                style={{
                  height: '240px',
                  padding: '20px 24px',
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  overflowY: 'visible',
                  alignItems: 'center',
                }}
                className="scrollbar-hide"
              >
                {activeP.hand.map((card, i) => (
                  <Card
                    key={`${card.id}-${i}`}
                    card={card}
                    canPlay={G.phase === 2 && activeP.energy >= card.cost}
                    isSelected={G.sel?.type === 'card' && G.sel.idx === i}
                    onClick={() => handleCardClick(i)}
                  />
                ))}
              </div>
            )}
            
            {!isMyTurn && (
              <div
                style={{
                  height: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#888',
                  fontSize: '14px',
                  gap: '12px',
                }}
              >
                <div className="spinner" style={{ fontSize: '24px' }}>⏳</div>
                <span>Waiting for opponent...</span>
              </div>
            )}
          </div>

          {/* Turn Overlay (Legacy - kept for compatibility but enhanced) */}
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
                className="animate-victory"
                style={{
                  fontSize: '64px',
                  marginBottom: '20px',
                  filter: 'drop-shadow(0 0 30px currentColor)',
                }}
              >
                {ap === 0 ? '🔵' : '🔴'}
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: '48px',
                  color: ap === 0 ? 'var(--color-p1)' : 'var(--color-p2)',
                  marginBottom: '20px',
                  textShadow: `0 0 40px ${ap === 0 ? 'var(--color-p1)' : 'var(--color-p2)'}`,
                }}
              >
                Player {ap + 1}&apos;s Turn
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
                  boxShadow: '0 0 30px rgba(212, 168, 67, 0.5)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(212, 168, 67, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(212, 168, 67, 0.5)';
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
              <div 
                className="animate-victory animate-victory-glow"
                style={{
                  fontSize: '80px',
                  marginBottom: '10px',
                }}
              >
                🏆
              </div>
              <h1
                className="animate-victory-glow"
                style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: '72px',
                  color: 'var(--color-gold)',
                  marginBottom: '20px',
                }}
              >
                Victory!
              </h1>
              <p style={{ 
                fontSize: '32px', 
                color: '#fff', 
                marginBottom: '40px',
                textShadow: '0 0 20px rgba(255,255,255,0.3)',
              }}>
                Player {victory.winner + 1} Wins!
              </p>
              <button
                onClick={onBackToMenu}
                style={{
                  padding: '18px 56px',
                  background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-light))',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 0 40px rgba(212, 168, 67, 0.5)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 0 50px rgba(212, 168, 67, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(212, 168, 67, 0.5)';
                }}
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>
      </ScreenShake>
    </>
  );
}
