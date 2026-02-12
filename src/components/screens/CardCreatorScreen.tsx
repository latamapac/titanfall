interface CardCreatorScreenProps {
  onBack: () => void;
}

export function CardCreatorScreen({ onBack }: CardCreatorScreenProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f1f 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
    }}>
      <h2 style={{
        fontFamily: '"Cinzel", serif',
        fontSize: '48px',
        color: '#FFD700',
      }}>
        Card Creator
      </h2>
      <p style={{ color: '#888' }}>Coming soon...</p>
      <button
        onClick={onBack}
        style={{
          padding: '16px 32px',
          background: 'transparent',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '8px',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>
    </div>
  );
}
