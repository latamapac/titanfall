# Titanfall Chronicles - Codebase Optimization Plan

> **Analysis Date:** 2026-02-12  
> **Current LOC:** ~5,941 lines (src/)  
> **Target:** Improve maintainability, performance, and type safety

---

## Executive Summary

This document outlines specific recommendations to optimize the Titanfall Chronicles codebase. The analysis identified 7 key areas for improvement: code duplication, file organization, component complexity, naming conventions, unused code, type safety, and test coverage.

---

## 1. Code Duplication 🔁

### 1.1 Critical: Two Parallel UI Versions (V1 + V2)

**Issue:** The codebase maintains two complete UI implementations:
- `src/App.tsx` + `src/components/screens/*` + `src/components/game/*` (V1)
- `src/AppV2.tsx` + `src/components/v2/*` (V2)

**Impact:** 
- 2,400+ lines of duplicated screen components
- Maintenance burden - every feature change requires updates in both places
- Bundle size bloat

**Recommendation:** 
```
Priority: HIGH
Effort: 2-3 days
Action: Consolidate to V2 only, remove V1 components
```

**Migration Plan:**
1. Move `AppV2.tsx` → `App.tsx` (replace)
2. Move `components/v2/*` → `components/game/*`
3. Delete V1 components:
   - `components/screens/GameScreen.tsx`
   - `components/screens/NewGameScreen.tsx`
   - `components/game/Board.tsx`
   - `components/game/Cell.tsx`
   - `components/game/HandArea.tsx`
   - `components/game/PlayerBar.tsx`
   - `components/game/Sidebar.tsx`
   - `components/game/UnitToken.tsx`
4. Move `components/v2/CharacterSelectV2.tsx` → `components/screens/CharacterSelectScreen.tsx`
5. Delete `components/v2/CharacterSelect.tsx` (unused V2 duplicate)

### 1.2 Duplicate Character Select Components

**Issue:** Two character select implementations:
- `components/v2/CharacterSelect.tsx` (456 lines)
- `components/v2/CharacterSelectV2.tsx` (428 lines)

**Recommendation:** Keep `CharacterSelectV2.tsx` (better memoization), delete the other.

### 1.3 Inline Styles Duplication

**Issue:** Heavy use of inline styles with repeated patterns:
```tsx
// Repeated pattern in BattleScreen.tsx
style={{
  position: 'absolute',
  top: '3px',
  left: '3px',
  // ... repeated 20+ times
}}
```

**Recommendation:** Extract to CSS classes or styled-components.

---

## 2. File Organization 📁

### 2.1 Current Structure Issues

```
src/
├── components/
│   ├── game/          # V1 game components (to be removed)
│   ├── overlays/      # Only 2 files - merge into screens/
│   ├── screens/       # V1 screens (to be removed)
│   ├── ui/            # EMPTY folder
│   └── v2/            # V2 components (inconsistent naming)
├── styles/
│   ├── *.css          # V1 styles
│   └── v2/            # V2 styles (inconsistent)
└── tests/             # Only 1 test file at root
```

### 2.2 Recommended Structure

```
src/
├── components/
│   ├── ui/            # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── game/          # Game-specific components
│   │   ├── BattleScreen.tsx
│   │   ├── CharacterSelect.tsx
│   │   ├── Board.tsx
│   │   ├── Hand.tsx
│   │   ├── TitanPortrait.tsx
│   │   └── ParticleEffects.tsx
│   └── screens/       # Full page screens
│       ├── MenuScreen.tsx
│       ├── LobbyScreen.tsx
│       ├── DeckBuilderScreen.tsx
│       ├── CardCreatorScreen.tsx
│       └── RulesScreen.tsx
├── styles/
│   ├── variables.css    # CSS custom properties
│   ├── global.css       # Global styles
│   ├── animations.css   # All animations consolidated
│   └── components/      # Component-specific styles
│       ├── button.css
│       ├── card.css
│       └── board.css
├── hooks/
├── engine/
├── ai/
├── data/
├── types/
└── __tests__/           # Colocated or centralized tests
    ├── engine/
    │   └── GameEngine.test.ts
    ├── components/
    └── integration/
```

### 2.3 Specific Moves

| From | To | Reason |
|------|-----|--------|
| `components/v2/BattleScreen.tsx` | `components/game/BattleScreen.tsx` | Remove v2 suffix |
| `components/v2/CharacterSelectV2.tsx` | `components/screens/CharacterSelectScreen.tsx` | Consistent naming |
| `components/v2/Card.tsx` | `components/ui/Card.tsx` | Reusable UI component |
| `components/v2/TitanPortrait.tsx` | `components/game/TitanPortrait.tsx` | Game-specific |
| `components/v2/ParticleEffects.tsx` | `components/game/ParticleEffects.tsx` | Game-specific |
| `components/v2/ArtAsset.tsx` | `components/ui/ArtAsset.tsx` | Reusable art component |
| `styles/v2/*` | `styles/` | Consolidate styles |
| `components/overlays/*` | `components/game/` or merge into screens | Simplify structure |

---

## 3. Component Complexity 🏗️

### 3.1 Large Components Requiring Refactoring

| Component | Lines | Issue | Recommendation |
|-----------|-------|-------|----------------|
| `BattleScreen.tsx` | 986 | Too many responsibilities | Split into sub-components |
| `App.tsx` | 560 | Handles too much state | Extract multiplayer logic to hook |
| `GameEngine.ts` | 933 | God class | Split into phase handlers |
| `GameEngine.full.test.ts` | 1,262 | Test file too large | Split by feature |
| `useAnimations.ts` | 635 | Multiple concerns | Split by animation type |
| `useTouch.ts` | 449 | Complex gesture logic | Extract gesture handlers |

### 3.2 BattleScreen.tsx Refactor Plan

**Current:** Single 986-line component

**Proposed Structure:**
```tsx
// BattleScreen.tsx - orchestrator only (~200 lines)
<BattleScreen>
  <Battlefield />        // Grid + units (~250 lines)
  <PlayerPanel />        // Titan info + HP (~150 lines)
  <Hand />               // Cards in hand (~100 lines)
  <Sidebar />            // Phase + logs (~150 lines)
  <TurnOverlay />        // Turn transition (~100 lines)
  <VictoryOverlay />     // Game end (~80 lines)
  <ParticleEffects />    // Visual effects (~150 lines)
</BattleScreen>
```

### 3.3 App.tsx Refactor Plan

**Extract to Custom Hooks:**
```tsx
// New hooks to create:
- useMultiplayer()    // Socket connection, room management
- useAI()             // AI game mode logic  
- useGameScreens()    // Screen navigation state
```

---

## 4. Naming Conventions 📝

### 4.1 Current Inconsistencies

| Issue | Example | Recommended |
|-------|---------|-------------|
| Abbreviated types | `G`, `p`, `ap` | `gameState`, `player`, `activePlayer` |
| Hungarian notation | `_r`, `_c`, `_armor` | `row`, `col`, `armor` |
| Inconsistent suffixes | `V2`, `V2` in filenames | Remove versions |
| Abbreviated handlers | `cb` | `callbacks` |
| Magic numbers | `G.p[0]`, `G.p[1]` | `PLAYER_ONE`, `PLAYER_TWO` |

### 4.2 Type Naming Issues

```ts
// Current (src/types/game.ts)
interface Unit {
  _r: number;        // Should be: row
  _c: number;        // Should be: col
  _armor: number;    // Should be: armor
  _turnBuffs: {};    // Should be: turnBuffs
  kw: Keyword[];     // Should be: keywords
  // ...
}
```

### 4.3 File Naming

| Current | Recommended |
|---------|-------------|
| `Anim.ts` | `animations.ts` |
| `SFX.ts` | `soundEffects.ts` or `audio.ts` |
| `useHaptic.ts` | `useHaptics.ts` (plural consistency) |

---

## 5. Unused Code 🗑️

### 5.1 Empty/Unused Files

| File | Status | Action |
|------|--------|--------|
| `src/components/ui/` | Empty directory | Delete or add shared UI components |
| `src/components/v2/CharacterSelect.tsx` | Superseded by V2 | Delete |
| `src/assets/react.svg` | Unused default asset | Delete |
| `src/App.css` | Only 25 lines, mostly unused | Merge into globals.css |

### 5.2 Potentially Dead Code

```bash
# Check for unused exports
npx ts-prune  # Run to find unused exports
```

**Suspected Unused:**
- `components/screens/NewGameScreen.tsx` - May be replaced by CharacterSelectV2
- `components/overlays/TurnOverlay.tsx` - Check if V2 uses its own
- Some animation utilities in `useAnimations.ts`

### 5.3 Duplicate CSS

**Issue:** `styles/animations.css` and `styles/v2/animations.css` have overlapping keyframes.

**Action:** Consolidate into single animation system.

---

## 6. Type Safety 🔒

### 6.1 Missing/Weak Types

| Location | Issue | Fix |
|----------|-------|-----|
| `GameEngine.ts:183` | `animQueue: unknown[]` | Define `Animation` interface |
| `useGameEngine.ts:46` | Callback args as `unknown[]` | Define proper types |
| `App.tsx:163` | `action.payload` as optional | Make required with type union |
| `game.ts:98-99` | `elem: Element \| ''` | Remove empty string, use proper default |

### 6.2 Any Types to Remove

```bash
# Search for explicit any
npx eslint . --rule '@typescript-eslint/no-explicit-any: error'
```

### 6.3 Strict TypeScript Configuration

**Current:** `tsconfig.app.json`

**Recommended additions:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 6.4 Shared Type Exports

Create `src/types/index.ts` for centralized type exports:
```ts
export type { GameState, Unit, CardDef, /* ... */ } from './game';
export type { AnimationType, AnimationState } from './animations';
// etc.
```

---

## 7. Test Coverage 🧪

### 7.1 Current State

| Component | Test Coverage |
|-----------|---------------|
| GameEngine.ts | ✅ Has tests (1,262 lines) |
| Components | ❌ No tests |
| Hooks | ❌ No tests |
| Utils | ❌ No tests |
| AI | ❌ No tests |

### 7.2 Recommended Test Structure

```
src/
└── __tests__/
    ├── unit/
    │   ├── engine/
    │   │   ├── GameEngine.test.ts
    │   │   ├── GameEngine.combat.test.ts
    │   │   ├── GameEngine.phases.test.ts
    │   │   └── utils.test.ts
    │   ├── hooks/
    │   │   ├── useGameEngine.test.ts
    │   │   └── useAnimations.test.ts
    │   └── ai/
    │       └── GameAI.test.ts
    ├── integration/
    │   ├── game-flow.test.ts
    │   └── multiplayer.test.ts
    └── components/
        ├── BattleScreen.test.tsx
        └── CharacterSelect.test.tsx
```

### 7.3 Priority Test Additions

| Priority | Test | Description |
|----------|------|-------------|
| HIGH | Component render tests | Ensure screens render without errors |
| HIGH | Hook unit tests | Test useGameEngine state management |
| MEDIUM | AI decision tests | Verify AI makes valid moves |
| MEDIUM | Animation tests | Verify animation state transitions |
| LOW | Visual regression | Screenshot comparisons |

### 7.4 Test Utilities Needed

```ts
// src/__tests__/utils/test-utils.tsx
export function renderWithGameState(state: Partial<GameState>) {
  // Wrapper with game context
}

export function createMockGameState(overrides?: Partial<GameState>): GameState {
  // Factory for test states
}
```

---

## Implementation Roadmap

### Phase 1: Cleanup (Week 1)
- [ ] Remove V1 components (game/, screens/)
- [ ] Consolidate V2 to standard locations
- [ ] Delete empty `components/ui/` or add UI primitives
- [ ] Remove unused CSS files

### Phase 2: Type Safety (Week 1-2)
- [ ] Enable strict TypeScript
- [ ] Fix all `any` types
- [ ] Rename abbreviated properties (`_r` → `row`)
- [ ] Create shared types index

### Phase 3: Component Refactoring (Week 2-3)
- [ ] Split BattleScreen into sub-components
- [ ] Extract multiplayer logic from App.tsx
- [ ] Consolidate duplicate styles

### Phase 4: Testing (Week 3-4)
- [ ] Set up testing framework (Vitest + React Testing Library)
- [ ] Add component render tests
- [ ] Add hook unit tests
- [ ] Split large test file

### Phase 5: Polish (Week 4)
- [ ] Add Storybook for UI components
- [ ] Performance profiling
- [ ] Bundle analysis
- [ ] Documentation updates

---

## Quick Wins (Can Do Today)

1. **Delete empty folder:** `rm -rf src/components/ui/`
2. **Remove unused asset:** `rm src/assets/react.svg`
3. **Consolidate App files:** Move `AppV2.tsx` → `App.tsx`
4. **Fix console.logs:** Remove or convert to proper logging (6 occurrences)

---

## Metrics to Track

| Metric | Current | Target |
|--------|---------|--------|
| Total LOC (src/) | ~5,941 | < 4,500 (after V1 removal) |
| Console statements | 6 | 0 (in production) |
| Test coverage | ~20% | > 70% |
| `any` types | ? | 0 |
| Build size | ? | < 500KB gzipped |
| TypeScript strict mode | Off | On |

---

## Appendix: File Size Analysis

| File | Lines | Category |
|------|-------|----------|
| `tests/GameEngine.full.test.ts` | 1,262 | Test (too large) |
| `engine/GameEngine.ts` | 933 | Engine (acceptable) |
| `components/v2/BattleScreen.tsx` | 986 | Component (too large) |
| `hooks/useAnimations.ts` | 635 | Hook (acceptable) |
| `ai/GameAI.ts` | 580 | AI (acceptable) |
| `App.tsx` | 560 | Component (acceptable) |
| `hooks/useTouch.ts` | 449 | Hook (acceptable) |
| `audio/SFX.ts` | 301 | Audio (acceptable) |
| `engine/utils.ts` | 271 | Utils (acceptable) |

---

*Document generated by codebase analysis. Review and prioritize based on team capacity and upcoming features.*
