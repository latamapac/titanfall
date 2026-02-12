# 🎨 UI Asset Implementation Guide — Titanfall Chronicles

> **Mapping generated assets to React components**

This guide bridges the gap between the UI generation pipeline and actual implementation in the Titanfall codebase.

---

## 🏗️ Architecture Overview

```
Generated Assets → CSS Variables → React Components
      ↓                ↓                ↓
   PNG/WebP       factions.css      UI Components
   SVG             theme system      Screen layouts
   Lottie JSON     animation hooks   Interactive elements
```

---

## 📁 Asset-to-Code Mapping

### 1. Shell Frames → `ShellFrame` Component

**Generated Assets:**
- `shell_frame_[faction]_[size].png`
- Corner embellishments
- Border slices (9-patch)

**Implementation:**
```tsx
// src/components/ui/ShellFrame.tsx
interface ShellFrameProps {
  faction: Faction;
  variant: 'modal' | 'panel' | 'card';
  children: React.ReactNode;
}

export const ShellFrame: React.FC<ShellFrameProps> = ({ 
  faction, variant, children 
}) => {
  return (
    <div className={`shell-frame ${faction}-theme ${variant}`}>
      <div className="frame-corner tl" />
      <div className="frame-corner tr" />
      <div className="frame-corner bl" />
      <div className="frame-corner br" />
      <div className="frame-content">{children}</div>
    </div>
  );
};
```

**CSS Integration:**
```css
/* src/styles/shell.css */
.shell-frame {
  position: relative;
  background: var(--panel-bg);
  border: var(--frame-border-width) solid var(--frame-border-color);
}

.shell-frame.kargath-theme {
  --panel-bg: url('/assets/ui/shell/panel_kargath.png');
  --frame-border-color: var(--kargath-ember);
  --corner-asset: url('/assets/ui/shell/corner_kargath.png');
}
```

---

### 2. Card Templates → `CardFrame` Component

**Generated Assets:**
- `card_frame_[rarity]_[faction]_front.png`
- `card_frame_[rarity]_[faction]_back.png`
- Rarity gem overlays
- Stat plate assets

**Implementation:**
```tsx
// src/components/card/CardFrame.tsx
interface CardFrameProps {
  card: Card;
  size: 'sm' | 'md' | 'lg';
  revealed?: boolean;
}

export const CardFrame: React.FC<CardFrameProps> = ({ 
  card, size, revealed = true 
}) => {
  const { faction, rarity } = card;
  
  return (
    <div className={`card-frame ${size} ${faction}-theme ${rarity}`}>
      {!revealed ? (
        <div className="card-back" />
      ) : (
        <>
          <div className="card-art">
            <img src={card.imageUrl} alt={card.name} />
          </div>
          <div className="card-frame-overlay" />
          <div className="card-cost-plate">{card.cost}</div>
          <div className="card-name-plate">{card.name}</div>
          <div className="card-stats">
            <span className="atk">{card.atk}</span>
            <span className="hp">{card.hp}</span>
          </div>
          <div className={`rarity-gem ${rarity}`} />
        </>
      )}
    </div>
  );
};
```

**CSS Size Scale:**
```css
.card-frame.sm { width: 80px; height: 112px; }
.card-frame.md { width: 120px; height: 168px; }
.card-frame.lg { width: 240px; height: 336px; }
```

---

### 3. HUD Combat → `CombatHUD` Component

**Generated Assets:**
- `hud_healthbar_[faction]_frame.png`
- `hud_healthbar_[faction]_fill.png`
- `hud_energy_[faction]_*.png`
- Status slot frames
- Phase indicator icons

**Implementation:**
```tsx
// src/components/game/CombatHUD.tsx
export const CombatHUD: React.FC = () => {
  const { player, phase } = useGame();
  const faction = player.titan.faction;
  
  return (
    <div className={`combat-hud ${faction}-theme`}>
      {/* Health Bar */}
      <ResourceBar 
        type="health"
        current={player.hp}
        max={player.maxHp}
        faction={faction}
      />
      
      {/* Energy Bar */}
      <ResourceBar 
        type="energy"
        current={player.energy}
        max={10}
        faction={faction}
      />
      
      {/* Status Slots */}
      <StatusSlots effects={player.statusEffects} />
      
      {/* Phase Tracker */}
      <PhaseTracker currentPhase={phase} />
      
      {/* Titan Ability */}
      <TitanAbilityButton titan={player.titan} />
    </div>
  );
};
```

---

### 4. Nav Icons → `Icon` Component

**Generated Assets:**
- `icon_nav_[name]_[faction].svg`
- 3 color variants per icon

**Implementation:**
```tsx
// src/components/ui/Icon.tsx
const iconPaths = {
  home: { /* SVG path */ },
  deck: { /* SVG path */ },
  shop: { /* SVG path */ },
  // ... etc
};

interface IconProps {
  name: keyof typeof iconPaths;
  faction?: Faction;
  size?: 24 | 32 | 48;
  state?: 'normal' | 'hover' | 'active';
}

export const Icon: React.FC<IconProps> = ({ 
  name, faction = 'neutral', size = 32, state = 'normal' 
}) => {
  return (
    <svg 
      className={`ui-icon ${faction} ${state}`}
      width={size} 
      height={size}
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
};
```

---

### 5. Action Icons → `ActionButton` Component

**Generated Assets:**
- `icon_action_[action]_[faction]_[state].png`
- Attack, Defend, End Turn, etc.

**Implementation:**
```tsx
// src/components/ui/ActionButton.tsx
interface ActionButtonProps {
  action: 'play' | 'attack' | 'defend' | 'endTurn' | 'deploy';
  faction: Faction;
  disabled?: boolean;
  onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  action, faction, disabled, onClick
}) => {
  return (
    <button 
      className={`action-button ${action} ${faction}-theme`}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon name={action} faction={faction} size={48} />
      <span className="action-label">{getActionLabel(action)}</span>
    </button>
  );
};
```

---

### 6. Notifications → `Toast` Component

**Generated Assets:**
- `toast_frame_[type].png` (9-slice)
- `icon_notification_[type].png`
- Lottie animations

**Implementation:**
```tsx
// src/components/ui/Toast.tsx
interface ToastProps {
  type: 'info' | 'warning' | 'error' | 'success' | 'quest';
  message: string;
  duration?: number;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  type, message, duration = 3000, onDismiss 
}) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);
  
  return (
    <div className={`toast ${type} slide-in`}>
      <div className="toast-icon">
        <Icon name={type} size={32} />
      </div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onDismiss}>×</button>
    </div>
  );
};
```

---

### 7. Tooltips → `Tooltip` Component

**Generated Assets:**
- `tooltip_frame_[faction].png` (9-slice)
- Arrow assets (8 directions)

**Implementation:**
```tsx
// src/components/ui/Tooltip.tsx
interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  faction?: Faction;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, position = 'top', faction = 'neutral' 
}) => {
  return (
    <div className={`tooltip ${position} ${faction}-theme`}>
      <div className="tooltip-arrow" />
      <div className="tooltip-content">{content}</div>
    </div>
  );
};
```

---

### 8. Endgame Screens → `VictoryScreen` / `DefeatScreen`

**Generated Assets:**
- `screen_victory_[faction].jpg` (full screen)
- `screen_defeat_[faction].jpg` (full screen)
- Particle effect overlays
- Stats panel frame

**Implementation:**
```tsx
// src/components/screens/VictoryScreen.tsx
export const VictoryScreen: React.FC = () => {
  const { player, stats } = useGame();
  const faction = player.titan.faction;
  
  return (
    <div className={`victory-screen ${faction}-theme`}>
      <div className="victory-background" />
      <div className="victory-particles" />
      
      <div className="victory-content">
        <h1 className="victory-title">TITAN CONQUERS</h1>
        
        <div className="victory-stats">
          <StatItem label="Turns" value={stats.turns} />
          <StatItem label="Cards Played" value={stats.cardsPlayed} />
          <StatItem label="Damage Dealt" value={stats.damageDealt} />
        </div>
        
        <div className="victory-actions">
          <ActionButton action="play" faction={faction}>
            Play Again
          </ActionButton>
          <ActionButton action="home" faction={faction}>
            Main Menu
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
```

---

### 9. Status Effect Icons → `StatusEffect` Component

**Generated Assets:**
- `icon_status_[effect]_[size].png`
- Stun, Poison, Burn, Shield, etc.

**Implementation:**
```tsx
// src/components/game/StatusEffect.tsx
interface StatusEffectProps {
  effect: StatusEffectType;
  duration?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusEffect: React.FC<StatusEffectProps> = ({ 
  effect, duration, size = 'md' 
}) => {
  return (
    <div className={`status-effect ${effect} ${size}`}>
      <img 
        src={`/assets/ui/icons/status/${effect}.png`}
        alt={effect}
      />
      {duration && (
        <span className="duration">{duration}</span>
      )}
    </div>
  );
};
```

---

### 10. Resource Icons → `ResourceDisplay` Component

**Generated Assets:**
- `icon_resource_[resource]_[size].png`
- Mana, Energy, Gold, etc.

**Implementation:**
```tsx
// src/components/ui/ResourceDisplay.tsx
interface ResourceDisplayProps {
  type: 'mana' | 'energy' | 'gold' | 'gems';
  amount: number;
  showIcon?: boolean;
}

export const ResourceDisplay: React.FC<ResourceDisplayProps> = ({
  type, amount, showIcon = true
}) => {
  return (
    <span className={`resource-display ${type}`}>
      {showIcon && (
        <Icon name={type} size={24} />
      )}
      <span className="resource-amount">{amount}</span>
    </span>
  );
};
```

---

### 11. World FX Overlay → `AmbientOverlay` Component

**Generated Assets:**
- `fx_dust_motes.webm` (transparent video)
- `fx_glyphs_[faction].webm`
- Light streak overlays

**Implementation:**
```tsx
// src/components/effects/AmbientOverlay.tsx
export const AmbientOverlay: React.FC = () => {
  const { player } = useGame();
  const faction = player?.titan?.faction || 'kargath';
  
  return (
    <div className="ambient-overlay">
      <video 
        className="fx-dust"
        src="/assets/ui/effects/dust_motes.webm"
        autoPlay
        loop
        muted
      />
      <video 
        className={`fx-glyphs ${faction}`}
        src={`/assets/ui/effects/glyphs_${faction}.webm`}
        autoPlay
        loop
        muted
      />
    </div>
  );
};
```

---

### 12. Faction Banners → `FactionBanner` Component

**Generated Assets:**
- `banner_[faction]_[aspect].jpg`
- 21:9, 16:9, 9:16, 1:1 variants

**Implementation:**
```tsx
// src/components/ui/FactionBanner.tsx
interface FactionBannerProps {
  faction: Faction;
  aspect?: 'ultrawide' | 'standard' | 'portrait' | 'square';
  variant?: 'backdrop' | 'loading' | 'profile';
}

export const FactionBanner: React.FC<FactionBannerProps> = ({
  faction, aspect = 'standard', variant = 'backdrop'
}) => {
  return (
    <div 
      className={`faction-banner ${faction} ${variant}`}
      style={{
        backgroundImage: `url('/assets/ui/banners/${faction}_${aspect}.jpg')`
      }}
    />
  );
};
```

---

## 🎨 CSS Theme System Integration

### Faction CSS Variables

```css
/* src/styles/factions.css */
:root {
  /* Kargath — Iron Church */
  --kargath-primary: #e84430;
  --kargath-secondary: #8b2e1c;
  --kargath-accent: #ff6b4a;
  --kargath-glow: rgba(232, 68, 48, 0.6);
  --kargath-material: url('/assets/ui/materials/kargath_stone.png');
  
  /* Thalor — Verdant Covenant */
  --thalor-primary: #d4a030;
  --thalor-secondary: #8b6914;
  --thalor-accent: #f0c050;
  --thalor-glow: rgba(212, 160, 48, 0.6);
  --thalor-material: url('/assets/ui/materials/thalor_wood.png');
  
  /* Sylara — Stormbound */
  --sylara-primary: #30d4c8;
  --sylara-secondary: #1a8b84;
  --sylara-accent: #4afff0;
  --sylara-glow: rgba(48, 212, 200, 0.6);
  --sylara-material: url('/assets/ui/materials/sylara_crystal.png');
  
  /* Nyx — Shadow */
  --nyx-primary: #9d30d4;
  --nyx-secondary: #5a1a7a;
  --nyx-accent: #d080ff;
  --nyx-glow: rgba(157, 48, 212, 0.6);
  --nyx-material: url('/assets/ui/materials/nyx_void.png');
}

/* Theme Classes */
.kargath-theme {
  --primary: var(--kargath-primary);
  --secondary: var(--kargath-secondary);
  --accent: var(--kargath-accent);
  --glow: var(--kargath-glow);
  --material: var(--kargath-material);
}

.thalor-theme {
  --primary: var(--thalor-primary);
  --secondary: var(--thalor-secondary);
  --accent: var(--thalor-accent);
  --glow: var(--thalor-glow);
  --material: var(--thalor-material);
}

/* etc for other factions */
```

---

## 🎬 Animation Integration

### Lottie Animation Hook

```tsx
// src/hooks/useLottie.ts
import lottie from 'lottie-react';

export const useLottieAnimation = (path: string) => {
  return {
    AnimationComponent: () => (
      <lottie.animation 
        path={path}
        loop={true}
        autoplay={true}
      />
    )
  };
};
```

### CSS Animation Classes

```css
/* src/styles/animations.css */
@keyframes slideIn {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px var(--glow); }
  50% { box-shadow: 0 0 40px var(--glow), 0 0 60px var(--glow); }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
```

---

## 📦 Asset Loading Strategy

### Lazy Loading Components

```tsx
// src/components/ui/LazyImage.tsx
import { useState, useEffect } from 'react';

export const LazyImage: React.FC<{ src: string; alt: string }> = ({ 
  src, alt 
}) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <img
      src={src}
      alt={alt}
      className={`lazy-image ${loaded ? 'loaded' : 'loading'}`}
      onLoad={() => setLoaded(true)}
      loading="lazy"
    />
  );
};
```

### Asset Preloading

```tsx
// src/hooks/usePreloadAssets.ts
export const usePreloadAssets = (faction: Faction) => {
  useEffect(() => {
    const assets = [
      `/assets/ui/shell/panel_${faction}.png`,
      `/assets/ui/hud/healthbar_${faction}.png`,
      `/assets/ui/icons/nav/home_${faction}.svg`,
    ];
    
    assets.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [faction]);
};
```

---

## 📋 Implementation Checklist

### Phase 1: Foundation
- [ ] Set up CSS variable system (factions.css)
- [ ] Create base `ShellFrame` component
- [ ] Implement `Icon` system with SVG
- [ ] Add faction theme classes

### Phase 2: Game UI
- [ ] `CardFrame` with all rarities
- [ ] `CombatHUD` with resource bars
- [ ] `StatusEffect` icons
- [ ] `ActionButton` components

### Phase 3: Navigation
- [ ] Menu screens with shell frames
- [ ] Navigation icons
- [ ] Button states (hover, active, disabled)
- [ ] Transition animations

### Phase 4: Feedback
- [ ] Toast notification system
- [ ] Tooltip components
- [ ] Loading screens
- [ ] Victory/Defeat screens

### Phase 5: Polish
- [ ] Ambient particle effects
- [ ] Lottie animations
- [ ] Sound effect integration
- [ ] Performance optimization

---

## 🔧 Performance Guidelines

### Image Optimization
- Use WebP with PNG fallback
- Implement responsive images with `srcset`
- Lazy load off-screen assets
- Use CSS sprites for icon sheets

### Animation Performance
- Use `transform` and `opacity` only
- Add `will-change` for animated elements
- Implement `prefers-reduced-motion` support
- Throttle particle effect frame rates

### Memory Management
- Unload off-screen screen assets
- Pool particle objects
- Use object URLs for temporary assets
- Monitor texture memory in WebGL contexts

---

*This guide provides the bridge between the UI generation pipeline and actual implementation in the Titanfall Chronicles codebase.*
