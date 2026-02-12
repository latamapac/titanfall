# Titanfall Chronicles - Critical Usability Audit Report

**Date:** 2026-02-12  
**Scope:** Game Screen UI/UX - Core Player Experience  
**Auditor:** UX Analysis Agent  

---

## Executive Summary

This audit identifies the **10 most critical usability issues** in Titanfall Chronicles that directly impact player comprehension, engagement, and accessibility. These issues range from hidden critical information to confusing visual hierarchies that prevent new players from understanding game state.

**Severity Distribution:**
- 🔴 **Critical (5 issues):** Blockers that prevent effective gameplay
- 🟠 **High (3 issues):** Significant friction impacting player experience  
- 🟡 **Medium (2 issues):** Noticeable issues that compound over time

---

## 🔴 Critical Issues

### 1. Unit Identity Completely Hidden Until Hover

| Aspect | Details |
|--------|---------|
| **Problem** | Unit names are invisible by default (`font-size: 0; opacity: 0`). Players cannot identify which unit is which without hovering over each token individually. |
| **Location** | `src/styles/board.css:166-182`, `src/components/game/UnitToken.tsx:31` |
| **Impact** | **CRITICAL** - New players cannot learn units, distinguish threats, or make informed tactical decisions. Board state is unreadable at a glance. |
| **Evidence** | `.u-name { font-size: 0; opacity: 0; }` - only shows on `.unit-token:hover` |

**Root Cause Analysis:**
The design prioritizes visual cleanliness over information density. Small token size (90% × 85% of cell) combined with complex terrain backgrounds makes text illegible without hover.

**Solution:**
```css
/* Always-visible abbreviated names */
.unit-token .u-name {
  font-size: 8px;
  opacity: 1;
  position: absolute;
  top: -14px;
  background: rgba(0,0,0,0.9);
  padding: 2px 6px;
  border-radius: 3px;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**Priority:** 🔴 Critical  
**Effort:** Low (CSS-only change)

---

### 2. Keyword Icons Are Cryptic Single Letters

| Aspect | Details |
|--------|---------|
| **Problem** | Unit keywords display as single letters (T, F, S, R, C, D, W...) with no color coding or visual distinction. "S" could mean Stealth, Swift, or Shield. |
| **Location** | `src/components/game/UnitToken.tsx:8-13, 32-37` |
| **Impact** | **CRITICAL** - Players cannot understand unit capabilities without external reference. Combat decisions require memorizing 18+ keyword abbreviations. |
| **Evidence** | `taunt: 'T', flying: 'F', stealth: 'S', rush: 'R', charge: 'C'` |

**User Scenario:**
> New player sees an enemy unit with "S" badge. Is it Stealth (can't target)? Swift (can move through units)? Or Shield? They must hover and wait for browser tooltip to know if they can attack it.

**Solution:**
1. Replace letters with mini-icons (SVG symbols)
2. Color-code by keyword category:
   - 🛡️ Defense (Taunt, Divine Shield, Ward, Armor): Blue
   - ⚔️ Offense (Rush, Charge, Windfury, Poisonous): Red
   - 💨 Movement (Flying, Swift, Stealth, Elusive): Green
3. Add keyword legend panel in sidebar
4. Show keyword description on unit hover

**Priority:** 🔴 Critical  
**Effort:** Medium (new icons + CSS)

---

### 3. Mobile Sidebar Completely Removes Critical Game Info

| Aspect | Details |
|--------|---------|
| **Problem** | At viewport widths below 700px, the entire sidebar is hidden with `display: none`. Mobile players lose access to turn counter, phase tracker, and combat log. |
| **Location** | `src/styles/board.css:327` |
| **Impact** | **CRITICAL** - Mobile players cannot see what phase they're in, how many turns have passed, or read combat history. Core gameplay information is inaccessible. |
| **Evidence** | `@media (max-width: 700px) { .sidebar { display: none; } }` |

**Root Cause:**
Sidebar is fixed 220px width which doesn't fit mobile screens. Rather than redesign, it was hidden entirely.

**Solution:**
Transform sidebar into collapsible bottom sheet for mobile:
```css
@media (max-width: 700px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    max-height: 40vh;
    border-left: none;
    border-top: 2px solid var(--gold);
    z-index: 100;
    transform: translateY(calc(100% - 50px));
    transition: transform 0.3s;
  }
  .sidebar.expanded { transform: translateY(0); }
}
```

**Priority:** 🔴 Critical  
**Effort:** Medium (new mobile layout)

---

### 4. No Visual Connection Between Phase Numbers and Phase Names

| Aspect | Details |
|--------|---------|
| **Problem** | Code uses phase numbers (0-5) but sidebar shows phase names. HandArea checks `phase === 2` for playability, but players see "Deploy" with no connection between the two. |
| **Location** | `src/components/game/HandArea.tsx:23`, `src/components/game/Sidebar.tsx:30-38` |
| **Impact** | **CRITICAL** - Players cannot understand why cards are unplayable. "I have energy but my cards are grayed out" confusion. No indication that cards can ONLY be played in Deploy phase. |
| **Evidence** | `const canPlay = phase === 2 && energy >= card.cost;` |

**User Quote (Hypothetical):**
> "I have 5 energy and this card costs 3. Why is it grayed out? The game is broken!"

**Solution:**
1. Add phase restriction indicator to cards:
   - Show "🔒 Deploy Phase Only" tooltip when unplayable due to phase
   - Highlight Deploy phase in sidebar when player has playable cards
   - Flash energy display with warning when clicking card in wrong phase
2. Disable card hover effects in non-Deploy phases
3. Show "Deploy Phase Required" message in hand area header during other phases

**Priority:** 🔴 Critical  
**Effort:** Low (conditional rendering)

---

### 5. Terrain Effects Completely Invisible Without Interaction

| Aspect | Details |
|--------|---------|
| **Problem** | Terrain icons have 55% opacity and no labels. Height indicators use subtle inset shadows only. Players cannot see terrain bonuses or movement penalties at a glance. |
| **Location** | `src/styles/board.css:57-68, 122-132` |
| **Impact** | **CRITICAL** - Tactical positioning is core to gameplay, but terrain advantages are invisible. Players miss +2 defense from forests, movement costs from water, etc. |
| **Evidence** | `.terrain-icon { opacity: .55; }` - fades to `.35` on hover |

**Current Height Visualization:**
- Height 1: subtle bottom border
- Height 2: slightly thicker bottom border  
- Height 3: thicker bottom border + shadow

**Solution:**
1. Add terrain type labels on hover with persistent mini-indicators
2. Height badges: display "⬆️1", "⬆️2", "⬆️3" in cell corner
3. Color-code terrain by type with stronger saturation
4. Add terrain effect summary in sidebar when cell is selected
5. First-time tooltip: "Forest: +2 Defense" when first moving into terrain type

**Priority:** 🔴 Critical  
**Effort:** Medium (new indicators + tooltips)

---

## 🟠 High Priority Issues

### 6. Hand Cards Lack "Why Can't I Play This?" Feedback

| Aspect | Details |
|--------|---------|
| **Problem** | Unplayable cards only show reduced opacity and grayscale. No indication if unplayable due to energy cost, wrong phase, or other restrictions. |
| **Location** | `src/styles/cards.css:67-80`, `src/components/game/HandArea.tsx:23, 29` |
| **Impact** | **HIGH** - Players waste time clicking unplayable cards. Colorblind players may not see the opacity difference at all. |
| **Evidence** | `.card.unplayable { opacity: 0.5; filter: grayscale(60%); }` |

**Solution:**
```tsx
// Enhanced unplayable feedback
<div 
  className={`card ${isSelected ? 'selected' : ''} ${!canPlay ? 'unplayable' : ''}`}
  onClick={() => canPlay ? onCardClick(i) : showWhyUnplayable(i)}
>
  {/* Cost turns red when insufficient energy */}
  <div className={`c-cost ${energy < card.cost ? 'cost-unaffordable' : ''}`}>
    {card.cost}
  </div>
  
  {/* Phase restriction badge */}
  {phase !== 2 && (
    <div className="phase-lock">🔒 Deploy</div>
  )}
</div>
```

**Priority:** 🟠 High  
**Effort:** Low

---

### 7. Energy Display Missing Maximum and Visual Context

| Aspect | Details |
|--------|---------|
| **Problem** | Energy shows only current value with lightning bolt icon. No maximum indicator, no visual representation of available vs spent energy. |
| **Location** | `src/components/game/PlayerBar.tsx:35-40` |
| **Impact** | **HIGH** - Players cannot quickly assess energy economy. "Do I have enough for this combo?" requires mental math every turn. |
| **Evidence** | `<span className="energy-current">{player.energy}</span>` only |

**Current Display:**
```
⚡ 7
```

**Improved Display:**
```
⚡ 7 / 10  [███████░░░]
```

**Solution:**
1. Show energy as fraction: "7 / 10"
2. Add visual mana crystal orbs (10 small icons, filled/empty)
3. Color gradient: bright blue for available, gray for empty
4. Animate energy gain/loss with floating numbers

**Priority:** 🟠 High  
**Effort:** Low

---

### 8. Combat Log Is Empty Black Box Until First Action

| Aspect | Details |
|--------|---------|
| **Problem** | Combat log shows completely empty area at game start with no placeholder or indication of its purpose. |
| **Location** | `src/components/game/Sidebar.tsx:64-70` |
| **Impact** | **HIGH** - New players don't understand the log's purpose. First-time experience lacks guidance on where action feedback appears. |
| **Evidence** | `logs.length === 0` shows nothing (blank space) |

**Solution:**
```tsx
{logs.length === 0 ? (
  <div className="log-empty">
    <div className="log-icon">📜</div>
    <div>Combat log will appear here</div>
    <div className="log-hint">Actions, damage, and effects are recorded</div>
  </div>
) : (...)}
```

Add tutorial message: "When you attack, damage numbers and results will appear here."

**Priority:** 🟠 High  
**Effort:** Very Low

---

## 🟡 Medium Priority Issues

### 9. No First-Time Tutorial or Contextual Help

| Aspect | Details |
|--------|---------|
| **Problem** | New game starts immediately after titan selection with no tutorial, tooltips, or guided introduction. Rules screen exists but is disconnected from gameplay. |
| **Location** | `src/components/screens/NewGameScreen.tsx` → `GameScreen.tsx` |
| **Impact** | **MEDIUM** - Steep learning curve. Players must learn 6 phases, 18 keywords, terrain effects, and titan abilities simultaneously. |
| **Evidence** | No onboarding flow; `RulesScreen.tsx` is optional menu item |

**Solution:**
1. **First-run tutorial overlay:**
   - "Welcome Commander! Let's learn the basics..."
   - Highlight Deploy phase: "This is when you play cards"
   - Show unit movement: "Click a unit, then click a highlighted cell"
   - Explain combat: "Attack enemies to reduce their HP"

2. **Contextual hints:**
   - "Deploy Phase: Play up to 3 cards from your hand" (first Deploy phase)
   - "Click your units to move them" (first Movement phase)
   - "Enemy in range! Click to attack" (first Combat phase)

3. **Interactive glossary:** Click keywords to see definitions

**Priority:** 🟡 Medium  
**Effort:** High (new tutorial system)

---

### 10. Titan Ability Button State Is Ambiguous

| Aspect | Details |
|--------|---------|
| **Problem** | Titan ability button shows disabled state with only opacity reduction. No indication of WHY it's disabled (wrong phase? not enough energy? no deploys left?). |
| **Location** | `src/components/game/PlayerBar.tsx:44-53`, `src/styles/board.css:255-257` |
| **Impact** | **MEDIUM** - Players don't understand when/how to use titan abilities. Button appears clickable but does nothing. |
| **Evidence** | `.titan-ability-btn:disabled { opacity: .4; cursor: not-allowed; }` |

**Current Logic:**
```tsx
const canActivate = isActive && onActivateTitan && phase === 2 && (deployLeft ?? 0) > 0 && player.energy >= (titan?.activeCost ?? 99);
```

**Solution:**
```tsx
<button 
  className="titan-ability-btn"
  disabled={!canActivate}
  data-disabled-reason={!canActivate ? getDisabledReason() : undefined}
  title={getTooltipText()}
>
  {titan.activeText.split('.')[0]} ({titan.activeCost}E)
  {!canActivate && phase !== 2 && <span className="ability-wait">🔒 Deploy Phase</span>}
  {!canActivate && player.energy < titan.activeCost && <span className="ability-need-energy">Need {titan.activeCost - player.energy} more E</span>}
</button>
```

**Priority:** 🟡 Medium  
**Effort:** Low

---

## Summary Table

| Rank | Issue | Priority | Effort | Impact Area |
|------|-------|----------|--------|-------------|
| 1 | Hidden unit names | 🔴 Critical | Low | Board Readability |
| 2 | Cryptic keyword icons | 🔴 Critical | Medium | Unit Understanding |
| 3 | Mobile sidebar removed | 🔴 Critical | Medium | Mobile Playability |
| 4 | Phase number confusion | 🔴 Critical | Low | Game Flow Clarity |
| 5 | Invisible terrain effects | 🔴 Critical | Medium | Tactical Depth |
| 6 | Unplayable card feedback | 🟠 High | Low | Hand Interaction |
| 7 | Energy display limited | 🟠 High | Low | Resource Management |
| 8 | Empty combat log | 🟠 High | Very Low | Feedback System |
| 9 | Missing tutorial | 🟡 Medium | High | First-Time Experience |
| 10 | Ambiguous titan button | 🟡 Medium | Low | Ability Discovery |

---

## Recommended Implementation Order

### Phase 1: Critical Blockers (Week 1)
1. Fix unit name visibility (Issue #1)
2. Add phase restriction tooltips (Issue #4)
3. Add empty log placeholder (Issue #8)
4. Improve unplayable card feedback (Issue #6)
5. Enhance energy display (Issue #7)

### Phase 2: Information Architecture (Week 2)
6. Implement keyword icons/colors (Issue #2)
7. Add terrain indicators (Issue #5)
8. Clarify titan ability states (Issue #10)

### Phase 3: Mobile & Onboarding (Week 3-4)
9. Redesign mobile sidebar (Issue #3)
10. Build tutorial system (Issue #9)

---

## Appendix: Quick Reference for Testers

### What to Test
1. **New Player Test:** Ask someone unfamiliar with the game to play for 5 minutes without help. Note where they get stuck.
2. **Mobile Test:** Play on phone. Can you see turn/phase information? Can you read cards?
3. **Colorblind Test:** Use grayscale filter. Can you distinguish playable/unplayable cards? Owner colors?

### Success Criteria
- [ ] Unit names visible without hover
- [ ] Keywords understandable without external reference
- [ ] Mobile players can see phase and turn info
- [ ] Players understand why cards are unplayable
- [ ] Terrain effects visible without hovering each cell
