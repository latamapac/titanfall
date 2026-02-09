import { sfx } from '../../audio/SFX';

interface MenuScreenProps {
  onNewGame: () => void;
  onMultiplayer: () => void;
  onRules: () => void;
}

export function MenuScreen({ onNewGame, onMultiplayer, onRules }: MenuScreenProps) {
  const handleSoundToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const on = sfx.toggle();
    (e.target as HTMLButtonElement).textContent = on ? 'Sound: ON' : 'Sound: OFF';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '20px',
      paddingTop: '80px',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(40,40,80,.6) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(80,40,30,.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(30,60,80,.3) 0%, transparent 40%)',
    }}>
      <h1>Titanfall Chronicles</h1>
      <p className="subtitle">A Tactical Fantasy Card Game</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px' }}>
        <button className="btn-primary" onClick={onNewGame} style={{ width: '100%' }}>Local Game</button>
        <button className="btn-primary" onClick={onMultiplayer} style={{ width: '100%' }}>Multiplayer</button>
        <button className="btn-primary" onClick={onRules} style={{ width: '100%' }}>Rules &amp; Help</button>
        <button className="btn-secondary" onClick={handleSoundToggle} style={{ width: '100%' }}>Sound: ON</button>
      </div>
    </div>
  );
}
