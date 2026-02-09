interface VictoryOverlayProps {
  winner: number;
  onBackToMenu: () => void;
}

export function VictoryOverlay({ winner, onBackToMenu }: VictoryOverlayProps) {
  return (
    <div className="overlay active">
      <h2>Player {winner + 1} Wins!</h2>
      <p style={{ color: 'var(--dim)', fontSize: '16px' }}>Victory achieved</p>
      <button className="btn-primary" onClick={onBackToMenu} style={{ marginTop: '10px' }}>
        Back to Menu
      </button>
    </div>
  );
}
