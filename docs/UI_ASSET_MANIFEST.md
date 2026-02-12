# 🎨 Titanfall Chronicles — UI Asset Manifest

> **113 AI-Generated UI Assets via Gemini 3 Pro Image (Nano Banana Pro)**

---

## 📊 Generation Summary

| Metric | Value |
|--------|-------|
| **Total Assets** | 113 PNG files |
| **Total Size** | ~77 MB |
| **Generation Time** | ~40 minutes |
| **API Used** | Gemini 3 Pro Image Preview |
| **Success Rate** | 100% (0 failures) |

---

## 📁 Asset Categories

### 1. Shell Elements (4 assets)
Foundation UI frames for panels, modals, buttons, tooltips.

| Asset | Faction | Size | Usage |
|-------|---------|------|-------|
| `shell_panel_kargath.png` | Kargath | 668KB | Main game panels |
| `shell_modal_kargath.png` | Kargath | 664KB | Dialog popups |
| `shell_button_kargath.png` | Kargath | 743KB | Button states |
| `shell_tooltip_kargath.png` | Kargath | 600KB | Info tooltips |

> **Note:** Shell elements currently generated for Kargath only. Run generator with other factions for complete set.

---

### 2. Card Frames (25 assets)
Trading card templates for all 5 rarities × 5 factions.

**Rarities:** Common → Uncommon → Rare → Epic → Legendary

| Faction | Common | Uncommon | Rare | Epic | Legendary |
|---------|--------|----------|------|------|-----------|
| **Kargath** | 686KB | 662KB | 735KB | 805KB | 873KB |
| **Thalor** | 566KB | 751KB | 813KB | 704KB | 899KB |
| **Sylara** | 701KB | 804KB | 796KB | 762KB | 691KB |
| **Nyx** | 595KB | 564KB | 693KB | 564KB | 710KB |
| **Elandor** | 484KB | 627KB | 709KB | 703KB | 734KB |

**Naming:** `card_frame_{rarity}_{faction}.png`

**Example:** `card_frame_legendary_kargath.png`

---

### 3. HUD Elements (20 assets)
Heads-up display components for combat interface.

**Types:** Health Bar, Energy Bar, Phase Tracker, Status Slot

| Faction | Health Bar | Energy | Phase Tracker | Status Slot |
|---------|------------|--------|---------------|-------------|
| Kargath | 671KB | — | — | — |
| Thalor | 567KB | — | — | — |
| Sylara | 656KB | — | — | — |
| Nyx | 674KB | — | — | — |
| Elandor | 587KB | — | — | — |

**Naming:** `hud_{type}_{faction}.png`

---

### 4. Status Effect Icons (8 assets)
Universal status effect badges.

| Icon | Size | Visual Theme |
|------|------|--------------|
| `status_stun.png` | ~500KB | Swirling stars/spirals |
| `status_poison.png` | ~500KB | Toxic green drips |
| `status_burn.png` | ~500KB | Orange flames |
| `status_freeze.png` | ~500KB | Ice crystals |
| `status_shield.png` | ~500KB | Protective barrier |
| `status_regen.png` | ~500KB | Healing light/leaf |
| `status_buff.png` | ~500KB | Upward chevron/glow |
| `status_debuff.png` | ~500KB | Downward arrow/dim |

---

### 5. Action Icons (40 assets)
Interactive button icons for all game actions.

**Actions:** Attack, Defend, Move, Deploy, End Turn, Home, Deck, Settings

| Action | Kargath | Thalor | Sylara | Nyx | Elandor |
|--------|---------|--------|--------|-----|---------|
| Attack | 659KB | 687KB | 563KB | 608KB | 560KB |
| Defend | 643KB | 610KB | 624KB | 637KB | 540KB |
| Move | 681KB | 567KB | 569KB | 613KB | 556KB |
| Deploy | 615KB | 582KB | 573KB | 568KB | 615KB |
| End Turn | 580KB | 613KB | 566KB | 579KB | 548KB |
| Home | 616KB | 580KB | 563KB | 582KB | 556KB |
| Deck | 588KB | 565KB | 603KB | 568KB | 593KB |
| Settings | 589KB | 599KB | 566KB | 609KB | 541KB |

**Naming:** `icon_{action}_{faction}.png`

**Features:** Each includes 3 states (Normal, Hover, Active) in one image

---

### 6. Screen Backgrounds (15 assets)
Full-screen UI backgrounds for game states.

| Screen | Kargath | Thalor | Sylara | Nyx | Elandor |
|--------|---------|--------|--------|-----|---------|
| Victory | 904KB | 677KB | 574KB | 800KB | 815KB |
| Defeat | 731KB | 609KB | 564KB | 667KB | 652KB |
| Loading | 656KB | 600KB | 610KB | 624KB | 648KB |

**Naming:** `screen_{type}_{faction}.png`

---

## 🎨 Faction Visual Identity

### Kargath (Iron Church)
- **Material:** Forged black steel
- **Colors:** Crimson red, charcoal black, molten orange
- **Motifs:** Anvil, hammer, chain, flame
- **Personality:** Industrial, militant, disciplined

### Thalor (Verdant Covenant)
- **Material:** Aged oak with living vines
- **Colors:** Forest green, golden amber, bark brown
- **Motifs:** Tree, leaf, root, sun
- **Personality:** Ancient, nurturing, patient

### Sylara (Stormbound)
- **Material:** Crystalline with lightning
- **Colors:** Electric cyan, storm gray, silver
- **Motifs:** Lightning, cloud, crystal, wind
- **Personality:** Volatile, brilliant, unpredictable

### Nyx (Void Covenant)
- **Material:** Shadow glass with void essence
- **Colors:** Deep purple, midnight black, ghost white
- **Motifs:** Moon, shadow, raven, silence
- **Personality:** Mysterious, cunning, elegant

### Elandor (Arcane Order)
- **Material:** Sapphire glass with floating runes
- **Colors:** Arcane blue, mystic violet, starlight
- **Motifs:** Tome, sigil, constellation, portal
- **Personality:** Scholarly, enigmatic, cosmic

---

## 📂 File Locations

```
titanfall-chronicles/
└── public/
    └── assets/
        └── ui/
            ├── card_frame_*.png      (25 files)
            ├── hud_*.png             (20 files)
            ├── icon_*.png            (40 files)
            ├── screen_*.png          (15 files)
            ├── shell_*.png           (4 files)
            ├── status_*.png          (8 files)
            └── test-*.png            (1 file)
```

---

## 🚀 Usage in Code

### Card Frame
```tsx
<img 
  src={`/assets/ui/card_frame_${card.rarity}_${card.faction}.png`}
  className="card-frame"
/>
```

### HUD Element
```tsx
<div 
  className="health-bar"
  style={{ 
    backgroundImage: `url(/assets/ui/hud_healthbar_${player.faction}.png)` 
  }}
/>
```

### Action Icon
```tsx
<button className="action-btn">
  <img src={`/assets/ui/icon_attack_${faction}.png`} />
</button>
```

---

## 🔄 Regenerating Assets

```bash
cd ../gemini-image-service
export GEMINI_API_KEY="your-key"

# Generate specific category
node generate-titanfall-ui.js cards          # All card frames
node generate-titanfall-ui.js hud kargath    # Kargath HUD only
node generate-titanfall-ui.js icons          # All action icons
node generate-titanfall-ui.js all            # Everything
```

---

## ✨ Highlights

- **Faction Consistency:** Each faction has distinct visual language
- **State Variations:** Icons include Normal/Hover/Active states
- **Resolution Ready:** All assets generated at game-appropriate sizes
- **Transparent Centers:** Card frames have alpha channels for artwork
- **Production Quality:** 500KB-900KB PNGs with fine detail

---

*Generated with Gemini 3 Pro Image Preview (Nano Banana Pro)*
*Pipeline: `generate-titanfall-ui.js`*
