import { useEffect, useState, useCallback } from 'react';

interface TurnOverlayProps {
  playerIdx: number;
  onDismiss: () => void;
}

const AUTO_DISMISS_SECONDS = 5;

export function TurnOverlay({ playerIdx, onDismiss }: TurnOverlayProps) {
  const [secondsLeft, setSecondsLeft] = useState(AUTO_DISMISS_SECONDS);

  const handleDismiss = useCallback(() => {
    onDismiss();
  }, [onDismiss]);

  // Allow dismissing with Escape key or Space key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDismiss]);

  // Auto-dismiss countdown
  useEffect(() => {
    if (secondsLeft <= 0) {
      handleDismiss();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, handleDismiss]);

  const progressPct = (secondsLeft / AUTO_DISMISS_SECONDS) * 100;

  return (
    <div className="overlay active" onClick={handleDismiss} style={{ cursor: 'pointer' }}>
      <h2 style={{ fontSize: '3em', marginBottom: '20px' }}>
        {playerIdx === 0 ? '🔵' : '🔴'} Player {playerIdx + 1}'s Turn
      </h2>
      <p style={{ color: 'var(--dim)', fontSize: '18px', marginBottom: '30px' }}>
        Click anywhere or press SPACE to continue
      </p>
      
      {/* Progress bar */}
      <div style={{
        width: '300px',
        height: '6px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '3px',
        marginBottom: '20px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progressPct}%`,
          height: '100%',
          background: 'var(--gold)',
          transition: 'width 1s linear',
        }} />
      </div>

      <p style={{ color: 'var(--dim)', fontSize: '14px', marginBottom: '20px' }}>
        Auto-starting in {secondsLeft}s...
      </p>

      <button 
        style={{
          padding: '15px 40px',
          fontSize: '18px',
          background: 'var(--gold)',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
        onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
      >
        Start Turn
      </button>
    </div>
  );
}
