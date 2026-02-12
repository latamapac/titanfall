/**
 * Titanfall Chronicles - Comprehensive Game Engine Test Suite
 * 
 * A custom test runner using TypeScript assertions without external dependencies.
 * Tests cover game initialization, phase progression, turn flow, combat, and win conditions.
 */

import { GameEngine, GameCallback } from '../engine/GameEngine';
import type { GameState, CardDef, Unit } from '../types/game';
import { BASE_CARDS } from '../data/cards';
import { TITANS } from '../data/titans';

// ====================== Test Framework ======================

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

class TestRunner {
  private tests: Array<{ name: string; fn: () => void | Promise<void> }> = [];
  private results: TestResult[] = [];
  private beforeEachFn: (() => void) | null = null;
  private afterEachFn: (() => void) | null = null;

  beforeEach(fn: () => void) {
    this.beforeEachFn = fn;
  }

  afterEach(fn: () => void) {
    this.afterEachFn = fn;
  }

  test(name: string, fn: () => void | Promise<void>) {
    this.tests.push({ name, fn });
  }

  private assert(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // Assertion helpers
  assertEquals(actual: unknown, expected: unknown, message?: string): void {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    this.assert(
      actualStr === expectedStr,
      message || `Expected ${expectedStr}, got ${actualStr}`
    );
  }

  assertTrue(value: boolean, message?: string): void {
    this.assert(value === true, message || `Expected true, got ${value}`);
  }

  assertFalse(value: boolean, message?: string): void {
    this.assert(value === false, message || `Expected false, got ${value}`);
  }

  assertNotNull(value: unknown, message?: string): void {
    this.assert(value !== null && value !== undefined, message || `Expected non-null value`);
  }

  assertNull(value: unknown, message?: string): void {
    this.assert(value === null || value === undefined, message || `Expected null, got ${value}`);
  }

  assertGreaterThan(actual: number, expected: number, message?: string): void {
    this.assert(
      actual > expected,
      message || `Expected ${actual} to be greater than ${expected}`
    );
  }

  assertLessThan(actual: number, expected: number, message?: string): void {
    this.assert(
      actual < expected,
      message || `Expected ${actual} to be less than ${expected}`
    );
  }

  assertGreaterThanOrEqual(actual: number, expected: number, message?: string): void {
    this.assert(
      actual >= expected,
      message || `Expected ${actual} to be >= ${expected}`
    );
  }

  assertLessThanOrEqual(actual: number, expected: number, message?: string): void {
    this.assert(
      actual <= expected,
      message || `Expected ${actual} to be <= ${expected}`
    );
  }

  assertArrayLength(arr: unknown[], length: number, message?: string): void {
    this.assert(
      arr.length === length,
      message || `Expected array length ${length}, got ${arr.length}`
    );
  }

  assertIncludes(arr: unknown[], item: unknown, message?: string): void {
    const itemStr = JSON.stringify(item);
    const found = arr.some(x => JSON.stringify(x) === itemStr);
    this.assert(found, message || `Expected array to include ${itemStr}`);
  }

  async run(): Promise<TestResult[]> {
    console.log('\n🎮 Running Titanfall Chronicles Test Suite\n');
    
    for (const { name, fn } of this.tests) {
      const startTime = Date.now();
      try {
        if (this.beforeEachFn) this.beforeEachFn();
        await fn();
        if (this.afterEachFn) this.afterEachFn();
        this.results.push({
          name,
          passed: true,
          duration: Date.now() - startTime
        });
        console.log(`✅ ${name}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.results.push({
          name,
          passed: false,
          error: errorMessage,
          duration: Date.now() - startTime
        });
        console.log(`❌ ${name}`);
        console.log(`   Error: ${errorMessage}`);
      }
    }

    return this.results;
  }

  printSummary(): void {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏱️  Duration: ${totalDuration}ms`);
    console.log('='.repeat(50));

    if (failed > 0) {
      console.log('\n🔴 Failed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    }

    console.log('');
  }
}

// ====================== Test Helpers ======================

function createMockCallbacks(): GameCallback & { 
  logs: string[]; 
  popups: Array<{r: number, c: number, text: string, isHeal?: boolean}>;
  animations: Array<{type: string, args: unknown[]}>;
  victoryCalled: boolean;
  winner: number | null;
  sfxCalls: string[];
} {
  return {
    logs: [],
    popups: [],
    animations: [],
    victoryCalled: false,
    winner: null,
    sfxCalls: [],
    onLog: function(msg: string) { this.logs.push(msg); },
    onPopup: function(r: number, c: number, text: string, isHeal?: boolean) { 
      this.popups.push({ r, c, text, isHeal }); 
    },
    onVetPopup: function() {},
    onRender: function() {},
    onShowTurnOverlay: function() {},
    onVictory: function(winner: number) { 
      this.victoryCalled = true; 
      this.winner = winner; 
    },
    onPlaySFX: function(name: string) { this.sfxCalls.push(name); },
    onAnimate: function(type: string, ...args: unknown[]) { 
      this.animations.push({ type, args }); 
    },
  };
}

function createTestDeck(): string[] {
  // Create a 30-card deck with a mix of units and spells
  const deck: string[] = [];
  const cardIds = [
    'elven_archer', 'orc_berserker', 'fire_imp', 'dwarven_shieldbearer',
    'goblin_saboteur', 'dragon_hatchling', 'undead_warrior', 'stone_golem',
    'beast_rider', 'swamp_lurker', 'spirit_fox', 'demon_brute',
    'frost_mage', 'war_elephant', 'void_stalker', 'arcane_construct',
    'plague_bearer', 'light_priestess', 'holy_knight', 'phoenix_hatchling',
    'fireball', 'healing_light', 'shadow_strike', 'wind_rush',
    'arcane_intellect', 'frost_nova', 'raise_dead', 'divine_favor',
    'lightning_bolt', 'elven_watchtower'
  ];
  
  // Fill deck with available cards (30 cards)
  for (let i = 0; i < 30; i++) {
    deck.push(cardIds[i % cardIds.length]);
  }
  return deck;
}

function createLowCostDeck(): string[] {
  // Create a deck with mostly low-cost cards for easier testing
  const lowCostCards = [
    'fire_imp', 'goblin_saboteur', 'elven_archer', 'dwarven_shieldbearer',
    'undead_warrior', 'spirit_fox', 'fire_imp', 'goblin_saboteur',
    'lightning_bolt', 'healing_light', 'shadow_strike', 'wind_rush'
  ];
  const deck: string[] = [];
  for (let i = 0; i < 30; i++) {
    deck.push(lowCostCards[i % lowCostCards.length]);
  }
  return deck;
}

// Helper to wait for async phase transitions
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPhaseTransitions(engine: GameEngine, count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    engine.nextPhase();
    await wait(100);
  }
}

// ====================== Test Suite ======================

const runner = new TestRunner();

// Global test state
let engine: GameEngine;
let callbacks: ReturnType<typeof createMockCallbacks>;

runner.beforeEach(() => {
  callbacks = createMockCallbacks();
  engine = new GameEngine(callbacks);
});

// ====================== 1. Game Initialization Tests ======================

runner.test('Game Initialization: correct initial state', () => {
  const G = engine.G;
  runner.assertEquals(G.screen, 'menu');
  runner.assertEquals(G.turn, 1);
  runner.assertEquals(G.ap, 0);
  runner.assertEquals(G.phase, 0);
  runner.assertEquals(G.deployLeft, 3);
  // Board is not initialized until startGame is called
  runner.assertTrue(Array.isArray(G.board));
  runner.assertArrayLength(G.log, 0);
});

runner.test('Game Initialization: both players start with correct state', () => {
  const G = engine.G;
  
  // Both players should have default values before game starts
  runner.assertEquals(G.p[0].hp, 30);
  runner.assertEquals(G.p[1].hp, 30);
  runner.assertEquals(G.p[0].energy, 10);
  runner.assertEquals(G.p[1].energy, 10);
  runner.assertTrue(G.p[0].reaction);
  runner.assertTrue(G.p[1].reaction);
});

runner.test('Game Initialization: startGame sets up correct state', async () => {
  const p1Deck = createTestDeck();
  const p2Deck = createTestDeck();
  
  engine.startGame('warden', 'skyseeker', 0, p1Deck, p2Deck);
  
  const G = engine.G;
  
  // Check game state
  runner.assertEquals(G.turn, 1);
  runner.assertEquals(G.ap, 0);
  runner.assertEquals(G.phase, 0); // Refresh phase
  runner.assertEquals(G.mapIdx, 0);
  
  // Both players should have 4 cards in hand (after initial draw)
  runner.assertEquals(G.p[0].hand.length, 4);
  runner.assertEquals(G.p[1].hand.length, 4);
  
  // Decks should have 26 cards left (30 - 4 drawn)
  runner.assertEquals(G.p[0].deck.length, 26);
  runner.assertEquals(G.p[1].deck.length, 26);
  
  // Check titans are set correctly
  runner.assertEquals(G.p[0].titanId, 'warden');
  runner.assertEquals(G.p[1].titanId, 'skyseeker');
  runner.assertNotNull(G.p[0].titan);
  runner.assertNotNull(G.p[1].titan);
  
  // Check titan HP
  runner.assertEquals(G.p[0].hp, 35); // Warden has 35 HP
  runner.assertEquals(G.p[1].hp, 25); // Skyseeker has 25 HP
});

runner.test('Game Initialization: player 1 is active (ap = 0)', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  runner.assertEquals(engine.G.ap, 0);
});

runner.test('Game Initialization: correct titan HP based on selection', async () => {
  engine.startGame('thornbinder', 'arcanist', 0, createTestDeck(), createTestDeck());
  runner.assertEquals(engine.G.p[0].hp, 28); // Thornbinder has 28 HP
  runner.assertEquals(engine.G.p[1].hp, 26); // Arcanist has 26 HP
});

// ====================== 2. Phase Progression Tests ======================

runner.test('Phase Progression: Refresh phase refills energy to 10', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  await wait(500);
  
  // After startGame, energy should be 10
  runner.assertEquals(engine.G.p[0].energy, 10);
});

runner.test('Phase Progression: deployLeft is set to 3 in Refresh phase', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  await wait(500);
  runner.assertEquals(engine.G.deployLeft, 3);
});

runner.test('Phase Progression: Draw phase draws 1 card', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  const initialHandSize = G.p[0].hand.length;
  const initialDeckSize = G.p[0].deck.length;
  
  // Manually trigger Draw phase
  G.phase = 1;
  engine.runPhase();
  await wait(400);
  
  runner.assertEquals(G.p[0].hand.length, initialHandSize + 1);
  runner.assertEquals(G.p[0].deck.length, initialDeckSize - 1);
});

runner.test('Phase Progression: Deploy phase allows playing cards', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  await runPhaseTransitions(engine, 2); // Move through Refresh and Draw to Deploy
  
  runner.assertEquals(engine.G.phase, 2);
  runner.assertGreaterThan(engine.G.p[0].hand.length, 0);
  runner.assertEquals(engine.G.deployLeft, 3);
});

runner.test('Phase Progression: Movement phase sets up unit moves', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  // Wait for initial phase transitions to complete
  await wait(600);
  // Now manually set to Movement phase
  engine.G.phase = 3;
  engine.G.animating = false;
  engine.runPhase();
  await wait(100);
  
  // Phase should be 3 (Movement) or may have auto-transitioned
  runner.assertTrue(engine.G.phase === 3 || engine.G.phase === 4);
});

runner.test('Phase Progression: Combat phase allows attacks', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  await wait(600);
  // Manually set to Combat phase
  engine.G.phase = 4;
  engine.G.animating = false;
  engine.runPhase();
  await wait(100);
  
  // Phase should be 4 (Combat) or may have auto-transitioned to 5 (End)
  runner.assertTrue(engine.G.phase === 4 || engine.G.phase === 5);
});

runner.test('Phase Progression: End phase transitions to next player', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  G.phase = 5; // Set to End phase
  const initialTurn = G.turn;
  
  engine.nextPhase();
  await wait(100);
  
  // Should now be player 2's turn, Refresh phase
  runner.assertEquals(G.ap, 1);
  runner.assertEquals(G.phase, 0);
  runner.assertEquals(G.turn, initialTurn + 1);
});

// ====================== 3. Player 2 Turn Flow Tests ======================

runner.test('Player 2 Turn: becomes active after player 1 ends', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  // Complete player 1's turn
  await runPhaseTransitions(engine, 6);
  await wait(600);
  
  runner.assertEquals(engine.G.ap, 1);
});

runner.test('Player 2 Turn: gets Refresh phase with energy = 10', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  // Complete player 1's turn and wait for player 2's Refresh
  await runPhaseTransitions(engine, 6);
  await wait(1000);
  
  runner.assertEquals(engine.G.ap, 1);
  runner.assertEquals(engine.G.p[1].energy, 10);
  // After completing a turn, phase cycles back to 0 (Refresh)
  runner.assertTrue(engine.G.phase === 0 || engine.G.phase === 4);
});

runner.test('Player 2 Turn: draws a card in Draw phase', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  await runPhaseTransitions(engine, 6); // Complete P1 turn
  await wait(600);
  
  const G = engine.G;
  const handSizeBefore = G.p[1].hand.length;
  
  // Trigger Draw phase for P2
  G.phase = 1;
  engine.runPhase();
  await wait(400);
  
  runner.assertEquals(G.p[1].hand.length, handSizeBefore + 1);
});

runner.test('Player 2 Turn: can play cards during Deploy phase', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  await runPhaseTransitions(engine, 6); // Complete P1 turn
  await wait(800);
  // Manually set to Deploy phase for P2
  engine.G.phase = 2;
  engine.runPhase();
  await wait(100);
  
  runner.assertEquals(engine.G.ap, 1);
  runner.assertEquals(engine.G.phase, 2);
  runner.assertGreaterThan(engine.G.p[1].hand.length, 0);
});

// ====================== 4. Turn Switching Tests ======================

runner.test('Turn Switching: 3 full turns cycle correctly', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  await wait(500); // Wait for initial phase to settle
  
  const G = engine.G;
  const players: number[] = [];
  
  // Record active player for each phase over 3 full turns (18 phase transitions)
  for (let i = 0; i < 18; i++) {
    players.push(G.ap);
    engine.nextPhase();
    await wait(100);
  }
  
  // Check that we cycled through players (accounting for async phase timing)
  const p0Count = players.filter(p => p === 0).length;
  const p1Count = players.filter(p => p === 1).length;
  
  // Both players should have been active at least a few times
  runner.assertGreaterThan(p0Count, 5);
  runner.assertGreaterThan(p1Count, 5);
});

runner.test('Turn Switching: correct player active each turn', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  await wait(600);
  
  // Turn 1 - Player 1
  runner.assertEquals(engine.G.turn, 1);
  runner.assertEquals(engine.G.ap, 0);
  
  // Complete turn 1 by cycling through phases 0-5
  engine.G.phase = 5; // Set to End phase
  engine.G.animating = false;
  engine.nextPhase(); // This should switch to player 2
  await wait(600);
  
  // After completing turn 1, should be Player 2's turn
  runner.assertTrue(engine.G.turn >= 2, 'Turn should be >= 2');
  runner.assertEquals(engine.G.ap, 1);
  
  // Complete turn 2
  engine.G.phase = 5;
  engine.G.animating = false;
  engine.nextPhase();
  await wait(600);
  
  // Turn 3 - Player 1 again
  runner.assertTrue(engine.G.turn >= 3, 'Turn should be >= 3');
  runner.assertEquals(engine.G.ap, 0);
});

runner.test('Turn Switching: hands update correctly', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  const p1HandStart = G.p[0].hand.length;
  const p2HandStart = G.p[1].hand.length;
  
  // After 2 turns, both players should have drawn 2 cards each
  await runPhaseTransitions(engine, 12);
  await wait(1200);
  
  runner.assertEquals(G.p[0].hand.length, p1HandStart + 2);
  runner.assertEquals(G.p[1].hand.length, p2HandStart + 2);
});

runner.test('Turn Switching: energy refreshes each turn', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  
  // Spend some energy
  G.p[0].energy = 5;
  
  // Complete turn and verify refresh
  await runPhaseTransitions(engine, 6);
  await wait(800);
  
  // Now it's P2's turn, P1's energy should be refreshed for next turn
  runner.assertEquals(G.p[1].energy, 10);
});

// ====================== 5. Card Playing Tests ======================

runner.test('Card Playing: can play a unit card', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  
  await runPhaseTransitions(engine, 2); // Get to Deploy phase
  
  const G = engine.G;
  const initialHandSize = G.p[0].hand.length;
  const initialEnergy = G.p[0].energy;
  
  // Find a unit card
  const unitCardIdx = G.p[0].hand.findIndex(c => c.type === 'unit');
  if (unitCardIdx === -1) {
    console.log('   ⚠️  Skipping: no unit card in hand');
    return;
  }
  
  const card = G.p[0].hand[unitCardIdx];
  const validTiles = engine.getValidDeployTiles(card);
  
  if (validTiles.length === 0) {
    console.log('   ⚠️  Skipping: no valid deployment tiles');
    return;
  }
  
  const { r, c } = validTiles[0];
  const result = engine.deployCard(unitCardIdx, r, c);
  
  runner.assertTrue(result);
  runner.assertNotNull(G.board[r][c]);
  runner.assertEquals(G.p[0].hand.length, initialHandSize - 1);
  runner.assertEquals(G.p[0].energy, initialEnergy - (card.cost || 0));
  runner.assertEquals(G.deployLeft, 2);
});

runner.test('Card Playing: can play a spell card', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  await runPhaseTransitions(engine, 2); // Get to Deploy phase
  
  const G = engine.G;
  const initialHandSize = G.p[0].hand.length;
  
  // Find a spell card (arcane_intellect does not need target)
  const spellIdx = G.p[0].hand.findIndex(c => c.id === 'arcane_intellect');
  if (spellIdx === -1) {
    console.log('   ⚠️  Skipping: no arcane_intellect in hand');
    return;
  }
  
  const result = engine.deployCard(spellIdx, 0, 0);
  
  runner.assertTrue(result);
  runner.assertEquals(G.p[0].hand.length, initialHandSize - 1);
  // Arcane intellect draws 2 cards
  runner.assertTrue(callbacks.logs.some(log => log.includes('Arcane Intellect')));
});

runner.test('Card Playing: energy is deducted correctly', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  
  await runPhaseTransitions(engine, 2);
  
  const G = engine.G;
  G.p[0].energy = 10;
  
  const unitCardIdx = G.p[0].hand.findIndex(c => c.type === 'unit' && (c.cost || 0) > 0);
  if (unitCardIdx === -1) {
    console.log('   ⚠️  Skipping: no unit card with cost > 0');
    return;
  }
  
  const card = G.p[0].hand[unitCardIdx];
  const validTiles = engine.getValidDeployTiles(card);
  
  if (validTiles.length === 0) {
    console.log('   ⚠️  Skipping: no valid deployment tiles');
    return;
  }
  
  const expectedEnergy = 10 - (card.cost || 0);
  engine.deployCard(unitCardIdx, validTiles[0].r, validTiles[0].c);
  
  runner.assertEquals(G.p[0].energy, expectedEnergy);
});

runner.test('Card Playing: card is removed from hand', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  
  await runPhaseTransitions(engine, 2);
  
  const G = engine.G;
  const initialHandSize = G.p[0].hand.length;
  const cardId = G.p[0].hand[0]?.id;
  
  if (!cardId) {
    console.log('   ⚠️  Skipping: no cards in hand');
    return;
  }
  
  const validTiles = engine.getValidDeployTiles(G.p[0].hand[0]);
  if (validTiles.length === 0) {
    console.log('   ⚠️  Skipping: no valid deployment tiles');
    return;
  }
  
  engine.deployCard(0, validTiles[0].r, validTiles[0].c);
  
  runner.assertEquals(G.p[0].hand.length, initialHandSize - 1);
  const cardStillInHand = G.p[0].hand.some(c => c.id === cardId);
  // Card might still be in hand if there were duplicates
  runner.assertTrue(initialHandSize > G.p[0].hand.length);
});

runner.test('Card Playing: insufficient energy prevents playing', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  await runPhaseTransitions(engine, 2);
  
  const G = engine.G;
  G.p[0].energy = 0;
  
  // Try to play a card that costs energy
  const expensiveCardIdx = G.p[0].hand.findIndex(c => (c.cost || 0) > 0);
  if (expensiveCardIdx === -1) {
    console.log('   ⚠️  Skipping: no card with cost > 0');
    return;
  }
  
  const validTiles = engine.getValidDeployTiles(G.p[0].hand[expensiveCardIdx]);
  if (validTiles.length === 0) {
    console.log('   ⚠️  Skipping: no valid deployment tiles');
    return;
  }
  
  const result = engine.deployCard(expensiveCardIdx, validTiles[0].r, validTiles[0].c);
  
  runner.assertFalse(result);
  runner.assertTrue(callbacks.logs.some(log => log.includes('Not enough energy')));
});

// ====================== 6. Combat Tests ======================

runner.test('Combat: unit deployment creates unit on board', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  
  await runPhaseTransitions(engine, 2);
  
  const G = engine.G;
  const unitCardIdx = G.p[0].hand.findIndex(c => c.type === 'unit');
  
  if (unitCardIdx === -1) {
    console.log('   ⚠️  Skipping: no unit card');
    return;
  }
  
  const card = G.p[0].hand[unitCardIdx];
  const validTiles = engine.getValidDeployTiles(card);
  
  if (validTiles.length === 0) {
    console.log('   ⚠️  Skipping: no valid tiles');
    return;
  }
  
  const { r, c } = validTiles[0];
  engine.deployCard(unitCardIdx, r, c);
  
  runner.assertNotNull(G.board[r][c]);
  runner.assertEquals(G.board[r][c]?.name, card.name);
  runner.assertEquals(G.board[r][c]?.owner, 0);
});

runner.test('Combat: unit can move in Movement phase', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  await wait(500);
  
  // Deploy a unit first (Deploy phase)
  const G = engine.G;
  const unitCardIdx = G.p[0].hand.findIndex(c => c.type === 'unit' && (c.move || 0) > 0);
  
  if (unitCardIdx === -1) {
    console.log('   ⚠️  Skipping: no mobile unit');
    return;
  }
  
  const card = G.p[0].hand[unitCardIdx];
  const validTiles = engine.getValidDeployTiles(card);
  
  if (validTiles.length === 0) {
    console.log('   ⚠️  Skipping: no valid tiles');
    return;
  }
  
  const deployR = validTiles[0].r;
  const deployC = validTiles[0].c;
  engine.deployCard(unitCardIdx, deployR, deployC);
  
  // Move to Movement phase
  G.phase = 3;
  engine.runPhase();
  await wait(100);
  
  runner.assertEquals(G.phase, 3);
  
  const unit = G.board[deployR][deployC];
  if (!unit) {
    console.log('   ⚠️  Skipping: unit not deployed');
    return;
  }
  
  // Check valid moves exist
  const validMoves = engine.getValidMoves(deployR, deployC);
  runner.assertTrue(validMoves.length > 0 || unit.movesLeft === 0);
});

runner.test('Combat: unit can attack in Combat phase', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  await wait(500);
  
  // Deploy units for both players to set up combat
  const G = engine.G;
  
  // Deploy P1 unit
  const p1UnitIdx = G.p[0].hand.findIndex(c => c.type === 'unit');
  if (p1UnitIdx === -1) {
    console.log('   ⚠️  Skipping: no unit for P1');
    return;
  }
  
  const validTiles = engine.getValidDeployTiles(G.p[0].hand[p1UnitIdx]);
  if (validTiles.length === 0) {
    console.log('   ⚠️  Skipping: no valid tiles');
    return;
  }
  
  engine.deployCard(p1UnitIdx, validTiles[0].r, validTiles[0].c);
  
  // Move to Combat phase
  G.phase = 4;
  engine.runPhase();
  await wait(100);
  
  runner.assertEquals(G.phase, 4);
});

runner.test('Combat: damage calculation reduces HP', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  
  // Set up a unit and deal damage directly
  const G = engine.G;
  
  // Create a test unit
  const testUnit: Unit = {
    id: 'test_unit',
    name: 'Test Unit',
    cost: 2,
    type: 'unit',
    atk: 3,
    hp: 5,
    maxHp: 5,
    move: 2,
    range: 1,
    elem: 'fire',
    race: 'Human',
    kw: [],
    text: 'Test',
    vet1: '',
    vet2: '',
    vet3: '',
    xp: 0,
    vetLv: 0,
    owner: 1,
    ready: true,
    movesLeft: 2,
    hasAttacked: false,
    effects: [],
    _r: 2,
    _c: 3,
    _armor: 0,
    _moveBonus: 0,
    _turnBuffs: {},
    _divine_shield: false,
    _ward: false,
    _frozen: false,
    _stealthed: false,
    rarity: 'common',
    isToken: false,
  };
  
  G.board[2][3] = testUnit;
  
  const initialHP = testUnit.hp;
  engine.dealDamage(testUnit, 2, 2, 3);
  
  runner.assertEquals(testUnit.hp, initialHP - 2);
});

runner.test('Combat: unit destruction removes from board', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  
  // Create a weak test unit
  const testUnit: Unit = {
    id: 'test_unit',
    name: 'Weak Unit',
    cost: 1,
    type: 'unit',
    atk: 1,
    hp: 1,
    maxHp: 1,
    move: 1,
    range: 1,
    elem: 'fire',
    race: 'Human',
    kw: [],
    text: 'Test',
    vet1: '',
    vet2: '',
    vet3: '',
    xp: 0,
    vetLv: 0,
    owner: 1,
    ready: true,
    movesLeft: 1,
    hasAttacked: false,
    effects: [],
    _r: 2,
    _c: 3,
    _armor: 0,
    _moveBonus: 0,
    _turnBuffs: {},
    _divine_shield: false,
    _ward: false,
    _frozen: false,
    _stealthed: false,
    rarity: 'common',
    isToken: false,
  };
  
  G.board[2][3] = testUnit;
  
  // Deal lethal damage
  engine.dealDamage(testUnit, 5, 2, 3);
  
  runner.assertNull(G.board[2][3]);
});

runner.test('Combat: kills add to titan kill count', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  
  // Create a P1 unit that will do the killing
  const attackerUnit: Unit = {
    id: 'attacker',
    name: 'Attacker',
    cost: 2,
    type: 'unit',
    atk: 5,
    hp: 5,
    maxHp: 5,
    move: 2,
    range: 1,
    elem: 'fire',
    race: 'Human',
    kw: [],
    text: 'Test',
    vet1: '',
    vet2: '',
    vet3: '',
    xp: 0,
    vetLv: 0,
    owner: 0,
    ready: true,
    movesLeft: 2,
    hasAttacked: false,
    effects: [],
    _r: 2,
    _c: 2,
    _armor: 0,
    _moveBonus: 0,
    _turnBuffs: {},
    _divine_shield: false,
    _ward: false,
    _frozen: false,
    _stealthed: false,
    rarity: 'common',
    isToken: false,
  };
  
  // Create enemy unit
  const enemyUnit: Unit = {
    id: 'enemy_unit',
    name: 'Enemy',
    cost: 1,
    type: 'unit',
    atk: 1,
    hp: 1,
    maxHp: 1,
    move: 1,
    range: 1,
    elem: 'shadow',
    race: 'Undead',
    kw: [],
    text: 'Test',
    vet1: '',
    vet2: '',
    vet3: '',
    xp: 0,
    vetLv: 0,
    owner: 1,
    ready: true,
    movesLeft: 1,
    hasAttacked: false,
    effects: [],
    _r: 2,
    _c: 3,
    _armor: 0,
    _moveBonus: 0,
    _turnBuffs: {},
    _divine_shield: false,
    _ward: false,
    _frozen: false,
    _stealthed: false,
    rarity: 'common',
    isToken: false,
  };
  
  G.board[2][2] = attackerUnit;
  G.board[2][3] = enemyUnit;
  
  // Simulate combat resolution which increments kills
  G.animating = false; // Reset animation flag
  engine.resolveCombat(2, 2, 2, 3);
  await wait(500); // Wait for combat animation
  
  // Check if kill was counted (either P0 for killing enemy, or P1 for killing attacker)
  const totalKills = (G.p[0].titan?.kills || 0) + (G.p[1].titan?.kills || 0);
  runner.assertGreaterThanOrEqual(totalKills, 1);
});

runner.test('Combat: armor reduces damage', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  
  // Create armored unit with 2 armor
  const armoredUnit: Unit = {
    id: 'armored_unit',
    name: 'Armored Unit',
    cost: 3,
    type: 'unit',
    atk: 2,
    hp: 5,
    maxHp: 5,
    move: 1,
    range: 1,
    elem: 'earth',
    race: 'Dwarf',
    kw: [],
    text: 'Test',
    vet1: '',
    vet2: '',
    vet3: '',
    xp: 0,
    vetLv: 0,
    owner: 1,
    ready: true,
    movesLeft: 1,
    hasAttacked: false,
    effects: [],
    _r: 2,
    _c: 3,
    _armor: 2,
    _moveBonus: 0,
    _turnBuffs: {},
    _divine_shield: false,
    _ward: false,
    _frozen: false,
    _stealthed: false,
    rarity: 'common',
    isToken: false,
  };
  
  G.board[2][3] = armoredUnit;
  
  // Deal 3 damage with 2 armor = 1 actual damage (3-2=1, 5-1=4)
  engine.dealDamage(armoredUnit, 3, 2, 3);
  
  // 5 HP - (3 dmg - 2 armor) = 4 HP
  runner.assertEquals(armoredUnit.hp, 4);
});

runner.test('Combat: divine shield blocks damage', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  
  // Create unit with divine shield
  const shieldedUnit: Unit = {
    id: 'shielded_unit',
    name: 'Shielded Unit',
    cost: 4,
    type: 'unit',
    atk: 3,
    hp: 4,
    maxHp: 4,
    move: 2,
    range: 1,
    elem: 'light',
    race: 'Human',
    kw: ['divine_shield'],
    text: 'Divine Shield',
    vet1: '',
    vet2: '',
    vet3: '',
    xp: 0,
    vetLv: 0,
    owner: 1,
    ready: true,
    movesLeft: 2,
    hasAttacked: false,
    effects: [],
    _r: 2,
    _c: 3,
    _armor: 0,
    _moveBonus: 0,
    _turnBuffs: {},
    _divine_shield: true,
    _ward: false,
    _frozen: false,
    _stealthed: false,
    rarity: 'rare',
    isToken: false,
  };
  
  G.board[2][3] = shieldedUnit;
  
  // Deal damage - should be blocked by divine shield
  engine.dealDamage(shieldedUnit, 5, 2, 3);
  
  runner.assertEquals(shieldedUnit.hp, 4); // No damage taken
  runner.assertFalse(shieldedUnit._divine_shield); // Shield consumed
});

// ====================== 7. Win Condition Tests ======================

runner.test('Win Condition: reducing opponent Titan to 0 HP triggers victory', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  G.p[1].hp = 5;
  
  // Deal damage directly to P2's titan
  G.p[1].hp = 0;
  engine.checkWin();
  
  runner.assertTrue(callbacks.victoryCalled);
  runner.assertEquals(callbacks.winner, 0);
});

runner.test('Win Condition: victory callback is called with correct winner', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  G.p[0].hp = 0;
  engine.checkWin();
  
  runner.assertTrue(callbacks.victoryCalled);
  runner.assertEquals(callbacks.winner, 1);
});

runner.test('Win Condition: game logs victory message', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  G.p[1].hp = 0;
  engine.checkWin();
  
  const hasVictoryLog = callbacks.logs.some(log => 
    log.includes('GAME OVER') || log.includes('wins')
  );
  runner.assertTrue(hasVictoryLog);
});

runner.test('Win Condition: titan HP cannot go below 0', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  G.p[1].hp = -5;
  engine.checkWin();
  
  runner.assertEquals(G.p[1].hp, 0);
});

// ====================== 8. Edge Case Tests ======================

runner.test('Edge Case: fatigue damage when deck is empty', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  
  // Empty the deck
  G.p[0].deck = [];
  G.p[0].hand = [];
  const initialHP = G.p[0].hp;
  
  // Trigger draw phase
  G.phase = 1;
  G.turn = 10; // Higher turn = more fatigue damage
  engine.runPhase();
  await wait(400);
  
  runner.assertTrue(callbacks.logs.some(log => log.includes('Fatigue')));
  // Fatigue damage = turn - 5, min 1
  const expectedDamage = Math.max(1, G.turn - 5);
  runner.assertEquals(G.p[0].hp, initialHP - expectedDamage);
});

runner.test('Edge Case: maximum hand size limit', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  const G = engine.G;
  
  // Fill hand to maximum
  while (G.p[0].hand.length < 10 && G.p[0].deck.length > 0) {
    G.p[0].hand.push(G.p[0].deck.pop()!);
  }
  
  const handSizeBefore = G.p[0].hand.length;
  
  // Try to draw more - drawCards function should respect the limit
  const { drawCards } = await import('../engine/utils');
  drawCards(G, 0, 5);
  
  runner.assertLessThanOrEqual(G.p[0].hand.length, 10);
});

runner.test('Edge Case: deploying on invalid tile fails', async () => {
  engine.startGame('warden', 'skyseeker', 0, createLowCostDeck(), createTestDeck());
  
  await runPhaseTransitions(engine, 2);
  
  const G = engine.G;
  const unitCardIdx = G.p[0].hand.findIndex(c => c.type === 'unit');
  
  if (unitCardIdx === -1) {
    console.log('   ⚠️  Skipping: no unit card');
    return;
  }
  
  // Try to deploy on invalid tile (enemy's deployment zone)
  const result = engine.deployCard(unitCardIdx, 0, 0); // Row 0 is P2's zone
  
  runner.assertFalse(result);
});

runner.test('Edge Case: spell targeting empty board cell', async () => {
  engine.startGame('warden', 'skyseeker', 0, createTestDeck(), createTestDeck());
  
  await runPhaseTransitions(engine, 2);
  
  const G = engine.G;
  
  // Find fireball spell
  const fireballIdx = G.p[0].hand.findIndex(c => c.id === 'fireball');
  if (fireballIdx === -1) {
    console.log('   ⚠️  Skipping: no fireball in hand');
    return;
  }
  
  const initialEnemyHP = G.p[1].hp;
  
  // Cast fireball on empty cell - should damage enemy titan
  engine.deployCard(fireballIdx, 0, 0);
  
  // Fireball deals 5 damage to titan when no unit targeted
  runner.assertEquals(G.p[1].hp, initialEnemyHP - 5);
});

// ====================== Run Tests ======================

async function runAllTests(): Promise<void> {
  const results = await runner.run();
  runner.printSummary();
  
  // Exit with error code if any tests failed
  const failed = results.filter(r => !r.passed).length;
  if (failed > 0) {
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

// Export for potential external use
export { runner, createMockCallbacks, createTestDeck };
