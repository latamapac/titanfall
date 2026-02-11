import { useState, useRef, useEffect } from 'react';
import type { CardDef } from '../../types/game';
import { ELEMENTS } from '../../data/constants';

interface CardProps {
  card: CardDef;
  isSelected?: boolean;
  canPlay?: boolean;
  isZoomed?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const rarityBorders = {
  common: '#888',
  rare: '#4A9EFF',
  epic: '#A78BFA',
  legendary: '#D4A843',
};

const rarityGlows = {
  common: '0 0 10px rgba(136,136,136,0.3)',
  rare: '0 0 15px rgba(74,158,255,0.4)',
  epic: '0 0 20px rgba(167,139,250,0.5)',
  legendary: '0 0 30px rgba(212,168,67,0.6)',
};

const rarityHoverGlows = {
  common: '0 0 20px rgba(136,136,136,0.5), 0 20px 40px rgba(0,0,0,0.6)',
  rare: '0 0 30px rgba(74,158,255,0.6), 0 20px 40px rgba(0,0,0,0.6)',
  epic: '0 0 35px rgba(167,139,250,0.7), 0 20px 40px rgba(0,0,0,0.6)',
  legendary: '0 0 40px rgba(212,168,67,0.8), 0 0 60px rgba(212,168,67,0.4), 0 20px 50px rgba(0,0,0,0.7)',
};

const raritySelectedGlows = {
  common: '0 0 25px rgba(136,136,136,0.7), inset 0 0 15px rgba(136,136,136,0.3)',
  rare: '0 0 35px rgba(74,158,255,0.8), inset 0 0 20px rgba(74,158,255,0.3)',
  epic: '0 0 40px rgba(167,139,250,0.9), inset 0 0 25px rgba(167,139,250,0.4)',
  legendary: '0 0 50px rgba(212,168,67,1), 0 0 80px rgba(212,168,67,0.5), inset 0 0 30px rgba(212,168,67,0.5)',
};

export function Card({
  card,
  isSelected = false,
  canPlay = false,
  isZoomed = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDrawn, setIsDrawn] = useState(true);
  
  const elem = ELEMENTS[card.elem as keyof typeof ELEMENTS];
  const rarity = card.rarity || 'common';
  
  // Check if art exists
  const artPath = `/art/cards/${card.id}.png`;
  const hasArt = false; // Will check for generated art

  // Draw animation on mount
  useEffect(() => {
    setIsDrawn(false);
    const timer = setTimeout(() => setIsDrawn(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
    onMouseLeave?.();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isZoomed) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Calculate 3D tilt transform
  const getTiltTransform = () => {
    if (!isHovered || isZoomed || isSelected) return 'scale(1)';
    const rotateX = -mousePos.y * 10;
    const rotateY = mousePos.x * 10;
    return `translateY(-25px) scale(1.08) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  // Get glow color based on element
  const getElementGlow = () => {
    if (!elem) return '';
    return `0 0 30px ${elem.color}40, 0 0 60px ${elem.color}20`;
  };

  return (
    <div
      ref={cardRef}
      className={`card-v2 ${rarity === 'legendary' ? 'card-shine' : ''} ${isDrawn ? 'animate-card-draw' : ''}`}
      style={{
        width: isZoomed ? 200 : 140,
        height: isZoomed ? 280 : 200,
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: `3px solid ${isSelected ? 'var(--color-gold)' : rarityBorders[rarity]}`,
        boxShadow: isSelected 
          ? raritySelectedGlows[rarity]
          : isHovered && canPlay
          ? `${rarityHoverGlows[rarity]}, ${getElementGlow()}`
          : rarityGlows[rarity],
        transform: getTiltTransform(),
        transition: isHovered && !isZoomed 
          ? 'transform 0.1s ease-out, box-shadow 0.3s ease' 
          : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: canPlay || onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        zIndex: isHovered ? 100 : isSelected ? 50 : 1,
        opacity: canPlay ? 1 : 0.6,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Shine effect overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isHovered 
            ? `radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
            : 'none',
          pointerEvents: 'none',
          zIndex: 10,
          transition: 'background 0.2s ease-out',
          borderRadius: '10px',
        }}
      />

      {/* Selection glow ring */}
      {isSelected && (
        <div
          className="selection-ring"
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '16px',
            padding: '3px',
            background: 'linear-gradient(90deg, #D4A843, #E8C97A, #FFD700, #E8C97A, #D4A843)',
            backgroundSize: '200% 100%',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'selectionRotate 2s linear infinite',
            zIndex: -1,
          }}
        />
      )}

      {/* Can play indicator */}
      {canPlay && !isSelected && (
        <div
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '14px',
            border: '2px solid transparent',
            background: `linear-gradient(90deg, ${elem?.color || '#4ADE80'}, ${elem?.color ? adjustBrightness(elem.color, 30) : '#86EFAC'}, ${elem?.color || '#4ADE80'}) border-box`,
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            backgroundSize: '200% 100%',
            animation: 'selectionRotate 3s linear infinite',
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.3s ease',
            zIndex: -1,
          }}
        />
      )}
      
      {/* Card Art Area */}
      <div
        style={{
          height: '55%',
          background: hasArt
            ? `url(${artPath}) center/cover`
            : `linear-gradient(135deg, ${elem?.color}40, ${elem?.color}15)`,
          position: 'relative',
          borderBottom: `2px solid ${rarityBorders[rarity]}`,
          overflow: 'hidden',
        }}
      >
        {/* Gradient overlay for depth */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isHovered 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)'
              : 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3) 100%)',
            transition: 'background 0.3s ease',
          }}
        />

        {/* Cost Badge */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-mana), #6BB6FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#000',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
            border: '2px solid rgba(255,255,255,0.2)',
            zIndex: 5,
          }}
        >
          {card.cost}
        </div>

        {/* Element Badge */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            padding: '4px 10px',
            borderRadius: '4px',
            background: elem?.color || '#888',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: '#fff',
            letterSpacing: '1px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.2)',
            zIndex: 5,
          }}
        >
          {card.elem}
        </div>

        {/* Rarity badge for legendary/epic */}
        {(rarity === 'legendary' || rarity === 'epic') && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '3px 10px',
              borderRadius: '10px',
              background: rarity === 'legendary' 
                ? 'linear-gradient(90deg, #D4A843, #E8C97A, #D4A843)'
                : 'linear-gradient(90deg, #A78BFA, #C4B5FD, #A78BFA)',
              fontSize: '8px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: rarity === 'legendary' ? '#000' : '#fff',
              letterSpacing: '2px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              zIndex: 5,
            }}
          >
            {rarity}
          </div>
        )}

        {/* Fallback Icon */}
        {!hasArt && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              opacity: isHovered ? 0.7 : 0.5,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease',
              filter: isHovered ? 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' : 'none',
            }}
          >
            {card.type === 'unit' ? '⚔️' : card.type === 'spell' ? '✨' : '🏛️'}
          </div>
        )}
      </div>

      {/* Card Info */}
      <div
        style={{
          padding: '10px',
          height: '45%',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* Name */}
        <div
          style={{
            fontFamily: 'var(--font-header)',
            fontSize: '13px',
            fontWeight: 'bold',
            color: rarity === 'legendary' ? '#FFD700' : 'var(--color-gold)',
            lineHeight: 1.2,
            textAlign: 'center',
            textShadow: rarity === 'legendary' ? '0 0 10px rgba(255,215,0,0.5)' : 'none',
          }}
        >
          {card.name}
        </div>

        {/* Type & Race */}
        <div
          style={{
            fontSize: '10px',
            color: '#888',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textAlign: 'center',
          }}
        >
          {card.type}{card.race ? ` • ${card.race}` : ''}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '10px',
            color: '#aaa',
            lineHeight: 1.3,
            flex: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {card.text}
        </div>

        {/* Stats Bar */}
        {card.type !== 'spell' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto',
              paddingTop: '6px',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            {/* Attack */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'var(--color-danger)',
                textShadow: '0 0 10px rgba(248, 113, 113, 0.4)',
              }}
            >
              ⚔️ {card.atk || 0}
            </div>

            {/* Health */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '16px',
                fontWeight: 'bold',
                color: 'var(--color-success)',
                textShadow: '0 0 10px rgba(74, 222, 128, 0.4)',
              }}
            >
              ❤️ {card.hp || 0}
            </div>
          </div>
        )}
      </div>

      {/* Rarity Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: rarity === 'legendary'
            ? 'linear-gradient(90deg, #D4A843, #E8C97A, #FFD700, #E8C97A, #D4A843)'
            : rarityBorders[rarity],
          backgroundSize: rarity === 'legendary' ? '200% 100%' : '100%',
          animation: rarity === 'legendary' ? 'selectionRotate 3s linear infinite' : 'none',
        }}
      />
    </div>
  );
}

// Helper function to adjust color brightness
function adjustBrightness(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  ).toString(16).slice(1);
}
