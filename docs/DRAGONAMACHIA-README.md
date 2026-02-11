# Dragonamachia

**Where Factions Collide**

A tactical digital card game with distinct faction-based warfare, inspired by Hearthstone, Magic: The Gathering, and Mortal Kombat.

---

## 🎮 Project Overview

Dragonamachia is a competitive card game featuring four ideological factions battling for dominance. Each faction has unique visual identity, playstyle, and lore.

### The Four Factions

| Faction | Playstyle | Visual Identity |
|---------|-----------|-----------------|
| **Iron Church** 🛡️ | Tank/Defense | Forged iron, geometric runes, ash embers |
| **Verdant Covenant** 🌿 | Growth/Swarm | Living vines, organic armor, pollen motes |
| **Stormbound** ⚡ | Speed/Air | Lightning, wind glyphs, crackling energy |
| **Esoteric Scholarium** 🔮 | Control/Magic | Floating sigils, void crystals, mind magic |

---

## 📁 Project Structure

```
dragonamachia/
├── lore/
│   └── world-bible.json          # Complete world lore, factions, characters
├── tasks/
│   ├── asset-pipeline.json       # Task tracker with 18 tasks across 5 phases
│   └── task-cli.js              # CLI tool for task management
├── prompts/
│   └── generation-templates.js   # AI prompt templates for all assets
├── assets/                      # Generated assets (to be created)
│   ├── heroes/
│   ├── creatures/
│   ├── equipment/
│   └── ui/
└── docs/                        # Documentation (to be added)
```

---

## 🚀 Quick Start

### View Task Pipeline

```bash
cd tasks
node task-cli.js list           # All tasks
node task-cli.js list --phase=2 # Phase 2 only
node task-cli.js next           # Next actionable task
node task-cli.js report         # Progress report
```

### Generate AI Prompts

```bash
cd prompts
node generation-templates.js    # Output complete manifest
```

Or import in your code:
```javascript
import { generateHeroPrompt, generateCreaturePrompt } from './prompts/generation-templates.js';

const wardenPrompt = generateHeroPrompt('warden', 'iron-church');
console.log(wardenPrompt.prompt);
```

---

## 🎨 Visual Style Guide (Summary)

### Core Principles

1. **Bold Silhouettes** - Every character readable at a glance
2. **Signal Colors** - Faction identity through focal elements
3. **Grounded Anatomy** - Real biology with mythic exaggeration
4. **Cultural Weapons** - Gear that feels used in faction wars
5. **UI = World Extension** - Interface belongs to the universe

### Faction Color Palettes

```css
/* Iron Church */
--iron-primary: #8B4513;    /* Bronze */
--iron-signal: #FF6B35;     /* Forge Orange */

/* Verdant Covenant */
--verdant-primary: #228B22; /* Forest Green */
--verdant-signal: #ADFF2F;  /* Acid Green */

/* Stormbound */
--storm-primary: #4169E1;   /* Sky Blue */
--storm-signal: #00FFFF;    /* Electric Cyan */

/* Esoteric Scholarium */
--scholarium-primary: #4B0082; /* Deep Purple */
--scholarium-signal: #FFD700;  /* Arcane Gold */
```

---

## 📋 Asset Pipeline

### Phase 1: Foundation (Week 1)
- ✅ World Bible Complete
- ⬜ Visual Style Guide
- ⬜ Character Templates

### Phase 2: Hero Assets (Week 2-3)
- ⬜ Iron Warden (Tank)
- ⬜ Verdant Thornbinder (DPS)
- ⬜ Storm Sky-Seeker (Ranged)
- ⬜ Scholarium Arcanist (Caster)

### Phase 3: Creatures (Week 4)
- ⬜ Forest Behemoth
- ⬜ Iron Juggernaut
- ⬜ Storm Wyrm

### Phase 4: UI System (Week 5-6)
- ⬜ Card Frames (4 rarities × 4 factions)
- ⬜ Button System
- ⬜ Icon Set (20+)

### Phase 5: Effects (Week 7-8)
- ⬜ Spell Effects (4 factions)
- ⬜ UI Animations
- ⬜ Particle Systems

**Total: 18 tasks | 96 estimated hours**

---

## 📝 Task Management

### View Tasks
```bash
node tasks/task-cli.js list
```

### Check Status
```bash
node tasks/task-cli.js report
```

### Next Action
```bash
node tasks/task-cli.js next
```

---

## 🛠️ For AI Generation

### Hero Prompt Example
```javascript
import { generateHeroPrompt } from './prompts/generation-templates.js';

const prompt = generateHeroPrompt('warden', 'iron-church');
// Returns:
// {
//   prompt: "Warden, Tank hero from the Iron Church...",
//   negative: "anime, cartoon, blurry...",
//   specs: { dimensions: "1024x1024", format: "PNG", ... }
// }
```

### Generate All Faction Assets
```javascript
import { generateFactionPrompts } from './prompts/generation-templates.js';

const ironChurchAssets = generateFactionPrompts('iron-church');
// Returns heroes, creatures, equipment, and UI prompts
```

---

## 👥 Team

- **Creative Director:** Alaryc
- **Design Architect:** [To be hired]
- **AI Asset Generation:** Nano Banana Pro (Gemini 3)
- **Development:** [Your team]

---

## 📄 Documentation

- `lore/world-bible.json` - Complete faction lore, religions, locations
- `tasks/asset-pipeline.json` - Task tracker with deadlines
- `prompts/generation-templates.js` - AI prompt generation system
- `TITANFALL_VISUAL_SYSTEM_PLAN.md` - Extended planning document
- `DESIGN_ARCHITECT_JOB.md` - Job posting for visual designer

---

## 🎯 Next Steps

1. **Review World Bible** - Check `lore/world-bible.json`
2. **Hire Design Architect** - Post job using `DESIGN_ARCHITECT_JOB.md`
3. **Begin Asset Generation** - Use prompt templates with Nano Banana Pro
4. **Track Progress** - Use CLI tool to update task status

---

**Status:** Planning Phase | **Last Updated:** 2026-02-11
