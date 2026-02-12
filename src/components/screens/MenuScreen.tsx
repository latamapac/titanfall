import { useState } from 'react';
import { factions } from '../../styles/theme';

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Ambient particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${3 + Math.random() * 4}s`,
  }));

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: `
        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212, 160, 48, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse 60% 40% at 50% 100%, rgba(138, 48, 232, 0.1) 0%, transparent 40%),
        linear-gradient(180deg, #0a0a12 0%, #12121c 30%, #0d0d14 70%, #0a0a10 100%)
      `,
      overflow: 'auto',
      fontFamily: '"Cinzel", "Trajan Pro", serif',
    }}>
      {/* Animated particles */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed',
            left: p.left,
            top: p.top,
            width: '2px',
            height: '2px',
            background: 'rgba(212, 160, 48, 0.6)',
            borderRadius: '50%',
            animation: `float ${p.duration} ease-in-out ${p.delay} infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Subtle vignette */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
        }}>
          {/* Crossed Swords Icon */}
          <div style={{
            fontSize: '64px',
            marginBottom: '20px',
            filter: 'drop-shadow(0 0 30px rgba(212, 160, 48, 0.5))',
            animation: 'pulse-glow 4s ease-in-out infinite',
          }}>
            ⚔️
          </div>

          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(48px, 10vw, 80px)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            margin: 0,
            background: 'linear-gradient(180deg, #FFD700 0%, #D4A030 50%, #8B6914 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 60px rgba(212, 160, 48, 0.4)',
            position: 'relative',
          }}>
            TITANFALL
          </h1>

          {/* Subtitle */}
          <div style={{
            fontSize: 'clamp(16px, 3vw, 24px)',
            letterSpacing: '0.4em',
            color: 'rgba(255, 255, 255, 0.6)',
            marginTop: '8px',
            fontWeight: 300,
          }}>
            CHRONICLES
          </div>

          {/* Tagline */}
          <div style={{
            fontSize: '14px',
            color: 'rgba(212, 160, 48, 0.7)',
            marginTop: '12px',
            fontStyle: 'italic',
            fontFamily: '"Crimson Text", Georgia, serif',
            letterSpacing: '0.1em',
          }}>
            A Mythic Tactical Card Game
          </div>

          {/* Decorative divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '30px',
          }}>
            <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(212, 160, 48, 0.5))' }} />
            <div style={{
              width: '8px',
              height: '8px',
              background: '#D4A030',
              transform: 'rotate(45deg)',
              boxShadow: '0 0 10px rgba(212, 160, 48, 0.5)',
            }} />
            <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, rgba(212, 160, 48, 0.5), transparent)' }} />
          </div>
        </div>

        {/* PLAY Section */}
        <div style={{
          width: '100%',
          maxWidth: '500px',
          marginBottom: '40px',
        }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            paddingLeft: '10px',
          }}>
            <span style={{ fontSize: '14px', color: '#D4A030' }}>▶</span>
            <span style={{
              fontSize: '14px',
              letterSpacing: '0.3em',
              color: '#D4A030',
              fontWeight: 600,
            }}>PLAY</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(212, 160, 48, 0.5), transparent)' }} />
          </div>

          {/* Game Mode Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <GameModeCard
              icon="⚔️"
              title="Single Battle"
              subtitle="Face the AI"
              badge="VS AI"
              badgeColor={factions.kargath.colors.primary}
              onClick={onSingleBattle}
              isHovered={hoveredItem === 'single'}
              onHover={() => setHoveredItem('single')}
              onLeave={() => setHoveredItem(null)}
            />
            <GameModeCard
              icon="👥"
              title="Local Multiplayer"
              subtitle="Same device"
              onClick={onLocalMultiplayer}
              isHovered={hoveredItem === 'local'}
              onHover={() => setHoveredItem('local')}
              onLeave={() => setHoveredItem(null)}
            />
            <GameModeCard
              icon="🌐"
              title="Online Game"
              subtitle="Play worldwide"
              onClick={onOnlineGame}
              isHovered={hoveredItem === 'online'}
              onHover={() => setHoveredItem('online')}
              onLeave={() => setHoveredItem(null)}
            />
            <GameModeCard
              icon="📜"
              title="Campaign"
              subtitle="Coming soon"
              badge="LOCKED"
              badgeColor="#555"
              locked
              onClick={() => {}}
              isHovered={false}
              onHover={() => {}}
              onLeave={() => {}}
            />
          </div>
        </div>

        {/* FORGE Section */}
        <div style={{
          width: '100%',
          maxWidth: '500px',
        }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            paddingLeft: '10px',
          }}>
            <span style={{ fontSize: '14px' }}>🛠️</span>
            <span style={{
              fontSize: '14px',
              letterSpacing: '0.3em',
              color: '#888',
              fontWeight: 600,
            }}>FORGE</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(136, 136, 136, 0.5), transparent)' }} />
          </div>

          {/* Tool Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            <ToolCard
              icon="📚"
              title="Deck Builder"
              onClick={onDeckBuilder}
              isHovered={hoveredItem === 'decks'}
              onHover={() => setHoveredItem('decks')}
              onLeave={() => setHoveredItem(null)}
            />
            <ToolCard
              icon="🎨"
              title="Card Creator"
              onClick={onCardCreator}
              isHovered={hoveredItem === 'cards'}
              onHover={() => setHoveredItem('cards')}
              onLeave={() => setHoveredItem(null)}
            />
            <ToolCard
              icon="📖"
              title="Tome of Rules"
              onClick={onRules}
              isHovered={hoveredItem === 'rules'}
              onHover={() => setHoveredItem('rules')}
              onLeave={() => setHoveredItem(null)}
            />
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(212, 160, 48, 0.3)); }
          50% { filter: drop-shadow(0 0 40px rgba(212, 160, 48, 0.6)); }
        }
      `}</style>
    </div>
  );
}

// Game Mode Card Component
interface GameModeCardProps {
  icon: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  locked?: boolean;
  onClick: () => void;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function GameModeCard({ 
  icon, title, subtitle, badge, badgeColor = '#555', locked, 
  onClick, isHovered, onHover, onLeave 
}: GameModeCardProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      disabled={locked}
      style={{
        width: '100%',
        padding: '20px',
        background: locked 
          ? 'rgba(30, 30, 40, 0.5)'
          : isHovered 
            ? 'linear-gradient(135deg, rgba(40, 40, 60, 0.9), rgba(30, 30, 45, 0.9))'
            : 'linear-gradient(135deg, rgba(30, 30, 45, 0.8), rgba(20, 20, 30, 0.8))',
        border: locked
          ? '1px solid rgba(85, 85, 85, 0.3)'
          : isHovered
            ? '1px solid rgba(212, 160, 48, 0.5)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        cursor: locked ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
        boxShadow: isHovered && !locked
          ? '0 10px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 4px 20px rgba(0, 0, 0, 0.2)',
        textAlign: 'left',
      }}
    >
      {/* Icon */}
      <div style={{
        fontSize: '28px',
        filter: locked ? 'grayscale(100%) opacity(0.5)' : 'none',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        {icon}
      </div>

      {/* Text Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 600,
          color: locked ? '#666' : '#fff',
          marginBottom: '4px',
          fontFamily: '"Cinzel", serif',
          letterSpacing: '0.05em',
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '13px',
          color: locked ? '#444' : 'rgba(255, 255, 255, 0.5)',
          fontFamily: '"Crimson Text", Georgia, serif',
        }}>
          {subtitle}
        </div>
      </div>

      {/* Badge */}
      {badge && (
        <div style={{
          padding: '6px 12px',
          background: locked ? 'rgba(85, 85, 85, 0.3)' : `${badgeColor}30`,
          border: locked ? '1px solid rgba(85, 85, 85, 0.5)' : `1px solid ${badgeColor}80`,
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: locked ? '#555' : badgeColor,
          fontFamily: 'system-ui, sans-serif',
        }}>
          {badge}
        </div>
      )}
    </button>
  );
}

// Tool Card Component
interface ToolCardProps {
  icon: string;
  title: string;
  onClick: () => void;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function ToolCard({ icon, title, onClick, isHovered, onHover, onLeave }: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        padding: '16px 12px',
        background: isHovered
          ? 'rgba(40, 40, 55, 0.9)'
          : 'rgba(30, 30, 40, 0.6)',
        border: isHovered
          ? '1px solid rgba(212, 160, 48, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div style={{
        fontSize: '24px',
        transition: 'transform 0.3s ease',
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: '12px',
        color: isHovered ? '#D4A030' : 'rgba(255, 255, 255, 0.7)',
        fontWeight: 500,
        letterSpacing: '0.02em',
        transition: 'color 0.3s ease',
        fontFamily: '"Cinzel", serif',
      }}>
        {title}
      </div>
    </button>
  );
}
