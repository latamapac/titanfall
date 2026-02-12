interface RulesScreenProps {
  onBack: () => void;
}

export function RulesScreen({ onBack }: RulesScreenProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f1f 100%)',
      padding: '40px',
      overflowY: 'auto',
    }}>
      <h2 style={{
        fontFamily: '"Cinzel", serif',
        fontSize: '48px',
        color: '#FFD700',
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        How to Play
      </h2>
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        color: '#fff',
        lineHeight: 1.6,
      }}>
        <h3>Game Phases</h3>
        <ol>
          <li><strong>Refresh</strong> - Energy refills to 10</li>
          <li><strong>Draw</strong> - Draw 1 card</li>
          <li><strong>Deploy</strong> - Play cards (2 deploys)</li>
          <li><strong>Movement</strong> - Move units</li>
          <li><strong>Combat</strong> - Attack enemies</li>
          <li><strong>End</strong> - Turn ends</li>
        </ol>
      </div>
      
      <button
        onClick={onBack}
        style={{
          marginTop: '40px',
          padding: '16px 32px',
          background: 'transparent',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          color: '#fff',
          cursor: 'pointer',
          display: 'block',
          margin: '40px auto 0',
        }}
      >
        ← Back
      </button>
    </div>
  );
}
