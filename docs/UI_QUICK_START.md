# UI Asset Quick-Start Guide

## For Titanfall Chronicles Implementation

---

## Phase 1: Immediate Needs (This Week)

### Critical Path Assets (Must Have)

**1. Container System**
```
Priority: CRITICAL
Assets needed:
□ modal_frame_base.png              (dialog backgrounds)
□ panel_card_base.png               (unit cards, info panels)
□ tooltip_base.png                  (hover information)

Factions to implement:
- Fire (Kargath)        → Volcanic stone, magma cracks
- Earth (Thalor)        → Mountain granite, fossil patterns
- Wind (Sylara)         → Cloud marble, sky motifs
- Shadow (Nyx)          → Obsidian, void swirls
- Arcane (Elandor)      → Crystal matrices, rune circuits
```

**2. Button Family**
```
Priority: CRITICAL
Assets needed:
□ btn_primary_[state].png           (End Turn, major actions)
□ btn_secondary_[state].png         (Next Phase, Confirm)
□ btn_tertiary_[state].png          (Back, Cancel)

States: normal, hover, active, disabled
Total: 3 types × 4 states = 12 assets per faction
```

**3. Progress Bars**
```
Priority: HIGH
Assets needed:
□ bar_health_frame.png              (titan HP)
□ bar_health_fill.png               (gradient segments)
□ bar_energy_frame.png              (player energy)
□ bar_energy_fill.png

Element variants:
- Fire: Ember gradient, volcanic rock frame
- Earth: Amber energy, stone frame
- Wind: Sky blue, cloud wisps
- Shadow: Purple void, obsidian
- Arcane: Violet mana, crystal
```

---

## Phase 2: Game Flow (Next Week)

### Screen-Specific Modules

**Main Menu**
```
Assets:
□ menu_bg_[faction].png              (hero background)
□ menu_button_large_[state].png     (Single Battle, Multiplayer)
□ menu_section_header.png            ("PLAY", "TOOLS" labels)
□ menu_crest_logo.png                (game logo treatment)
```

**Character Select (New Game)**
```
Assets:
□ charselect_frame.png               (container)
□ charselect_portrait_frame.png      (titan portrait border)
□ charselect_stat_panel.png          (stats display)
□ charselect_ability_card.png        (ability descriptions)
□ charselect_confirm_btn.png         (Start Battle)

Interactive states:
□ charselect_portrait_hover.png      (highlighted selection)
□ charselect_portrait_selected.png   (confirmed choice)
```

**Battle Screen (Game HUD)**
```
Assets:
□ hud_player_bar_[faction].png       (top/bottom player info)
□ hud_phase_indicator.png            (current phase display)
□ hud_phase_list_item.png            (phase list rows)
□ hud_hand_container.png             (card hand background)
□ hud_card_frame.png                 (individual card)
□ hud_card_selected.png              (selected highlight)
□ hud_card_unplayable.png            (disabled overlay)
□ hud_sidebar_frame.png              (log/phase panel)
□ hud_log_entry.png                  (combat log row)
□ hud_titan_button_[state].png       (ability activation)
□ hud_end_turn_btn_[state].png       (phase advance)
```

---

## Phase 3: Polish Layer (Week 3)

### Feedback & Animation

**Interaction Feedback**
```
Assets:
□ fx_button_click_ring.png           (click ripple)
□ fx_card_play_burst.png             (card deployment)
□ fx_damage_impact.png               (combat hit)
□ fx_heal_glow.png                   (restoration)
□ fx_phase_transition.png            (phase change)

Animation frames:
□ anim_phase_refresh_loop.png        (energy refill)
□ anim_turn_indicator_pulse.png      (active player)
```

**Icons System**
```
Core set (32x32, 48x48, 64x64):
□ icon_attack.png
□ icon_defend.png
□ icon_move.png
□ icon_deploy.png
□ icon_energy.png
□ icon_card.png
□ icon_settings.png
□ icon_back.png

Keyword icons:
□ icon_kw_taunt.png                  (shield symbol)
□ icon_kw_flying.png                 (wing symbol)
□ icon_kw_stealth.png                (eye-slash)
□ icon_kw_charge.png                 (lightning bolt)
□ icon_kw_rush.png                   (running figure)
```

---

## Phase 4: Mobile & Accessibility (Week 4)

### Responsive Variants

**Mobile Scaling**
```
Desktop → Tablet → Mobile
100%    → 75%    → 50%

Critical adaptations:
□ sidebar_collapsed_tab.png          (mobile toggle)
□ card_mobile_layout.png             (stacked vs fanned)
□ button_touch_size.png              (44px minimum)
```

**Accessibility**
```
High contrast variants:
□ [all_assets]_high_contrast.png

Large text mode:
□ [text_containers]_expanded.png

Colorblind patterns:
□ [color_coded]_pattern_overlay.png
```

---

## Faction Visual Translation

### From Game Elements to UI Language

| Titan | Element | UI Material | Border Style | Accent Color | Motif |
|-------|---------|-------------|--------------|--------------|-------|
| Kargath | Fire | Volcanic rock, magma | Cracked stone, ember veins | #e74c3c | Flames, lava flows |
| Thalor | Earth | Mountain granite, fossils | Rune-carved, sturdy | #8b6914 | Mountains, roots |
| Sylara | Wind | Cloud marble, crystal | Flowing, airy | #30b8c8 | Clouds, feathers |
| Nyx | Shadow | Obsidian, void glass | Sharp, angular | #7030a0 | Vines, darkness |
| Elandor | Arcane | Crystal matrix, runes | Geometric, circuit | #a855f5 | Runes, constellations |

---

## File Naming Convention

```
[type]_[element]_[state]_[faction]_[size]@[density].png

Examples:
□ btn_primary_normal_fire_280x80@2x.png
□ bar_health_fill_earth_240x24@1x.png
□ hud_card_selected_shadow_110x155@2x.png
□ icon_kw_taunt_all_48x48@1x.png

States:
normal, hover, active, disabled, loading

Sizes:
@1x = 100%, @2x = 200%, @3x = 300%
```

---

## Immediate Action Items

### Today:
1. [ ] Define final faction visual languages (5 variants)
2. [ ] Create base container frame (modal, panel, tooltip)
3. [ ] Generate primary button family (4 states)

### This Week:
4. [ ] Complete battle HUD elements
5. [ ] Implement phase indicator system
6. [ ] Create card hand UI
7. [ ] Build character select screen

### Next Week:
8. [ ] Main menu redesign
9. [ ] Animation assets
10. [ ] Icon system completion
11. [ ] Mobile responsive pass

---

## Asset Generation Priority Matrix

| Asset | Impact | Effort | Priority | Phase |
|-------|--------|--------|----------|-------|
| Container frames | HIGH | MEDIUM | P0 | 1 |
| Primary buttons | HIGH | LOW | P0 | 1 |
| Health/Energy bars | HIGH | LOW | P0 | 1 |
| Battle HUD | HIGH | HIGH | P0 | 2 |
| Card frames | HIGH | MEDIUM | P0 | 2 |
| Phase indicators | MEDIUM | LOW | P1 | 2 |
| Menu screens | MEDIUM | MEDIUM | P1 | 2 |
| Animation FX | MEDIUM | HIGH | P1 | 3 |
| Icons | MEDIUM | MEDIUM | P2 | 3 |
| Mobile variants | LOW | HIGH | P2 | 4 |

---

## Nano Prompts Ready to Use

### Prompt 1: Base Container
```
Create modal container frame for [FACTION]:
- Size: 640x480px with 9-slice support
- Material: [from faction table]
- Border: 48px decorative edge
- Background: Subtle texture, tileable
- States: Normal, Active (glowing)
- Corners: [faction motif] accents
- Output: PNG, corners + edges + center separate
```

### Prompt 2: Primary Button
```
Create primary action button for [FACTION]:
- Size: 280x80px
- Material: [from faction table]
- Depth: 3px raised, casts shadow
- States: Normal, Hover (ember glow), Active (pressed), Disabled (rusted/locked)
- Accent: [faction color] inner glow when active
- Icon area: 64x64px left side
- Output: 4 state files + glow overlay
```

### Prompt 3: Health Bar
```
Create health bar for [FACTION]:
- Frame: 240x32px with decorative edges
- Fill area: 200x16px
- Material: [from faction] frame, gradient fill
- Segments: 10 discrete chunks visible
- States: Normal, Low (<30%), Critical (<10%), Healing (glow)
- Effect: Damage shows chip/crack overlay
- Output: Frame variants + fill gradients + damage overlays
```

### Prompt 4: Card Frame
```
Create unit card frame for [FACTION]:
- Size: 110x155px (standard playing card ratio)
- Material: [from faction] backing
- Border: 4px decorative edge
- Areas: Cost circle (top-left), Name banner (top), Art frame (center), Stats bar (bottom)
- States: Normal, Selected (gold glow), Unplayable (darkened, lock icon)
- Output: Base frame + state overlays + empty template
```

---

## Quality Check Before Integration

For each asset batch:
```
□ All 5 factions visually consistent with their element
□ States clearly distinguishable (especially disabled)
□ Readable at 50% scale
□ Light direction consistent (upper-left standard)
□ Color contrast meets accessibility (WCAG AA)
□ Mobile scale (50%) still functional
□ No visual noise competing with content
□ Faction motifs recognizable without text
```

---

## Integration Test Checklist

When adding to game:
```
□ Asset loads without 404
□ Clickable area matches visual button
□ Hover state triggers correctly
□ Disabled state prevents interaction
□ Animation loops smoothly (if applicable)
□ No visual bleeding at edges
□ Scales correctly on different screen sizes
□ Maintains clarity at all resolutions
```

---

**Total Estimated Assets: 150-200 for complete UI set**
**Priority 0 (Critical): 45 assets**
**Timeline: 4 weeks for full implementation**
