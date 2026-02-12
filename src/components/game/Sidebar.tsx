import { useRef, useEffect } from 'react';
import { PHASES } from '../../data/constants';

interface SidebarProps {
  turn: number;
  phase: number;
  logs: string[];
  onNextPhase: () => void;
}

export function Sidebar({ turn, phase, logs, onNextPhase }: SidebarProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs.length]);

  const canAdvance = phase === 2 || phase === 3 || phase === 4;
  const isEnd = phase === 5;

  return (
    <div className="sidebar">
      <div className="phase-section">
        <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '4px' }}>
          Turn {turn}
        </div>
        <div className="phase-list">
          {PHASES.map((name, i) => (
            <div
              key={name}
              className={`phase-item ${i === phase ? 'active' : ''} ${i < phase ? 'done' : ''}`}
            >
              {name}
            </div>
          ))}
        </div>
        {canAdvance && (
          <button className="btn-primary" style={{ width: '100%', fontSize: '12px', padding: '6px' }} onClick={onNextPhase}>
            Next Phase →
          </button>
        )}
        {isEnd && (
          <button 
            className="btn-primary" 
            style={{ 
              width: '100%', 
              fontSize: '14px', 
              padding: '10px',
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
      <div className="log-section">
        {logs.length === 0 ? (
          <div className="log-empty">Combat log will appear here...</div>
        ) : (
          logs.map((entry, i) => (
            <div key={i} className="log-entry">{entry}</div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
