import { useEffect } from 'react';

interface TurnOverlayProps {
  playerIdx: number;
  onDismiss: () => void;
}

export function TurnOverlay({ playerIdx, onDismiss }: TurnOverlayProps) {
  // Allow dismissing with Escape key or Space key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <div className="overlay active" onClick={onDismiss} style={{ cursor: 'pointer' }}>
      <h2 style={{ fontSize: '3em', marginBottom: '20px' }}>
        {playerIdx === 0 ? '🔵' : '🔴'} Player {playerIdx + 1}'s Turn
      </h2>
      <p style={{ color: 'var(--dim)', fontSize: '18px', marginBottom: '30px' }}>
        Click anywhere or press SPACE to continue
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
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
      >
        Start Turn
      </button>
    </div>
  );
}
