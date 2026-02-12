# 🛠️ FULL UI CREATION PIPELINE — ULTRAGIGA PROMPT

> **Production-grade prompt for designers and AI art engines**

---

## 🎯 UI DESIGN NORTH STAR

A UI that feels like a living artifact of the world.

It must not float above the game — it must **grow from the game's world archetype**.

Your UI should visually answer:
- What civilization made this interface?
- What materials do they use?
- What cultural cues inform every button, panel, and interaction?

**Every UI element is an extension of in-world materials** (metal, stone, bone, fabric, glow).

---

## 📌 UI DESIGN PRINCIPLES

### 1. Material Consistency
UI panels, buttons, and bars must visually feel like they are made of materials from your world — e.g., forged steel, carved bone, stained glass with glyphs.

### 2. Faction Grammar Integration
Each faction has its own UI flavor:

| Faction | Material | Visual Language |
|---------|----------|-----------------|
| **Iron Faith** | Engraved iron | Cold luminescence, sharp angles |
| **Verdant Covenant** | Wooden runes | Moss inlays, organic curves |
| **Stormbound** | Crackling metal | Lightning filigree, energy arcs |
| **Arcane Sapphire** | Floating crystals | Glass facets, sigil glow |

### 3. Legibility First
Thumb readability for cards and icons < 48px must still communicate meaning instantly.

### 4. Visual Feedback
UI motion must feel physical — metal clangs, cloth unfurls, stone resonates. Motion must serve comprehension, not decoration.

---

## 🗂️ UI SYSTEMS & REQUIRED ASSETS

### 🎨 1) UI SHELL ASSETS

| UI Element | Art Requirements | Faction Coding |
|------------|------------------|----------------|
| **Main UI Frame Border** | Strong silhouette, corner emblems | Faction material base |
| **Card UI Frame** | Rarity trims, faction symbols | Material + rarity gradient |
| **HUD Bars** | Resource tracking, fill animation | Faction glow colors |
| **Menu Panels** | Material depth, texture | Steel/wood/crystal variants |
| **Popup Windows** | Elevated layered, shadowed | Consistent depth system |
| **Tooltip Containers** | Micro-ornamentation edges | Subtle faction borders |
| **Loading Screens** | Full panel, ambient motifs | Faction backdrop |
| **Notification Toasts** | Slide-in animation ready | Faction accent color |

### Base Prompt Template:

```
UI Shell: Full UI frame set for a high-fantasy TCG, material style 
based on [FACTION_MATERIAL], engraved cultural glyphs, strong 
silhouette edges, readable at small scale, faction emblem integrated 
into corners, subtle luminescent highlights, physical texture 
(steel/wood/bone/crystal), consistent lighting, cinematic UI depth.

Replace [FACTION_MATERIAL] with:
• forged black steel (Iron Faith)
• aged oak & vine (Verdant)
• storm-etched metal (Stormbound)
• sapphire glass & sigil glow (Arcane)
```

---

## 🔧 2) GENERATION PROMPTS (Copy/Paste Ready)

### GENERATE_UI_SHELL_FRAMES

```
Generate a full set of UI shell frames for a high fantasy TCG called 
Titanfall Chronicles. Each UI panel (main frame, sub-panel, modal window) 
must be faction-coded.

Materials:
- Iron Church: engraved forged black steel
- Verdant Covenant: aged oak & living vines
- Stormbound: storm-etched metal with energy cracks
- Arcane: sapphire glass & floating sigil glow

Include:
- Decorative borders with faction motifs
- Layered material depth (foreground/background)
- Vignette shadowing for focus
- Corner embellishments with faction emblems

Deliver: 16:9 layered PSD/AI with export slices for web (PNG/WebP)
```

---

### GENERATE_UI_CARD_TEMPLATES

```
Generate card frame templates for all rarity tiers: 
common, uncommon, rare, epic, legendary.

Faction trim styles:
- Iron Church: sharp angles, metal arcs, rivet details
- Verdant: interwoven vines, leaf charms, bark texture
- Stormbound: crackling glyphs, circuit patterns
- Arcane: glass facets, rune circuits, crystal prisms

Requirements:
- Must read clearly at 100px (hand view)
- Must read clearly at 300px (detail view)
- Transparent backgrounds for art insertion
- Overlay masks for dynamic content

Deliver: 
- Transparent PNGs for each rarity × faction combination
- Separate overlay masks for cost, name, stats
- Border-only variants for highlighting
```

---

### GENERATE_UI_HUD_COMBAT

```
Generate a combat HUD interface:
- Resource bars (health, mana, energy)
- Turn indicator with active player glow
- Status effect slots (6 positions)
- Phase tracker with current highlight
- Titan ability button
- End Turn button

Design requirements:
- HUD feels part of world material
- Iron Church: metal engraving with glowing inlays
- Verdant: moss-woven wood with amber sap glow
- Stormbound: crystalline with arcing energy
- Arcane: floating runes with violet pulses

Animation states:
- Normal, hover, active, disabled
- Damage flash, heal pulse, buff glow
- Turn transition effects

Deliver: 
- Static assets (PNG)
- Animation states (JSON/Lottie)
- Slice guides for implementation
```

---

### GENERATE_UI_NAV_ICONS

```
Generate a complete set of navigation icons:
Home, Deck, Shop, Profile, Settings, Help, Back, Close, Menu

Design requirements:
- Silhouette-first readability
- Must work at 32px (mobile) and 48px (desktop)
- Material style matches world logic
- Physical depth appearance (engraved, embossed)

Style variants per faction:
- Iron Church: Chiseled, heavy, industrial
- Verdant: Organic, grown, flowing
- Stormbound: Geometric, energetic, sharp
- Arcane: Mystical, floating, layered

Deliver:
- SVG source files (scalable)
- 3 color variants: normal, hover, active
- 32px, 48px, 64px PNG exports
```

---

### GENERATE_UI_ACTION_ICONS

```
Generate game action icons:
Play, Cast, Discard, Equip, Attack, Defend, End Turn, Retreat, Deploy, Move

Design requirements:
- Unique glyph language per action
- Must belong to same universal visual grammar
- Clear meaning without text labels
- Consistent base shape language

Per faction styling:
- Same core glyph, faction-specific embellishment
- Iron: Heavy stroke, metal shine
- Verdant: Organic stroke, leaf accents
- Stormbound: Electric stroke, spark effects
- Arcane: Glowing stroke, rune trails

Deliver:
- Vector files (SVG/AI)
- Base color, hover, and pressed states
- 48px, 96px exports
```

---

### GENERATE_UI_NOTIFICATION_ASSETS

```
Generate notification toasts and badges:

Toast Types:
- Info: Blue glow, subtle pulse
- Warning: Amber glow, attention pulse
- Error: Red glow, shake animation
- Success: Gold glow, celebrate pulse
- Quest: Purple glow, sparkle effect

Design requirements:
- World motif edges (faction-specific borders)
- Slide-in animation from top/bottom
- Auto-dismiss with fade-out
- Persistent option with close button

Animation requirements:
- Enter: Slide + fade (0.3s)
- Idle: Subtle ambient pulse
- Exit: Fade + shrink (0.2s)
- Urgent: Shake + glow intensify

Deliver:
- Toast frame assets (9-slice)
- Icon badges for each type
- Lottie JSON for animations
- Sound cue recommendations
```

---

### GENERATE_UI_TOOLTIP_DESIGNS

```
Generate tooltip containers:

Variants:
- Standard: Text + icon
- Extended: Text + stats + icon
- Lore: Text + scroll texture
- Faction: Colored by source

Design requirements:
- Subtle material borders
- Arrow pointers (8 directions)
- Drop shadow with faction color
- Background blur option

Faction styling:
- Border color matches faction
- Corner detail varies by culture
- Font treatment (serif vs sans)

Deliver:
- 9-slice PNG frames
- Vector source (scalable arrows)
- CSS implementation guide
```

---

### GENERATE_UI_LORE_POPUPS

```
Generate lore popup UI screens:

Components:
- Background art panel (full-bleed capable)
- Decorative borders (material logical)
- Text area with scroll capability
- Faction motif imprint
- Close button (themed)
- "Read More" expansion

Design requirements:
- Feels like opening ancient tome/unveiling relic
- Parallax depth layers
- Ambient particle effects
- Texture integration (parchment, metal, crystal)

Faction variants:
- Iron: Metal plates with etched story
- Verdant: Living bark with glowing sap text
- Stormbound: Holographic crystal display
- Arcane: Floating pages with binding glow

Deliver:
- Layered PSD composition
- Separate elements for animation
- Typography recommendations
```

---

### GENERATE_UI_ENDGAME_SCREENS

```
Generate Victory and Defeat screens:

Victory Screen:
- "TITAN CONQUERS" headline
- Cinematic framing
- Relic unveiling animation space
- Stats summary panel
- Continue/Share buttons

Defeat Screen:
- "TITAN FALLS" headline
- Dark, somber but honorable
- Learn/Retry/Menu options
- Progress persistence display

Design requirements:
- Full-screen cinematic composition
- Particle effects (confetti victory, ash defeat)
- Music visualization space
- Screenshot/share optimization

Faction accents:
- Victory: Faction color explosion
- Defeat: Faction color fade to gray

Deliver:
- Layered compositions
- Animation storyboards
- Particle effect specifications
```

---

### GENERATE_ICON_STATUS_EFFECTS

```
Generate status effect icons:

Core Effects:
- Stun (spirals/swirl)
- Poison (drips/skull)
- Burn (flames/ember)
- Freeze (ice/crystal)
- Shield (barrier/aegis)
- Aura (radiance/glow)
- Stealth (shadow/eye)
- Taunt (attention/agro)
- Buff (up arrow/glow)
- Debuff (down arrow/dim)

Design requirements:
- Clear meaning via shape language
- Minimal noise, maximal readability
- Stackable (multiple effects visible)
- Duration indicator integration

Size variants:
- 24px: Battle token overlay
- 48px: Card text inline
- 96px: Detail inspection

Deliver:
- PNG exports (all sizes)
- SVG source files
- Animation cycles (idle, expiring)
```

---

### GENERATE_ICON_RESOURCES

```
Generate resource icons:

Resources:
- Mana (crystal drop)
- Energy (lightning bolt)
- Souls (ethereal flame)
- Rage (burning blood)
- Focus (eye/target)
- Gold (coin/treasure)
- Gems (premium currency)

Design requirements:
- World-faithful glyph shapes
- Consistent base size (circular)
- Animated variants (glow pulse)
- Color coding system

Style variants per faction:
- Container shape differs
- Fill animation unique
- Glow color matches faction

Deliver:
- PNG (24px, 48px, 96px)
- SVG source
- Spin/flash animation frames
```

---

### GENERATE_UI_WORLD_MAP_SCREEN

```
Generate world map UI:

Components:
- Map frame (atlas/tactical table)
- Minimap border (ornate/functional)
- Zoom controls (+/-, fit, layer)
- Location markers (discovered/hidden)
- Path indicators (roads, rivers)
- Tooltip overlays (region info)
- Legend panel (symbols guide)

Design requirements:
- Material: Ancient atlas vs tactical table
- Parallax depth layers
- Fog of war visual treatment
- Faction territory color coding

Interactions:
- Pan smooth, zoom stepped
- Location hover reveals card
- Path draw animation

Deliver:
- Frame assets (9-slice)
- Control buttons
- Marker icons (various states)
- Parallax layer guide
```

---

### GENERATE_UI_DECKBUILDER_PANEL

```
Generate deck builder UI:

Components:
- Card slot grid (responsive)
- Drag-and-drop placeholders
- Search bar (themed input)
- Filter dropdowns (faction, cost, type)
- Sort controls (rarity, name, cost)
- Deck stats panel (curve, count)
- Save/Load/Export buttons

Design requirements:
- Faction material styling
- Drag ghost visual
- Drop zone highlighting
- Filter chip interface
- Responsive (desktop → mobile)

Faction variants:
- Slot frame style
- Filter dropdown material
- Stats panel embellishment

Deliver:
- All component assets
- Drag state animations
- Responsive layout guide
```

---

### GENERATE_UI_STORE_PANEL

```
Generate in-game store UI:

Components:
- Category tabs (Cards, Packs, Cosmetics)
- Product cards (image, name, price)
- Price badges (gold, gems, real)
- Purchase button (themed primary)
- Bundle highlights (glow, badge)
- Currency display (top bar)
- Limited time badges

Design requirements:
- Premium feel without paywall anxiety
- Clear value communication
- Faction accents on relevant items
- Sale/Deal visual treatment

Interactions:
- Card flip for details
- Buy confirmation modal
- Unlock animation

Deliver:
- Panel frames
- Product card templates
- Button states
- Badge assets
```

---

### GENERATE_UI_SETTINGS_PANEL

```
Generate settings panel:

Components:
- Tab navigation (Graphics, Audio, Gameplay, Account)
- Sliders (volume, sensitivity)
- Toggles (on/off switches)
- Dropdowns (resolution, language)
- Keybinding display
- Reset/Apply buttons

Design requirements:
- Sliders appear physically embedded
- Toggles feel like physical switches
- Dropdowns animate like unfolding
- Consistent spacing and rhythm

Material styling:
- Iron: Mechanical, industrial
- Verdant: Organic, grown
- Stormbound: Holographic, futuristic
- Arcane: Mystical, floating

Deliver:
- All control assets
- Animation specifications
- Layout grid system
```

---

### GENERATE_UI_INPUT_STATES

```
Generate explicit input states for ALL interactive elements:

States Required:
1. Normal — resting state
2. Hover — mouse over
3. Active — mouse down / pressed
4. Disabled — unavailable
5. Focus — keyboard navigation
6. Loading — processing
7. Success — completed
8. Error — failed

Per Element:
- Buttons (all variants)
- Input fields
- Sliders
- Toggles
- Dropdowns
- Cards

Animation requirements:
- State transitions: 150-300ms
- Easing: physical feel (spring, bounce)
- Feedback: visual + audio cues

Deliver:
- State asset sheets
- CSS animation code
- Sound effect specs
```

---

### GENERATE_WORLD_UI_FX_OVERLAY

```
Generate UI visual effect overlays:

Ambient Effects:
- Dust motes (floating particles)
- Glyph flicker (rune pulsing)
- Light streaks (god rays)
- Energy hum (subtle glow)

Interaction Effects:
- Button press ripple
- Card hover float
- Transition swipes
- Loading spirals

Weather/Time:
- Day/night color grading
- Rain on glass panels
- Snow dust overlay
- Fire glow reflection

Deliver:
- Transparent video loops (WebM)
- Particle sprite sheets
- CSS filter recipes
- Performance guidelines
```

---

### GENERATE_FACTION_BANNERS

```
Generate full faction banners:

Usage:
- UI backdrops (blurred)
- Loading screens
- Marketing materials
- Profile backgrounds

Per Faction:
- Wide (21:9) — ultrawide backdrop
- Standard (16:9) — standard screen
- Portrait (9:16) — mobile/portrait
- Square (1:1) — social media

Elements:
- Faction emblem (large, centered)
- Ambient background (material texture)
- Tagline space
- Character silhouette optional

Deliver:
- High-res exports (4K minimum)
- Compressed variants (web)
- Layered sources (emblem separable)
```

---

### GENERATE_LOBBY_UI

```
Generate multiplayer lobby UI:

Components:
- Player list panel (4-8 players)
- Player avatar frame (faction badge)
- Ready status indicator
- Chat panel (with history)
- Chat input bar
- Game mode selector
- Map vote display
- Start/Ready button

Design requirements:
- Player slots feel like seats at table
- Faction frame badges around avatars
- Chat feels like whisper/comm device
- Ready state: individual + all-ready

Avatar frames per faction:
- Border style
- Ready glow color
- Hover highlight

Deliver:
- Panel frames
- Avatar frame variants (4 factions)
- Chat bubble styles
- Button states
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Before Generation:
- [ ] Define your 4 factions completely (name, material, values)
- [ ] Choose primary UI faction (or neutral)
- [ ] Establish color palette (primary, secondary, accent per faction)
- [ ] Document lighting direction (upper-left standard?)
- [ ] Set target resolutions (mobile, tablet, desktop, 4K)

### During Generation:
- [ ] Start with shell frames (foundation)
- [ ] Generate all states for each element
- [ ] Test readability at minimum size (24px icons, 100px cards)
- [ ] Verify faction consistency across elements

### After Generation:
- [ ] Slice 9-patch assets for scalable frames
- [ ] Export animation frames (sprite sheets)
- [ ] Compress for web (WebP when possible)
- [ ] Create CSS variables for colors
- [ ] Document all timing values (animations)

---

## 🎨 STYLE REFERENCE BOARD

Create a mood board with:
- Material texture references (steel, wood, crystal)
- Cultural design references (Gothic, Art Nouveau, Art Deco, Mystical)
- Lighting reference (consistent direction, mood)
- Typography specimens
- Animation timing references (physical vs digital)

---

## 💾 DELIVERY SPECIFICATIONS

### File Formats:
- **Source:** PSD / AI / Figma
- **Web Assets:** PNG-24, WebP, SVG
- **Animations:** Lottie JSON, sprite sheets PNG
- **Video:** WebM (alpha), MP4 (fallback)

### Naming Convention:
```
[system]_[element]_[faction]_[state]_[size].[ext]

Examples:
shell_modal_iron_normal_1920x1080.png
shell_modal_iron_hover_1920x1080.png
card_frame_legendary_arcane_front_512x768.png
hud_healthbar_verdant_fill_240x32.png
icon_action_attack_stormbound_active_48x48.png
```

### Folder Structure:
```
assets/
├── ui/
│   ├── shell/           # Frames, panels, borders
│   ├── cards/           # Card templates
│   ├── hud/             # Health, energy, bars
│   ├── icons/
│   │   ├── nav/         # Navigation
│   │   ├── actions/     # Game actions
│   │   ├── status/      # Status effects
│   │   └── resources/   # Currency
│   ├── screens/         # Menu, lobby, settings
│   ├── effects/         # Particles, overlays
│   └── fonts/           # Typography
└── marketing/           # Banners, social
```

---

## 🚀 QUICK START WORKFLOW

1. **Define** your 4 factions (30 min)
2. **Generate** shell frames for 1 faction (2 hours)
3. **Test** in engine at target resolution (30 min)
4. **Iterate** based on readability (1 hour)
5. **Batch generate** remaining factions (8 hours)
6. **Integrate** all assets (4 hours)
7. **Polish** animations and feedback (4 hours)

**Total estimated time: 20 hours for complete UI system**

---

*This prompt is designed to be copied directly into art generation tools, given to design teams, or used as a specification document for outsourcing.*
