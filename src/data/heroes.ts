/**
 * Dragonamachia Heroes (Titan Replacements)
 * 
 * Four hero archetypes, one for each faction
 * Compatible with existing Titan system
 */

import type { TitanDef } from '../types/game';

export const HEROES: TitanDef[] = [
  {
    id: 'warden',
    name: 'Iron Warden',
    elem: 'earth',
    hp: 35,
    passiveText: 'Units gain Armor 2 while adjacent to Warden.',
    activeText: 'Create a Rune Shield on target ally (blocks next 5 damage). (3 Energy)',
    activeCost: 3,
    ultText: 'Fortify all allies with Divine Shield + Taunt. Requires 4 kills.',
    ultReq: 4,
    kills: 0,
    icon: '🛡️',
    color: '#8B4513',
    faction: 'iron-church',
    role: 'Tank',
    visualSignature: ['vertical shields', 'rune-guarded plate', 'defensive stance']
  },
  {
    id: 'thornbinder',
    name: 'Verdant Thornbinder',
    elem: 'nature',
    hp: 28,
    passiveText: 'Damaged enemies are Rooted (cannot move next turn).',
    activeText: 'Summon thorns that damage and entangle enemies in a row. (3 Energy)',
    activeCost: 3,
    ultText: 'Transform battlefield - all enemies take 2 damage per turn. Requires 3 kills.',
    ultReq: 3,
    kills: 0,
    icon: '🌿',
    color: '#228B22',
    faction: 'verdant-covenant',
    role: 'DPS',
    visualSignature: ['vined whip', 'organic armor', 'symbiotic growth']
  },
  {
    id: 'skyseeker',
    name: 'Storm Sky-Seeker',
    elem: 'wind',
    hp: 25,
    passiveText: 'Units have +1 Move and ignore terrain penalties.',
    activeText: 'Dash to any tile and strike adjacent enemy for 4 damage. (2 Energy)',
    activeCost: 2,
    ultText: 'All allies gain Swift (attack twice) and Fly for 1 turn. Requires 3 kills.',
    ultReq: 3,
    kills: 0,
    icon: '⚡',
    color: '#4169E1',
    faction: 'stormbound',
    role: 'Ranged',
    visualSignature: ['cerulean bow', 'wind glyphs', 'aerial mobility']
  },
  {
    id: 'arcanist',
    name: 'Scholarium Arcanist',
    elem: 'arcane',
    hp: 26,
    passiveText: 'Spells cost 1 less Energy. Draw a card when you cast a spell.',
    activeText: 'Copy the last spell cast this game. (4 Energy)',
    activeCost: 4,
    ultText: 'Cast three random spells instantly. Requires 4 kills.',
    ultReq: 4,
    kills: 0,
    icon: '🔮',
    color: '#4B0082',
    faction: 'esoteric-scholarium',
    role: 'Caster',
    visualSignature: ['floating sigils', 'glowing eyes', 'orbital elements']
  }
];

// Keep legacy titans for backward compatibility
export const LEGACY_TITANS: TitanDef[] = [
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

// Default export for game - use HEROES (Dragonamachia)
export const TITANS = HEROES;
