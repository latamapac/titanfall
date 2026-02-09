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
  return (
    <div className="hand-section">
      <div style={{ fontSize: '11px', color: 'var(--dim)', marginRight: '8px', whiteSpace: 'nowrap' }}>
        P{activePlayer + 1} Hand ({hand.length})
      </div>
      {hand.map((card, i) => {
        const elemInfo = ELEMENTS[card.elem as keyof typeof ELEMENTS];
        const isSelected = selectedIdx === i;
        const canPlay = phase === 2 && energy >= card.cost;
        const artHtml = getCardArt(card.id, card.type, card.elem);

        return (
          <div
            key={i}
            className={`card elem-${card.elem} rarity-${card.rarity} ${isSelected ? 'selected' : ''} ${!canPlay ? 'unplayable' : ''}`}
            onClick={() => onCardClick(i)}
          >
            <div className="c-cost">{card.cost}</div>
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
    </div>
  );
}
