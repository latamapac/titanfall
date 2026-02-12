# Titanfall Chronicles - UI/UX Design Audit Report

**Date:** 2026-02-12  
**Scope:** Game Screen UI Components  
**Auditor:** Code Analysis  

---

## Executive Summary

This audit identifies **20 UI/UX design flaws** across the Titanfall Chronicles game interface, ranging from critical accessibility issues to minor visual inconsistencies. The most severe issues impact readability, player feedback, and mobile usability.

---

## Critical Issues (5)

### 1. Card Text Illegibility
- **Issue:** Card description text is set to 8px font size (`cards.css:39`) with color `#bbb` on dark background
- **Location:** `src/styles/cards.css`, `src/components/game/HandArea.tsx`
- **Impact:** Falls below WCAG 12px minimum recommendation; players cannot read card abilities without clicking/hovering
- **Severity:** Critical
- **Suggestion:** Increase to minimum 11px, use `#fff` or `#eee` color, add line-height: 1.4 for readability

### 2. Missing Focus Indicators for Keyboard Navigation
- **Issue:** No `:focus` styles defined anywhere in the CSS; keyboard users cannot see which element is selected
- **Location:** `src/styles/globals.css`
- **Impact:** Violates WCAG 2.1 accessibility standards; keyboard-only users cannot play the game
- **Severity:** Critical
- **Suggestion:** Add `*:focus { outline: 2px solid var(--gold); outline-offset: 2px; }` and component-specific focus states

### 3. Mobile Sidebar Complete Removal
- **Issue:** At 700px breakpoint, sidebar is hidden with `display: none` (`board.css:300`)
- **Location:** `src/styles/board.css`
- **Impact:** Mobile players lose access to turn counter, phase indicator, and combat log entirely
- **Severity:** Critical
- **Suggestion:** Transform sidebar into collapsible drawer or bottom sheet for mobile; never hide critical game info

### 4. Unit Keyword Icons Are Cryptic
- **Issue:** Single-letter icons (T, F, S, R, C) with no visual distinction or legend; tooltips only show on hover
- **Location:** `src/components/game/UnitToken.tsx:8-13`
- **Impact:** New players cannot understand unit abilities at a glance; "S" could mean Stealth, Swift, or Shield
- **Severity:** Critical
- **Suggestion:** Use distinct colors/shapes for each keyword type; add keyword legend in sidebar; use icons instead of letters

### 5. Turn Overlay Blocks Interaction Without Progress Indicator
- **Issue:** TurnOverlay captures all input but provides no visual indication of timeout or auto-dismiss
- **Location:** `src/components/overlays/TurnOverlay.tsx`
- **Impact:** Players may not realize they need to click/press key to continue; feels like game is frozen
- **Severity:** Critical
- **Suggestion:** Add auto-dismiss countdown timer (3-5 seconds); add progress bar; make "Click to continue" more prominent

---

## Major Issues (8)

### 6. HP Bar Text Readability Issues
- **Issue:** HP text is white with minimal text-shadow over gradient background; text overflows when HP is low
- **Location:** `src/styles/board.css:220-231`
- **Impact:** Current/max HP values difficult to read, especially with red-on-red gradient
- **Severity:** Major
- **Suggestion:** Add semi-transparent dark background behind text; ensure min-width allows full text display; use black text with white outline

### 7. Inconsistent Button Styling Across Components
- **Issue:** Titan ability button (`board.css:235`) has different padding, no transition, and inconsistent hover effects compared to `btn-primary`
- **Location:** `src/styles/board.css`, `src/styles/globals.css`
- **Impact:** UI feels unpolished; users may not recognize clickable elements
- **Severity:** Major
- **Suggestion:** Create unified button component system with consistent padding, transitions, and hover states

### 8. Unplayable Cards Lack Clear Disabled State
- **Issue:** Cards only use `opacity: 0.5` when unplayable (`cards.css:67`); no color change, cursor change, or overlay
- **Location:** `src/styles/cards.css`, `src/components/game/HandArea.tsx`
- **Impact:** Colorblind players cannot distinguish playable vs unplayable cards; no feedback why card can't be played
- **Severity:** Major
- **Suggestion:** Add grayscale filter, `cursor: not-allowed`, red cost indicator when insufficient energy, and tooltip explaining why

### 9. Hand Area Horizontal Scroll Issues
- **Issue:** Cards extend beyond viewport with only standard scrollbar; no card overlap or scaling mechanism
- **Location:** `src/components/game/HandArea.tsx`, `src/styles/board.css:277-287`
- **Impact:** Players with large hands must scroll excessively; cards may be cut off on smaller screens
- **Severity:** Major
- **Suggestion:** Implement card fan/stacking with hover expansion; add scroll indicators; scale cards based on hand size

### 10. Victory Overlay Lacks Celebration
- **Issue:** Victory screen shows only plain text and button with no animation, confetti, or visual reward
- **Location:** `src/components/overlays/VictoryOverlay.tsx`
- **Impact:** Winning feels anticlimactic; misses opportunity for player satisfaction
- **Severity:** Major
- **Suggestion:** Add particle effects, screen flash, titan victory pose/animation, and "Victory" text animation

### 11. Energy Display Has No Visual Context
- **Issue:** Energy shown as plain text "X Energy" without maximum indicator or icon
- **Location:** `src/components/game/PlayerBar.tsx:35-37`
- **Impact:** Players cannot quickly assess energy state without reading; no intuitive mana crystal visualization
- **Severity:** Major
- **Suggestion:** Add mana crystal icon; show as "current/max" format; use color gradient (blue→gray) for available/spent

### 12. Turn Indicator Uses Hardcoded Inline Styles
- **Issue:** Turn indicator (`GameScreen.tsx:100-110`) uses inline styles with hardcoded rgba values, no theme consistency
- **Location:** `src/components/screens/GameScreen.tsx`
- **Impact:** Inconsistent with design system; difficult to maintain; poor text contrast on some displays
- **Severity:** Major
- **Suggestion:** Move to CSS class with CSS variables; add proper contrast testing; use existing color palette

### 13. Terrain Height Visualization Too Subtle
- **Issue:** Height levels (h-1, h-2, h-3) use only inset shadows and 1-3px borders (`board.css:122-132`)
- **Location:** `src/styles/board.css`
- **Impact:** Players cannot easily distinguish height advantages at a glance
- **Severity:** Major
- **Suggestion:** Add height number badges; use increasingly lighter backgrounds; add 3D elevation effect with shadows

---

## Minor Issues (7)

### 14. Card Border Color Conflict (Element vs Rarity)
- **Issue:** Cards can have both element border and rarity border, but legendary cards override element colors entirely
- **Location:** `src/styles/cards.css:46-66`
- **Impact:** Players lose element identification on legendary cards
- **Severity:** Minor
- **Suggestion:** Use dual-border technique (inner=element, outer=rarity) or corner badges for rarity

### 15. Deploy Display Causes Layout Shift
- **Issue:** Deploy counter conditionally renders in PlayerBar, causing elements to shift when it appears/disappears
- **Location:** `src/components/game/PlayerBar.tsx:38-40`
- **Impact:** Visual jank; titan ability button moves position during gameplay
- **Severity:** Minor
- **Suggestion:** Reserve fixed space for deploy display even when empty; use visibility:hidden instead of conditional render

### 16. Log Section Has No Empty State
- **Issue:** Combat log shows blank area when no entries exist
- **Location:** `src/components/game/Sidebar.tsx:60-65`
- **Impact:** Players may not understand the purpose of the empty box
- **Severity:** Minor
- **Suggestion:** Add placeholder text like "Combat log will appear here..." or hide section until first entry

### 17. Player Bar Border-Image Creates Inconsistent Borders
- **Issue:** Player bars use `border-image: linear-gradient(...)` which behaves differently than solid borders
- **Location:** `src/styles/board.css:201-206`
- **Impact:** Visual inconsistency; gradient borders don't match other UI elements
- **Severity:** Minor
- **Suggestion:** Use pseudo-elements for gradient effects with standard solid borders

### 18. Unit Name Tooltip Hidden Until Hover
- **Issue:** Unit names only visible on hover with opacity transition (`board.css:166-182`)
- **Location:** `src/styles/board.css`
- **Impact:** Cannot identify units at a glance; tooltips may be cut off at board edges
- **Severity:** Minor
- **Suggestion:** Always show abbreviated names on tokens; increase tooltip z-index; add edge detection

### 19. Tooltip CSS Defined But Unused
- **Issue:** Comprehensive tooltip styles exist (`animations.css:38-54`) but no tooltip component uses them
- **Location:** `src/styles/animations.css`
- **Impact:** Dead code; missed opportunity for better UX
- **Severity:** Minor
- **Suggestion:** Implement tooltip system for cards, units, and abilities; or remove unused styles

### 20. Phase List Missing Visual Connection to Gameplay
- **Issue:** Phase indicators show text names but no visual representation of what each phase means
- **Location:** `src/components/game/Sidebar.tsx:27-36`
- **Impact:** New players don't understand phase progression or purpose
- **Severity:** Minor
- **Suggestion:** Add icons to each phase; show phase description on hover; highlight actionable phases

---

## Recommendations Summary

### Immediate Actions (Critical)
1. Fix card text size and contrast
2. Add keyboard focus indicators
3. Implement mobile-friendly sidebar
4. Replace keyword letters with icons
5. Add auto-dismiss to turn overlay

### Short-term Improvements (Major)
6. Redesign HP bar with better text contrast
7. Standardize button component system
8. Improve unplayable card feedback
9. Implement smart hand card layout
10. Add victory celebration effects

### Polish Items (Minor)
11-20. Address layout shifts, empty states, and visual consistency

---

## Accessibility Checklist

| Criterion | Status | Notes |
|-----------|--------|-------|
| Text resize 200% | ❌ Fail | Card text too small |
| Color independence | ❌ Fail | Relies on color for rarity/elements |
| Keyboard navigation | ❌ Fail | No focus indicators |
| Screen reader labels | ⚠️ Partial | Some icons lack aria-labels |
| Motion reduction | ❌ Fail | No `prefers-reduced-motion` support |
| Touch target size | ⚠️ Partial | Some buttons may be <44px |

---

## Conclusion

The Titanfall Chronicles UI has a solid foundation with thematic styling and functional components, but requires significant improvements in accessibility, mobile responsiveness, and visual feedback before release. The critical issues around text readability and keyboard navigation should be prioritized to ensure all players can enjoy the game.
