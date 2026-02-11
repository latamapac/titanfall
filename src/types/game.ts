// ====================== Core Game Types ======================

export type Element = 'fire' | 'earth' | 'wind' | 'shadow' | 'light' | 'arcane' | 'nature';
export type TerrainType = 'plain' | 'forest' | 'mountain' | 'water' | 'swamp' | 'hill' | 'volcano' | 'ruins';
export type CardType = 'unit' | 'spell' | 'structure';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type Phase = 'Refresh' | 'Draw' | 'Deploy' | 'Movement' | 'Combat' | 'End';
export type Race = 'Human' | 'Elf' | 'Dwarf' | 'Orc' | 'Goblin' | 'Dragon' | 'Undead' | 'Demon' | 'Beast' | 'Elemental' | 'Angel' | 'Merfolk' | 'Construct' | 'Spirit';
export type Keyword = 'rush' | 'charge' | 'taunt' | 'flying' | 'stealth' | 'divine_shield' | 'windfury' | 'guard' | 'swift' | 'poisonous' | 'lifesteal' | 'trample' | 'elusive' | 'ward' | 'haste' | 'freeze' | 'deathrattle' | 'battlecry' | 'enrage' | 'inspire' | 'ranged' | 'regen' | 'armor' | 'bleed';

export interface ElementInfo {
  name: string;
  color: string;
  icon: string;
}

export interface TerrainInfo {
  name: string;
  color: string;
  desc: string;
  defBonus: number;
}

export interface MapTile {
  t: TerrainType;
  h: number;
}

export interface GameMap {
  name: string;
  desc: string;
  tiles: MapTile[][];
}

export interface CardDef {
  id: string;
  name: string;
  cost: number;
  type: CardType;
  atk?: number;
  hp?: number;
  move?: number;
  range?: number;
  elem: Element;
  race?: Race;
  kw: Keyword[];
  text: string;
  flavor?: string;
  rarity: Rarity;
  vet1: string;
  vet2: string;
  vet3: string;
  isToken?: boolean;
}

export interface TitanDef {
  id: string;
  name: string;
  elem: Element;
  hp: number;
  passiveText: string;
  activeText: string;
  activeCost: number;
  ultText: string;
  ultReq: number;
  kills: number;
  icon: string;
  color: string;
  // Dragonamachia extensions
  faction?: string;
  role?: string;
  visualSignature?: string[];
}

export interface Effect {
  type: 'regen' | 'poison' | 'bleed';
  val: number;
  dur?: number;
}

export interface TurnBuffs {
  volcanoBuff?: number;
  momentum?: number;
  inspireAtk?: number;
  [key: string]: number | undefined;
}

export interface Unit {
  id: string;
  name: string;
  cost: number;
  type: CardType;
  atk: number;
  hp: number;
  maxHp: number;
  move: number;
  range: number;
  elem: Element | '';
  race: Race | '';
  kw: Keyword[];
  text: string;
  vet1: string;
  vet2: string;
  vet3: string;
  xp: number;
  vetLv: number;
  owner: number;
  ready: boolean;
  movesLeft: number;
  hasAttacked: boolean;
  effects: Effect[];
  _r: number;
  _c: number;
  _armor: number;
  _moveBonus: number;
  _turnBuffs: TurnBuffs;
  _divine_shield: boolean;
  _ward: boolean;
  _frozen: boolean;
  _stealthed: boolean;
  rarity: Rarity;
  isToken: boolean;
  // Synergy flags
  _orcBonus?: boolean;
  _undeadRespawn?: boolean;
  _demonSummon?: boolean;
  _humanDraw?: boolean;
  _beastHeal?: boolean;
  _angelHeal?: boolean;
  _goblinStrike?: boolean;
  _goblinStrikeUsed?: boolean;
  _noWaterPenalty?: boolean;
  _merfolkWater?: boolean;
  _elemTerrain?: boolean;
  _elemImmune?: boolean;
  _phaseThrough?: boolean;
  _dragonBonus?: number;
  _windfuryUsed?: boolean;
  _ariseUsed?: boolean;
  isCustom?: boolean;
}

export interface Player {
  titanId: string;
  titan: TitanDef | null;
  hp: number;
  energy: number;
  hand: CardDef[];
  deck: CardDef[];
  grave: Unit[];
  reaction: boolean;
  deckIds: string[];
}

export interface Selection {
  type: 'card' | 'unit' | 'spell' | 'titan_target' | 'vet3';
  idx?: number;
  r?: number;
  c?: number;
  action?: string;
}

export interface Highlight {
  r: number;
  c: number;
  type: 'deploy' | 'move' | 'attack' | 'selected';
}

export interface GameState {
  screen: string;
  mapIdx: number;
  turn: number;
  ap: number; // active player (0 or 1)
  phase: number;
  deployLeft: number;
  sel: Selection | null;
  highlights: Highlight[];
  lastSpell: CardDef | null;
  animating: boolean;
  p: [Player, Player];
  board: (Unit | null)[][];
  log: string[];
  animQueue: unknown[];
}

export interface Position {
  r: number;
  c: number;
}

export interface UnitPosition {
  unit: Unit;
  r: number;
  c: number;
}

export interface SynergyDef {
  t3: string;
  t5: string;
  fn3: ((u: Unit, b?: (Unit | null)[][]) => void) | null;
  fn5: ((u: Unit) => void) | null;
}
