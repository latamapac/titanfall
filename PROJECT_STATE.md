# Titanfall Chronicles - Project State

> Last updated: 2026-02-09

---

## 🚀 Deployment Status

**Live URL:** https://intuitive-creativity-production-8688.up.railway.app

**GitHub:** https://github.com/latamapac/titanfall

---

## ✅ What's Working

### Core Game
- [x] Full game engine with 6 phases (Refresh, Draw, Deploy, Movement, Combat, End)
- [x] 5 Titans with unique abilities (Kargath, Thalor, Sylara, Nyx, Elandor)
- [x] 49 Cards (35 units, 10 spells, 4 structures)
- [x] 5 Maps (Verdant Valley, Obsidian Peaks, Tidal Marshes, Arcane Ruins, Dragon's Spine)
- [x] 8 Terrain types with effects
- [x] 14 Races with synergy bonuses
- [x] 24 Keywords with mechanics
- [x] Veterancy system (units level up with XP)
- [x] Deck generation based on Titan element

### Screens
- [x] Main Menu (Local, Multiplayer, Deck Builder, Card Creator, Rules)
- [x] New Game Setup (Titan selection, Map selection)
- [x] Game Screen (Board, Hand, Player bars, Sidebar)
- [x] Lobby Screen (Create/Join rooms)
- [x] **Deck Builder** - Build custom 30-card decks, save/load/delete, cost curve
- [x] **Card Creator** - Create custom cards with stats/keywords/veterancy
- [x] **Rules Screen** - Full rules reference with tabs

### Multiplayer
- [x] Socket.io server
- [x] Room creation with 5-digit codes
- [x] Real-time state synchronization
- [x] Host/Remote player roles
- [x] Action relay system

### Audio
- [x] Procedural SFX (sword hits, spells, UI clicks)
- [x] Ambient background music
- [x] Toggle on/off

### Extras from Original HTML
- [x] All cards extracted
- [x] All titans extracted
- [x] All maps extracted
- [x] Keywords system
- [x] Terrain effects
- [x] Synergy system
- [x] SFX system

---

## 📋 Known Issues / TODO

### Bugs
- [ ] Need to verify all card abilities work correctly
- [ ] Some edge cases in combat might need testing
- [ ] Mobile responsiveness could be improved

### Features to Add (from original HTML)
- [ ] Single-player vs AI mode
- [ ] Flavor text on cards
- [ ] More detailed card art (currently procedural SVG)
- [ ] Tutorial mode

### Polish
- [ ] Loading states
- [ ] Better error handling for multiplayer disconnects
- [ ] Sound volume controls (not just on/off)
- [ ] Card hover tooltips with full stats

### Future Ideas
- [ ] Campaign mode
- [ ] Ranked multiplayer
- [ ] Replay system
- [ ] More cards/titans/maps
- [ ] Card balance analytics
- [ ] User accounts

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Express + Socket.io |
| Styling | CSS Modules |
| Audio | Web Audio API (procedural) |
| Deployment | Railway |

---

## 📁 Key Files

```
src/
├── components/
│   ├── screens/
│   │   ├── MenuScreen.tsx
│   │   ├── NewGameScreen.tsx
│   │   ├── GameScreen.tsx
│   │   ├── LobbyScreen.tsx
│   │   ├── RulesScreen.tsx        ← Full rules with tabs
│   │   ├── DeckBuilderScreen.tsx  ← Deck building
│   │   └── CardCreatorScreen.tsx  ← Card creation
│   ├── game/
│   │   ├── Board.tsx
│   │   ├── HandArea.tsx
│   │   ├── PlayerBar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Cell.tsx
│   │   └── UnitToken.tsx
│   └── overlays/
│       ├── TurnOverlay.tsx
│       └── VictoryOverlay.tsx
├── engine/
│   ├── GameEngine.ts    ← Core game logic
│   └── utils.ts         ← Helpers + deck storage
├── data/
│   ├── cards.ts         ← 49 cards
│   ├── titans.ts        ← 5 titans
│   ├── maps.ts          ← 5 maps
│   └── constants.ts     ← Elements, keywords, etc
├── audio/
│   └── SFX.ts           ← Procedural audio
├── art/
│   └── CardArt.ts       ← SVG card art
└── multiplayer/
    └── socket.ts        ← Socket.io client

server/
└── index.js             ← Express + Socket.io server
```

---

## 🎮 How to Run Locally

```bash
# Dev mode (2 terminals)
npm run dev          # Vite dev server on :5173
cd server && npm run dev  # WS server on :3001

# Production
npm run build
npm start            # Serves everything on :3001

# Docker
docker build -t titanfall . && docker run -p 3001:3001 titanfall
```

---

## 🔄 Recent Changes (2026-02-09)

1. **Fixed critical bug:** Empty deck arrays → Now generates default 30-card decks
2. **Added Deck Builder:** Full deck building with cost curve visualization
3. **Added Card Creator:** Create custom cards with all stats/keywords
4. **Added SFX:** Procedural audio system (swords, spells, ambient)
5. **Expanded Rules:** Complete rules reference with 4 tabs
6. **Deployed to Railway:** Live at https://intuitive-creativity-production-8688.up.railway.app

---

## 📝 Notes for Next Session

- Game is fully playable in both local and multiplayer modes
- Custom cards are saved to localStorage (browser-only)
- Decks are also saved to localStorage
- Railway deployment is automatic from GitHub pushes
- The original HTML file is preserved at `/Users/mark/titanfall-chronicles.html`

---

**Next Priority:** 
1. Test all card abilities work correctly
2. Add AI opponent for single-player
3. Mobile responsiveness improvements
