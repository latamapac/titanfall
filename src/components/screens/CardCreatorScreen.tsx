import { useState, useEffect } from 'react';
import { ELEMENTS, RACES, KEYWORDS } from '../../data/constants';
import { saveCustomCard, getCustomCards, deleteCustomCard } from '../../engine/utils';
import type { CardDef, Race, Keyword } from '../../types/game';
import { getCardArt } from '../../art/CardArt';

interface CardCreatorScreenProps {
  onBack: () => void;
}

export function CardCreatorScreen({ onBack }: CardCreatorScreenProps) {
  const [savedCards, setSavedCards] = useState<CardDef[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [form, setForm] = useState<{
    name: string;
    cost: number;
    type: 'unit' | 'spell' | 'structure';
    elem: string;
    race: Race | '';
    atk: number;
    hp: number;
    move: number;
    range: number;
    kw: string[];
    text: string;
    rarity: string;
    vet1: string;
    vet2: string;
    vet3: string;
  }>({
    name: '',
    cost: 2,
    type: 'unit',
    elem: 'fire',
    race: '',
    atk: 1,
    hp: 1,
    move: 2,
    range: 1,
    kw: [],
    text: '',
    rarity: 'common',
    vet1: '',
    vet2: '',
    vet3: '',
  });

  useEffect(() => {
    setSavedCards(getCustomCards());
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      cost: 2,
      type: 'unit',
      elem: 'fire',
      race: '',
      atk: 1,
      hp: 1,
      move: 2,
      range: 1,
      kw: [],
      text: '',
      rarity: 'common',
      vet1: '',
      vet2: '',
      vet3: '',
    });
    setEditingId(null);
  };

  const generateId = (name: string) => {
    return 'custom_' + name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    
    const card: CardDef = {
      id: editingId || generateId(form.name),
      name: form.name.trim(),
      cost: form.cost,
      type: form.type,
      elem: form.elem as CardDef['elem'],
      race: (form.race as Race) || undefined,
      atk: form.type !== 'spell' ? form.atk : undefined,
      hp: form.type !== 'spell' ? form.hp : undefined,
      move: form.type === 'unit' ? form.move : undefined,
      range: form.type === 'unit' ? form.range : undefined,
      kw: (form.kw as Keyword[]) || [],
      text: form.text.trim() || '',
      rarity: form.rarity as CardDef['rarity'],
      vet1: form.vet1.trim() || '',
      vet2: form.vet2.trim() || '',
      vet3: form.vet3.trim() || '',
    };

    saveCustomCard(card);
    setSavedCards(getCustomCards());
    resetForm();
  };

  const handleEdit = (card: CardDef) => {
    setForm({
      name: card.name,
      cost: card.cost,
      type: card.type,
      elem: card.elem,
      race: (card.race as Race) || '',
      atk: card.atk ?? 1,
      hp: card.hp ?? 1,
      move: card.move ?? 2,
      range: card.range ?? 1,
      kw: card.kw ?? [],
      text: card.text ?? '',
      rarity: card.rarity,
      vet1: card.vet1 ?? '',
      vet2: card.vet2 ?? '',
      vet3: card.vet3 ?? '',
    });
    setEditingId(card.id);
  };

  const handleDelete = (id: string) => {
    deleteCustomCard(id);
    setSavedCards(getCustomCards());
    if (editingId === id) resetForm();
  };

  const toggleKeyword = (kw: string) => {
    setForm(prev => ({
      ...prev,
      kw: prev.kw.includes(kw) 
        ? prev.kw.filter(k => k !== kw)
        : [...prev.kw, kw]
    }));
  };

  const artHtml = getCardArt('preview', form.type, form.elem);
  const elemInfo = ELEMENTS[form.elem as keyof typeof ELEMENTS];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '20px' }}>
      <h2>Card Creator</h2>
      
      <div className="cc-container" style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'auto' }}>
        {/* Form */}
        <div className="cc-form" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', padding: '15px', background: 'var(--bg2)', borderRadius: '6px' }}>
          <div className="row" style={{ display: 'flex', gap: '10px' }}>
            <label style={{ flex: 2 }}>
              <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Name</span>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </label>
            <label style={{ flex: 1 }}>
              <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Cost</span>
              <input type="number" min={0} max={10} value={form.cost} onChange={e => setForm({...form, cost: parseInt(e.target.value) || 0})} />
            </label>
          </div>

          <div className="row" style={{ display: 'flex', gap: '10px' }}>
            <label style={{ flex: 1 }}>
              <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Type</span>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
                <option value="unit">Unit</option>
                <option value="spell">Spell</option>
                <option value="structure">Structure</option>
              </select>
            </label>
            <label style={{ flex: 1 }}>
              <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Element</span>
              <select value={form.elem} onChange={e => setForm({...form, elem: e.target.value as any})}>
                {Object.keys(ELEMENTS).map(e => (
                  <option key={e} value={e}>{ELEMENTS[e as keyof typeof ELEMENTS].name}</option>
                ))}
              </select>
            </label>
            <label style={{ flex: 1 }}>
              <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Rarity</span>
              <select value={form.rarity} onChange={e => setForm({...form, rarity: e.target.value as any})}>
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </label>
          </div>

          {form.type !== 'spell' && (
            <div className="row" style={{ display: 'flex', gap: '10px' }}>
              <label style={{ flex: 1 }}>
                <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Attack</span>
                <input type="number" min={0} max={20} value={form.atk} onChange={e => setForm({...form, atk: parseInt(e.target.value) || 0})} />
              </label>
              <label style={{ flex: 1 }}>
                <span style={{ color: 'var(--dim)', fontSize: '11px' }}>HP</span>
                <input type="number" min={1} max={30} value={form.hp} onChange={e => setForm({...form, hp: parseInt(e.target.value) || 1})} />
              </label>
              {form.type === 'unit' && (
                <>
                  <label style={{ flex: 1 }}>
                    <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Move</span>
                    <input type="number" min={0} max={5} value={form.move} onChange={e => setForm({...form, move: parseInt(e.target.value) || 0})} />
                  </label>
                  <label style={{ flex: 1 }}>
                    <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Range</span>
                    <input type="number" min={1} max={5} value={form.range} onChange={e => setForm({...form, range: parseInt(e.target.value) || 1})} />
                  </label>
                </>
              )}
            </div>
          )}

          <label>
            <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Race (optional)</span>
            <select value={form.race} onChange={e => setForm({...form, race: e.target.value as Race | ''})}>
              <option value="">None</option>
              {RACES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>

          <div>
            <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Keywords</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
              {KEYWORDS.slice(0, 15).map(kw => (
                <button
                  key={kw}
                  onClick={() => toggleKeyword(kw)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    background: form.kw.includes(kw) ? 'var(--gold)' : 'var(--bg)',
                    color: form.kw.includes(kw) ? '#000' : 'var(--text)',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>

          <label>
            <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Card Text</span>
            <textarea 
              value={form.text} 
              onChange={e => setForm({...form, text: e.target.value})}
              rows={2}
              style={{ resize: 'none' }}
            />
          </label>

          <div style={{ marginTop: '10px', color: 'var(--dim)', fontSize: '12px' }}>Veterancy Upgrades:</div>
          <label>
            <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Vet 1 (5 XP)</span>
            <input value={form.vet1} onChange={e => setForm({...form, vet1: e.target.value})} placeholder="e.g., +1 Attack" />
          </label>
          <label>
            <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Vet 2 (10 XP)</span>
            <input value={form.vet2} onChange={e => setForm({...form, vet2: e.target.value})} placeholder="e.g., Gain Flying" />
          </label>
          <label>
            <span style={{ color: 'var(--dim)', fontSize: '11px' }}>Vet 3 (15 XP)</span>
            <input value={form.vet3} onChange={e => setForm({...form, vet3: e.target.value})} placeholder="e.g., Ultimate ability" />
          </label>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="btn-primary" onClick={handleSave} disabled={!form.name.trim()}>
              {editingId ? 'Update Card' : 'Save Card'}
            </button>
            {editingId && (
              <button className="btn-secondary" onClick={resetForm}>Cancel Edit</button>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="cc-preview" style={{ width: '260px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px' }}>
          <h3>Preview</h3>
          <div style={{ transform: 'scale(1.3)', transformOrigin: 'top center' }}>
            <div className={`card elem-${form.elem} rarity-${form.rarity}`} style={{ width: '110px', minWidth: '110px', height: '155px' }}>
              <div className="c-cost">{form.cost}</div>
              <div className="c-name">{form.name || 'Card Name'}</div>
              <div className="c-art" dangerouslySetInnerHTML={{ __html: artHtml }} />
              <div className="c-type">{form.type}{form.race ? ` - ${form.race}` : ''}</div>
              <div className="c-text">{form.text}</div>
              <div className="c-bottom">
                {form.type !== 'spell' && (
                  <>
                    <span className="c-atk">{form.atk}</span>
                    <span className="c-elem-badge" style={{ background: elemInfo?.color ?? '#888' }}>{form.elem}</span>
                    <span className="c-hp">{form.hp}</span>
                  </>
                )}
                {form.type === 'spell' && (
                  <span className="c-elem-badge" style={{ background: elemInfo?.color ?? '#888', margin: '0 auto' }}>{form.elem}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Cards */}
      {savedCards.length > 0 && (
        <div className="cc-saved" style={{ marginTop: '20px' }}>
          <h3>Custom Cards ({savedCards.length})</h3>
          <div className="cc-saved-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', maxHeight: '200px', overflowY: 'auto' }}>
            {savedCards.map(card => (
              <div key={card.id} style={{ 
                background: 'var(--bg2)', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ color: 'var(--gold)' }}>{card.name}</span>
                <span style={{ color: 'var(--dim)', fontSize: '11px' }}>{card.cost} - {card.type} - {card.elem}</span>
                <button onClick={() => handleEdit(card)} style={{ fontSize: '11px', padding: '2px 8px' }}>Edit</button>
                <button onClick={() => handleDelete(card.id)} style={{ fontSize: '11px', padding: '2px 8px' }} className="btn-danger">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="btn-secondary back-btn" style={{ marginTop: '15px' }} onClick={onBack}>Back</button>
    </div>
  );
}
