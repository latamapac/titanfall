import { useState, useMemo, useEffect } from 'react';
import { ELEMENTS } from '../../data/constants';
import { getCardPool, saveDeckToStorage, loadDeckFromStorage, getSavedDeckNames, deleteDeckFromStorage } from '../../engine/utils';
import type { CardDef } from '../../types/game';
import { getCardArt } from '../../art/CardArt';

interface DeckBuilderScreenProps {
  onBack: () => void;
}

export function DeckBuilderScreen({ onBack }: DeckBuilderScreenProps) {
  const [deck, setDeck] = useState<string[]>([]);
  const [deckName, setDeckName] = useState('');
  const [savedDecks, setSavedDecks] = useState<string[]>([]);
  const [filterElem, setFilterElem] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterRarity, setFilterRarity] = useState<string>('');
  const [search, setSearch] = useState('');

  const cardPool = useMemo(() => getCardPool(), []);

  useEffect(() => {
    setSavedDecks(getSavedDeckNames());
  }, []);

  const filteredCards = useMemo(() => {
    return cardPool.filter(c => {
      if (filterElem && c.elem !== filterElem) return false;
      if (filterType && c.type !== filterType) return false;
      if (filterRarity && c.rarity !== filterRarity) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [cardPool, filterElem, filterType, filterRarity, search]);

  const deckCards = useMemo(() => {
    return deck.map(id => cardPool.find(c => c.id === id)).filter(Boolean) as CardDef[];
  }, [deck, cardPool]);

  const addToDeck = (cardId: string) => {
    if (deck.length >= 30) return;
    setDeck([...deck, cardId]);
  };

  const removeFromDeck = (index: number) => {
    const newDeck = [...deck];
    newDeck.splice(index, 1);
    setDeck(newDeck);
  };

  const saveDeck = () => {
    if (!deckName.trim() || deck.length !== 30) return;
    saveDeckToStorage(deckName.trim(), deck);
    setSavedDecks(getSavedDeckNames());
    alert('Deck saved!');
  };

  const loadDeck = (name: string) => {
    const loaded = loadDeckFromStorage(name);
    if (loaded) {
      setDeck(loaded);
      setDeckName(name);
    }
  };

  const deleteDeck = (name: string) => {
    deleteDeckFromStorage(name);
    setSavedDecks(getSavedDeckNames());
    if (deckName === name) {
      setDeck([]);
      setDeckName('');
    }
  };

  const clearDeck = () => {
    setDeck([]);
    setDeckName('');
  };

  const costCurve = useMemo(() => {
    const curve: Record<number, number> = {};
    deckCards.forEach(c => {
      curve[c.cost] = (curve[c.cost] || 0) + 1;
    });
    return curve;
  }, [deckCards]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '20px' }}>
      <h2>Deck Builder</h2>
      
      <div className="db-filter" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <select value={filterElem} onChange={e => setFilterElem(e.target.value)}>
          <option value="">All Elements</option>
          {Object.keys(ELEMENTS).map(e => (
            <option key={e} value={e}>{ELEMENTS[e as keyof typeof ELEMENTS].name}</option>
          ))}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="unit">Unit</option>
          <option value="spell">Spell</option>
          <option value="structure">Structure</option>
        </select>
        <select value={filterRarity} onChange={e => setFilterRarity(e.target.value)}>
          <option value="">All Rarities</option>
          <option value="common">Common</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
        <input 
          type="text" 
          placeholder="Search..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ minWidth: '150px' }}
        />
      </div>

      <div className="db-container" style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
        {/* Card Pool */}
        <div className="db-pool" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: '6px', alignContent: 'flex-start', padding: '10px', background: 'var(--bg2)', borderRadius: '6px' }}>
          {filteredCards.map(card => (
            <div 
              key={card.id}
              onClick={() => addToDeck(card.id)}
              style={{ cursor: 'pointer', transform: 'scale(0.65)', transformOrigin: 'top left', marginBottom: '-50px', marginRight: '-35px' }}
            >
              <MiniCard card={card} />
            </div>
          ))}
        </div>

        {/* Deck Panel */}
        <div className="db-deck" style={{ width: '320px', display: 'flex', flexDirection: 'column', background: 'var(--bg2)', borderRadius: '6px', padding: '15px' }}>
          <h3>Deck ({deck.length}/30)</h3>
          
          {/* Cost Curve */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '10px', height: '40px', alignItems: 'flex-end' }}>
            {[1,2,3,4,5,6,7,8,9].map(cost => (
              <div key={cost} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  background: 'var(--gold)', 
                  height: `${Math.min((costCurve[cost] || 0) * 8, 32)}px`,
                  borderRadius: '2px 2px 0 0'
                }} />
                <span style={{ fontSize: '10px', color: 'var(--dim)' }}>{cost}</span>
              </div>
            ))}
          </div>

          <div className="db-deck-list" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px', margin: '8px 0' }}>
            {deckCards.map((card, i) => (
              <div 
                key={i}
                className="db-deck-item"
                onClick={() => removeFromDeck(i)}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '6px 10px',
                  background: 'var(--bg)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                <span>
                  <span style={{ color: '#4a9eff', fontWeight: 'bold', marginRight: '6px' }}>{card.cost}</span>
                  {card.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--dim)', textTransform: 'capitalize' }}>{card.elem}</span>
              </div>
            ))}
          </div>

          <div className="db-controls" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <input 
              value={deckName}
              onChange={e => setDeckName(e.target.value)}
              placeholder="Deck name..."
              style={{ flex: 1, minWidth: '100px' }}
            />
            <button 
              className="btn-secondary btn-sm"
              onClick={saveDeck}
              disabled={deck.length !== 30 || !deckName.trim()}
            >
              Save
            </button>
            <select 
              value="" 
              onChange={e => e.target.value && loadDeck(e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="">Load deck...</option>
              {savedDecks.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <button className="btn-danger btn-sm" onClick={clearDeck}>Clear</button>
          </div>

          {savedDecks.length > 0 && (
            <div style={{ marginTop: '10px', fontSize: '12px' }}>
              <div style={{ color: 'var(--dim)', marginBottom: '5px' }}>Saved Decks:</div>
              {savedDecks.map(name => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
                  <span style={{ cursor: 'pointer', color: 'var(--gold)' }} onClick={() => loadDeck(name)}>{name}</span>
                  <button onClick={() => deleteDeck(name)} style={{ fontSize: '10px', padding: '2px 6px' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="btn-secondary back-btn" style={{ marginTop: '15px' }} onClick={onBack}>Back</button>
    </div>
  );
}

function MiniCard({ card }: { card: CardDef }) {
  const elemInfo = ELEMENTS[card.elem as keyof typeof ELEMENTS];
  const artHtml = getCardArt(card.id, card.type, card.elem);

  return (
    <div 
      className={`card elem-${card.elem} rarity-${card.rarity}`}
      style={{ width: '110px', minWidth: '110px', height: '155px' }}
    >
      <div className="c-cost">{card.cost}</div>
      <div className="c-name">{card.name}</div>
      <div className="c-art" dangerouslySetInnerHTML={{ __html: artHtml }} />
      <div className="c-type">{card.type}{card.race ? ` - ${card.race}` : ''}</div>
      <div className="c-text" style={{ fontSize: '7px' }}>{card.text}</div>
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
}
