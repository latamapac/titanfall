import { useState } from 'react';
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
  epic: '0 0 15px rgba(167,139,250,0.4)',
  legendary: '0 0 20px rgba(212,168,67,0.5)',
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
  const elem = ELEMENTS[card.elem as keyof typeof ELEMENTS];
  const rarity = card.rarity || 'common';
  
  // Check if art exists
  const artPath = `/art/cards/${card.id}.png`;
  const hasArt = false; // Will check for generated art

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  return (
    <div
      className="card-v2"
      style={{
        width: isZoomed ? 200 : 140,
        height: isZoomed ? 280 : 200,
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: `3px solid ${isSelected ? 'var(--color-gold)' : rarityBorders[rarity]}`,
        boxShadow: isSelected 
          ? '0 0 30px rgba(212,168,67,0.6), 0 10px 30px rgba(0,0,0,0.5)'
          : isHovered
          ? `${rarityGlows[rarity]}, 0 20px 40px rgba(0,0,0,0.6)`
          : rarityGlows[rarity],
        transform: isHovered && !isZoomed ? 'translateY(-30px) scale(1.1)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: canPlay || onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        zIndex: isHovered ? 100 : 1,
        opacity: canPlay ? 1 : 0.6,
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card Art Area */}
      <div
        style={{
          height: '55%',
          background: hasArt
            ? `url(${artPath}) center/cover`
            : `linear-gradient(135deg, ${elem?.color}30, ${elem?.color}10)`,
          position: 'relative',
          borderBottom: `2px solid ${rarityBorders[rarity]}`,
        }}
      >
        {/* Cost Badge */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--color-mana)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-mono)',
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#000',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
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
            padding: '4px 8px',
            borderRadius: '4px',
            background: elem?.color || '#888',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: '#fff',
            letterSpacing: '1px',
          }}
        >
          {card.elem}
        </div>

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
              opacity: 0.5,
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
        }}
      >
        {/* Name */}
        <div
          style={{
            fontFamily: 'var(--font-header)',
            fontSize: '13px',
            fontWeight: 'bold',
            color: 'var(--color-gold)',
            lineHeight: 1.2,
            textAlign: 'center',
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
          background: rarityBorders[rarity],
        }}
      />
    </div>
  );
}
