import type { Element, ElementInfo, TerrainType, TerrainInfo, Race, Keyword, Phase } from '../types/game';

export const PHASES: Phase[] = ['Refresh', 'Draw', 'Deploy', 'Movement', 'Combat', 'End'];

export const ELEMENTS: Record<Element, ElementInfo> = {
  fire: { name: 'Fire', color: '#e84430', icon: '\u{1F525}' },
  earth: { name: 'Earth', color: '#8b6914', icon: '\u{1FAA8}' },
  wind: { name: 'Wind', color: '#30b8c8', icon: '\u{1F4A8}' },
  shadow: { name: 'Shadow', color: '#7030a0', icon: '\u{1F311}' },
  light: { name: 'Light', color: '#e8d44d', icon: '\u{2728}' },
  arcane: { name: 'Arcane', color: '#a855f5', icon: '\u{1F52E}' },
};

export const TERRAIN_INFO: Record<TerrainType, TerrainInfo> = {
  plain: { name: 'Plain', color: '#3a5a3a', desc: 'Normal terrain.', defBonus: 0 },
  forest: { name: 'Forest', color: '#1e4a1e', desc: '+2 defense. Elves move +1 here.', defBonus: 2 },
  mountain: { name: 'Mountain', color: '#4a4a5a', desc: 'Impassable (except Flying). Height +2.', defBonus: 0 },
  water: { name: 'Water', color: '#1a3a6a', desc: 'Movement cost 2. No melee across.', defBonus: 0 },
  swamp: { name: 'Swamp', color: '#2a3a1a', desc: 'Units entering take 1 poison damage.', defBonus: 0 },
  hill: { name: 'Hill', color: '#5a5a2a', desc: 'Height +1, +1 defense.', defBonus: 1 },
  volcano: { name: 'Volcano', color: '#4a1a1a', desc: 'Fire units +2 Attack here.', defBonus: 0 },
  ruins: { name: 'Ruins', color: '#3a2a4a', desc: 'Arcane spells cost 1 less from here.', defBonus: 0 },
};

export const RACES: Race[] = [
  'Human', 'Elf', 'Dwarf', 'Orc', 'Goblin', 'Dragon', 'Undead',
  'Demon', 'Beast', 'Elemental', 'Angel', 'Merfolk', 'Construct', 'Spirit',
];

export const ALL_KEYWORDS: Keyword[] = [
  'rush', 'charge', 'taunt', 'flying', 'stealth', 'divine_shield',
  'windfury', 'guard', 'swift', 'poisonous', 'lifesteal', 'trample',
  'elusive', 'ward', 'haste', 'freeze', 'deathrattle', 'battlecry',
  'enrage', 'inspire', 'ranged', 'regen', 'armor', 'bleed',
];

// Simpler arrays for UI
export const KEYWORDS = ALL_KEYWORDS;
export const RARITIES = ['common', 'rare', 'epic', 'legendary'] as const;
