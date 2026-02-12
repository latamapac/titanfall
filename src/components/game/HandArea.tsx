import type { CardDef } from '../../types/game';
import { ELEMENTS } from '../../data/constants';
import { getCardArt } from '../../art/CardArt';

interface HandAreaProps {
  hand: CardDef[];
  activePlayer: number;
  energy: number;
  phase: number;
  selectedIdx: number | null;
  onCardClick: (idx: number) => void;
}

export function HandArea({ hand, activePlayer, energy, phase, selectedIdx, onCardClick }: HandAreaProps) {
  const isDeployPhase = phase === 2;

  return (
    <div className="hand-section">
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
        {!isDeployPhase && (
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
            🔒 Deploy only
          </div>
        )}
      </div>

      {/* Cards */}
      {hand.map((card, i) => {
        const elemInfo = ELEMENTS[card.elem as keyof typeof ELEMENTS];
        const isSelected = selectedIdx === i;
        const canAfford = energy >= card.cost;
        const canPlay = isDeployPhase && canAfford;
        const artHtml = getCardArt(card.id, card.type, card.elem);

        // Determine why card is unplayable
        let unplayableReason = '';
        if (!isDeployPhase) {
          unplayableReason = 'Deploy phase only';
        } else if (!canAfford) {
          unplayableReason = `Need ${card.cost - energy} more energy`;
        }

        return (
          <div
            key={i}
            className={`card elem-${card.elem} rarity-${card.rarity} ${isSelected ? 'selected' : ''} ${!canPlay ? 'unplayable' : ''}`}
            onClick={() => onCardClick(i)}
            title={unplayableReason || `${card.name}: ${card.text}`}
          >
            {/* Cost with afford indicator */}
            <div className={`c-cost ${!canAfford && isDeployPhase ? 'unaffordable' : ''}`}>
              {card.cost}
              {!canAfford && isDeployPhase && (
                <span style={{ 
                  position: 'absolute', 
                  top: '-8px', 
                  right: '-8px',
                  fontSize: '10px',
                  color: '#f55',
                  background: 'rgba(0,0,0,0.8)',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>!</span>
              )}
            </div>

            {/* Phase lock indicator */}
            {!isDeployPhase && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24px',
                opacity: 0.5,
                pointerEvents: 'none',
              }}>
                🔒
              </div>
            )}

            <div className="c-name">{card.name}</div>
            <div className="c-art" dangerouslySetInnerHTML={{ __html: artHtml }} />
            <div className="c-type">{card.type}{card.race ? ` - ${card.race}` : ''}</div>
            <div className="c-text">{card.text}</div>
            <div className="c-bottom">
              {card.type !== 'spell' ? (
                <>
                  <span className="c-atk">{card.atk ?? 0}</span>
                  <span className="c-elem-badge" style={{ background: elemInfo?.color ?? '#888' }}>{card.elem}</span>
                  <span className="c-hp">{card.hp ?? 0}</span>
                </>
              ) : (
                <span className="c-elem-badge" style={{ background: elemInfo?.color ?? '#888', margin: '0 auto' }}>{card.elem}</span>
              )}
            </div>
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
