import type { TitanDef } from '../types/game';

export const TITANS: TitanDef[] = [
  {
    id: 'arcanum', name: 'Archmage Arcanum', elem: 'arcane', hp: 26,
    passiveText: 'Spells cost 1 less Energy.',
    activeText: 'Copy the last spell you played this game. (4 Energy)', activeCost: 4,
    ultText: 'Draw 3 cards and reduce their cost by 2. Requires 4 kills.', ultReq: 4, kills: 0,
    icon: '🔮', color: '#4a9eff',
  },
  {
    id: 'maulk', name: 'Bloodlord Maulk', elem: 'fire', hp: 30,
    passiveText: 'Fire units +2 Attack on volcano tiles.',
    activeText: 'Deal 4 damage split among enemies in target row. (3 Energy)', activeCost: 3,
    ultText: 'Board-wide 3 fire damage to all enemies. Requires 3 kills.', ultReq: 3, kills: 0,
    icon: '🔥', color: '#e84430',
  },
  {
    id: 'sylvana', name: 'Sylvana the Ancient', elem: 'earth', hp: 35,
    passiveText: 'Earth units gain Armor 2.',
    activeText: 'Give target ally Divine Shield + Taunt. (3 Energy)', activeCost: 3,
    ultText: 'Summon two 3/3 Stone Walls with Taunt. Requires 4 kills.', ultReq: 4, kills: 0,
    icon: '🌿', color: '#4ade80',
  },
  {
    id: 'solara', name: 'Solara Dragonguard', elem: 'wind', hp: 25,
    passiveText: 'Wind units +2 Move.',
    activeText: 'Return target ally to hand, draw 1 card. (2 Energy)', activeCost: 2,
    ultText: 'All allies gain +1 Move and Swift this turn. Requires 3 kills.', ultReq: 3, kills: 0,
    icon: '🐉', color: '#d4a843',
  },
  {
    id: 'nyx', name: 'Shadow Queen Nyx', elem: 'shadow', hp: 28,
    passiveText: 'Shadow units have Stealth until they attack.',
    activeText: 'Poison target enemy (3 dmg over 3 turns) + draw 1. (3 Energy)', activeCost: 3,
    ultText: 'All enemies lose 2 HP and lose all buffs. Requires 3 kills.', ultReq: 3, kills: 0,
    icon: '🌑', color: '#a855f7',
  },
];
