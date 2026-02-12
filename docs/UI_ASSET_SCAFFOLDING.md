# UI Asset Scaffolding - Mythic Grammar System

## Master Prompt Analysis

### Core Philosophy (The "Why")
```
UI ≠ Interface Layer
UI = World Extension (Cognitive Bridge)
```
**Depth:** UI must emerge FROM world logic, not be applied TO it. Every pixel obeys physics, culture, and mythology.

### Structural Hierarchy (The "What")
```
Primary   = Actionable (Player Intent)
Secondary = Contextual (Decision Support)  
Tertiary  = Atmospheric (World Immersion)
```

### Style-Code System (The "How")
**Faction as Visual Language:**
- Iron Church → Etched iron, crests, weight
- Verdant → Living vines, growth patterns, organic flow
- Stormbound → Geometric arcs, energy nodes, crackling tension

---

## COMPREHENSIVE UI ASSET INVENTORY

### A. CONTAINER ELEMENTS (Frames & Windows)

#### A1. Primary Containers (Modal dialogs, main panels)
**Required Assets:**
```
□ modal_frame_base_[faction].png        (1920x1080 capable)
□ modal_corner_tl_[faction].png         (64x64, 128x128 variants)
□ modal_corner_tr_[faction].png
□ modal_corner_bl_[faction].png
□ modal_corner_br_[faction].png
□ modal_edge_top_[faction].png          (seamless, 64px height)
□ modal_edge_bottom_[faction].png
□ modal_edge_left_[faction].png         (64px width)
□ modal_edge_right_[faction].png
□ modal_header_bar_[faction].png        (128px height)
□ modal_footer_bar_[faction].png

□ modal_bg_pattern_[faction].png        (subtle texture, tileable)
□ modal_bg_gradient_[faction].png       (fallback for solid)

□ modal_close_button_[faction].png      (normal, hover, active, disabled)
□ modal_close_button_hover_[faction].png
□ modal_close_button_active_[faction].png
```

**Faction Variations:**
- **Iron Church:** Heavy iron borders, rivet details, heraldic crest corners
- **Verdant:** Bark frames, vine-wrapped edges, living leaf corners
- **Stormbound:** Crystalline segments, energy-pulsing edges, arc nodes

---

#### A2. Secondary Panels (Cards, tooltips, notifications)
**Required Assets:**
```
□ panel_card_base_[faction].png         (512x256, 640x320 variants)
□ panel_card_header_[faction].png
□ panel_card_divider_[faction].png      (horizontal rule)
□ panel_card_accent_[faction].png       (faction color stripe)

□ tooltip_base_[faction].png            (dynamic sizing support)
□ tooltip_arrow_top_[faction].png
□ tooltip_arrow_bottom_[faction].png
□ tooltip_arrow_left_[faction].png
□ tooltip_arrow_right_[faction].png

□ notification_banner_[faction].png     (full-width, 120px height)
□ notification_icon_frame_[faction].png (64x64 circular)
□ notification_dismiss_[faction].png

□ toast_slide_[faction].png             (enter/exit animation frames)
□ toast_bg_[faction].png
```

---

### B. NAVIGATION ELEMENTS

#### B1. Primary Navigation (Main menu, major sections)
**Required Assets:**
```
□ nav_button_large_normal_[faction].png     (320x80)
□ nav_button_large_hover_[faction].png
□ nav_button_large_active_[faction].png
□ nav_button_large_disabled_[faction].png

□ nav_button_large_icon_slot_[faction].png  (64x64 icon area)
□ nav_button_large_text_bg_[faction].png    (typography backing)

□ nav_tab_normal_[faction].png              (240x60)
□ nav_tab_active_[faction].png              (with underline/indicator)
□ nav_tab_inactive_[faction].png
□ nav_tab_hover_[faction].png

□ nav_tab_indicator_[faction].png           (animated underline asset)

□ breadcrumb_separator_[faction].png
□ breadcrumb_node_normal_[faction].png
□ breadcrumb_node_active_[faction].png
```

---

#### B2. Secondary Navigation (Submenus, filters)
**Required Assets:**
```
□ nav_pill_normal_[faction].png             (160x40, rounded)
□ nav_pill_active_[faction].png
□ nav_pill_hover_[faction].png

□ dropdown_frame_[faction].png
□ dropdown_item_normal_[faction].png        (row background)
□ dropdown_item_hover_[faction].png
□ dropdown_item_selected_[faction].png
□ dropdown_arrow_[faction].png

□ accordion_header_[faction].png
□ accordion_content_[faction].png
□ accordion_expand_icon_[faction].png       (plus/arrow variants)
□ accordion_collapse_icon_[faction].png
```

---

### C. INPUT ELEMENTS

#### C1. Buttons (The "Clickable Grammar")
**Required Assets - Primary (Major Actions):**
```
□ btn_primary_normal_[faction].png          (200x64, 280x80 variants)
□ btn_primary_hover_[faction].png           (glow/state change)
□ btn_primary_active_[faction].png          (pressed depth)
□ btn_primary_disabled_[faction].png        (ghosted, locked)
□ btn_primary_loading_[faction].png         (spinner integration)

□ btn_primary_icon_left_[faction].png       (icon + text layout)
□ btn_primary_icon_right_[faction].png
□ btn_primary_icon_only_[faction].png       (64x64, 80x80)

□ btn_primary_glow_effect_[faction].png     (ambient glow layer)
□ btn_primary_ripple_mask_[faction].png     (for click feedback)
```

**Required Assets - Secondary (Supporting Actions):**
```
□ btn_secondary_normal_[faction].png        (160x48)
□ btn_secondary_hover_[faction].png
□ btn_secondary_active_[faction].png
□ btn_secondary_disabled_[faction].png

□ btn_tertiary_normal_[faction].png         (text-only, 120x40)
□ btn_tertiary_hover_[faction].png
□ btn_tertiary_underline_[faction].png      (animated accent)
```

**Button Material Variants (per faction):**
```
□ btn_material_iron_[state].png             (Iron Church: heavy, forged)
□ btn_material_wood_[state].png             (Verdant: living bark)
□ btn_material_crystal_[state].png          (Stormbound: pulsing energy)
□ btn_material_rune_[state].png             (Universal: carved glyphs)
```

---

#### C2. Form Inputs
**Required Assets:**
```
□ input_text_normal_[faction].png           (400x56)
□ input_text_focus_[faction].png            (glow border)
□ input_text_error_[faction].png            (red/crackle effect)
□ input_text_disabled_[faction].png

□ input_text_caret_[faction].png            (blinking cursor asset)
□ input_text_selection_[faction].png        (highlight texture)

□ input_number_frame_[faction].png
□ input_number_step_up_[faction].png
□ input_number_step_down_[faction].png

□ checkbox_normal_[faction].png             (32x32)
□ checkbox_hover_[faction].png
□ checkbox_checked_[faction].png
□ checkbox_indeterminate_[faction].png

□ radio_normal_[faction].png                (32x32 circular)
□ radio_selected_[faction].png

□ slider_track_[faction].png                (horizontal bar)
□ slider_fill_[faction].png                 (progress portion)
□ slider_handle_normal_[faction].png        (draggable)
□ slider_handle_hover_[faction].png
□ slider_handle_active_[faction].png

□ toggle_bg_off_[faction].png               (switch background)
□ toggle_bg_on_[faction].png
□ toggle_handle_[faction].png               (sliding element)
```

---

### D. DATA DISPLAY ELEMENTS

#### D1. Progress & Status Bars
**Required Assets:**
```
□ bar_health_frame_[faction].png            (standard health)
□ bar_health_fill_[faction].png             (gradient segments)
□ bar_health_low_[faction].png              (critical color variant)

□ bar_mana_frame_[faction].png              (energy/mana)
□ bar_mana_fill_[faction].png
□ bar_mana_chunk_[faction].png              (discrete segments)

□ bar_xp_frame_[faction].png                (experience)
□ bar_xp_fill_[faction].png

□ bar_progress_frame_[faction].png          (loading/crafting)
□ bar_progress_fill_[faction].png
□ bar_progress_glow_[faction].png           (completion effect)

□ bar_shield_frame_[faction].png            (armor/shield)
□ bar_shield_fill_[faction].png
□ bar_shield_break_[faction].png            (depleted state)

□ bar_segment_separator_[faction].png       (for chunk bars)
```

---

#### D2. Icons & Symbols (The "Visual Vocabulary")

**Core System Icons (32x32, 48x48, 64x64):**
```
□ icon_action_attack_[faction].png
□ icon_action_defend_[faction].png
□ icon_action_move_[faction].png
□ icon_action_use_[faction].png
□ icon_action_speak_[faction].png

□ icon_nav_back_[faction].png
□ icon_nav_forward_[faction].png
□ icon_nav_close_[faction].png
□ icon_nav_menu_[faction].png
□ icon_nav_settings_[faction].png

□ icon_state_buff_[faction].png
□ icon_state_debuff_[faction].png
□ icon_state_neutral_[faction].png
□ icon_state_warning_[faction].png
□ icon_state_critical_[faction].png

□ icon_resource_gold_[faction].png
□ icon_resource_mana_[faction].png
□ icon_resource_wood_[faction].png
□ icon_resource_iron_[faction].png
```

**Faction-Specific Icon Families:**
```
Iron Church Icons (angular, forged):
□ icon_iron_sword.png
□ icon_iron_shield.png
□ icon_iron_hammer.png
□ icon_iron_crest.png
□ icon_iron_chain.png

Verdant Icons (organic, flowing):
□ icon_verdant_leaf.png
□ icon_verdant_vine.png
□ icon_verdant_seed.png
□ icon_verdant_root.png
□ icon_verdant_bloom.png

Stormbound Icons (geometric, energetic):
□ icon_storm_bolt.png
□ icon_storm_arc.png
□ icon_storm_node.png
□ icon_storm_sphere.png
□ icon_storm_web.png
```

---

### E. TYPOGRAPHY SYSTEM

#### E1. Font Assets
**Required:**
```
□ font_display_[faction].woff2              (headers, titles)
□ font_body_[faction].woff2                 (paragraphs)
□ font_mono_[faction].woff2                 (numbers, data)
□ font_rune_[faction].woff2                 (special/magical text)

□ font_display_italic_[faction].woff2
□ font_display_bold_[faction].woff2
□ font_display_black_[faction].woff2
```

**Font Specifications (per faction):**
- **Iron Church:** Heavy serif, chiseled edges, small caps support
- **Verdant:** Organic serif, slight irregularities, vine-like terminals
- **Stormbound:** Geometric sans, segmented strokes, arc terminals

---

#### E2. Text Effects
```
□ text_glow_[faction].png                   (glow sprite sheet)
□ text_shadow_[faction].png                 (drop shadow overlay)
□ text_crack_[faction].png                  (damaged text overlay)
□ text_shimmer_[faction].png                (animated shine)
□ text_blood_[faction].png                  (drip effect for damage)
□ text_vine_[faction].png                   (growth wrap effect)
```

---

### F. BACKGROUND & ATMOSPHERE

#### F1. Texture Library
```
□ bg_texture_paper_[faction].png            (subtle grain)
□ bg_texture_metal_[faction].png            (brushed iron)
□ bg_texture_wood_[faction].png             (bark grain)
□ bg_texture_crystal_[faction].png          (faceted surface)
□ bg_texture_fabric_[faction].png           (cloth weave)
□ bg_texture_stone_[faction].png            (carved stone)

□ bg_pattern_subtle_[faction].png           (tileable patterns)
□ bg_vignette_[faction].png                 (edge darkening)
□ bg_noise_[faction].png                    (film grain overlay)
```

#### F2. Lighting & Atmosphere
```
□ light_directional_[faction].png           (consistent world light)
□ light_rim_[faction].png                   (edge highlighting)
□ light_glow_ambient_[faction].png          (soft ambient)

□ atmosphere_fog_[faction].png              (depth layer)
□ atmosphere_particles_[faction].png        (dust, sparks, pollen)
□ atmosphere_volumetric_[faction].png       (god rays, mist)
```

---

### G. ANIMATION ASSETS

#### G1. UI Motion Elements
```
□ anim_button_hover_[faction].png           (sprite sheet)
□ anim_button_click_[faction].png           (ripple, impact)
□ anim_button_loading_[faction].png         (spinner, glow pulse)

□ anim_panel_open_[faction].png             (unfold, grow)
□ anim_panel_close_[faction].png            (fold, shrink)

□ anim_notification_enter_[faction].png     (slide, bounce)
□ anim_notification_exit_[faction].png

□ anim_tooltip_appear_[faction].png         (fade, pop)
□ anim_tooltip_trail_[faction].png          (motion blur)

□ anim_cursor_trail_[faction].png           (pointer effects)
□ anim_cursor_click_[faction].png           (impact ring)
```

#### G2. Particle Systems
```
□ particle_spark_[faction].png              (iron strike)
□ particle_leaf_[faction].png               (verdant drift)
□ particle_energy_[faction].png             (storm arc)
□ particle_dust_[faction].png               (ambient)
□ particle_motes_[faction].png              (magic light)

□ particle_burst_success_[faction].png      (completion)
□ particle_burst_failure_[faction].png      (error)
```

---

### H. CURSOR & POINTER SYSTEM

```
□ cursor_default_[faction].png              (32x32)
□ cursor_hover_[faction].png                (interactive element)
□ cursor_click_[faction].png                (pressed state)
□ cursor_text_[faction].png                 (I-beam)
□ cursor_drag_[faction].png                 (grabbing)
□ cursor_resize_[faction].png               (directional arrows)

□ cursor_attack_[faction].png               (combat mode)
□ cursor_defend_[faction].png
□ cursor_interact_[faction].png             (usable object)
□ cursor_speak_[faction].png                (dialogue)
□ cursor_travel_[faction].png               (exit/entrance)

□ cursor_trail_[faction].png                (motion effect)
```

---

### I. SCREEN-SPECIFIC MODULES

#### I1. Character Select Screen
```
□ charselect_frame_[faction].png
□ charselect_portrait_frame_[faction].png
□ charselect_stat_bar_[faction].png
□ charselect_ability_slot_[faction].png
□ charselect_confirm_button_[faction].png
□ charselect_back_button_[faction].png

□ charselect_bg_[faction].png               (ambient backdrop)
□ charselect_vignette_[faction].png
```

#### I2. Battle/HUD Screen
```
□ hud_frame_health_[faction].png            (player health)
□ hud_frame_energy_[faction].png
□ hud_ability_bar_[faction].png             (hotbar)
□ hud_ability_slot_[faction].png            (individual slot)
□ hud_minimap_frame_[faction].png
□ hud_compass_[faction].png

□ hud_damage_indicator_[faction].png        (incoming direction)
□ hud_status_icon_[faction].png             (buff/debuff)
□ hud_combo_meter_[faction].png
```

#### I3. Inventory/Menu Screen
```
□ inv_slot_normal_[faction].png             (grid slot)
□ inv_slot_hover_[faction].png
□ inv_slot_selected_[faction].png
□ inv_slot_rare_[faction].png               (quality border)
□ inv_slot_epic_[faction].png
□ inv_slot_legendary_[faction].png

□ inv_category_tab_[faction].png
□ inv_sort_button_[faction].png
□ inv_details_panel_[faction].png
```

---

## PRODUCTION PIPELINE

### Phase 1: Foundation (Week 1)
1. Base container frames (modal, panel)
2. Primary button set (normal, hover, active, disabled)
3. Core icons (actions, navigation, states)
4. Progress bars (health, mana, xp)

### Phase 2: Expansion (Week 2)
1. Form elements (inputs, checkboxes, sliders)
2. Secondary navigation (tabs, pills, breadcrumbs)
3. Notification system (toasts, banners)
4. Cursor set

### Phase 3: Polish (Week 3)
1. Animation sprite sheets
2. Particle effects
3. Typography refinements
4. Screen-specific modules

### Phase 4: Integration (Week 4)
1. Faction variant completion
2. Responsive scaling tests
3. Motion consistency pass
4. Accessibility review

---

## NAMING CONVENTION

```
[type]_[element]_[variant]_[faction].[ext]

Examples:
□ btn_primary_normal_iron.png
□ modal_frame_base_verdant.png
□ bar_health_fill_storm.png
□ icon_action_attack_iron.png
```

---

## QUALITY CHECKLIST

For each asset:
- [ ] Consistent with faction visual language
- [ ] Readable at target size
- [ ] Properly compressed (PNG-24, optimized)
- [ ] Seamless if tileable
- [ ] Animated variants prepared (if needed)
- [ ] Accessibility contrast verified
- [ ] Mobile scaling tested
