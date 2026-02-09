import { useState } from 'react';
import { ELEMENTS, TERRAIN_INFO, RACES, ALL_KEYWORDS } from '../../data/constants';

interface RulesScreenProps {
  onBack: () => void;
}

export function RulesScreen({ onBack }: RulesScreenProps) {
  const [activeTab, setActiveTab] = useState<'basics' | 'keywords' | 'terrain' | 'titans'>('basics');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <h2>Rules & Help</h2>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {(['basics', 'keywords', 'terrain', 'titans'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'btn-primary' : 'btn-secondary'}
            style={{ textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rules-content" style={{ maxWidth: '850px', width: '100%', background: 'var(--bg2)', borderRadius: '8px', padding: '25px 30px', maxHeight: '65vh', overflowY: 'auto', lineHeight: '1.7', fontSize: '14px' }}>
        {activeTab === 'basics' && <BasicsTab />}
        {activeTab === 'keywords' && <KeywordsTab />}
        {activeTab === 'terrain' && <TerrainTab />}
        {activeTab === 'titans' && <TitansTab />}
      </div>

      <button className="btn-secondary back-btn" style={{ marginTop: '20px' }} onClick={onBack}>Back</button>
    </div>
  );
}

function BasicsTab() {
  return (
    <>
      <h3 style={{ color: 'var(--gold)', marginBottom: '10px' }}>Game Overview</h3>
      <p>Titanfall Chronicles is a tactical fantasy card game where two players command armies led by powerful Titans. Destroy the enemy Titan to win!</p>
      
      <h3 style={{ color: 'var(--gold)', marginTop: '20px', marginBottom: '10px' }}>Setup</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Each player chooses a Titan (your commander with special abilities)</li>
        <li>Select a battlefield map</li>
        <li>Each player starts with 30 cards in their deck</li>
        <li>Draw 4 cards to start</li>
      </ul>

      <h3 style={{ color: 'var(--gold)', marginTop: '20px', marginBottom: '10px' }}>Turn Structure (6 Phases)</h3>
      <ol style={{ paddingLeft: '20px' }}>
        <li><strong>Refresh:</strong> Gain 10 Energy, ready all units, remove freeze, apply start-of-turn effects</li>
        <li><strong>Draw:</strong> Draw 1 card (take fatigue damage if deck is empty)</li>
        <li><strong>Deploy:</strong> Play cards from hand (up to 3 per turn)</li>
        <li><strong>Movement:</strong> Move your units across the board</li>
        <li><strong>Combat:</strong> Attack enemy units and Titan</li>
        <li><strong>End:</strong> Trigger end-of-turn effects, pass to opponent</li>
      </ol>

      <h3 style={{ color: 'var(--gold)', marginTop: '20px', marginBottom: '10px' }}>Card Types</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li><strong>Units:</strong> Creatures with Attack/HP/Move/Range that fight for you</li>
        <li><strong>Spells:</strong> One-time effects (damage, healing, buffs)</li>
        <li><strong>Structures:</strong> Stationary buildings with ongoing effects</li>
      </ul>

      <h3 style={{ color: 'var(--gold)', marginTop: '20px', marginBottom: '10px' }}>Elements</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
        {Object.entries(ELEMENTS).map(([key, info]) => (
          <span key={key} style={{ background: 'var(--bg)', padding: '5px 12px', borderRadius: '15px', fontSize: '13px' }}>
            <span style={{ color: info.color }}>{info.icon}</span> {info.name}
          </span>
        ))}
      </div>

      <h3 style={{ color: 'var(--gold)', marginTop: '20px', marginBottom: '10px' }}>Veterancy (Unit Leveling)</h3>
      <p>Units gain XP by dealing damage or killing enemies:</p>
      <ul style={{ paddingLeft: '20px' }}>
        <li>Deal damage: +1 XP</li>
        <li>Kill a unit: +3 XP</li>
        <li>5 XP: Veterancy 1 - unlock first upgrade</li>
        <li>10 XP: Veterancy 2 - unlock second upgrade</li>
        <li>15 XP: Veterancy 3 - unlock ultimate ability</li>
      </ul>

      <h3 style={{ color: 'var(--gold)', marginTop: '20px', marginBottom: '10px' }}>Winning the Game</h3>
      <p>Reduce the enemy Titan's HP to 0 to win! Protect your Titan with units and use its special abilities wisely.</p>
    </>
  );
}

function KeywordsTab() {
  const keywordDescriptions: Record<string, string> = {
    rush: 'Can attack immediately after being deployed',
    charge: 'Can move immediately after being deployed',
    taunt: 'Enemies must attack this unit first',
    flying: 'Ignores terrain penalties, can pass over units',
    stealth: 'Cannot be targeted until it attacks',
    divine_shield: 'Blocks the next damage taken',
    windfury: 'Can attack twice per turn',
    guard: 'Protects adjacent allies from ranged attacks',
    swift: 'Can move through enemy units',
    poisonous: 'Kills any unit it damages',
    lifesteal: 'Heals for damage dealt',
    trample: 'Excess damage carries over to the Titan',
    elusive: 'Cannot be targeted by spells',
    ward: 'Blocks the next spell targeting this unit',
    haste: 'Ignores deploy exhaustion (acts immediately)',
    freeze: 'Frozen units cannot move or attack next turn',
    deathrattle: 'Effect triggers when unit dies',
    battlecry: 'Effect triggers when unit is deployed',
    enrage: 'Bonus when unit is damaged',
    inspire: 'Effect triggers each turn while alive',
    ranged: 'Can attack from a distance',
    regen: 'Heals HP at the start of your turn',
    armor: 'Reduces damage taken by this amount',
    bleed: 'Takes damage at start of turn',
  };

  return (
    <>
      <h3 style={{ color: 'var(--gold)', marginBottom: '15px' }}>Keywords Reference</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
        {ALL_KEYWORDS.map(kw => (
          <div key={kw} style={{ background: 'var(--bg)', padding: '10px 15px', borderRadius: '6px' }}>
            <div style={{ color: 'var(--gold)', fontWeight: 'bold', textTransform: 'capitalize', marginBottom: '3px' }}>
              {kw.replace(/_/g, ' ')}
            </div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>
              {keywordDescriptions[kw] || 'Special ability'}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ color: 'var(--gold)', marginTop: '25px', marginBottom: '10px' }}>Race Synergies</h3>
      <p style={{ marginBottom: '15px' }}>Having multiple units of the same race grants powerful bonuses:</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
        {RACES.map(race => (
          <div key={race} style={{ background: 'var(--bg)', padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}>
            <strong style={{ color: 'var(--gold)' }}>{race}</strong>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>3 units: Tier 1 bonus | 5 units: Tier 2 bonus</div>
          </div>
        ))}
      </div>
    </>
  );
}

function TerrainTab() {
  return (
    <>
      <h3 style={{ color: 'var(--gold)', marginBottom: '15px' }}>Terrain Types</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(TERRAIN_INFO).map(([key, info]) => (
          <div key={key} style={{ background: 'var(--bg)', padding: '15px', borderRadius: '8px', borderLeft: `4px solid ${info.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <strong style={{ textTransform: 'capitalize', fontSize: '16px' }}>{info.name}</strong>
              {info.defBonus > 0 && <span style={{ color: '#4a4', fontSize: '12px' }}>+{info.defBonus} Defense</span>}
            </div>
            <div style={{ color: '#aaa', fontSize: '13px' }}>{info.desc}</div>
          </div>
        ))}
      </div>

      <h3 style={{ color: 'var(--gold)', marginTop: '25px', marginBottom: '10px' }}>Height System</h3>
      <ul style={{ paddingLeft: '20px' }}>
        <li><strong>Height 0:</strong> Plains, Water, Swamp, Ruins</li>
        <li><strong>Height 1:</strong> Hills (+1 defense)</li>
        <li><strong>Height 2:</strong> Mountains (impassable except by Flying units)</li>
      </ul>
      <p style={{ marginTop: '10px', color: '#aaa' }}>Higher ground provides tactical advantages. Units on higher elevation can see and attack over obstacles.</p>
    </>
  );
}

function TitansTab() {
  const titans = [
    { name: 'Firelord Kargath', elem: 'fire', hp: 30, passive: 'Fire units +2 Attack on volcano tiles', active: 'Deal 4 damage split among enemies in a row (3 Energy)', ultimate: 'Board-wide 3 fire damage to all enemies (3 kills)' },
    { name: 'Earthwarden Thalor', elem: 'earth', hp: 35, passive: 'Earth units gain Armor 2', active: 'Give target ally Divine Shield + Taunt (3 Energy)', ultimate: 'Summon two 3/3 Stone Walls with Taunt (4 kills)' },
    { name: 'Windrider Sylara', elem: 'wind', hp: 25, passive: 'Wind units +2 Move', active: 'Return target ally to hand, draw 1 card (2 Energy)', ultimate: 'All allies gain +1 Move and Swift this turn (3 kills)' },
    { name: 'Shadow Queen Nyx', elem: 'shadow', hp: 28, passive: 'Shadow units have Stealth until they attack', active: 'Poison target enemy + draw 1 card (3 Energy)', ultimate: 'All enemies lose 2 HP and lose all buffs (3 kills)' },
    { name: 'Archmage Elandor', elem: 'arcane', hp: 26, passive: 'Spells cost 1 less Energy', active: 'Copy the last spell you played (4 Energy)', ultimate: 'Draw 3 cards and reduce their cost by 2 (4 kills)' },
  ];

  return (
    <>
      <h3 style={{ color: 'var(--gold)', marginBottom: '15px' }}>Titan Abilities</h3>
      <p style={{ marginBottom: '20px' }}>Your Titan is your commander. Each has unique passive abilities, an active skill that costs Energy, and an ultimate that unlocks after getting enough kills.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {titans.map(t => {
          const elemInfo = ELEMENTS[t.elem as keyof typeof ELEMENTS];
          return (
            <div key={t.name} style={{ background: 'var(--bg)', padding: '18px', borderRadius: '8px', borderLeft: `4px solid ${elemInfo.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>{elemInfo.icon}</span>
                <strong style={{ fontSize: '16px' }}>{t.name}</strong>
                <span style={{ color: '#888', fontSize: '13px' }}>{t.hp} HP</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div><span style={{ color: '#4a9eff' }}>Passive:</span> {t.passive}</div>
                <div><span style={{ color: '#f4a' }}>Active:</span> {t.active}</div>
                <div><span style={{ color: 'var(--gold)' }}>Ultimate:</span> {t.ultimate}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
