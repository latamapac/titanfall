interface MenuScreenProps {
  onLocalMultiplayer: () => void;
  onOnlineGame: () => void;
  onSingleBattle: () => void;
  onRules: () => void;
  onDeckBuilder: () => void;
  onCardCreator: () => void;
}

export function MenuScreen({ 
  onLocalMultiplayer, 
  onOnlineGame, 
  onSingleBattle, 
  onRules,
  onDeckBuilder,
  onCardCreator
}: MenuScreenProps) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #0f0f1f 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
    }}>
      <h1 style={{
        fontFamily: '"Cinzel", serif',
        fontSize: '64px',
        fontWeight: 'bold',
        background: 'linear-gradient(180deg, #FFD700, #FFA500)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
        marginBottom: '40px',
      }}>
        Titanfall Chronicles
      </h1>
      
      <button
        onClick={onSingleBattle}
        style={{
          padding: '20px 60px',
          fontSize: '24px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #E84430, #8B2E1C)',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 10px 40px rgba(232, 68, 48, 0.4)',
          transition: 'all 0.3s ease',
        }}
      >
        ⚔️ Single Battle
      </button>

      <button
        onClick={onLocalMultiplayer}
        style={{
          padding: '16px 48px',
          fontSize: '18px',
          background: 'linear-gradient(135deg, #D4A030, #8B6914)',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(212, 160, 48, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        👥 Local Multiplayer
      </button>

      <button
        onClick={onOnlineGame}
        style={{
          padding: '16px 48px',
          fontSize: '18px',
          background: 'linear-gradient(135deg, #30D4C8, #1A8B84)',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '12px',
          color: '#fff',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(48, 212, 200, 0.3)',
          transition: 'all 0.3s ease',
        }}
      >
        🌐 Online Game
      </button>

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        <button
          onClick={onDeckBuilder}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          📚 Decks
        </button>
        <button
          onClick={onCardCreator}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          🎨 Cards
        </button>
        <button
          onClick={onRules}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          📖 Rules
        </button>
      </div>
    </div>
  );
}
