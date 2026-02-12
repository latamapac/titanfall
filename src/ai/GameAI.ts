/**
 * Titanfall Chronicles - AI Opponent
 * 
 * Implements a strategic AI that can play through all phases of the game.
 * Difficulty levels: Easy, Medium, Hard
 */

import type { GameState, CardDef, Unit } from '../types/game';
import { getAllUnits, getTerrain, enemy, inBounds, countRace } from '../engine/utils';
// AI Module - GameAI

export type AIDifficulty = 'easy' | 'medium' | 'hard';

interface AIAction {
  type: 'deploy' | 'move' | 'attack' | 'titan' | 'nextPhase';
  payload?: Record<string, unknown>;
}

interface ScoredMove {
  fromR: number;
  fromC: number;
  toR: number;
  toC: number;
  score: number;
}

interface ScoredAttack {
  fromR: number;
  fromC: number;
  toR: number;
  toC: number;
  score: number;
  expectedDamage: number;
  expectedRetaliation: number;
}

export class GameAI {
  private difficulty: AIDifficulty;
  private thinkDelay: number;
  
  constructor(difficulty: AIDifficulty = 'medium') {
    this.difficulty = difficulty;
    // Delay between actions so player can see AI moves
    this.thinkDelay = difficulty === 'easy' ? 800 : difficulty === 'medium' ? 600 : 400;
  }

  /**
   * Main AI decision entry point
   * Returns a promise that resolves with the AI's action
   */
  async think(G: GameState): Promise<AIAction | null> {
    const aiPlayerIdx = 1; // AI is always player 2
    
    // Wait a bit to simulate thinking
    await this.delay(this.thinkDelay);
    
    switch (G.phase) {
      case 2: // Deploy phase
        return this.thinkDeploy(G, aiPlayerIdx);
      case 3: // Movement phase
        return this.thinkMove(G, aiPlayerIdx);
      case 4: // Combat phase
        return this.thinkCombat(G, aiPlayerIdx);
      case 5: // End phase
        return { type: 'nextPhase' };
      default:
        // For automatic phases (Refresh, Draw), just advance
        return null;
    }
  }

  /**
   * Deploy phase AI
   * Play cards strategically based on difficulty
   */
  private thinkDeploy(G: GameState, playerIdx: number): AIAction | null {
    const p = G.p[playerIdx];
    
    if (G.deployLeft <= 0 || p.hand.length === 0) {
      return { type: 'nextPhase' };
    }

    // Get playable cards (can afford)
    const playableCards = p.hand
      .map((card, index) => ({ card, index }))
      .filter(({ card }) => this.canAffordCard(G, playerIdx, card));

    if (playableCards.length === 0) {
      return { type: 'nextPhase' };
    }

    // Score each playable card
    const scoredCards = playableCards.map(({ card, index }) => ({
      card,
      index,
      score: this.scoreCardForDeploy(G, playerIdx, card),
    }));

    // Sort by score descending
    scoredCards.sort((a, b) => b.score - a.score);

    // Based on difficulty, sometimes make suboptimal choices
    let selectedCard = scoredCards[0];
    if (this.difficulty === 'easy' && scoredCards.length > 1 && Math.random() < 0.4) {
      selectedCard = scoredCards[Math.floor(Math.random() * scoredCards.length)];
    } else if (this.difficulty === 'medium' && scoredCards.length > 1 && Math.random() < 0.15) {
      selectedCard = scoredCards[Math.floor(Math.random() * scoredCards.length)];
    }

    // Find best position for this card
    const position = this.findBestDeployPosition(G, playerIdx, selectedCard.card);
    
    if (position) {
      return {
        type: 'deploy',
        payload: {
          cardIndex: selectedCard.index,
          r: position.r,
          c: position.c,
        },
      };
    }

    // Try titan ability if no good card plays
    if (this.shouldUseTitanAbility(G, playerIdx)) {
      return { type: 'titan' };
    }

    return { type: 'nextPhase' };
  }

  /**
   * Movement phase AI
   * Move units strategically toward enemies or objectives
   */
  private thinkMove(G: GameState, playerIdx: number): AIAction | null {
    const units = getAllUnits(G, playerIdx);
    const enemyUnits = getAllUnits(G, enemy(playerIdx));
    
    if (units.length === 0) {
      return { type: 'nextPhase' };
    }

    // Score all possible moves
    const possibleMoves: ScoredMove[] = [];
    
    for (const { unit, r, c } of units) {
      if (!unit.ready || unit.movesLeft <= 0) continue;
      
      const validMoves = this.getValidMovesForUnit(G, playerIdx, r, c);
      
      for (const move of validMoves) {
        const score = this.scoreMove(G, playerIdx, unit, r, c, move.r, move.c, enemyUnits);
        possibleMoves.push({
          fromR: r,
          fromC: c,
          toR: move.r,
          toC: move.c,
          score,
        });
      }
    }

    if (possibleMoves.length === 0) {
      return { type: 'nextPhase' };
    }

    // Sort by score
    possibleMoves.sort((a, b) => b.score - a.score);

    // Pick best move (with some randomness for easier difficulties)
    let selectedMove = possibleMoves[0];
    if (this.difficulty === 'easy' && possibleMoves.length > 1 && Math.random() < 0.5) {
      selectedMove = possibleMoves[Math.floor(Math.random() * Math.min(3, possibleMoves.length))];
    }

    return {
      type: 'move',
      payload: {
        fromR: selectedMove.fromR,
        fromC: selectedMove.fromC,
        toR: selectedMove.toR,
        toC: selectedMove.toC,
      },
    };
  }

  /**
   * Combat phase AI
   * Attack enemy units when favorable
   */
  private thinkCombat(G: GameState, playerIdx: number): AIAction | null {
    const units = getAllUnits(G, playerIdx);
    const enemyUnits = getAllUnits(G, enemy(playerIdx));
    
    if (units.length === 0 || enemyUnits.length === 0) {
      return { type: 'nextPhase' };
    }

    // Score all possible attacks
    const possibleAttacks: ScoredAttack[] = [];
    
    for (const { unit, r, c } of units) {
      if (!unit.ready || unit.hasAttacked) continue;
      
      const validTargets = this.getValidAttackTargets(G, playerIdx, r, c);
      
      for (const target of validTargets) {
        const targetUnit = G.board[target.r][target.c]!;
        const score = this.scoreAttack(G, playerIdx, unit, targetUnit, r, c, target.r, target.c);
        
        possibleAttacks.push({
          fromR: r,
          fromC: c,
          toR: target.r,
          toC: target.c,
          score: score.score,
          expectedDamage: score.damage,
          expectedRetaliation: score.retaliation,
        });
      }
    }

    if (possibleAttacks.length === 0) {
      return { type: 'nextPhase' };
    }

    // Sort by score
    possibleAttacks.sort((a, b) => b.score - a.score);

    // Filter for safe attacks on easy mode, favor trades on hard mode
    let selectedAttack = possibleAttacks[0];
    
    if (this.difficulty === 'easy') {
      // Easy AI only makes safe attacks (won't die)
      const safeAttacks = possibleAttacks.filter(a => a.expectedRetaliation < G.board[a.fromR][a.fromC]!.hp);
      if (safeAttacks.length > 0) {
        selectedAttack = safeAttacks[0];
      }
    } else if (this.difficulty === 'hard') {
      // Hard AI makes optimal trades
      const goodTrades = possibleAttacks.filter(a => 
        a.expectedDamage >= G.board[a.toR][a.toC]!.hp || // Can kill
        a.score > 0 // Favorable trade
      );
      if (goodTrades.length > 0) {
        selectedAttack = goodTrades[0];
      }
    }

    // Skip attack if it's a really bad trade
    if (selectedAttack.score < -5 && this.difficulty !== 'hard') {
      return { type: 'nextPhase' };
    }

    return {
      type: 'attack',
      payload: {
        fromR: selectedAttack.fromR,
        fromC: selectedAttack.fromC,
        toR: selectedAttack.toR,
        toC: selectedAttack.toC,
      },
    };
  }

  // ==================== SCORING FUNCTIONS ====================

  private scoreCardForDeploy(G: GameState, playerIdx: number, card: CardDef): number {
    let score = 0;
    const p = G.p[playerIdx];
    
    // Base value: stats/cost ratio
    if (card.type === 'unit') {
      score += (card.atk || 0) * 2 + (card.hp || 0);
      score -= card.cost * 1.5;
      
      // Bonus for keywords
      if (card.kw?.includes('taunt')) score += 3;
      if (card.kw?.includes('charge')) score += 4;
      if (card.kw?.includes('haste')) score += 3;
      if (card.kw?.includes('battlecry')) score += 2;
      
      // Synergy with titan element
      if (p.titan && card.elem === p.titan.elem) score += 2;
      
      // Early game: prefer cheaper units
      if (G.turn <= 3 && card.cost <= 3) score += 3;
    } else if (card.type === 'spell') {
      // Spells for removal or draw
      if (card.text?.toLowerCase().includes('damage')) score += 5;
      if (card.text?.toLowerCase().includes('draw')) score += 4;
      if (card.text?.toLowerCase().includes('heal')) score += 2;
    }
    
    return score;
  }

  private scoreMove(G: GameState, playerIdx: number, unit: Unit, fromR: number, _fromC: number, toR: number, toC: number, enemyUnits: {unit: Unit, r: number, c: number}[]): number {
    let score = 0;
    
    // Distance to nearest enemy (closer is better for combat units)
    let minDistToEnemy = Infinity;
    for (const e of enemyUnits) {
      const dist = Math.abs(toR - e.r) + Math.abs(toC - e.c);
      minDistToEnemy = Math.min(minDistToEnemy, dist);
    }
    
    // Combat units want to get close to enemies
    if (unit.atk > 0 && !unit.kw?.includes('ranged')) {
      score += (10 - minDistToEnemy) * 2;
    }
    
    // Ranged units want to maintain distance
    if (unit.kw?.includes('ranged') || (unit.range || 1) > 1) {
      score += minDistToEnemy;
    }
    
    // Terrain bonuses
    const terrain = getTerrain(G, toR, toC);
    if (terrain === 'forest' && unit.race === 'Elf') score += 3;
    if (terrain === 'volcano' && unit.elem === 'fire') score += 2;
    if (terrain === 'mountain') score += 1; // Defensive position
    
    // Avoid swamp damage
    if (terrain === 'swamp' && !unit.kw?.includes('flying')) score -= 2;
    
    // Prefer forward movement (toward enemy)
    const isForward = playerIdx === 0 ? toR > fromR : toR < fromR;
    if (isForward) score += 2;
    
    return score;
  }

  private scoreAttack(G: GameState, _playerIdx: number, attacker: Unit, defender: Unit, aR: number, aC: number, dR: number, dC: number): { score: number; damage: number; retaliation: number } {
    // Simple damage calc (approximation)
    let attackDamage = attacker.atk;
    
    // Height advantage
    const aH = this.getHeight(G, aR, aC);
    const dH = this.getHeight(G, dR, dC);
    if (aH > dH) attackDamage += 2;
    if (dH > aH) attackDamage -= 1;
    
    // Defender armor
    const armor = (defender as unknown as Record<string, number>)._armor || 0;
    attackDamage = Math.max(0, attackDamage - armor);
    
    // Can we kill?
    const canKill = attackDamage >= defender.hp;
    
    // Retaliation damage
    let retaliationDamage = 0;
    const dist = Math.abs(aR - dR) + Math.abs(aC - dC);
    const defRange = defender.range || 1;
    if (dist <= defRange && defender.type !== 'structure') {
      retaliationDamage = defender.atk;
      // Height advantage for defender
      if (dH > aH) retaliationDamage += 2;
      const atkArmor = (attacker as unknown as Record<string, number>)._armor || 0;
      retaliationDamage = Math.max(0, retaliationDamage - atkArmor);
    }
    
    // Divine shield
    if ((defender as unknown as Record<string, boolean>)._divine_shield) {
      attackDamage = 0;
    }
    if ((attacker as unknown as Record<string, boolean>)._divine_shield) {
      retaliationDamage = 0;
    }
    
    // Score calculation
    let score = 0;
    
    // Killing is very good
    if (canKill) {
      score += 20;
      // Bonus for killing high-value targets
      score += (defender.atk + defender.hp) * 2;
    } else {
      // Damage is okay
      score += attackDamage * 2;
    }
    
    // Penalty for taking damage
    score -= retaliationDamage * 3;
    
    // Penalty for potentially dying
    if (retaliationDamage >= attacker.hp) {
      score -= 15;
    }
    
    // Prefer attacking damaged units
    if (defender.hp < defender.maxHp) {
      score += 3;
    }
    
    return { score, damage: attackDamage, retaliation: retaliationDamage };
  }

  // ==================== HELPER FUNCTIONS ====================

  private canAffordCard(G: GameState, playerIdx: number, card: CardDef): boolean {
    const p = G.p[playerIdx];
    let cost = card.cost;
    
    // Element discount
    if (p.titan && card.elem === p.titan.elem) {
      cost = Math.max(0, cost - 1);
    }
    
    // Spell discount for Elandor
    if (card.type === 'spell' && p.titanId === 'elandor') {
      cost = Math.max(0, cost - 1);
    }
    
    // Goblin discount
    if (card.race === 'Goblin' && countRace(G, playerIdx, 'Goblin') >= 3) {
      cost = Math.max(0, cost - 1);
    }
    
    return p.energy >= cost;
  }

  private findBestDeployPosition(G: GameState, playerIdx: number, card: CardDef): { r: number; c: number } | null {
    // Get valid deploy tiles
    const zones = playerIdx === 0 ? [3, 4] : [0, 1];
    if (getAllUnits(G, playerIdx).some(u => u.r === 2)) zones.push(2);
    
    const validTiles: { r: number; c: number; score: number }[] = [];
    
    for (const r of zones) {
      for (let c = 0; c < 7; c++) {
        if (G.board[r][c]) continue;
        
        // Check terrain
        const terrain = getTerrain(G, r, c);
        if (terrain === 'mountain' && !card.kw?.includes('flying')) continue;
        
        // Score this position
        let score = Math.random() * 2; // Random factor
        
        // Prefer forward positions (toward enemy)
        if (playerIdx === 0) {
          score += r * 2; // Higher row = closer to enemy
        } else {
          score += (4 - r) * 2;
        }
        
        // Center columns are better
        score += 3 - Math.abs(c - 3);
        
        // Terrain preferences
        if (terrain === 'forest' && card.race === 'Elf') score += 5;
        if (terrain === 'volcano' && card.elem === 'fire') score += 3;
        if (terrain === 'swamp' && !card.kw?.includes('flying')) score -= 5;
        
        validTiles.push({ r, c, score });
      }
    }
    
    if (validTiles.length === 0) return null;
    
    validTiles.sort((a, b) => b.score - a.score);
    return validTiles[0];
  }

  private shouldUseTitanAbility(G: GameState, playerIdx: number): boolean {
    const p = G.p[playerIdx];
    const titan = p.titan;
    
    if (!titan || G.phase !== 2 || G.deployLeft <= 0) return false;
    if (p.energy < titan.activeCost) return false;
    
    // Titan-specific logic
    switch (titan.id) {
      case 'kargath':
        // Use if enemies on board
        return getAllUnits(G, enemy(playerIdx)).length > 0;
      case 'thalor':
        // Use if we have a good target
        return getAllUnits(G, playerIdx).some(u => !u.unit.kw?.includes('divine_shield'));
      case 'sylara':
        // Use if we have a damaged unit to save
        return getAllUnits(G, playerIdx).some(u => u.unit.hp < u.unit.maxHp * 0.5);
      case 'nyx':
        // Use if enemies on board
        return getAllUnits(G, enemy(playerIdx)).length > 0;
      case 'elandor':
        // Use if we cast a good spell this turn
        return G.lastSpell !== null;
      default:
        return false;
    }
  }

  private getValidMovesForUnit(G: GameState, playerIdx: number, r: number, c: number): { r: number; c: number }[] {
    const unit = G.board[r][c];
    if (!unit || unit.owner !== playerIdx || !unit.ready || unit.type === 'structure') return [];
    
    const moves: { r: number; c: number }[] = [];
    const maxDist = unit.movesLeft;
    if (maxDist <= 0) return [];
    
    // Simple BFS for valid moves
    const visited = new Set<string>();
    const queue: { r: number; c: number; cost: number }[] = [{ r, c, cost: 0 }];
    visited.add(`${r},${c}`);
    
    while (queue.length > 0) {
      const cur = queue.shift()!;
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      
      for (const [dr, dc] of dirs) {
        const nr = cur.r + dr;
        const nc = cur.c + dc;
        
        if (!inBounds(nr, nc)) continue;
        
        const terrain = getTerrain(G, nr, nc);
        if (terrain === 'mountain' && !unit.kw?.includes('flying')) continue;
        if (G.board[nr][nc]) continue;
        
        let moveCost = 1;
        if (terrain === 'water' && !unit.kw?.includes('flying')) {
          moveCost = 2;
        }
        
        const totalCost = cur.cost + moveCost;
        if (totalCost > maxDist) continue;
        
        const key = `${nr},${nc}`;
        if (visited.has(key)) continue;
        visited.add(key);
        
        moves.push({ r: nr, c: nc });
        queue.push({ r: nr, c: nc, cost: totalCost });
      }
    }
    
    return moves;
  }

  private getValidAttackTargets(G: GameState, playerIdx: number, r: number, c: number): { r: number; c: number }[] {
    const unit = G.board[r][c];
    if (!unit || unit.owner !== playerIdx || !unit.ready || unit.hasAttacked || unit.type === 'structure') return [];
    
    const targets: { r: number; c: number }[] = [];
    const range = unit.range || 1;
    
    for (let tr = 0; tr < 5; tr++) {
      for (let tc = 0; tc < 7; tc++) {
        const target = G.board[tr][tc];
        if (!target || target.owner === playerIdx) continue;
        
        const dist = Math.abs(tr - r) + Math.abs(tc - c);
        if (dist > range) continue;
        
        targets.push({ r: tr, c: tc });
      }
    }
    
    return targets;
  }

  private getHeight(G: GameState, r: number, c: number): number {
    const terrain = getTerrain(G, r, c);
    switch (terrain) {
      case 'mountain': return 3;
      case 'hill': return 2;
      default: return 1;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default GameAI;
