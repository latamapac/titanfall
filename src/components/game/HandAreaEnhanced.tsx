import type { CardDef } from '../../types/game';
import { CardEnhanced } from '../v2/CardEnhanced';

interface HandAreaProps {
  hand: CardDef[];
  activePlayer: number;
  playerFaction?: string;
  energy: number;
  phase: number;
  selectedIdx: number | null;
  onCardClick: (idx: number) => void;
}

export function HandAreaEnhanced({ hand, activePlayer, playerFaction, energy, phase, selectedIdx, onCardClick }: HandAreaProps) {
  const isDeployPhase = phase === 2;

  return (
    <div className="hand-section" style={{ 
      display: 'flex', 
      alignItems: 'center',
      padding: '10px 20px',
      gap: '16px',
      overflowX: 'auto',
      background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.3))',
    }}>
      {/* Hand Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: '12px',
        minWidth: '60px',
      }}>
        <div style={{ 
          fontSize: '12px', 
          fontWeight: 'bold',
          color: 'var(--gold)',
        }}>
          P{activePlayer + 1}
        </div>
        <div style={{ 
          fontSize: '10px', 
          color: 'var(--dim)',
        }}>
          {hand.length} cards
        </div>
        {!isDeployPhase && phase !== -1 && (
          <div style={{
            fontSize: '9px',
            color: '#f55',
            textAlign: 'center',
            marginTop: '4px',
            background: 'rgba(255,0,0,0.1)',
            padding: '2px 4px',
            borderRadius: '4px',
            maxWidth: '50px',
          }}>
            🔒 Deploy
          </div>
        )}
      </div>

      {/* Enhanced Cards */}
      {hand.map((card, i) => {
        const isSelected = selectedIdx === i;
        const canAfford = energy >= card.cost;
        const canPlay = isDeployPhase && canAfford;

        return (
          <div
            key={i}
            style={{
              transform: isSelected ? 'translateY(-20px)' : 'translateY(0)',
              transition: 'transform 0.2s ease',
              zIndex: isSelected ? 100 : hand.length - i,
            }}
            title={!canPlay && isDeployPhase ? `Need ${card.cost - energy} more energy` : card.text}
          >
            <CardEnhanced
              card={card}
              faction={playerFaction}
              isSelected={isSelected}
              canPlay={canPlay}
              onClick={() => onCardClick(i)}
            />
          </div>
        );
      })}

      {/* Empty hand message */}
      {hand.length === 0 && (
        <div style={{
          color: 'var(--dim)',
          fontStyle: 'italic',
          padding: '20px',
          textAlign: 'center',
        }}>
          No cards in hand
        </div>
      )}
    </div>
  );
}
