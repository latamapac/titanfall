interface TurnOverlayProps {
  playerIdx: number;
  onDismiss: () => void;
}

export function TurnOverlay({ playerIdx, onDismiss }: TurnOverlayProps) {
  return (
    <div className="overlay active" onClick={onDismiss}>
      <h2>Player {playerIdx + 1}'s Turn</h2>
      <p style={{ color: 'var(--dim)', fontSize: '14px' }}>Click anywhere to continue</p>
    </div>
  );
}
