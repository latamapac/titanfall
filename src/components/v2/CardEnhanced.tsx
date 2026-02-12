import { useState, useRef, useEffect } from 'react';
import type { CardDef } from '../../types/game';
import { ELEMENTS } from '../../data/constants';

interface CardProps {
  card: CardDef;
  faction?: string;
  isSelected?: boolean;
  canPlay?: boolean;
  isZoomed?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Map element to faction for frame selection
const elementToFaction: Record<string, string> = {
  fire: 'kargath',
  earth: 'thalor',
  wind: 'sylara',
  shadow: 'nyx',
  arcane: 'elandor',
};

export function CardEnhanced({
  card,
  faction,
  isSelected = false,
  canPlay = false,
  isZoomed = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDrawn, setIsDrawn] = useState(true);
  
  const elem = ELEMENTS[card.elem as keyof typeof ELEMENTS];
  const rarity = card.rarity || 'common';
  
  // Determine faction from card or element
  const cardFaction = faction || elementToFaction[card.elem] || 'kargath';
  
  // Card frame image path
  const framePath = `/assets/ui/card_frame_${rarity}_${cardFaction}.png`;
  
  // Card art path
  const artPath = `/art/cards/${card.id}.png`;
  const hasArt = false; // Will check for generated art

  // Preload frame image
  useEffect(() => {
    const img = new Image();
    img.src = framePath;
    img.onload = () => setImageLoaded(true);
  }, [framePath]);

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

  // Card dimensions
  const cardWidth = isZoomed ? 220 : 150;
  const cardHeight = isZoomed ? 308 : 210;

  return (
    <div
      ref={cardRef}
      className={`card-enhanced rarity-${rarity} ${isSelected ? 'selected' : ''} ${canPlay ? 'can-play' : ''} ${isDrawn ? 'animate-card-draw' : ''}`}
      style={{
        width: cardWidth,
        height: cardHeight,
        position: 'relative',
        cursor: canPlay || onClick ? 'pointer' : 'default',
        zIndex: isHovered ? 100 : isSelected ? 50 : 1,
        opacity: canPlay || !isHovered ? 1 : 0.7,
        transform: getTiltTransform(),
        transition: isHovered && !isZoomed 
          ? 'transform 0.1s ease-out, box-shadow 0.3s ease' 
          : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Card Frame Background */}
      <img
        src={framePath}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          zIndex: 1,
          filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
          transition: 'filter 0.3s ease',
        }}
      />

      {/* Card Art Area (inside frame) */}
      <div
        style={{
          position: 'absolute',
          top: cardHeight * 0.12,
          left: cardWidth * 0.1,
          right: cardWidth * 0.1,
          height: cardHeight * 0.45,
          background: hasArt
            ? `url(${artPath}) center/cover`
            : `linear-gradient(135deg, ${elem?.color}30, ${elem?.color}10)`,
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {/* Fallback Icon */}
        {!hasArt && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isZoomed ? '64px' : '40px',
              opacity: isHovered ? 0.8 : 0.6,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            {card.type === 'unit' ? '⚔️' : card.type === 'spell' ? '✨' : '🏛️'}
          </div>
        )}
      </div>

      {/* Cost Badge - Positioned in top-left of frame */}
      <div
        style={{
          position: 'absolute',
          top: cardHeight * 0.02,
          left: cardWidth * 0.04,
          width: isZoomed ? 40 : 28,
          height: isZoomed ? 40 : 28,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontWeight: 'bold',
          fontSize: isZoomed ? '18px' : '14px',
          color: '#000',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
          border: '2px solid rgba(255,255,255,0.3)',
          zIndex: 5,
        }}
      >
        {card.cost}
      </div>

      {/* Card Name - Positioned in name banner area */}
      <div
        style={{
          position: 'absolute',
          top: cardHeight * 0.58,
          left: cardWidth * 0.08,
          right: cardWidth * 0.08,
          textAlign: 'center',
          fontFamily: 'var(--font-header)',
          fontSize: isZoomed ? '16px' : '12px',
          fontWeight: 'bold',
          color: rarity === 'legendary' ? '#FFD700' : rarity === 'epic' ? '#E9D5FF' : '#F5F5F5',
          textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.5)',
          zIndex: 5,
          lineHeight: 1.2,
        }}
      >
        {card.name}
      </div>

      {/* Type & Race */}
      <div
        style={{
          position: 'absolute',
          top: cardHeight * 0.67,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: isZoomed ? '11px' : '9px',
          color: '#AAA',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          zIndex: 5,
        }}
      >
        {card.type}{card.race ? ` • ${card.race}` : ''}
      </div>

      {/* Description */}
      <div
        style={{
          position: 'absolute',
          top: cardHeight * 0.72,
          left: cardWidth * 0.08,
          right: cardWidth * 0.08,
          height: cardHeight * 0.14,
          fontSize: isZoomed ? '11px' : '9px',
          color: '#CCC',
          lineHeight: 1.3,
          textAlign: 'center',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          zIndex: 5,
        }}
      >
        {card.text}
      </div>

      {/* Stats - ATK bottom left, HP bottom right */}
      {card.type !== 'spell' && (
        <>
          {/* ATK */}
          <div
            style={{
              position: 'absolute',
              bottom: cardHeight * 0.04,
              left: cardWidth * 0.12,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: isZoomed ? '20px' : '16px',
              fontWeight: 'bold',
              color: '#FF6B6B',
              textShadow: '0 0 10px rgba(255, 107, 107, 0.6), 0 1px 2px rgba(0,0,0,0.8)',
              zIndex: 5,
            }}
          >
            {card.atk || 0}
          </div>

          {/* HP */}
          <div
            style={{
              position: 'absolute',
              bottom: cardHeight * 0.04,
              right: cardWidth * 0.12,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: isZoomed ? '20px' : '16px',
              fontWeight: 'bold',
              color: '#4ADE80',
              textShadow: '0 0 10px rgba(74, 222, 128, 0.6), 0 1px 2px rgba(0,0,0,0.8)',
              zIndex: 5,
            }}
          >
            {card.hp || 0}
          </div>
        </>
      )}

      {/* Selection glow overlay */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            inset: '-4px',
            borderRadius: '16px',
            boxShadow: '0 0 30px rgba(212, 168, 67, 0.8), inset 0 0 20px rgba(212, 168, 67, 0.3)',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Can play indicator glow */}
      {canPlay && !isSelected && (
        <div
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '14px',
            boxShadow: `0 0 20px ${elem?.color || '#4ADE80'}80, inset 0 0 10px ${elem?.color || '#4ADE80'}40`,
            zIndex: 0,
            pointerEvents: 'none',
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      {/* Shine effect on hover */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${50 + mousePos.x * 30}% ${50 + mousePos.y * 30}%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            pointerEvents: 'none',
            zIndex: 10,
            borderRadius: '12px',
          }}
        />
      )}
    </div>
  );
}
