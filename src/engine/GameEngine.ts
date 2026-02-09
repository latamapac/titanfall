import type { CardDef, GameState, Unit } from '../types/game';
import { TITANS } from '../data/titans';
import { RACES } from '../data/constants';
import {
  deepClone, shuffle, getCardById, getTerrain, getHeight, getTerrainDefBonus,
  createUnit, getAllUnits, countRace, getAdjacentUnits, drawCards, enemy, inBounds,
  spawnTokensAdjacent, spawnTokensInZone, createInitialGameState,
} from './utils';

// Callback type for UI notifications
export type GameCallback = {
  onLog: (msg: string) => void;
  onPopup: (r: number, c: number, text: string, isHeal?: boolean) => void;
  onVetPopup: (r: number, c: number, level: number) => void;
  onRender: () => void;
  onShowTurnOverlay: () => void;
  onVictory: (winner: number) => void;
  onPlaySFX: (name: string) => void;
  onAnimate: (type: string, ...args: unknown[]) => void;
};

export class GameEngine {
  G: GameState;
  cb: GameCallback;

  constructor(cb: GameCallback) {
    this.G = createInitialGameState();
    this.cb = cb;
  }

  private log(msg: string) {
    this.G.log.push(msg);
    if (this.G.log.length > 80) this.G.log.shift();
    this.cb.onLog(msg);
  }

  startGame(p1TitanId: string, p2TitanId: string, mapIdx: number, p1DeckIds: string[], p2DeckIds: string[]) {
    const G = this.G;
    G.mapIdx = mapIdx;
    G.turn = 1; G.ap = 0; G.phase = 0; G.deployLeft = 3;
    G.sel = null; G.highlights = []; G.log = []; G.lastSpell = null; G.animating = false;
    G.board = Array.from({ length: 5 }, () => Array(7).fill(null));

    for (let i = 0; i < 2; i++) {
      const tid = i === 0 ? p1TitanId : p2TitanId;
      const t = deepClone(TITANS.find(x => x.id === tid)!);
      t.kills = 0;
      G.p[i].titanId = tid;
      G.p[i].titan = t;
      G.p[i].hp = t.hp;
      G.p[i].energy = 10;
      G.p[i].reaction = true;
      G.p[i].hand = [];
      G.p[i].grave = [];
      const dids = i === 0 ? p1DeckIds : p2DeckIds;
      const deckCards = dids.map(id => getCardById(id)).filter(Boolean) as CardDef[];
      G.p[i].deck = shuffle(deepClone(deckCards));
      for (let d = 0; d < 4; d++) {
        if (G.p[i].deck.length > 0) G.p[i].hand.push(G.p[i].deck.pop()!);
      }
    }

    this.log('Game started! Turn 1 - Player 1\'s turn.');
    this.log('Phase: Refresh');
    this.cb.onPlaySFX('ambientLoop');
    this.runPhase();
  }

  nextPhase() {
    const G = this.G;
    if (G.animating) return;
    G.sel = null;
    G.highlights = [];
    G.phase++;
    if (G.phase >= 6) {
      G.phase = 0;
      G.ap = enemy(G.ap);
      G.turn++;
      this.log('--- Turn ' + G.turn + ' - Player ' + (G.ap + 1) + ' ---');
      this.cb.onShowTurnOverlay();
      return;
    }
    const PHASE_NAMES = ['Refresh', 'Draw', 'Deploy', 'Movement', 'Combat', 'End'];
    this.log('Phase: ' + PHASE_NAMES[G.phase]);
    this.cb.onPlaySFX('phaseChange');
    this.runPhase();
  }

  runPhase() {
    const G = this.G;
    const p = G.p[G.ap];

    switch (G.phase) {
      case 0: // Refresh
        p.energy = 10;
        p.reaction = true;
        G.deployLeft = 3;
        this.applyTitanPassives();
        getAllUnits(G, G.ap).forEach(({ unit, r, c }) => {
          unit.ready = true;
          unit.hasAttacked = false;
          unit._turnBuffs = {};
          unit.effects = unit.effects.filter(eff => {
            if (eff.type === 'regen') {
              const heal = Math.min(eff.val, unit.maxHp - unit.hp);
              if (heal > 0) { unit.hp += heal; this.cb.onPopup(r, c, '+' + heal, true); }
              return true;
            }
            if (eff.type === 'poison' || eff.type === 'bleed') {
              unit.hp -= eff.val;
              this.cb.onPopup(r, c, '-' + eff.val);
              if (eff.dur !== undefined) eff.dur--;
              if (unit.hp <= 0) this.destroyUnit(r, c);
              return (eff.dur ?? 0) > 0;
            }
            return true;
          });
          if (unit._frozen) { unit._frozen = false; unit.ready = false; }
          if (G.p[unit.owner].titanId === 'nyx' && unit.elem === 'shadow' && !unit.hasAttacked) {
            unit._stealthed = true;
          }
        });
        // Healing Fountain aura
        getAllUnits(G, G.ap).forEach(({ unit: su, r: sr, c: sc }) => {
          if (su.id === 'healing_fountain') {
            const regenVal = su.vetLv >= 2 ? 2 : 1;
            getAdjacentUnits(G, sr, sc, G.ap).forEach(({ unit: au, r: ar, c: ac }) => {
              const h = Math.min(regenVal, au.maxHp - au.hp);
              if (h > 0) { au.hp += h; this.cb.onPopup(ar, ac, '+' + h, true); }
            });
          }
        });
        this.applySynergies(G.ap);
        this.log('Energy refilled to 10. Units readied.');
        setTimeout(() => this.nextPhase(), 400);
        break;

      case 1: // Draw
        if (p.deck.length > 0) {
          p.hand.push(p.deck.pop()!);
          this.log('Player ' + (G.ap + 1) + ' drew a card. (' + p.deck.length + ' left)');
        } else {
          p.hp -= (G.turn - 5 > 0 ? G.turn - 5 : 1);
          this.log('No cards to draw! Fatigue damage!');
        }
        setTimeout(() => this.nextPhase(), 300);
        break;

      case 2: // Deploy
        this.log('Deploy phase: ' + G.deployLeft + ' actions remaining. Play cards or activate Titan.');
        break;

      case 3: // Movement
        getAllUnits(G, G.ap).forEach(({ unit }) => {
          unit.movesLeft = unit.move + (unit._moveBonus || 0);
          if (unit.kw.includes('swift')) unit.movesLeft += 1;
          if (G.p[unit.owner].titanId === 'sylara' && unit.elem === 'wind') unit.movesLeft += 2;
        });
        this.log('Movement phase: Click your units to move them.');
        break;

      case 4: // Combat
        this.log('Combat phase: Click your units to attack enemy targets.');
        break;

      case 5: // End
        getAllUnits(G, G.ap).forEach(({ unit, r, c }) => {
          if (unit.type === 'unit' && !unit.isToken && unit.xp < 3) {
            unit.xp++;
            if (unit.xp === 1 && unit.vetLv < 1) this.applyVeteran(unit, 1, r, c);
            else if (unit.xp === 2 && unit.vetLv < 2) this.applyVeteran(unit, 2, r, c);
            else if (unit.xp === 3 && unit.vetLv < 3) this.applyVeteran(unit, 3, r, c);
          }
          if (unit.id === 'angel_healer') {
            const healAmt = 2 + (unit.vetLv >= 1 ? 1 : 0);
            getAdjacentUnits(G, r, c, unit.owner).forEach(au => {
              const h = Math.min(healAmt, au.unit.maxHp - au.unit.hp);
              if (h > 0) { au.unit.hp += h; this.cb.onPopup(au.r, au.c, '+' + h, true); }
            });
          }
          if (unit._beastHeal) {
            const h = Math.min(1, unit.maxHp - unit.hp);
            if (h > 0) unit.hp += h;
          }
          if (unit._angelHeal) {
            getAdjacentUnits(G, r, c, unit.owner).forEach(au => {
              const h = Math.min(1, au.unit.maxHp - au.unit.hp);
              if (h > 0) au.unit.hp += h;
            });
          }
          if (unit.id === 'elven_sage' && unit.vetLv >= 2) drawCards(G, unit.owner, 1);
        });
        this.log('End phase complete.');
        setTimeout(() => this.nextPhase(), 500);
        break;
    }
    this.cb.onRender();
  }

  // =================== VETERAN SYSTEM ===================
  applyVeteran(unit: Unit, level: number, r: number, c: number) {
    unit.vetLv = level;
    const desc = level === 1 ? unit.vet1 : level === 2 ? unit.vet2 : unit.vet3;
    if (!desc) return;
    this.log(unit.name + ' reached Veteran ' + level + '! ' + desc);
    this.cb.onVetPopup(r, c, level);
    this.cb.onPlaySFX('levelUp');
    const d = desc.toLowerCase();
    if (d.includes('+1 attack') || d.includes('+1 atk')) unit.atk += 1;
    if (d.includes('+2 attack') || d.includes('+2 atk')) unit.atk += 2;
    if (d.includes('+1 hp')) { unit.hp += 1; unit.maxHp += 1; }
    if (d.includes('+2 hp')) { unit.hp += 2; unit.maxHp += 2; }
    if (d.includes('+3 hp')) { unit.hp += 3; unit.maxHp += 3; }
    if (d.includes('+1/+1')) { unit.atk += 1; unit.hp += 1; unit.maxHp += 1; }
    if (d.includes('+1 range')) unit.range += 1;
    if (d.includes('+1 move')) unit.move += 1;
    if (d.includes('windfury') && !unit.kw.includes('windfury')) unit.kw.push('windfury');
    if (d.includes('lifesteal') && !unit.kw.includes('lifesteal')) unit.kw.push('lifesteal');
    if (d.includes('regen')) {
      const m = desc.match(/regen\s*(\d+)/i);
      unit.effects.push({ type: 'regen', val: m ? parseInt(m[1]) : 1 });
    }
    if (d.includes('armor')) {
      const m = desc.match(/armor\s*(\d+)/i);
      if (m) unit._armor += parseInt(m[1]);
    }
    if (d.includes('stealth') && !unit.kw.includes('stealth')) { unit.kw.push('stealth'); unit._stealthed = true; }
    if (d.includes('ward') && !unit.kw.includes('ward')) { unit.kw.push('ward'); unit._ward = true; }
    if (d.includes('range 2') && unit.range < 2) unit.range = 2;
  }

  // =================== SYNERGIES ===================
  applySynergies(owner: number) {
    const G = this.G;
    // Simplified synergy application - applies stat bonuses per race count
    for (const race of RACES) {
      const count = countRace(G, owner, race);
      if (count < 3) continue;
      const units = getAllUnits(G, owner).filter(u => u.unit.race === race);
      // Tier 3 bonuses
      units.forEach(({ unit }) => {
        switch (race) {
          case 'Elf': if (getTerrain(G, unit._r, unit._c) === 'forest') unit._moveBonus = (unit._moveBonus || 0) + 1; break;
          case 'Dwarf': unit.hp += 1; unit.maxHp += 1; break;
          case 'Orc': unit._orcBonus = true; break;
          case 'Dragon': if (!unit.kw.includes('flying')) unit.kw.push('flying'); break;
          case 'Undead': unit._undeadRespawn = true; break;
          case 'Demon': unit.atk += 1; break;
          case 'Human': unit._humanDraw = true; break;
          case 'Beast': unit.move += 1; break;
          case 'Angel': unit._angelHeal = true; break;
          case 'Merfolk': unit._noWaterPenalty = true; break;
          case 'Elemental': unit._elemTerrain = true; break;
          case 'Construct': unit.hp += 2; unit.maxHp += 2; break;
          case 'Spirit': if (!unit.kw.includes('elusive')) unit.kw.push('elusive'); break;
        }
      });
      // Tier 5 bonuses
      if (count >= 5) {
        units.forEach(({ unit }) => {
          switch (race) {
            case 'Elf': if (!unit.kw.includes('stealth')) unit.kw.push('stealth'); break;
            case 'Dwarf': unit._armor = (unit._armor || 0) + 1; break;
            case 'Orc': if (!unit.kw.includes('charge')) unit.kw.push('charge'); break;
            case 'Dragon': unit._dragonBonus = 2; break;
            case 'Undead': if (!unit.kw.includes('lifesteal')) unit.kw.push('lifesteal'); break;
            case 'Demon': unit._demonSummon = true; break;
            case 'Human': unit.atk += 1; unit.hp += 1; unit.maxHp += 1; break;
            case 'Beast': unit._beastHeal = true; break;
            case 'Angel': if (!unit.kw.includes('divine_shield')) unit.kw.push('divine_shield'); break;
            case 'Goblin': unit._goblinStrike = true; break;
            case 'Merfolk': unit._merfolkWater = true; break;
            case 'Elemental': unit._elemImmune = true; break;
            case 'Construct': unit._armor = (unit._armor || 0) + 2; break;
            case 'Spirit': unit._phaseThrough = true; break;
          }
        });
      }
    }
  }

  // =================== TITAN ===================
  applyTitanPassives() {
    const G = this.G;
    for (let i = 0; i < 2; i++) {
      const t = G.p[i].titan;
      if (!t) continue;
      switch (t.id) {
        case 'kargath':
          getAllUnits(G, i).forEach(({ unit, r, c }) => {
            if (unit.elem === 'fire' && getTerrain(G, r, c) === 'volcano') unit._turnBuffs.volcanoBuff = 2;
          });
          break;
        case 'thalor':
          getAllUnits(G, i).forEach(({ unit }) => {
            if (unit.elem === 'earth') unit._armor = Math.max(unit._armor, 2);
          });
          break;
        case 'nyx':
          getAllUnits(G, i).forEach(({ unit }) => {
            if (unit.elem === 'shadow' && !unit.hasAttacked) unit._stealthed = true;
          });
          break;
      }
    }
  }

  activateTitan() {
    const G = this.G;
    const p = G.p[G.ap];
    const t = p.titan;
    if (!t || G.phase !== 2 || G.deployLeft <= 0) return;
    if (p.energy < t.activeCost) { this.log('Not enough energy!'); return; }
    p.energy -= t.activeCost;
    G.deployLeft--;
    this.log('Player ' + (G.ap + 1) + ' activates ' + t.name + '!');

    switch (t.id) {
      case 'kargath': {
        const enemies = shuffle(getAllUnits(G, enemy(G.ap)));
        let dmgLeft = 4;
        for (const e of enemies) {
          if (dmgLeft <= 0) break;
          const d = Math.min(2, dmgLeft);
          this.dealDamage(e.unit, d, e.r, e.c);
          dmgLeft -= d;
        }
        if (enemies.length === 0) { G.p[enemy(G.ap)].hp -= 4; this.log('No enemies on board. Titan takes 4!'); }
        break;
      }
      case 'thalor': {
        G.sel = { type: 'titan_target', action: 'thalor' };
        G.highlights = getAllUnits(G, G.ap).map(u => ({ r: u.r, c: u.c, type: 'deploy' as const }));
        this.log('Click an ally to grant Divine Shield + Taunt.');
        this.cb.onRender();
        return;
      }
      case 'sylara': {
        G.sel = { type: 'titan_target', action: 'sylara' };
        G.highlights = getAllUnits(G, G.ap).filter(u => !u.unit.isToken).map(u => ({ r: u.r, c: u.c, type: 'deploy' as const }));
        this.log('Click an ally to return to hand.');
        this.cb.onRender();
        return;
      }
      case 'nyx': {
        G.sel = { type: 'titan_target', action: 'nyx' };
        G.highlights = getAllUnits(G, enemy(G.ap)).map(u => ({ r: u.r, c: u.c, type: 'attack' as const }));
        this.log('Click an enemy to poison.');
        this.cb.onRender();
        return;
      }
      case 'elandor': {
        if (G.lastSpell) {
          p.hand.push(deepClone(G.lastSpell));
          this.log('Copied ' + G.lastSpell.name + '!');
        } else {
          this.log('No spell to copy!');
          p.energy += t.activeCost;
          G.deployLeft++;
        }
        break;
      }
    }
    this.cb.onRender();
  }

  handleTitanTarget(r: number, c: number) {
    const G = this.G;
    const action = G.sel?.action;
    G.sel = null; G.highlights = [];
    const unit = G.board[r][c];
    if (!unit) return;

    switch (action) {
      case 'thalor':
        if (unit.owner !== G.ap) return;
        unit._divine_shield = true;
        if (!unit.kw.includes('taunt')) unit.kw.push('taunt');
        this.log(unit.name + ' gains Divine Shield and Taunt!');
        break;
      case 'sylara':
        if (unit.owner !== G.ap || unit.isToken) return;
        const card = getCardById(unit.id);
        if (card) G.p[G.ap].hand.push(deepClone(card));
        G.board[r][c] = null;
        drawCards(G, G.ap, 1);
        this.log(unit.name + ' returned to hand. Drew 1.');
        break;
      case 'nyx':
        if (unit.owner === G.ap) return;
        unit.effects.push({ type: 'poison', val: 1, dur: 3 });
        drawCards(G, G.ap, 1);
        this.log(unit.name + ' poisoned! Drew 1.');
        break;
    }
    this.cb.onRender();
  }

  // =================== DEPLOYMENT ===================
  getValidDeployTiles(card: CardDef): { r: number; c: number }[] {
    const G = this.G;
    const tiles: { r: number; c: number }[] = [];
    const zones = G.ap === 0 ? [3, 4] : [0, 1];
    if (getAllUnits(G, G.ap).some(u => u.r === 2)) zones.push(2);
    for (const r of zones) {
      for (let c = 0; c < 7; c++) {
        if (G.board[r][c]) continue;
        const t = getTerrain(G, r, c);
        if (t === 'mountain' && !(card.kw?.includes('flying'))) continue;
        tiles.push({ r, c });
      }
    }
    return tiles;
  }

  deployCard(handIdx: number, r: number, c: number): boolean {
    const G = this.G;
    const p = G.p[G.ap];
    const card = p.hand[handIdx];
    if (!card) return false;
    if (G.phase !== 2 || G.deployLeft <= 0) return false;

    let cost = card.cost || 0;
    if (G.p[G.ap].titan && card.elem === G.p[G.ap].titan!.elem) cost = Math.max(0, cost - 1);
    if (card.type === 'spell' && G.p[G.ap].titanId === 'elandor') cost = Math.max(0, cost - 1);
    if (card.type === 'spell') {
      getAllUnits(G, G.ap).forEach(u => { if (u.unit.id === 'arcane_sanctum') cost = Math.max(0, cost - 1); });
    }
    if (card.race === 'Goblin' && countRace(G, G.ap, 'Goblin') >= 3) cost = Math.max(0, cost - 1);
    if (p.energy < cost) { this.log('Not enough energy! Need ' + cost); return false; }

    if (card.type === 'spell') {
      p.energy -= cost;
      G.deployLeft--;
      p.hand.splice(handIdx, 1);
      G.lastSpell = deepClone(card);
      this.cb.onPlaySFX('cardPlay');
      this.resolveSpell(card, r, c);
      this.triggerInspire(G.ap);
      this.cb.onRender();
      return true;
    }

    const valid = this.getValidDeployTiles(card);
    if (!valid.find(t => t.r === r && t.c === c)) { this.log('Invalid placement!'); return false; }

    p.energy -= cost;
    G.deployLeft--;
    p.hand.splice(handIdx, 1);
    const unit = createUnit(card, G.ap);
    unit._r = r; unit._c = c;
    G.board[r][c] = unit;

    if (getTerrain(G, r, c) === 'swamp') {
      unit.hp -= 1;
      this.cb.onPopup(r, c, '-1');
      if (unit.hp <= 0) { this.destroyUnit(r, c); return true; }
    }

    this.cb.onPlaySFX('cardPlay');
    this.log('Player ' + (G.ap + 1) + ' deployed ' + card.name + '!');

    if (unit.kw.includes('haste') || unit.kw.includes('rush')) { unit.ready = true; unit.movesLeft = unit.move; }
    if (unit.kw.includes('charge')) unit.ready = true;
    if (unit.kw.includes('battlecry')) this.processBattlecry(unit, r, c);
    this.triggerInspire(G.ap);

    if (unit._demonSummon || (countRace(G, G.ap, 'Demon') >= 5 && unit.race === 'Demon')) {
      G.p[enemy(G.ap)].hp -= 1;
      this.log('Demon synergy: enemy Titan takes 1 damage!');
    }
    if (countRace(G, G.ap, 'Human') >= 3 && unit.race === 'Human') drawCards(G, G.ap, 1);

    this.checkWin();
    this.cb.onRender();
    return true;
  }

  // =================== SPELLS ===================
  resolveSpell(card: CardDef, targetR: number, targetC: number) {
    const G = this.G;
    this.log('Cast ' + card.name + '!');
    this.cb.onPlaySFX(card.elem === 'fire' ? 'fireball' : card.elem === 'shadow' ? 'shadowHum' : card.id === 'healing_light' || card.id === 'divine_favor' ? 'healChime' : 'arcanePulse');

    const target = G.board[targetR]?.[targetC] || null;
    switch (card.id) {
      case 'fireball': if (target) this.dealDamage(target, 5, targetR, targetC); else { G.p[enemy(G.ap)].hp -= 5; } break;
      case 'healing_light': if (target && target.owner === G.ap) { const h = Math.min(4, target.maxHp - target.hp); target.hp += h; } else { G.p[G.ap].hp = Math.min(G.p[G.ap].titan!.hp, G.p[G.ap].hp + 4); } break;
      case 'shadow_strike': if (target) this.dealDamage(target, 3, targetR, targetC); else G.p[enemy(G.ap)].hp -= 3; drawCards(G, G.ap, 1); break;
      case 'earthquake': for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) { const u = G.board[r][c]; if (u && !u.kw.includes('flying')) this.dealDamage(u, 2, r, c); } break;
      case 'wind_rush': if (target && target.owner === G.ap) { target.movesLeft += 3; target.move += 3; } break;
      case 'arcane_intellect': drawCards(G, G.ap, 2); break;
      case 'frost_nova': getAllUnits(G, enemy(G.ap)).forEach(e => { e.unit._frozen = true; }); this.log('All enemies frozen!'); break;
      case 'raise_dead': spawnTokensInZone(G, G.ap, 'skeleton', 2); break;
      case 'divine_favor': if (target && target.owner === G.ap) { target._divine_shield = true; target.atk += 1; target.hp += 1; target.maxHp += 1; } break;
      case 'lightning_bolt': if (target) this.dealDamage(target, 3, targetR, targetC); else G.p[enemy(G.ap)].hp -= 3; break;
      default: {
        const txt = (card.text || '').toLowerCase();
        if (txt.includes('deal') && txt.includes('damage')) {
          const m = card.text.match(/(\d+)\s*damage/i);
          const dmg = m ? parseInt(m[1]) : 2;
          if (target) this.dealDamage(target, dmg, targetR, targetC); else G.p[enemy(G.ap)].hp -= dmg;
        }
        if (txt.includes('draw')) { const m = card.text.match(/draw\s*(\d+)/i); drawCards(G, G.ap, m ? parseInt(m[1]) : 1); }
      }
    }
    this.checkWin();
  }

  processBattlecry(unit: Unit, r: number, c: number) {
    const G = this.G;
    switch (unit.id) {
      case 'goblin_engineer': spawnTokensAdjacent(G, r, c, unit.owner, 'mech', 1); this.log('Battlecry: Summoned a Mech!'); break;
      case 'elven_sage': drawCards(G, unit.owner, 1); this.log('Battlecry: Drew 1 card!'); break;
      case 'light_priestess': {
        const allies = getAdjacentUnits(G, r, c, unit.owner);
        if (allies.length > 0) {
          const a = allies[0];
          const h = Math.min(3, a.unit.maxHp - a.unit.hp);
          a.unit.hp += h;
          this.cb.onPopup(a.r, a.c, '+' + h, true);
          this.log('Battlecry: Healed ' + a.unit.name + ' for ' + h);
        }
        break;
      }
    }
  }

  triggerInspire(owner: number) {
    const G = this.G;
    getAllUnits(G, owner).forEach(({ unit, r, c }) => {
      if (unit.kw.includes('inspire')) {
        switch (unit.id) {
          case 'dark_necromancer': spawnTokensAdjacent(G, r, c, owner, 'skeleton', 1); break;
          case 'orcish_warlord': getAllUnits(G, owner).filter(u => u.unit.race === 'Orc').forEach(u => { u.unit._turnBuffs.inspireAtk = (u.unit._turnBuffs.inspireAtk || 0) + 1; }); break;
        }
      }
    });
  }

  // =================== MOVEMENT ===================
  getValidMoves(r: number, c: number): { r: number; c: number }[] {
    const G = this.G;
    const unit = G.board[r][c];
    if (!unit || unit.owner !== G.ap || !unit.ready || unit.type === 'structure') return [];
    const maxDist = unit.movesLeft;
    if (maxDist <= 0) return [];
    const moves: { r: number; c: number }[] = [];
    const visited: Record<string, number> = {};
    const queue: { r: number; c: number; cost: number }[] = [{ r, c, cost: 0 }];
    visited[r + ',' + c] = 0;

    while (queue.length > 0) {
      const cur = queue.shift()!;
      const dirs: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dr, dc] of dirs) {
        const nr = cur.r + dr, nc = cur.c + dc;
        if (!inBounds(nr, nc)) continue;
        const terrain = getTerrain(G, nr, nc);
        if (terrain === 'mountain' && !unit.kw.includes('flying')) continue;
        if (G.board[nr][nc]) continue;
        let moveCost = 1;
        if (terrain === 'water' && !unit.kw.includes('flying')) {
          moveCost = (unit._noWaterPenalty || unit.race === 'Merfolk') ? 1 : 2;
        }
        if (terrain === 'forest' && unit.race === 'Elf') moveCost = Math.max(0.5, moveCost - 1) || 1;
        const totalCost = cur.cost + moveCost;
        if (totalCost > maxDist) continue;
        const key = nr + ',' + nc;
        if (visited[key] !== undefined && visited[key] <= totalCost) continue;
        visited[key] = totalCost;
        moves.push({ r: nr, c: nc });
        queue.push({ r: nr, c: nc, cost: totalCost });
      }
    }
    return moves;
  }

  moveUnit(fromR: number, fromC: number, toR: number, toC: number): boolean {
    const G = this.G;
    const unit = G.board[fromR][fromC];
    if (!unit) return false;
    G.board[fromR][fromC] = null;
    G.board[toR][toC] = unit;
    unit._r = toR; unit._c = toC;

    const terrain = getTerrain(G, toR, toC);
    let cost = 1;
    if (terrain === 'water' && !unit.kw.includes('flying') && !unit._noWaterPenalty && unit.race !== 'Merfolk') cost = 2;
    unit.movesLeft = Math.max(0, unit.movesLeft - cost);

    if (terrain === 'swamp' && !unit.kw.includes('flying') && !unit._elemImmune) {
      unit.hp -= 1;
      this.cb.onPopup(toR, toC, '-1');
      this.log(unit.name + ' takes 1 swamp damage!');
      if (unit.hp <= 0) { this.destroyUnit(toR, toC); return true; }
    }

    if (unit.id === 'stone_golem' && unit.vetLv >= 2) {
      getAdjacentUnits(G, toR, toC, enemy(unit.owner)).forEach(e => this.dealDamage(e.unit, 1, e.r, e.c));
    }
    if (unit.id === 'beast_rider' && unit.vetLv >= 2) {
      unit._turnBuffs.momentum = (unit._turnBuffs.momentum || 0) + 1;
    }

    this.log(unit.name + ' moves to (' + toR + ',' + toC + ')');
    return true;
  }

  // =================== COMBAT ===================
  getValidTargets(r: number, c: number): { r: number; c: number }[] {
    const G = this.G;
    const unit = G.board[r][c];
    if (!unit || unit.owner !== G.ap || !unit.ready || unit.hasAttacked || unit.type === 'structure') return [];
    if (unit._frozen) return [];
    const targets: { r: number; c: number }[] = [];
    const tauntTargets: { r: number; c: number }[] = [];
    let range = unit.range || 1;

    getAdjacentUnits(G, r, c, unit.owner).forEach(({ unit: su }) => {
      if (su.id === 'elven_watchtower') range += 1 + (su.vetLv >= 2 ? 1 : 0);
    });

    for (let tr = 0; tr < 5; tr++) for (let tc = 0; tc < 7; tc++) {
      const t = G.board[tr][tc];
      if (!t || t.owner === unit.owner) continue;
      if (t._stealthed) continue;
      const dist = Math.abs(tr - r) + Math.abs(tc - c);
      if (dist > range) continue;
      if (range === 1 && (getTerrain(G, r, c) === 'water' || getTerrain(G, tr, tc) === 'water') && !unit.kw.includes('flying')) continue;
      if (t.kw.includes('elusive') && range <= 1) continue;
      if (range > 1 && !this.hasLineOfSight(r, c, tr, tc)) continue;
      if (t.kw.includes('taunt') || t.kw.includes('guard')) tauntTargets.push({ r: tr, c: tc });
      targets.push({ r: tr, c: tc });
    }
    return tauntTargets.length > 0 ? tauntTargets : targets;
  }

  hasLineOfSight(r1: number, c1: number, r2: number, c2: number): boolean {
    const steps = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1));
    for (let i = 1; i < steps; i++) {
      const checkR = Math.round(r1 + (r2 - r1) * i / steps);
      const checkC = Math.round(c1 + (c2 - c1) * i / steps);
      if (inBounds(checkR, checkC) && getTerrain(this.G, checkR, checkC) === 'mountain') return false;
    }
    return true;
  }

  calcDamage(attacker: Unit, aR: number, aC: number, defender: Unit, dR: number, dC: number): number {
    const G = this.G;
    let atk = attacker.atk;
    const aH = getHeight(G, aR, aC);
    const dH = getHeight(G, dR, dC);
    if (aH > dH) atk += 2;
    if (dH > aH) atk -= 1;
    if (attacker.elem === 'fire' && getTerrain(G, aR, aC) === 'volcano') atk += 2;
    if (attacker._turnBuffs?.volcanoBuff) atk += attacker._turnBuffs.volcanoBuff;
    if (attacker._turnBuffs?.momentum) atk += attacker._turnBuffs.momentum;
    if (attacker._turnBuffs?.inspireAtk) atk += attacker._turnBuffs.inspireAtk;
    if (attacker._stealthed && attacker.id === 'void_stalker') atk += 2;
    if (attacker._dragonBonus && !defender.kw.includes('flying')) atk += attacker._dragonBonus;
    let def = getTerrainDefBonus(G, dR, dC);
    def += defender._armor || 0;
    getAdjacentUnits(G, aR, aC, attacker.owner).forEach(({ unit: su }) => {
      if (su.id === 'orcish_war_drum') atk += 1 + (su.vetLv >= 2 ? 1 : 0);
    });
    if (attacker.kw.includes('enrage') && attacker.hp < attacker.maxHp) atk += 2;
    if (attacker._goblinStrike && !attacker._goblinStrikeUsed) { atk += 2; attacker._goblinStrikeUsed = true; }
    return Math.max(0, atk - def);
  }

  resolveCombat(aR: number, aC: number, dR: number, dC: number) {
    const G = this.G;
    let attacker = G.board[aR][aC];
    let defender = G.board[dR][dC];
    if (!attacker || !defender) return;

    attacker._stealthed = false;
    attacker.hasAttacked = true;
    const isRanged = (attacker.range || 1) > 1;
    const animDelay = 350;

    this.cb.onPlaySFX(isRanged ? 'arrowShot' : 'swordHit');
    this.cb.onAnimate(isRanged ? 'rangedProjectile' : 'meleeSlash', aR, aC, dR, dC);

    G.animating = true;
    this.cb.onRender();

    setTimeout(() => {
      attacker = G.board[aR][aC]; defender = G.board[dR][dC];
      if (!attacker || !defender) { G.animating = false; this.cb.onRender(); return; }

      const atkDmg = this.calcDamage(attacker, aR, aC, defender, dR, dC);
      let defDmg = 0;
      const defRange = defender.range || 1;
      const dist = Math.abs(aR - dR) + Math.abs(aC - dC);
      if (dist <= defRange && defender.type !== 'structure') {
        defDmg = this.calcDamage(defender, dR, dC, attacker, aR, aC);
      }
      if (defender.id === 'crystal_guardian' && defender.vetLv >= 2) defDmg += 1;

      this.log(attacker.name + ' attacks ' + defender.name + ' for ' + atkDmg + (defDmg > 0 ? ' (retaliates ' + defDmg + ')' : ''));

      // Apply damage to defender
      if (defender._divine_shield && atkDmg > 0) {
        defender._divine_shield = false;
        this.cb.onPopup(dR, dC, 'BLOCKED');
      } else if (defender._ward && attacker.range > 1) {
        defender._ward = false;
        this.cb.onPopup(dR, dC, 'WARDED');
      } else {
        defender.hp -= atkDmg;
        if (atkDmg > 0) this.cb.onPopup(dR, dC, '-' + atkDmg);
        if (attacker.kw.includes('poisonous') && atkDmg > 0) defender.effects.push({ type: 'poison', val: 1, dur: 3 });
        if ((attacker.kw.includes('freeze') || attacker.id === 'frost_mage') && atkDmg > 0) defender._frozen = true;
        if (attacker.kw.includes('lifesteal') && atkDmg > 0) {
          const heal = Math.min(atkDmg, G.p[attacker.owner].titan!.hp - G.p[attacker.owner].hp);
          G.p[attacker.owner].hp += Math.max(0, heal);
        }
      }

      // Retaliation
      if (defDmg > 0) {
        if (attacker._divine_shield) { attacker._divine_shield = false; this.cb.onPopup(aR, aC, 'BLOCKED'); }
        else {
          attacker.hp -= defDmg;
          this.cb.onPopup(aR, aC, '-' + defDmg);
          if (defender.kw.includes('poisonous') && defDmg > 0) attacker.effects.push({ type: 'poison', val: 1, dur: 3 });
        }
      }

      // Trample
      if (attacker.kw.includes('trample') && defender.hp <= 0) {
        const excess = Math.abs(defender.hp);
        if (excess > 0) { G.p[enemy(attacker.owner)].hp -= excess; this.log('Trample! ' + excess + ' damage to enemy Titan!'); }
      }

      const defDied = defender.hp <= 0;
      const atkDied = attacker.hp <= 0;
      if (defDied) { this.destroyUnit(dR, dC); G.p[attacker.owner].titan!.kills++; if (attacker._orcBonus) attacker.atk += 1; }
      if (atkDied) { this.destroyUnit(aR, aC); if (defender && G.board[dR][dC]) G.p[defender.owner].titan!.kills++; }
      if (attacker.kw.includes('windfury') && !atkDied && !attacker._windfuryUsed) { attacker._windfuryUsed = true; attacker.hasAttacked = false; }

      this.checkWin();
      G.animating = false;
      G.sel = null; G.highlights = [];
      this.cb.onRender();
    }, animDelay);
  }

  // =================== DAMAGE & DESTRUCTION ===================
  dealDamage(unit: Unit, dmg: number, r: number, c: number) {
    if (!unit) return;
    if (unit._divine_shield && dmg > 0) { unit._divine_shield = false; this.cb.onPopup(r, c, 'BLOCKED'); return; }
    if (unit._ward && dmg > 0) { unit._ward = false; this.cb.onPopup(r, c, 'WARDED'); return; }
    const finalDmg = Math.max(0, dmg - (unit._armor || 0));
    unit.hp -= finalDmg;
    if (finalDmg > 0) this.cb.onPopup(r, c, '-' + finalDmg);
    if (unit.hp <= 0) this.destroyUnit(r, c);
  }

  destroyUnit(r: number, c: number) {
    const G = this.G;
    const unit = G.board[r][c];
    if (!unit) return;
    this.cb.onPlaySFX('deathSound');
    this.cb.onAnimate('deathShatter', r, c);
    this.log(unit.name + ' destroyed!');

    if (unit.kw.includes('deathrattle')) {
      switch (unit.id) {
        case 'goblin_saboteur': {
          const dmg = unit.vetLv >= 1 ? 3 : 2;
          getAdjacentUnits(G, r, c).forEach(a => this.dealDamage(a.unit, dmg, a.r, a.c));
          break;
        }
        case 'phoenix_hatchling': {
          const card = getCardById('phoenix_hatchling');
          if (card) G.p[unit.owner].hand.push(deepClone(card));
          this.log('Phoenix returns to hand!');
          break;
        }
        case 'plague_bearer':
          getAdjacentUnits(G, r, c, enemy(unit.owner)).forEach(a => { a.unit.effects.push({ type: 'poison', val: 1, dur: 2 }); });
          break;
      }
    }

    if (unit._undeadRespawn || (unit.race === 'Undead' && countRace(G, unit.owner, 'Undead') >= 3)) {
      spawnTokensAdjacent(G, r, c, unit.owner, 'skeleton', 1);
    }

    if (unit.id === 'undead_warrior' && unit.vetLv >= 3 && !unit._ariseUsed) {
      unit._ariseUsed = true;
      const u2 = createUnit(getCardById('undead_warrior')!, unit.owner);
      u2.hp = 1; u2.maxHp = u2.hp;
      G.board[r][c] = u2;
      u2._r = r; u2._c = c;
      this.log('Undead Warrior arises!');
      return;
    }

    G.p[unit.owner].grave.push(unit);
    G.board[r][c] = null;
  }

  checkWin(): boolean {
    const G = this.G;
    for (let i = 0; i < 2; i++) {
      if (G.p[i].hp <= 0) {
        G.p[i].hp = 0;
        this.cb.onVictory(enemy(i));
        this.log('GAME OVER! Player ' + (enemy(i) + 1) + ' wins!');
        this.cb.onPlaySFX('victory');
        return true;
      }
    }
    return false;
  }

  // =================== CELL CLICK HANDLER ===================
  onCellClick(r: number, c: number) {
    const G = this.G;
    if (G.animating) return;

    // Titan target mode
    if (G.sel?.type === 'titan_target') {
      const hl = G.highlights.find(h => h.r === r && h.c === c);
      if (hl) this.handleTitanTarget(r, c);
      else { G.sel = null; G.highlights = []; this.cb.onRender(); }
      return;
    }

    // Spell targeting
    if (G.sel?.type === 'spell' && G.sel.idx !== undefined) {
      this.deployCard(G.sel.idx, r, c);
      G.sel = null; G.highlights = [];
      this.cb.onRender();
      return;
    }

    // Card placement
    if (G.sel?.type === 'card' && G.sel.idx !== undefined) {
      const hl = G.highlights.find(h => h.r === r && h.c === c);
      if (hl) {
        this.deployCard(G.sel.idx, r, c);
        G.sel = null; G.highlights = [];
      } else {
        G.sel = null; G.highlights = [];
      }
      this.cb.onRender();
      return;
    }

    const unit = G.board[r][c];

    // Movement phase
    if (G.phase === 3) {
      const hl = G.highlights.find(h => h.r === r && h.c === c);
      if (G.sel?.type === 'unit' && hl && G.sel.r !== undefined && G.sel.c !== undefined) {
        this.moveUnit(G.sel.r, G.sel.c, r, c);
        G.sel = null; G.highlights = [];
        this.cb.onRender();
        return;
      }
      if (unit && unit.owner === G.ap && unit.ready && unit.movesLeft > 0 && unit.type !== 'structure') {
        G.sel = { type: 'unit', r, c };
        const moves = this.getValidMoves(r, c);
        G.highlights = moves.map(m => ({ r: m.r, c: m.c, type: 'move' as const }));
        this.cb.onRender();
        return;
      }
      G.sel = null; G.highlights = [];
      this.cb.onRender();
      return;
    }

    // Combat phase
    if (G.phase === 4) {
      const hl = G.highlights.find(h => h.r === r && h.c === c);
      if (G.sel?.type === 'unit' && hl && G.sel.r !== undefined && G.sel.c !== undefined) {
        this.resolveCombat(G.sel.r, G.sel.c, r, c);
        return;
      }
      if (unit && unit.owner === G.ap && unit.ready && !unit.hasAttacked && unit.type !== 'structure') {
        G.sel = { type: 'unit', r, c };
        const targets = this.getValidTargets(r, c);
        G.highlights = targets.map(t => ({ r: t.r, c: t.c, type: 'attack' as const }));
        this.cb.onRender();
        return;
      }
      G.sel = null; G.highlights = [];
      this.cb.onRender();
      return;
    }

    G.sel = null; G.highlights = [];
    this.cb.onRender();
  }

  // =================== CARD CLICK HANDLER ===================
  onCardClick(idx: number) {
    const G = this.G;
    if (G.phase !== 2 || G.deployLeft <= 0 || G.animating) return;
    const card = G.p[G.ap].hand[idx];
    if (!card) return;

    const needsTarget = card.type === 'spell' && ['fireball', 'healing_light', 'shadow_strike', 'wind_rush', 'divine_favor', 'lightning_bolt'].includes(card.id);

    if (card.type === 'spell' && !needsTarget) {
      this.deployCard(idx, 0, 0);
      return;
    }

    if (card.type === 'spell' && needsTarget) {
      G.sel = { type: 'spell', idx };
      // All cells are valid for spells
      G.highlights = [];
      for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) {
        if (G.board[r][c]) G.highlights.push({ r, c, type: 'attack' });
      }
      this.cb.onRender();
      return;
    }

    // Unit/Structure
    G.sel = { type: 'card', idx };
    const tiles = this.getValidDeployTiles(card);
    G.highlights = tiles.map(t => ({ r: t.r, c: t.c, type: 'deploy' as const }));
    this.cb.onRender();
  }
}
