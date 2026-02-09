import type { CardDef, GameState, Unit, UnitPosition, TerrainType } from '../types/game';
import { BASE_CARDS, TOKEN_CARDS } from '../data/cards';
import { MAPS } from '../data/maps';
import { TERRAIN_INFO } from '../data/constants';

export function deepClone<T>(o: T): T {
  return JSON.parse(JSON.stringify(o));
}

export function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let customCards: CardDef[] = [];

export function setCustomCards(cards: CardDef[]) {
  customCards = cards;
}

export function getCustomCards(): CardDef[] {
  return customCards;
}

export function getCardPool(): CardDef[] {
  return [...BASE_CARDS, ...customCards];
}

// Generate a default 30-card deck based on titan element
export function generateDefaultDeck(titanElem: string): string[] {
  const pool = getCardPool();
  const deck: string[] = [];
  
  // Add cards that match the titan's element (prioritize them)
  const elemCards = pool.filter(c => c.elem === titanElem && c.type !== 'structure').slice(0, 10);
  elemCards.forEach(c => deck.push(c.id));
  
  // Fill with random other cards to reach 30
  const otherCards = pool.filter(c => c.elem !== titanElem && c.type !== 'structure');
  while (deck.length < 30 && otherCards.length > 0) {
    const idx = Math.floor(Math.random() * otherCards.length);
    deck.push(otherCards[idx].id);
    otherCards.splice(idx, 1);
  }
  
  // If still not enough, add structures
  const structures = pool.filter(c => c.type === 'structure');
  while (deck.length < 30 && structures.length > 0) {
    deck.push(structures[deck.length % structures.length].id);
  }
  
  return deck;
}

// Local storage for decks
export function saveDeckToStorage(name: string, cardIds: string[]) {
  const decks = JSON.parse(localStorage.getItem('tc_decks') || '{}');
  decks[name] = cardIds;
  localStorage.setItem('tc_decks', JSON.stringify(decks));
}

export function loadDeckFromStorage(name: string): string[] | null {
  const decks = JSON.parse(localStorage.getItem('tc_decks') || '{}');
  return decks[name] || null;
}

export function getSavedDeckNames(): string[] {
  const decks = JSON.parse(localStorage.getItem('tc_decks') || '{}');
  return Object.keys(decks);
}

export function deleteDeckFromStorage(name: string) {
  const decks = JSON.parse(localStorage.getItem('tc_decks') || '{}');
  delete decks[name];
  localStorage.setItem('tc_decks', JSON.stringify(decks));
}

// Local storage for custom cards
export function saveCustomCard(card: CardDef) {
  const cards = JSON.parse(localStorage.getItem('tc_custom_cards') || '[]');
  const existingIdx = cards.findIndex((c: CardDef) => c.id === card.id);
  if (existingIdx >= 0) {
    cards[existingIdx] = card;
  } else {
    cards.push(card);
  }
  localStorage.setItem('tc_custom_cards', JSON.stringify(cards));
  setCustomCards(cards);
}

export function loadCustomCardsFromStorage() {
  const cards = JSON.parse(localStorage.getItem('tc_custom_cards') || '[]');
  setCustomCards(cards);
}

export function deleteCustomCard(cardId: string) {
  const cards = JSON.parse(localStorage.getItem('tc_custom_cards') || '[]');
  const filtered = cards.filter((c: CardDef) => c.id !== cardId);
  localStorage.setItem('tc_custom_cards', JSON.stringify(filtered));
  setCustomCards(filtered);
}

export function getCardById(id: string): CardDef | null {
  return getCardPool().find(c => c.id === id) || TOKEN_CARDS[id] || null;
}

export function getTerrain(G: GameState, r: number, c: number): TerrainType {
  return MAPS[G.mapIdx].tiles[r][c].t;
}

export function getHeight(G: GameState, r: number, c: number): number {
  const t = MAPS[G.mapIdx].tiles[r][c];
  let h = t.h;
  if (t.t === 'mountain') h += 2;
  if (t.t === 'hill') h += 1;
  return h;
}

export function getTerrainDefBonus(G: GameState, r: number, c: number): number {
  return TERRAIN_INFO[getTerrain(G, r, c)].defBonus || 0;
}

export function enemy(p: number): number {
  return p === 0 ? 1 : 0;
}

export function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 5 && c >= 0 && c < 7;
}

export function createUnit(card: CardDef, owner: number): Unit {
  return {
    id: card.id,
    name: card.name,
    cost: card.cost,
    type: card.type || 'unit',
    atk: card.atk || 0,
    hp: card.hp || 1,
    maxHp: card.hp || 1,
    move: card.move || 0,
    range: card.range || 1,
    elem: card.elem || '',
    race: card.race || '',
    kw: [...(card.kw || [])],
    text: card.text || '',
    vet1: card.vet1 || '',
    vet2: card.vet2 || '',
    vet3: card.vet3 || '',
    xp: 0,
    vetLv: 0,
    owner,
    ready: false,
    movesLeft: 0,
    hasAttacked: false,
    effects: [],
    _r: -1,
    _c: -1,
    _armor: 0,
    _moveBonus: 0,
    _turnBuffs: {},
    _divine_shield: card.kw?.includes('divine_shield') || false,
    _ward: card.kw?.includes('ward') || false,
    _frozen: false,
    _stealthed: card.kw?.includes('stealth') || false,
    rarity: card.rarity || 'common',
    isToken: card.isToken || false,
  };
}

export function getAllUnits(G: GameState, owner?: number): UnitPosition[] {
  const units: UnitPosition[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 7; c++) {
      const u = G.board[r][c];
      if (u && (owner === undefined || u.owner === owner)) {
        units.push({ unit: u, r, c });
      }
    }
  }
  return units;
}

export function countRace(G: GameState, owner: number, race: string): number {
  return getAllUnits(G, owner).filter(u => u.unit.race === race && u.unit.type === 'unit').length;
}

export function getAdjacentUnits(G: GameState, r: number, c: number, owner?: number): UnitPosition[] {
  const adj: UnitPosition[] = [];
  const dirs: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (inBounds(nr, nc) && G.board[nr][nc]) {
      if (owner === undefined || G.board[nr][nc]!.owner === owner) {
        adj.push({ unit: G.board[nr][nc]!, r: nr, c: nc });
      }
    }
  }
  return adj;
}

export function drawCards(G: GameState, owner: number, count: number): void {
  for (let i = 0; i < count; i++) {
    if (G.p[owner].deck.length > 0 && G.p[owner].hand.length < 10) {
      G.p[owner].hand.push(G.p[owner].deck.pop()!);
    }
  }
}

export function spawnTokensAdjacent(
  G: GameState, r: number, c: number, owner: number, tokenId: string, count: number
): void {
  const dirs: [number, number][] = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  let spawned = 0;
  for (const [dr, dc] of dirs) {
    if (spawned >= count) break;
    const nr = r + dr, nc = c + dc;
    if (!inBounds(nr, nc) || G.board[nr][nc]) continue;
    if (getTerrain(G, nr, nc) === 'mountain') continue;
    const tokenDef = TOKEN_CARDS[tokenId];
    if (!tokenDef) continue;
    const token = createUnit(tokenDef, owner);
    token._r = nr;
    token._c = nc;
    G.board[nr][nc] = token;
    spawned++;
  }
}

export function spawnTokensInZone(G: GameState, owner: number, tokenId: string, count: number): void {
  const zones = owner === 0 ? [3, 4] : [0, 1];
  let spawned = 0;
  for (const r of zones) {
    for (let c = 0; c < 7; c++) {
      if (spawned >= count) return;
      if (!G.board[r][c] && getTerrain(G, r, c) !== 'mountain') {
        const tokenDef = TOKEN_CARDS[tokenId];
        if (!tokenDef) continue;
        const token = createUnit(tokenDef, owner);
        token._r = r;
        token._c = c;
        G.board[r][c] = token;
        spawned++;
      }
    }
  }
}

export function createInitialGameState(): GameState {
  return {
    screen: 'menu',
    mapIdx: 0,
    turn: 1,
    ap: 0,
    phase: 0,
    deployLeft: 3,
    sel: null,
    highlights: [],
    lastSpell: null,
    animating: false,
    p: [
      { titanId: '', titan: null, hp: 30, energy: 10, hand: [], deck: [], grave: [], reaction: true, deckIds: [] },
      { titanId: '', titan: null, hp: 30, energy: 10, hand: [], deck: [], grave: [], reaction: true, deckIds: [] },
    ],
    board: [],
    log: [],
    animQueue: [],
  };
}
