# Titanfall Chronicles - Complete Visual System Overhaul

## 🎯 Goal: Hearthstone/MTG-Level Production Quality

---

## 🔴 IMMEDIATE FIXES NEEDED

### 1. Image Loading Fix
**Problem:** 
- Files are JPEG data with `.png` extension
- Wrong aspect ratio (1408x768 instead of 1024x1024)
- Railway serving 404s

**Solution:**
```bash
# Convert to proper PNG format with correct aspect ratio
# Re-generate with correct settings
```

### 2. Image Specifications

| Asset Type | Format | Dimensions | Size Limit | Notes |
|------------|--------|------------|------------|-------|
| **Titan Portraits** | PNG | 1024x1024 | <500KB | 1:1 square, transparent bg optional |
| **Terrain Tiles** | PNG | 512x512 | <200KB | Seamless, tileable |
| **Card Art** | PNG | 512x768 | <300KB | 2:3 ratio |
| **Backgrounds** | JPG | 1920x1080 | <500KB | 16:9, compressed |
| **UI Elements** | PNG | Various | <100KB | Transparent bg |
| **Icons** | SVG/PNG | 64x64 to 256x256 | <50KB | Crisp at all sizes |

---

## 🎨 DESIGN ARCHITECT HIRING BRIEF

### Role: Lead Visual Designer & Art Director

**Responsibilities:**
1. **Complete Asset Audit** - Catalog every visual element needed
2. **Style Guide Creation** - Unified art direction document
3. **Asset Pipeline Design** - From generation to integration
4. **Quality Control** - Ensure consistent quality across all assets
5. **UI/UX Design** - Hearthstone-level interface design

### Required Deliverables

#### Phase 1: Audit & Planning (Week 1)
- [ ] Complete asset inventory spreadsheet
- [ ] Technical specifications for each asset type
- [ ] Style guide v1.0
- [ ] Priority ranking (MVP vs Polish)

#### Phase 2: Core Assets (Weeks 2-4)
- [ ] 5 Titan portraits (hero characters)
- [ ] 8 Terrain tiles
- [ ] 3 Battle backgrounds
- [ ] Card frame templates (4 rarities)
- [ ] Basic UI kit (buttons, panels, icons)

#### Phase 3: Gameplay Assets (Weeks 5-8)
- [ ] 20+ Unit card illustrations
- [ ] Spell effect animations
- [ ] Particle effects (fire, ice, shadow, etc.)
- [ ] Unit tokens/sprites for board

#### Phase 4: UI/UX Polish (Weeks 9-12)
- [ ] Main menu design
- [ ] Character select screen
- [ ] Battle HUD
- [ ] Victory/defeat screens
- [ ] Mobile-responsive layouts

---

## 📋 COMPLETE ASSET INVENTORY

### A. CHARACTERS (Titans)
**Count:** 5 heroes
- [x] Arcanum (Arcane Mage) - NEEDS RE-GENERATE (wrong format)
- [x] Maulk (Fire Demon) - NEEDS RE-GENERATE
- [x] Nyx (Shadow Assassin) - NEEDS RE-GENERATE
- [x] Sylvana (Earth Druid) - NEEDS RE-GENERATE
- [x] Solara (Dragon Knight) - NEEDS RE-GENERATE

**Needs:**
- 1024x1024 PNG
- Character select portrait (zoomed face)
- Full body for victory screen
- Chibi/emoji versions for chat

### B. TERRAIN (8 Types)
**Count:** 8 tiles
- [ ] Plain (grassland)
- [ ] Forest (woods)
- [ ] Mountain (rocky)
- [ ] Water (ocean/lake)
- [ ] Volcano (lava)
- [ ] Swamp (marsh)
- [ ] Ruins (ancient)
- [ ] Desert (sand)

**Needs:**
- 512x512 PNG seamless
- Variations (3-4 per type)
- Edge blending versions

### C. CARD ART (20+ Units)
**By Element:**
- [ ] Fire: 4 cards (Berserker, Dragon, Elemental, Witch)
- [ ] Water: 4 cards (Nymph, Serpent, Sorceress, Elemental)
- [ ] Earth: 4 cards (Golem, Dwarf, Treant, Shaman)
- [ ] Shadow: 4 cards (Assassin, Wraith, Vampire, Necromancer)
- [ ] Arcane: 4 cards (Construct, Enchanter, Guardian, Elemental)

**Needs:**
- 512x768 PNG
- Full illustration + zoomed version for card
- Rarity variants (glow effects)

### D. BACKGROUNDS (5 Screens)
- [ ] Main Menu
- [ ] Character Select
- [ ] Battlefield Day
- [ ] Battlefield Night
- [ ] Victory Screen

**Needs:**
- 1920x1080 JPG/PNG
- Parallax layers (2-3 depth levels)
- Mobile versions (9:16)

### E. UI ELEMENTS

#### Card Frames (4 Rarities)
- [ ] Common (iron/gray)
- [ ] Rare (blue)
- [ ] Epic (purple)
- [ ] Legendary (gold)

**Needs:**
- Frame template (PNG with transparency)
- Cost badge
- Attack/Health badges
- Name plate

#### Buttons (3 Styles × 3 States)
- [ ] Primary (Gold)
- [ ] Secondary (Silver)
- [ ] Danger (Red)

**States:** Normal, Hover, Active, Disabled

#### Icons (20+)
- [ ] Elements (fire, water, earth, shadow, arcane)
- [ ] Stats (attack, health, armor, speed)
- [ ] Actions (move, attack, cast, deploy)
- [ ] Resources (energy, mana)
- [ ] Status effects (stunned, poisoned, buffed)

#### Panels & Frames
- [ ] Dialogue box
- [ ] Tooltip
- [ ] Modal window
- [ ] Scroll bar
- [ ] Progress bar

### F. ANIMATIONS & EFFECTS

#### Card Animations
- [ ] Draw (slide from deck)
- [ ] Play (zoom to board)
- [ ] Attack (lunge forward)
- [ ] Damage (shake + flash)
- [ ] Death (fade + particles)

#### Board Animations
- [ ] Unit spawn (portal effect)
- [ ] Unit move (slide)
- [ ] Turn transition (banner swipe)
- [ ] Victory (confetti explosion)

#### Spell Effects (Particle Systems)
- [ ] Fire burst
- [ ] Ice shard
- [ ] Lightning bolt
- [ ] Heal glow
- [ ] Shadow mist
- [ ] Arcane blast

#### UI Animations
- [ ] Button hover (glow pulse)
- [ ] Card hover (lift + tilt)
- [ ] Notification slide-in
- [ ] Number tick-up

### G. SOUND & MUSIC (Optional V1)
- [ ] Background music (menu, battle)
- [ ] Sound effects (UI, spells, combat)
- [ ] Voice lines (titan abilities)

---

## 🎨 STYLE GUIDE FRAMEWORK

### Color Palette

#### Primary Colors
```css
--color-gold: #d4a843;      /* Legendary, premium */
--color-silver: #c0c0c0;    /* Rare, common */
--color-bronze: #cd7f32;    /* Common */
```

#### Element Colors
```css
--fire-primary: #e84430;
--fire-secondary: #ff6b35;
--water-primary: #2e5cff;
--water-secondary: #4a9eff;
--earth-primary: #4ade80;
--earth-secondary: #8b6914;
--shadow-primary: #7030a0;
--shadow-secondary: #a855f7;
--arcane-primary: #4a9eff;
--arcane-secondary: #a855f7;
```

#### UI Colors
```css
--color-bg-dark: #0a0b14;
--color-bg-panel: #1a1b2e;
--color-border: #2a2d4a;
--color-text-primary: #ffffff;
--color-text-secondary: #8b8b8b;
```

### Typography

**Headers:** Cinzel Decorative (serif, fantasy)
**Body:** Inter (clean, readable)
**Numbers:** Roboto Mono (tabular nums)

### Visual Effects

#### Lighting
- Rim lighting on characters
- Ambient glow from elements
- Dramatic shadows

#### Materials
- Metal: High specular, scratches
- Magic: Emissive, particles
- Leather: Rough, worn
- Stone: Matte, detailed

---

## 🛠️ PRODUCTION PIPELINE

### Step 1: Design (Design Architect)
- Sketch concepts
- Color studies
- Approval gates

### Step 2: Generation (AI + Artists)
- Nano Banana Pro for base images
- Manual refinement if needed
- Consistency checks

### Step 3: Post-Processing
- Format conversion (PNG/JPG)
- Size optimization
- Compression

### Step 4: Integration
- Copy to public/art/
- Update asset manifests
- Test in-game

### Step 5: QA
- Visual consistency check
- Performance test
- Mobile compatibility

---

## 💰 BUDGET ESTIMATE

### AI Generation (Nano Banana Pro)
- ~100 images × $0.02 = **$2**

### Design Architect (Contract)
- 4 weeks @ $50/hr × 20 hrs/week = **$4,000**

### Total: ~$4,000-5,000 for complete visual overhaul

---

## ✅ NEXT STEPS

1. **Fix current images** - Re-generate with correct specs
2. **Post job listing** - Find design architect
3. **Create asset tracking** - Spreadsheet/system
4. **Prioritize MVP assets** - Titans + terrain + basic UI
5. **Establish review process** - Weekly asset reviews

---

**Document Version:** 1.0
**Date:** 2026-02-11
**Status:** Planning Phase
