import { useState } from 'react';
import { sfx } from '../../audio/SFX';
import { TITANS } from '../../data/titans';

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
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(true);

  const handleSoundToggle = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    sfx.toggle();
  };

  return (
    <div className="mythic-menu">
      {/* Animated Background */}
      <div className="menu-bg">
        <div className="bg-gradient" />
        <div className="bg-particles" />
        <div className="bg-glow top" />
        <div className="bg-glow bottom" />
      </div>

      {/* Main Container */}
      <div className="menu-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-icon">⚔️</div>
          <h1 className="game-title">
            <span className="title-main">TITANFALL</span>
            <span className="title-sub">CHRONICLES</span>
          </h1>
          <p className="tagline">A Mythic Tactical Card Game</p>
          <div className="title-decoration">
            <span className="decoration-line" />
            <span className="decoration-orb">◆</span>
            <span className="decoration-line" />
          </div>
        </div>

        {/* Menu Content */}
        <div className="menu-content">
          {/* Play Section */}
          <div 
            className={`menu-section ${hoveredSection === 'play' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredSection('play')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="section-header">
              <span className="section-icon">▶</span>
              <span className="section-title">Play</span>
              <span className="section-line" />
            </div>

            <div className="button-grid">
              <MythicButton 
                icon="⚔️"
                label="Single Battle"
                description="Face the AI"
                badge="vs AI"
                variant="primary"
                faction="kargath"
                onClick={onSingleBattle}
              />
              <MythicButton 
                icon="👥"
                label="Local Multiplayer"
                description="Same device"
                variant="secondary"
                faction="thaler"
                onClick={onLocalMultiplayer}
              />
              <MythicButton 
                icon="🌐"
                label="Online Game"
                description="Play worldwide"
                variant="secondary"
                faction="sylara"
                onClick={onOnlineGame}
              />
              <MythicButton 
                icon="📜"
                label="Campaign"
                description="Coming soon"
                badge="LOCKED"
                variant="locked"
                faction="nyx"
                onClick={() => {}}
                disabled
              />
            </div>
          </div>

          {/* Tools Section */}
          <div 
            className={`menu-section ${hoveredSection === 'tools' ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredSection('tools')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="section-header">
              <span className="section-icon">🛠</span>
              <span className="section-title">Forge</span>
              <span className="section-line" />
            </div>

            <div className="button-grid compact">
              <MythicButton 
                icon="🃏"
                label="Deck Builder"
                description="Craft your arsenal"
                variant="tertiary"
                faction="elandor"
                onClick={onDeckBuilder}
              />
              <MythicButton 
                icon="✨"
                label="Card Creator"
                description="Forge new legends"
                variant="tertiary"
                faction="elandor"
                onClick={onCardCreator}
              />
              <MythicButton 
                icon="📖"
                label="Tome of Rules"
                description="Master the arts"
                variant="tertiary"
                faction="thaler"
                onClick={onRules}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="menu-footer">
            <button 
              className="sound-toggle"
              onClick={handleSoundToggle}
            >
              {soundOn ? '🔊' : '🔇'} Sound {soundOn ? 'On' : 'Off'}
            </button>
            <div className="version-info">v2.0.0 Mythic Edition</div>
          </div>
        </div>

        {/* Titan Silhouettes Decoration */}
        <div className="titan-showcase">
          {TITANS.map((titan, i) => (
            <div 
              key={titan.id}
              className={`titan-silhouette ${titan.elem}`}
              style={{ 
                animationDelay: `${i * 0.2}s`,
                opacity: hoveredSection === 'play' ? 0.3 : 0.15
              }}
            >
              <span className="silhouette-icon">{titan.icon}</span>
              <div className="silhouette-glow" />
            </div>
          ))}
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .mythic-menu {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: #0a0a1a;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        /* Animated Background */
        .menu-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .bg-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(168, 85, 245, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(48, 184, 200, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(192, 57, 43, 0.1) 0%, transparent 40%);
        }

        .bg-particles {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.3), transparent),
            radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.2), transparent);
          background-size: 200px 200px;
          animation: particle-drift 20s linear infinite;
        }

        @keyframes particle-drift {
          from { transform: translateY(0); }
          to { transform: translateY(-200px); }
        }

        .bg-glow {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 300px;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
        }

        .bg-glow.top {
          top: -150px;
          background: radial-gradient(circle, rgba(168, 85, 245, 0.5), transparent 70%);
        }

        .bg-glow.bottom {
          bottom: -150px;
          background: radial-gradient(circle, rgba(48, 184, 200, 0.4), transparent 70%);
        }

        /* Main Container */
        .menu-container {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 600px;
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Logo Section */
        .logo-section {
          text-align: center;
          margin-bottom: 48px;
          animation: fade-in-up 0.8s ease-out;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-icon {
          font-size: 64px;
          margin-bottom: 16px;
          filter: drop-shadow(0 0 20px rgba(212, 168, 67, 0.5));
          animation: icon-float 3s ease-in-out infinite;
        }

        @keyframes icon-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .game-title {
          display: flex;
          flex-direction: column;
          margin: 0;
          line-height: 1;
        }

        .title-main {
          font-size: 48px;
          font-weight: 900;
          letter-spacing: 8px;
          color: #d4a843;
          text-shadow: 
            0 0 20px rgba(212, 168, 67, 0.5),
            0 0 40px rgba(212, 168, 67, 0.3),
            0 0 60px rgba(212, 168, 67, 0.1);
          background: linear-gradient(180deg, #f0d78c 0%, #d4a843 50%, #b8953b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-sub {
          font-size: 20px;
          font-weight: 300;
          letter-spacing: 12px;
          color: #888;
          margin-top: 8px;
          text-transform: uppercase;
        }

        .tagline {
          color: #666;
          font-style: italic;
          margin-top: 12px;
          font-size: 14px;
        }

        .title-decoration {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
        }

        .decoration-line {
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4a843, transparent);
        }

        .decoration-orb {
          color: #d4a843;
          font-size: 12px;
          animation: orb-pulse 2s ease-in-out infinite;
        }

        @keyframes orb-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* Menu Content */
        .menu-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        /* Menu Sections */
        .menu-section {
          background: rgba(22, 22, 58, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .menu-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(212, 168, 67, 0.5), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .menu-section.hovered::before {
          opacity: 1;
        }

        .menu-section.hovered {
          border-color: rgba(212, 168, 67, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .section-icon {
          font-size: 16px;
          color: #d4a843;
        }

        .section-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #d4a843;
        }

        .section-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(212, 168, 67, 0.5), transparent);
        }

        /* Button Grid */
        .button-grid {
          display: grid;
          gap: 12px;
        }

        .button-grid.compact {
          grid-template-columns: repeat(3, 1fr);
        }

        @media (max-width: 500px) {
          .button-grid.compact {
            grid-template-columns: 1fr;
          }
        }

        /* Footer */
        .menu-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sound-toggle {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #888;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .sound-toggle:hover {
          border-color: rgba(255, 255, 255, 0.4);
          color: #fff;
        }

        .version-info {
          font-size: 11px;
          color: #555;
        }

        /* Titan Showcase */
        .titan-showcase {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 40px;
          pointer-events: none;
          z-index: 0;
        }

        .titan-silhouette {
          font-size: 48px;
          opacity: 0.15;
          animation: silhouette-float 4s ease-in-out infinite;
          position: relative;
          transition: opacity 0.5s ease;
        }

        .titan-silhouette.fire { filter: drop-shadow(0 0 10px rgba(231, 76, 60, 0.5)); }
        .titan-silhouette.earth { filter: drop-shadow(0 0 10px rgba(139, 105, 20, 0.5)); }
        .titan-silhouette.wind { filter: drop-shadow(0 0 10px rgba(48, 184, 200, 0.5)); }
        .titan-silhouette.shadow { filter: drop-shadow(0 0 10px rgba(112, 48, 160, 0.5)); }
        .titan-silhouette.arcane { filter: drop-shadow(0 0 10px rgba(168, 85, 245, 0.5)); }

        @keyframes silhouette-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .silhouette-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, currentColor 0%, transparent 70%);
          opacity: 0.3;
          filter: blur(20px);
        }
      `}</style>
    </div>
  );
}

/* Mythic Button Component */
interface MythicButtonProps {
  icon: string;
  label: string;
  description: string;
  badge?: string;
  variant: 'primary' | 'secondary' | 'tertiary' | 'locked';
  faction: string;
  onClick: () => void;
  disabled?: boolean;
}

function MythicButton({ 
  icon, 
  label, 
  description, 
  badge,
  variant, 
  faction,
  onClick,
  disabled 
}: MythicButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getFactionColors = () => {
    switch (faction) {
      case 'kargath': return { primary: '#c0392b', glow: 'rgba(231, 76, 60, 0.5)' };
      case 'thaler': return { primary: '#8b6914', glow: 'rgba(184, 134, 11, 0.5)' };
      case 'sylara': return { primary: '#30b8c8', glow: 'rgba(48, 184, 200, 0.5)' };
      case 'nyx': return { primary: '#7030a0', glow: 'rgba(112, 48, 160, 0.5)' };
      case 'elandor': return { primary: '#a855f5', glow: 'rgba(168, 85, 245, 0.5)' };
      default: return { primary: '#d4a843', glow: 'rgba(212, 168, 67, 0.5)' };
    }
  };

  const colors = getFactionColors();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: `linear-gradient(135deg, ${colors.primary}22 0%, ${colors.primary}11 100%)`,
          borderColor: colors.primary,
          boxShadow: isHovered 
            ? `0 0 30px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`
            : `0 0 10px ${colors.glow}`,
        };
      case 'secondary':
        return {
          background: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.2)',
          boxShadow: isHovered 
            ? `0 0 20px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`
            : 'none',
        };
      case 'tertiary':
        return {
          background: 'transparent',
          borderColor: 'rgba(255,255,255,0.1)',
          boxShadow: 'none',
        };
      case 'locked':
        return {
          background: 'rgba(0,0,0,0.3)',
          borderColor: 'rgba(255,255,255,0.1)',
          boxShadow: 'none',
          opacity: 0.5,
        };
      default:
        return {};
    }
  };

  const styles = getVariantStyles();

  return (
    <button
      className={`mythic-button ${variant} ${isHovered ? 'hovered' : ''}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: variant === 'tertiary' ? '12px 16px' : '16px 20px',
        borderRadius: '12px',
        border: `1px solid ${styles.borderColor}`,
        background: styles.background,
        boxShadow: styles.boxShadow,
        opacity: styles.opacity,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        width: '100%',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Icon */}
      <span style={{
        fontSize: variant === 'tertiary' ? '20px' : '28px',
        filter: isHovered && !disabled ? `drop-shadow(0 0 10px ${colors.glow})` : 'none',
        transition: 'all 0.3s ease',
        transform: isHovered && !disabled ? 'scale(1.1)' : 'scale(1)',
      }}>
        {icon}
      </span>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: variant === 'tertiary' ? '13px' : '15px',
          fontWeight: 600,
          color: variant === 'locked' ? '#666' : '#fff',
          marginBottom: '2px',
        }}>
          {label}
        </div>
        <div style={{
          fontSize: variant === 'tertiary' ? '10px' : '11px',
          color: '#888',
        }}>
          {description}
        </div>
      </div>

      {/* Badge */}
      {badge && (
        <span style={{
          fontSize: '9px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '4px 8px',
          borderRadius: '4px',
          background: variant === 'locked' ? 'rgba(0,0,0,0.5)' : colors.primary + '33',
          color: variant === 'locked' ? '#666' : colors.primary,
          border: `1px solid ${variant === 'locked' ? '#444' : colors.primary + '66'}`,
        }}>
          {badge}
        </span>
      )}

      {/* Hover Glow Effect */}
      {isHovered && !disabled && variant !== 'locked' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${colors.glow} 0%, transparent 60%)`,
          opacity: 0.3,
          pointerEvents: 'none',
        }} />
      )}
    </button>
  );
}
