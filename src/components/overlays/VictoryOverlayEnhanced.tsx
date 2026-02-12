import { useEffect, useState } from 'react';

interface VictoryOverlayProps {
  winner: string;
  winnerFaction?: string;
  stats?: {
    turns?: number;
    cardsPlayed?: number;
    damageDealt?: number;
    unitsDeployed?: number;
  };
  onPlayAgain?: () => void;
  onMainMenu?: () => void;
}

export function VictoryOverlayEnhanced({ 
  winner, 
  winnerFaction = 'kargath',
  stats = {},
  onPlayAgain,
  onMainMenu 
}: VictoryOverlayProps) {
  const [showContent, setShowContent] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  
  const screenPath = `/assets/ui/screen_victory_${winnerFaction}.png`;
  
  useEffect(() => {
    // Delay content appearance for dramatic effect
    const timer = setTimeout(() => setShowContent(true), 500);
    
    // Generate confetti particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
    
    return () => clearTimeout(timer);
  }, []);
  
  const statItems = [
    { label: 'Turns', value: stats.turns ?? 0, icon: '⏱️' },
    { label: 'Cards Played', value: stats.cardsPlayed ?? 0, icon: '🎴' },
    { label: 'Damage Dealt', value: stats.damageDealt ?? 0, icon: '⚔️' },
    { label: 'Units Deployed', value: stats.unitsDeployed ?? 0, icon: '🚀' },
  ];
  
  return (
    <div
      className="victory-overlay-enhanced"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Background Image */}
      <img
        src={screenPath}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -2,
        }}
      />
      
      {/* Dark overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)',
          zIndex: -1,
        }}
      />
      
      {/* Confetti Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: '8px',
            height: '8px',
            background: ['#FFD700', '#FFA500', '#FF6347', '#4ADE80', '#60A5FA'][p.id % 5],
            borderRadius: '50%',
            animation: `confetti-fall 3s ease-out ${p.delay}s forwards`,
            opacity: 0,
            zIndex: 0,
          }}
        />
      ))}
      
      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          opacity: showContent ? 1 : 0,
          transform: showContent ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1,
        }}
      >
        {/* Winner Title */}
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '8px',
              background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF6347 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
              marginBottom: '8px',
            }}
          >
            VICTORY
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#fff',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            {winner} conquers the battlefield!
          </div>
        </div>
        
        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            padding: '24px',
            background: 'rgba(0,0,0,0.6)',
            borderRadius: '16px',
            border: '1px solid rgba(255,215,0,0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {statItems.map((stat, idx) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                opacity: showContent ? 1 : 0,
                transform: showContent ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${0.3 + idx * 0.1}s`,
              }}
            >
              <span style={{ fontSize: '28px' }}>{stat.icon}</span>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#FFD700',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: '#aaa',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            opacity: showContent ? 1 : 0,
            transform: showContent ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease 0.7s',
          }}
        >
          {onPlayAgain && (
            <button
              onClick={onPlayAgain}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(74, 222, 128, 0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(74, 222, 128, 0.6)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(74, 222, 128, 0.4)';
              }}
            >
              ⚔️ Play Again
            </button>
          )}
          
          {onMainMenu && (
            <button
              onClick={onMainMenu}
              style={{
                padding: '16px 40px',
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
              }}
            >
              🏠 Main Menu
            </button>
          )}
        </div>
      </div>
      
      {/* CSS Animation */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
