import { useRef, useEffect } from 'react';
import { EndTurnButton } from '../ui/ActionButtons';

interface SidebarProps {
  turn: number;
  phase: number;
  faction?: string;
  logs: string[];
  onNextPhase: () => void;
}

const PHASE_INFO = [
  { name: 'Refresh', icon: 'home', desc: 'Energy refills, units ready' },
  { name: 'Draw', icon: 'deck', desc: 'Draw 1 card from deck' },
  { name: 'Deploy', icon: 'deploy', desc: 'Play cards & deploy units' },
  { name: 'Movement', icon: 'move', desc: 'Move your units' },
  { name: 'Combat', icon: 'attack', desc: 'Attack enemy units' },
  { name: 'End', icon: 'endTurn', desc: 'Units gain XP, turn ends' },
];

export function SidebarEnhanced({ turn, phase, faction = 'kargath', logs, onNextPhase }: SidebarProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [logs.length]);

  const canAdvance = phase === 2 || phase === 3 || phase === 4;
  const isEnd = phase === 5;
  const currentPhase = PHASE_INFO[phase];
  const iconPath = `/assets/ui/icon_${currentPhase.icon}_${faction}.png`;

  return (
    <div className="sidebar" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      background: 'rgba(0,0,0,0.5)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      {/* Turn & Phase Section */}
      <div className="phase-section">
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '16px', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--gold)',
        }}>
          <img 
            src={`/assets/ui/icon_home_${faction}.png`} 
            alt="" 
            style={{ width: '20px', height: '20px', objectFit: 'contain' }}
          />
          <span>Turn {turn}</span>
        </div>

        {/* Current Phase Highlight */}
        <div style={{
          background: 'rgba(212,168,67,0.15)',
          border: '1px solid var(--gold)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 'bold',
            color: 'var(--gold)',
            fontSize: '14px',
          }}>
            <img 
              src={iconPath} 
              alt="" 
              style={{ width: '24px', height: '24px', objectFit: 'contain' }}
            />
            <span>{currentPhase.name} Phase</span>
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--dim)',
            marginTop: '6px',
            paddingLeft: '34px',
          }}>
            {currentPhase.desc}
          </div>
        </div>

        {/* Phase Tracker with Icons */}
        <div className="phase-list" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>
          {PHASE_INFO.map((info, i) => {
            const phaseIconPath = `/assets/ui/icon_${info.icon}_${faction}.png`;
            return (
              <div
                key={info.name}
                className={`phase-item ${i === phase ? 'active' : ''} ${i < phase ? 'done' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: i === phase ? 'rgba(212,168,67,0.2)' : i < phase ? 'rgba(74,222,128,0.1)' : 'transparent',
                  opacity: i < phase ? 0.6 : 1,
                }}
              >
                <img 
                  src={phaseIconPath} 
                  alt="" 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    objectFit: 'contain',
                    filter: i === phase ? 'brightness(1.2)' : i < phase ? 'grayscale(0.5)' : 'grayscale(1)',
                  }}
                />
                <span style={{ 
                  fontSize: '12px',
                  color: i === phase ? 'var(--gold)' : i < phase ? '#4ADE80' : '#888',
                }}>
                  {info.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* End Turn Button with Icon */}
        {(canAdvance || isEnd) && (
          <div style={{ marginTop: '16px' }}>
            {isEnd ? (
              <EndTurnButton 
                faction={faction}
                onClick={onNextPhase}
              />
            ) : (
              <button 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  fontSize: '14px', 
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }} 
                onClick={onNextPhase}
              >
                <img 
                  src={`/assets/ui/icon_end_turn_${faction}.png`} 
                  alt="" 
                  style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                />
                Next Phase
              </button>
            )}
          </div>
        )}
      </div>

      {/* Combat Log */}
      <div className="log-section" style={{
        flex: 1,
        overflowY: 'auto',
        maxHeight: '300px',
      }}>
        <div style={{
          fontSize: '12px',
          color: 'var(--dim)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <img 
            src={`/assets/ui/icon_deck_${faction}.png`} 
            alt="" 
            style={{ width: '14px', height: '14px', objectFit: 'contain' }}
          />
          Combat Log
        </div>
        {logs.length === 0 ? (
          <div className="log-empty" style={{
            textAlign: 'center',
            padding: '20px 10px',
            color: 'var(--dim)',
            fontStyle: 'italic',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
            <div>Combat log will appear here</div>
            <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7 }}>
              Actions, damage, and effects are recorded
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {logs.slice(-20).map((entry, i) => (
              <div 
                key={i} 
                className="log-entry"
                style={{
                  padding: '6px 8px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: '#CCC',
                  borderLeft: '2px solid rgba(212,168,67,0.5)',
                }}
              >
                {entry}
              </div>
            ))}
          </div>
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
