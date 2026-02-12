import { useEffect, useState } from 'react';

interface VictoryOverlayProps {
  winner: number;
  onBackToMenu: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

export function VictoryOverlay({ winner, onBackToMenu }: VictoryOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showFlash, setShowFlash] = useState(true);

  // Generate celebration particles
  useEffect(() => {
    const colors = ['#d4a843', '#ff8800', '#4488ff', '#a855f5', '#e84430', '#30b8c8'];
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
      });
    }
    setParticles(newParticles);

    // Flash effect
    const flashTimer = setTimeout(() => setShowFlash(false), 300);
    return () => clearTimeout(flashTimer);
  }, []);

  const winnerColor = winner === 0 ? '#4a8af5' : '#f54a4a';
  const winnerEmoji = winner === 0 ? '🔵' : '🔴';

  return (
    <div className="overlay active victory-overlay">
      {/* Flash effect */}
      {showFlash && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: winnerColor,
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'opacity 0.3s ease-out',
        }} />
      )}

      {/* Celebration particles */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: '8px',
            height: '8px',
            background: p.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            animation: `confetti-fall 3s ease-out ${p.delay}s forwards`,
            zIndex: 1000,
          }}
        />
      ))}

      <div style={{
        animation: 'victory-pop 0.5s ease-out',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '5em',
          marginBottom: '10px',
          animation: 'victory-bounce 1s ease-in-out infinite',
        }}>
          🏆
        </div>
        
        <h2 style={{
          fontSize: '3.5em',
          marginBottom: '10px',
          color: winnerColor,
          textShadow: `0 0 30px ${winnerColor}80`,
        }}>
          {winnerEmoji} Player {winner + 1} Wins!
        </h2>
        
        <p style={{ 
          color: 'var(--dim)', 
          fontSize: '20px',
          marginBottom: '30px',
        }}>
          Victory achieved through tactical mastery
        </p>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
        }}>
          <button 
            className="btn-primary" 
            onClick={onBackToMenu}
            style={{ 
              marginTop: '10px',
              fontSize: '18px',
              padding: '15px 40px',
            }}
          >
            🎮 Play Again
          </button>
        </div>
      </div>

      <style>{`
        @keyframes victory-pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes victory-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes confetti-fall {
          0% { 
            transform: translateY(-100vh) rotate(0deg); 
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
