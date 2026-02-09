import type { Unit } from '../../types/game';
import { getCardArt } from '../../art/CardArt';

interface UnitTokenProps {
  unit: Unit;
}

const KW_ICONS: Record<string, string> = {
  taunt: 'T', flying: 'F', stealth: 'S', rush: 'R', charge: 'C',
  divine_shield: 'D', windfury: 'W', guard: 'G', swift: 'Sw',
  poisonous: 'P', lifesteal: 'L', trample: 'Tr', elusive: 'E',
  ward: 'Wd', haste: 'H', ranged: 'Ra', regen: 'Re', armor: 'Ar',
};

export function UnitToken({ unit }: UnitTokenProps) {
  const isStructure = unit.type === 'structure';
  const isExhausted = !unit.ready && !unit.hasAttacked;
  const stars = unit.vetLv > 0 ? '\u2605'.repeat(unit.vetLv) : '';

  const effectClasses: string[] = [];
  if (unit._divine_shield) effectClasses.push('effect-divine-shield');
  if (unit._frozen) effectClasses.push('effect-frozen');
  if (unit._stealthed) effectClasses.push('effect-stealth');
  if (unit._ward) effectClasses.push('effect-ward');
  if (unit.effects?.some(e => e.type === 'poison')) effectClasses.push('effect-poison');

  const artHtml = getCardArt(unit.id, unit.type, unit.elem);

  return (
    <div className={`unit-token owner-${unit.owner} ${isStructure ? 'is-structure' : ''} ${isExhausted ? 'exhausted' : ''} ${effectClasses.join(' ')}`}>
      <span className="u-name">{unit.name}</span>
      {unit.kw.length > 0 && (
        <div className="u-kw">
          {unit.kw.slice(0, 3).map((kw, i) => (
            <span key={i} className="kw-icon" title={kw}>{KW_ICONS[kw] || kw[0].toUpperCase()}</span>
          ))}
        </div>
      )}
      {stars && <span className="u-stars">{stars}</span>}
      <div className="u-art" dangerouslySetInnerHTML={{ __html: artHtml }} />
      <div className="u-stats">
        <span className="u-atk">{unit.atk}</span>
        <span className="u-hp">{unit.hp}</span>
      </div>
    </div>
  );
}
