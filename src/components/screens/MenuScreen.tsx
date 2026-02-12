import { sfx } from '../../audio/SFX';

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
  const handleSoundToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const on = sfx.toggle();
    (e.target as HTMLButtonElement).textContent = on ? '🔊 Sound: ON' : '🔇 Sound: OFF';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      paddingTop: '60px',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(40,40,80,.6) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(80,40,30,.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(30,60,80,.3) 0%, transparent 40%)',
    }}>
      <h1>Titanfall Chronicles</h1>
      <p className="subtitle">A Tactical Fantasy Card Game</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '320px' }}>
        
        {/* PLAY Section */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(212,168,67,0.3)',
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--gold)', 
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '12px',
            fontWeight: 'bold',
          }}>
            ▶ Play
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              className="btn-primary" 
              onClick={onSingleBattle} 
              style={{ 
                width: '100%',
                background: 'linear-gradient(135deg, #4a2a6f, #2a1a4f)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '20px' }}>⚔️</span>
              <span>Single Battle</span>
              <span style={{ 
                fontSize: '10px', 
                background: 'rgba(255,255,255,0.2)', 
                padding: '2px 6px', 
                borderRadius: '4px',
                marginLeft: 'auto',
              }}>vs AI</span>
            </button>
            
            <button 
              className="btn-primary" 
              onClick={onLocalMultiplayer} 
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '20px' }}>👥</span>
              <span>Local Multiplayer</span>
            </button>
            
            <button 
              className="btn-primary" 
              onClick={onOnlineGame} 
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '20px' }}>🌐</span>
              <span>Online Game</span>
            </button>
            
            <button 
              disabled
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                justifyContent: 'center',
                padding: '12px 18px',
                borderRadius: '4px',
                fontSize: '14px',
                background: '#2a2a3a',
                color: '#666',
                border: '1px solid #444',
                cursor: 'not-allowed',
                opacity: 0.7,
              }}
            >
              <span style={{ fontSize: '20px' }}>📜</span>
              <span>Campaign</span>
              <span style={{ 
                fontSize: '10px', 
                background: '#444', 
                padding: '2px 6px', 
                borderRadius: '4px',
                marginLeft: 'auto',
              }}>🔒 Locked</span>
            </button>
          </div>
        </div>

        {/* TOOLS Section */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid rgba(68,136,255,0.3)',
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: '#4488ff', 
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '12px',
            fontWeight: 'bold',
          }}>
            🛠 Tools
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              className="btn-primary" 
              onClick={onDeckBuilder} 
              style={{ 
                width: '100%',
                background: 'var(--bg3)',
                borderColor: '#4488ff',
              }}
            >
              🃏 Deck Builder
            </button>
            <button 
              className="btn-primary" 
              onClick={onCardCreator} 
              style={{ 
                width: '100%',
                background: 'var(--bg3)',
                borderColor: '#4488ff',
              }}
            >
              ✨ Card Creator
            </button>
            <button 
              className="btn-primary" 
              onClick={onRules} 
              style={{ 
                width: '100%',
                background: 'var(--bg3)',
                borderColor: '#4488ff',
              }}
            >
              📖 Rules & Help
            </button>
          </div>
        </div>

        <button 
          className="btn-secondary" 
          onClick={handleSoundToggle} 
          style={{ width: '100%' }}
        >
          🔊 Sound: ON
        </button>
      </div>
    </div>
  );
}
