# Titanfall Chronicles V2 - Visual & UX Overhaul Plan

## 🎯 Goals

Transform the game from prototype to polished indie game quality with:
- AI-generated 2D character/terrain art
- Industry-standard battle screen layout
- Smooth animations and transitions
- No scrolling, responsive viewport
- Professional UI/UX

---

## 📐 Design System

### Color Palette
```
Primary:    #D4A843 (Gold)        - Buttons, highlights, accents
Secondary:  #4A4F8C (Deep Blue)   - UI panels, backgrounds
Tertiary:   #2A2D4A (Dark Navy)   - Dark panels
Accent:     #4A9EFF (Mana Blue)   - Energy, spells
Success:    #4ADE80 (Green)       - Valid moves, heal
Danger:     #F87171 (Red)         - Attack, damage
Warning:    #FBBF24 (Amber)       - Warnings, special

Background: #0A0B14 (Near Black) - Game background
Surface:    #1A1B2E (Dark Surface) - Cards, panels
Border:     #3A3D5C (Border)      - Dividers, outlines
```

### Typography
```
Headers:    "Cinzel" or "Trajan Pro" - Fantasy serif
Body:       "Inter" or "Roboto"      - Clean sans-serif
Numbers:    "Roboto Mono"            - Stats, counters
```

### Art Style
- **2D Digital Painting** - Semi-realistic fantasy
- **Consistent lighting** - Dramatic, top-down for board
- **Rich colors** - Saturated but cohesive
- **Character portraits** - Dramatic lighting, dynamic poses
- **Terrain tiles** - Detailed, hand-painted look

---

## 🎨 Asset List for FLUX Generation

### 1. Character Portraits (5 Titans)
```
Style: Digital fantasy portrait, dramatic lighting
Specs: 512x512px, transparent PNG

Kargath: "Muscular orc warlord, red skin, massive sword, volcanic background, 
         dramatic side lighting, fierce expression, fantasy portrait style"

Thalor: "Elderly human wizard, long white beard, glowing staff, arcane ruins,
        mystical lighting, wise expression, high fantasy art"

Sylara: "Elven nature druid, green robes, staff with leaves, forest setting,
        soft natural lighting, serene expression, fantasy portrait"

Nyx:    "Shadowy female assassin, dark cloak, dual daggers, misty background,
        dramatic rim lighting, mysterious expression, dark fantasy"

Elandor:"Armored dragon knight, silver armor, dragon emblem, mountain fortress,
        golden hour lighting, noble expression, epic fantasy"
```

### 2. Unit Cards (49 Cards)
```
Style: Fantasy trading card art, detailed illustrations
Specs: 512x768px (portrait ratio)

Examples:
- "Orc Berserker charging with axe, battle scene, dynamic action pose"
- "Fire elemental swirling flames, dramatic lighting"
- "Ancient stone golem, moss-covered, mystical forest"
- "Elven archer aiming bow, tree branch perch"
```

### 3. Terrain Tiles (8 Types)
```
Style: Isometric hand-painted tiles, seamless
Specs: 256x256px each

Plain:    "Grassy meadow, wildflowers, soft daylight, top-down view"
Forest:   "Dense pine forest, dappled light, mossy ground"
Mountain: "Rocky cliff face, snow patches, dramatic shadows"
Water:    "Clear blue water, gentle waves, reflection"
Swamp:    "Murky swamp, mist, dead trees, eerie lighting"
Hill:     "Rolling grassy hill, golden hour, gentle slope"
Volcano:  "Lava flows, black rock, glowing cracks, dangerous"
Ruins:    "Ancient temple ruins, overgrown, mystical glow"
```

### 4. UI Elements
```
- Card frames (common, rare, epic, legendary)
- Button backgrounds (normal, hover, active)
- Panel backgrounds with decorative borders
- Health/Energy bars
- Phase indicators
- Victory/defeat screens
```

---

## 🎮 New Battle Screen Layout

### Layout Concept: "Dual Commander View"
```
┌─────────────────────────────────────────────────────────────┐
│  [TITAN P2]  [HP BAR]  [ENERGY]  [TITAN POWER]     TURN  │ ← Enemy (top)
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      BATTLEFIELD                            │
│                   (7x5 Grid Center)                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [TITAN P1]  [HP BAR]  [ENERGY]  [TITAN POWER]     PHASE  │ ← Player (bottom)
├─────────────────────────────────────────────────────────────┤
│  [HAND CARDS - Horizontal Scrollable]  [END TURN BUTTON]   │
└─────────────────────────────────────────────────────────────┘
```

### Key Features:
1. **Fixed viewport** - No page scrolling
2. **Aspect ratio locked** - 16:9 optimal
3. **Responsive scaling** - Scales down for smaller screens
4. **Smooth animations** - CSS transitions, canvas particles
5. **Card hover zoom** - Preview on hover
6. **Drag & drop** - For deployment and movement

---

## 🎬 Animation System

### Card Animations
```css
/* Draw card */
@keyframes cardDraw {
  from { transform: translateY(-100px) scale(0.5); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}

/* Play card */
@keyframes cardPlay {
  from { transform: scale(1); }
  50% { transform: scale(1.1) rotate(5deg); }
  to { transform: scale(0) translateY(-200px); opacity: 0; }
}

/* Hover */
.card:hover {
  transform: translateY(-20px) scale(1.1);
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  z-index: 100;
}
```

### Unit Animations
```css
/* Spawn */
@keyframes unitSpawn {
  from { transform: scale(0); filter: brightness(2); }
  to { transform: scale(1); filter: brightness(1); }
}

/* Attack */
@keyframes unitAttack {
  0% { transform: translateX(0); }
  50% { transform: translateX(20px) scale(1.1); }
  100% { transform: translateX(0); }
}

/* Take damage */
@keyframes unitDamage {
  0%, 100% { transform: translateX(0); filter: grayscale(0); }
  25% { transform: translateX(-10px); filter: grayscale(0.5) brightness(1.5); }
  75% { transform: translateX(10px); filter: grayscale(0.5); }
}

/* Death */
@keyframes unitDeath {
  to { transform: scale(0) rotate(180deg); opacity: 0; }
}
```

### UI Animations
```css
/* Phase transition */
@keyframes phaseSlide {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Turn indicator */
@keyframes turnPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212, 168, 67, 0.4); }
  50% { box-shadow: 0 0 0 20px rgba(212, 168, 67, 0); }
}

/* Victory */
@keyframes victoryZoom {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

---

## 🏗️ Implementation Phases

### Phase 1: Art Generation (Week 1)
- [ ] Generate all 5 Titan portraits
- [ ] Generate key unit cards (20 most common)
- [ ] Generate 8 terrain tiles
- [ ] Test integration

### Phase 2: UI Components (Week 2)
- [ ] New card component with art
- [ ] New Titan portrait component
- [ ] New terrain tiles
- [ ] Panel/Button components

### Phase 3: Battle Screen Redesign (Week 3)
- [ ] New layout structure
- [ ] Fixed viewport implementation
- [ ] Responsive scaling
- [ ] Drag & drop system

### Phase 4: Animations (Week 4)
- [ ] Card animations
- [ ] Unit animations
- [ ] UI transitions
- [ ] Particle effects

### Phase 5: Polish & Deploy (Week 5)
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Mobile testing
- [ ] Deploy V2

---

## 📁 New File Structure

```
public/
├── art/
│   ├── titans/
│   │   ├── kargath.png
│   │   ├── thalor.png
│   │   ├── sylara.png
│   │   ├── nyx.png
│   │   └── elandor.png
│   ├── cards/
│   │   ├── units/
│   │   ├── spells/
│   │   └── structures/
│   ├── terrain/
│   │   ├── plain.png
│   │   ├── forest.png
│   │   └── ...
│   └── ui/
│       ├── card-frames/
│       ├── buttons/
│       └── panels/

src/
├── components/
│   ├── v2/
│   │   ├── Card.tsx
│   │   ├── TitanPortrait.tsx
│   │   ├── TerrainTile.tsx
│   │   ├── BattleScreen.tsx
│   │   └── ...
│   └── ... (v1 components)
├── styles/
│   ├── v2/
│   │   ├── animations.css
│   │   ├── cards.css
│   │   └── battle.css
│   └── ... (v1 styles)
```

---

## 🎨 Sample FLUX Prompts

### Titan Portrait Template
```
Digital fantasy character portrait, [CHARACTER DESCRIPTION], 
dramatic cinematic lighting, rich colors, detailed, 
high quality digital painting, transparent background
--ar 1:1 --style raw
```

### Card Art Template
```
Fantasy trading card illustration, [UNIT DESCRIPTION], 
dynamic action pose, detailed background, dramatic lighting,
digital painting style, no text
--ar 2:3 --style raw
```

### Terrain Template
```
Hand-painted fantasy game tile, [TERRAIN DESCRIPTION],
top-down view, seamless edges, rich colors, detailed
--ar 1:1 --style raw
```

---

## 🚀 Let's Start!

Ready to generate art and build V2!
