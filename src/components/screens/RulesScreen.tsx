interface RulesScreenProps {
  onBack: () => void;
}

export function RulesScreen({ onBack }: RulesScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <h2>Rules &amp; Help</h2>
      <div style={{
        maxWidth: '800px', width: '100%', background: 'var(--bg2)',
        borderRadius: '8px', padding: '20px 30px', maxHeight: '70vh',
        overflowY: 'auto', lineHeight: 1.7, fontSize: '14px',
      }}>
        <h3>Game Overview</h3>
        <p>Titanfall Chronicles is a tactical card game played on a 5x7 grid. Two players choose Titans, build decks, and battle for supremacy.</p>

        <h3 style={{ marginTop: '16px' }}>Turn Phases</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Refresh</strong> - Units become ready, effects tick</li>
          <li><strong>Draw</strong> - Draw 2 cards, gain energy</li>
          <li><strong>Deploy</strong> - Play cards from hand (up to 3 deploys per turn)</li>
          <li><strong>Movement</strong> - Move units across the board</li>
          <li><strong>Combat</strong> - Attack enemy units and the enemy Titan</li>
          <li><strong>End</strong> - End-of-turn effects, switch to other player</li>
        </ul>

        <h3 style={{ marginTop: '16px' }}>Terrain Types</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Plain</span> - Normal terrain</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Forest</span> - +2 defense, Elves +1 move</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Mountain</span> - Impassable (except Flying), height +2</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Water</span> - Movement cost 2, no melee across</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Swamp</span> - Units entering take 1 poison damage</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Hill</span> - Height +1, +1 defense</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Volcano</span> - Fire units +2 Attack</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Ruins</span> - Arcane spells cost 1 less</li>
        </ul>

        <h3 style={{ marginTop: '16px' }}>Keywords</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Rush</span> - Can move immediately</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Charge</span> - Can attack immediately</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Taunt</span> - Must be attacked first</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Flying</span> - Ignores terrain, +1 range</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Stealth</span> - Cannot be targeted until attacking</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Divine Shield</span> - Blocks the first damage</li>
          <li><span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Lifesteal</span> - Heals Titan on damage dealt</li>
        </ul>

        <h3 style={{ marginTop: '16px' }}>Veteran System</h3>
        <p>Units gain XP from kills and level up through 3 veteran ranks, gaining unique bonuses at each level.</p>
      </div>
      <button className="btn-secondary" style={{ marginTop: '15px' }} onClick={onBack}>Back</button>
    </div>
  );
}
