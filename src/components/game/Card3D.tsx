import { useState, useRef, useEffect } from 'react';
import type { CardDef } from '../../types/game';
import { factions, rarity, animations } from '../../styles/theme';

interface Card3DProps {
  card: CardDef;
  faction?: string;
  isSelected?: boolean;
  canPlay?: boolean;
  isZoomed?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const elementToFaction: Record<string, string> = {
  fire: 'kargath',
  earth: 'thalor',
  wind: 'sylara',
  shadow: 'nyx',
  arcane: 'elandor',
};

export function Card3D({
  card,
  faction,
  isSelected = false,
  canPlay = false,
  isZoomed = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: Card3DProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const cardFaction = faction || elementToFaction[card.elem] || 'kargath';
  const factionTheme = factions[cardFaction as keyof typeof factions];
  const rarityTheme = rarity[card.rarity as keyof typeof rarity] || rarity.common;
  
  const framePath = `/assets/ui/card_frame_${card.rarity || 'common'}_${cardFaction}.png`;
  
  // 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isZoomed) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateX = (mouseY / (rect.height / 2)) * -15;
    const rotateY = (mouseX / (rect.width / 2)) * 15;
    
    setTilt({ x: rotateX, y: rotateY });
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    onMouseLeave?.();
  };
  
  // Card dimensions
  const width = isZoomed ? 280 : 180;
  const height = isZoomed ? 392 : 252;
  
  return (
    <div
      ref={cardRef}
      className={`card-3d ${isSelected ? 'selected' : ''} ${canPlay ? 'can-play' : ''}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width,
        height,
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `
          perspective(1000px)
          rotateX(${tilt.x}deg)
          rotateY(${tilt.y}deg)
          ${isHovered && !isZoomed ? 'translateY(-30px) scale(1.1)' : 'scale(1)'}
        `,
        transition: isHovered 
          ? 'transform 0.1s ease-out'
          : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: canPlay ? 'pointer' : 'default',
        zIndex: isHovered ? 100 : isSelected ? 50 : 1,
      }}
    >
      {/* Card Frame Background */}
      <div
        className="card-frame-container"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: isSelected
            ? `0 0 40px ${factionTheme.colors.glow}, 0 20px 60px rgba(0,0,0,0.5)`
            : isHovered && canPlay
            ? `0 30px 60px rgba(0,0,0,0.4), 0 0 30px ${factionTheme.colors.glow}`
            : '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        <img
          src={framePath}
          alt=""
          onLoad={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </div>
      
      {/* Shine Effect on Rares+ */}
      {card.rarity && ['rare', 'epic', 'legendary'].includes(card.rarity) && (
        <div
          className="card-shine"
          style={{
            position: 'absolute',
            inset: 0,
            background: rarityTheme.shine,
            backgroundSize: '200% 100%',
            animation: isHovered ? 'shine 2s infinite' : 'none',
            opacity: 0.6,
            pointerEvents: 'none',
            borderRadius: '16px',
          }}
        />
      )}
      
      {/* Card Content Overlay */}
      <div
        className="card-content"
        style={{
          position: 'absolute',
          inset: 0,
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'none',
        }}
      >
        {/* Cost Badge */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: isZoomed ? 44 : 32,
            height: isZoomed ? 44 : 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: animations.typography?.fontFamily?.mono || 'monospace',
            fontWeight: 'bold',
            fontSize: isZoomed ? '20px' : '16px',
            color: '#000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
            border: '2px solid rgba(255,255,255,0.3)',
            zIndex: 10,
          }}
        >
          {card.cost}
        </div>
        
        {/* Art Area (placeholder) */}
        <div
          style={{
            position: 'absolute',
            top: height * 0.1,
            left: width * 0.12,
            right: width * 0.12,
            height: height * 0.42,
            background: `linear-gradient(135deg, ${factionTheme.colors.dark}40, ${factionTheme.colors.primary}20)`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isZoomed ? '64px' : '48px',
          }}
        >
          {card.type === 'unit' ? '⚔️' : card.type === 'spell' ? '✨' : '🏛️'}
        </div>
        
        {/* Card Name */}
        <div
          style={{
            position: 'absolute',
            top: height * 0.56,
            left: width * 0.08,
            right: width * 0.08,
            textAlign: 'center',
            fontFamily: '"Cinzel", serif',
            fontSize: isZoomed ? '18px' : '13px',
            fontWeight: 'bold',
            color: rarityTheme.color,
            textShadow: `0 2px 4px rgba(0,0,0,0.8), 0 0 20px ${rarityTheme.glow}`,
            letterSpacing: '0.5px',
          }}
        >
          {card.name}
        </div>
        
        {/* Type Line */}
        <div
          style={{
            position: 'absolute',
            top: height * 0.65,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: isZoomed ? '11px' : '9px',
            color: '#AAA',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {card.type}{card.race ? ` • ${card.race}` : ''}
        </div>
        
        {/* Description */}
        <div
          style={{
            position: 'absolute',
            top: height * 0.7,
            left: width * 0.1,
            right: width * 0.1,
            height: height * 0.14,
            fontSize: isZoomed ? '12px' : '10px',
            color: '#CCC',
            lineHeight: 1.3,
            textAlign: 'center',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {card.text}
        </div>
        
        {/* Stats */}
        {card.type !== 'spell' && (
          <>
            {/* ATK */}
            <div
              style={{
                position: 'absolute',
                bottom: height * 0.04,
                left: width * 0.15,
                fontFamily: '"Cinzel", serif',
                fontSize: isZoomed ? '24px' : '18px',
                fontWeight: 'bold',
                color: '#FCA5A5',
                textShadow: '0 0 10px rgba(252, 165, 165, 0.6), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {card.atk || 0}
            </div>
            
            {/* HP */}
            <div
              style={{
                position: 'absolute',
                bottom: height * 0.04,
                right: width * 0.15,
                fontFamily: '"Cinzel", serif',
                fontSize: isZoomed ? '24px' : '18px',
                fontWeight: 'bold',
                color: '#86EFAC',
                textShadow: '0 0 10px rgba(134, 239, 172, 0.6), 0 2px 4px rgba(0,0,0,0.8)',
              }}
            >
              {card.hp || 0}
            </div>
          </>
        )}
      </div>
      
      {/* Hover Glow Overlay */}
      {isHovered && canPlay && (
        <div
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '20px',
            background: factionTheme.gradients.glow,
            opacity: 0.6,
            pointerEvents: 'none',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}
      
      {/* Selection Ring */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '22px',
            padding: '3px',
            background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
            backgroundSize: '200% 100%',
            animation: 'shine 3s linear infinite',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      )}
      
      {/* CSS Animations */}
      <style>{`
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
