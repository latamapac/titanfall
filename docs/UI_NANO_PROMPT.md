# UI Asset Generation - Nano Prompt

## System Prompt (The Foundation)

```
You are a world-class game UI artist. Your craft bridges player cognition and mythic worldbuilding. Every pixel obeys physics, culture, and story.

UI ≠ Interface. UI = World Extension.
```

---

## The Nano Template

### Structure: `[WORLD] + [HIERARCHY] + [ELEMENT] + [FACTION] + [STATE]`

---

## 1. WORLD DEFINITION (Define your universe in 3 lines)

```
World: [Name]
Tone: [3 adjectives]
Physics: [Light direction, material feel, motion physics]
```

**Example:**
```
World: Aethelgard
Tone: Crumbling majesty, living decay, desperate nobility
Physics: Light from upper-left, iron weighs, vines grow, energy arcs
```

---

## 2. FACTION VISUAL LANGUAGES (Your 3-5 core cultures)

```
[FACTION_NAME]:
- Material: [Primary building material]
- Motif: [Visual pattern]
- Motion: [Physics of interaction]
- Border: [Edge treatment]
- Font: [Typography feel]
```

**Example:**
```
Iron Church:
- Material: Forged iron, worn leather, wax seals
- Motif: Heraldic crests, chain links, Gothic arches
- Motion: Heavy, clangs, ratchets
- Border: Riveted edges, filigree corners
- Font: Chiseled serif, small caps

Verdant Covenant:
- Material: Living bark, moss, amber sap
- Motif: Intertwined vines, leaf patterns, root systems
- Motion: Grows, unfurls, sways
- Border: Organic edges, thorn accents
- Font: Irregular serif, organic terminals

Stormbound:
- Material: Crystalline, copper coils, glass
- Motif: Geometric arcs, circuit patterns, energy nodes
- Motion: Crackles, snaps, arcs between points
- Border: Segmented lines, spark gaps
- Font: Geometric sans, arc terminals
```

---

## 3. THE PROMPT FORMULA

### Base Template:

```
Create [ELEMENT_TYPE] for [FACTION]:

CONTEXT:
- Purpose: [What player does with this]
- Hierarchy: [Primary/Secondary/Tertiary]
- Size: [Dimensions]

VISUAL LANGUAGE:
- Material: [From faction definition]
- Depth: [Raised/Flat/Inset]
- Light: [Direction and quality]

STATES NEEDED:
□ Normal
□ Hover: [What happens - glow? lift? color shift?]
□ Active/Pressed: [What happens - depth? impact?]
□ Disabled: [Ghosted? locked? broken?]
□ Loading: [Animation hint]

FACTION MARKERS:
- Border: [Specific treatment]
- Accent: [Faction color application]
- Iconography: [Symbol system]

WORLD CONSISTENCY:
- Physics: [How it moves/feels]
- Wear: [New? Ancient? Corrupted?]
- Integration: [How it connects to world]

OUTPUT:
- Format: [PNG/SVG/Sprite sheet]
- Size: [Exact dimensions]
- Variants: [States as separate files or sprite sheet]
```

---

## 4. COMPLETE EXAMPLES

### Example A: Primary Button (Iron Church)

```
Create Primary Action Button for Iron Church faction:

CONTEXT:
- Purpose: Major player action (Attack, Confirm, Accept Quest)
- Hierarchy: PRIMARY - biggest, most visible
- Size: 280x80px

VISUAL LANGUAGE:
- Material: Forged iron plate, 4mm thickness, weathered
- Depth: Raised 3px, casts subtle shadow
- Light: Upper-left, creates highlight on top edge

STATES NEEDED:
□ Normal: Solid iron, crest emblem center, rivet corners
□ Hover: Ember glow from within, slight scale 1.02
□ Active: Pressed down, shadow flattens, clang impact hint
□ Disabled: Rusted, cracked, chain across
□ Loading: Gears turning in corner, pulsing ember

FACTION MARKERS:
- Border: Riveted iron frame, corner heraldic crests
- Accent: Deep crimson glow from within when active
- Iconography: Iron fist, sword, or faction crest

WORLD CONSISTENCY:
- Physics: Heavy, takes effort to press, satisfying weight
- Wear: Battle-worn, scratches, some rust at edges
- Integration: Could be pried from a cathedral door

OUTPUT:
- Format: PNG with transparency
- Size: 280x80px
- Variants: 5 state files + glow overlay separate
```

---

### Example B: Health Bar (Verdant)

```
Create Health Bar for Verdant Covenant faction:

CONTEXT:
- Purpose: Show player health status
- Hierarchy: SECONDARY - always visible but not dominant
- Size: 240x24px frame, 200x16px fill area

VISUAL LANGUAGE:
- Material: Living bark frame, amber sap fill
- Depth: Slightly inset, organic irregularity
- Light: Natural, dappled forest light effect

STATES NEEDED:
□ Normal: Healthy bark frame, golden sap fill
□ Low (<30%): Bark cracking, sap darkening to amber
□ Critical (<10%): Bark rotting, sap sluggish, thorns emerge
□ Healing: Sap flows upward, buds sprout along bar
□ Damage Taken: Bark chips fly, sap splashes

FACTION MARKERS:
- Border: Wrapped in living vines, small leaves at corners
- Accent: Sap color shifts with health (gold → amber → dark)
- Iconography: Heart-shaped leaf node at end

WORLD CONSISTENCY:
- Physics: Sap flows like liquid, responds to damage
- Wear: Frame grows/heals over time
- Integration: Grafted from world-tree branch

OUTPUT:
- Format: PNG frame + separate fill layers
- Size: 240x24px frame, tileable fill
- Variants: Frame states + fill gradient maps
```

---

### Example C: Modal Window (Stormbound)

```
Create Modal Dialog Frame for Stormbound faction:

CONTEXT:
- Purpose: Important information, confirmations
- Hierarchy: PRIMARY when open - blocks other input
- Size: 640x480px with 9-slice scaling support

VISUAL LANGUAGE:
- Material: Crystalline segments, copper connectors
- Depth: Floating, slight parallax ready
- Light: Internal energy glow, shifting slightly

STATES NEEDED:
□ Normal: Crystal panels stable, energy pulsing slow
□ Urgent: Energy pulses red, crystal vibrates
□ Success: Energy pulses gold, chime resonance
□ Error: Energy shorts, cracks in crystal

FACTION MARKERS:
- Border: Segmented crystal arcs, copper nodes at corners
- Accent: Energy color indicates urgency (blue→gold→red)
- Iconography: Circuit-like patterns etched in crystal

WORLD CONSISTENCY:
- Physics: Hums at frequency, responds to touch
- Wear: Some crystal cloudiness, copper tarnish
- Integration: Harnessed lightning in glass prison

OUTPUT:
- Format: 9-slice PNG components
- Size: Corners 64x64, edges 64px wide, center tileable
- Variants: Corner pieces, edge segments, center bg
```

---

## 5. QUICK GENERATION PROMPTS

### Ultra-Short (For fast iteration):

```
[FACTION] [ELEMENT] [STATE]
- Material: [from faction]
- Size: [WxH]
- Key feature: [one detail]

Example:
"Iron Church primary button, normal state.
- Material: Forged iron plate
- Size: 280x80px
- Key: Riveted corners, ember glow hint"
```

### Medium (For most assets):

```
Create [ELEMENT] for [FACTION]:
- Purpose: [action]
- Hierarchy: [level]
- Material: [from faction lang]
- States: normal, hover, active, disabled
- Size: [WxH]
- Faction markers: [border, accent, icon]
```

### Full (For hero assets):

```
Use complete template from Section 3
```

---

## 6. QUALITY GATES

Before accepting any asset, verify:

```
□ Faction-consistent materials and motifs
□ Readable at target size (test at 50%)
□ All requested states present
□ Light direction consistent with world
□ Physics feel appropriate (heavy vs light)
□ No digital/clean where world is worn
□ Functional as UI (clickable areas clear)
```

---

## 7. BATCH GENERATION WORKFLOW

For producing full UI sets efficiently:

### Step 1: Foundation (1 prompt, 4 outputs)
```
"Generate base container frame for [FACTION]:
- 9-slice: corners, edges, center
- Materials: [from faction]
- Style: [raised/flat/inset]"
```

### Step 2: Button Family (1 prompt, variants)
```
"Generate button set from base frame:
- Primary: 280x80 (use base materials)
- Secondary: 200x56 (simplify)
- Tertiary: text-only (extract style)
- States: normal, hover, active, disabled"
```

### Step 3: Icon Language (systematic)
```
"Generate [FACTION] icon family:
- Core: action_attack, action_defend, action_use
- Nav: back, forward, close, menu
- States: buff, debuff, neutral
- Style: [faction motif], 48x48px"
```

### Step 4: Screen Assembly (composite)
```
"Assemble [SCREEN_NAME] using generated components:
- Layout: [wireframe reference]
- Components: [list from previous steps]
- Faction: [apply visual lang]
- States: [empty, loading, error, populated]"
```

---

## 8. COMMON PITFALLS & FIXES

| Problem | Cause | Fix |
|---------|-------|-----|
| Looks like website UI | Too clean/modern | Add wear, irregularity, material texture |
| Generic fantasy | No faction specificity | Return to faction material/motif definitions |
| Flat/unconvincing | No depth/light | Define light direction, add shadow/highlight layers |
| Busy/cluttered | Too many competing elements | Apply hierarchy: primary pops, secondary supports |
| Doesn't feel interactive | Static appearance | State changes must be significant (not just color) |
| Breaks world logic | Ignores physics | Ask: "What material is this? How does it move?" |

---

## 9. ADVANCED TECHNIQUES

### Animated Assets:
```
Add to any prompt:
"Animation frames:
- Idle: subtle [faction motion]
- Trigger: [cause] → [effect]
- Recovery: return to idle
Sprite sheet: horizontal, [N] frames"
```

### Responsive Variants:
```
Add to any prompt:
"Responsive set:
- Desktop: [full size]
- Tablet: [80% scale, simplified detail]
- Mobile: [60% scale, iconic only]"
```

### Accessibility Pass:
```
Add to any prompt:
"Accessibility variants:
- High contrast: [increase value separation]
- Colorblind: [pattern/texture differentiation]
- Large text: [increase padding, test readability]"
```

---

## 10. TROUBLESHOOTING PROMPT

When output doesn't match vision:

```
"Refine previous:
- Keep: [what worked]
- Change: [specific element]
- Add: [missing detail]
- Remove: [extraneous element]
- Intensify: [make more extreme]
- Soften: [make more subtle]"
```

---

## NANO CHECKLIST (Before generating)

```
□ World defined (3 lines)
□ Faction selected (material/motif/motion)
□ Element typed (primary/secondary/tertiary)
□ States listed (normal/hover/active/disabled)
□ Size specified (exact pixels)
□ Physics described (how it moves/feels)
□ Quality gates understood (Section 6)
```

---

**Remember: Every UI element is a window into your world. Make it mythic.**
