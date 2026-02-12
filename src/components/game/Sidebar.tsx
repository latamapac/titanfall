import { useRef, useEffect } from 'react';

interface SidebarProps {
  turn: number;
  phase: number;
  logs: string[];
  onNextPhase: () => void;
}

const PHASE_INFO = [
  { name: 'Refresh', icon: '✨', desc: 'Energy refills, units ready' },
  { name: 'Draw', icon: '🃏', desc: 'Draw 1 card from deck' },
  { name: 'Deploy', icon: '🚀', desc: 'Play cards & deploy units' },
  { name: 'Movement', icon: '👣', desc: 'Move your units' },
  { name: 'Combat', icon: '⚔️', desc: 'Attack enemy units' },
  { name: 'End', icon: '🏁', desc: 'Units gain XP, turn ends' },
];

export function Sidebar({ turn, phase, logs, onNextPhase }: SidebarProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [logs.length]);

  const canAdvance = phase === 2 || phase === 3 || phase === 4;
  const isEnd = phase === 5;
  const currentPhase = PHASE_INFO[phase];

  return (
    <div className="sidebar">
      <div className="phase-section">
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '14px', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '16px' }}>🎮</span>
          <span>Turn {turn}</span>
        </div>

        {/* Current Phase Highlight */}
        <div style={{
          background: 'rgba(212,168,67,0.15)',
          border: '1px solid var(--gold)',
          borderRadius: '8px',
          padding: '10px',
          marginBottom: '12px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold',
            color: 'var(--gold)',
            fontSize: '14px',
          }}>
            <span style={{ fontSize: '18px' }}>{currentPhase.icon}</span>
            <span>{currentPhase.name} Phase</span>
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--dim)',
            marginTop: '4px',
          }}>
            {currentPhase.desc}
          </div>
        </div>

        {/* Phase List */}
        <div className="phase-list">
          {PHASE_INFO.map((info, i) => (
            <div
              key={info.name}
              className={`phase-item ${i === phase ? 'active' : ''} ${i < phase ? 'done' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '12px' }}>{info.icon}</span>
              <span>{info.name}</span>
            </div>
          ))}
        </div>

        {/* Phase Action Button */}
        {canAdvance && (
          <button 
            className="btn-primary" 
            style={{ width: '100%', fontSize: '13px', padding: '8px', marginTop: '10px' }} 
            onClick={onNextPhase}
          >
            Next Phase →
          </button>
        )}
        {isEnd && (
          <button 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              fontSize: '14px', 
              padding: '12px',
              marginTop: '10px',
              background: 'linear-gradient(135deg, var(--gold), #d4af37)',
              color: '#000',
              fontWeight: 'bold',
              animation: 'pulse 2s infinite',
            }} 
            onClick={onNextPhase}
          >
            🔄 END TURN
          </button>
        )}
      </div>

      {/* Combat Log */}
      <div className="log-section">
        <div style={{
          fontSize: '11px',
          color: 'var(--dim)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px',
          padding: '0 4px',
        }}>
          📜 Combat Log
        </div>
        {logs.length === 0 ? (
          <div className="log-empty" style={{
            textAlign: 'center',
            padding: '20px 10px',
            color: 'var(--dim)',
            fontStyle: 'italic',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📜</div>
            <div>Combat log will appear here</div>
            <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.7 }}>
              Actions, damage, and effects are recorded
            </div>
          </div>
        ) : (
          logs.slice(-20).map((entry, i) => (
            <div key={i} className="log-entry">{entry}</div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
