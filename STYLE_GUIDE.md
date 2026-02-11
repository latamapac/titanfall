# Titanfall Chronicles - FLUX Art Style Guide

## 🎯 Art Direction

**Core Style:** Cinematic fantasy realism with dramatic lighting
**Reference:** Mortal Kombat 11 character art + Magic: The Gathering illustrations
**Mood:** Epic, intense, battle-ready

---

## 📝 Universal Prompt Template

```
[SUBJECT], [POSE/ACTION], [CLOTHING/ARMOR], [WEAPON/ITEM], 
[ENVIRONMENT], [LIGHTING], [STYLE MODIFIERS], 
[COMPOSITION], [QUALITY TAGS]
```

---

## 🎨 Style Consistency Rules

### 1. Universal Style Modifiers (ALWAYS INCLUDE)
```
masterpiece, best quality, cinematic lighting, dramatic composition, 
rich colors, highly detailed, fantasy art, professional illustration,
sharp focus, 8k uhd, artstation trending
```

### 2. Forbidden Elements (NEVER INCLUDE)
- Anime/cartoon style
- Oversaturated neon colors
- Photorealistic skin textures (keep painterly)
- Modern/futuristic elements
- Abstract backgrounds

### 3. Color Palette Per Element
| Element | Primary | Secondary | Accent | Lighting |
|---------|---------|-----------|--------|----------|
| **Fire** | `#e84430` | `#ff6b35` | `#ffd700` | Warm rim light |
| **Water** | `#2e5cff` | `#4a9eff` | `#00d4ff` | Cool underlight |
| **Earth** | `#4ade80` | `#8b6914` | `#d4a843` | Natural dappled |
| **Wind** | `#30b8c8` | `#87ceeb` | `#ffd700` | Ethereal glow |
| **Shadow** | `#7030a0` | `#a855f7` | `#ff00ff` | Dramatic chiaroscuro |
| **Arcane** | `#4a9eff` | `#a855f7` | `#ffd700` | Magical bloom |

---

## 👤 TITAN PORTRAIT PROMPTS

### Template Structure
```
[ROLE] [NAME], [RACE], [DESCRIPTION], 
wearing [ARMOR DESCRIPTION], wielding [WEAPON], 
[POSE], [FACIAL EXPRESSION],
[ENVIRONMENT DESCRIPTION],
[ELEMENT-SPECIFIC LIGHTING],
masterpiece, best quality, cinematic lighting, dramatic composition, 
rich colors, highly detailed, fantasy art, professional illustration,
upper body portrait, sharp focus, 8k uhd, artstation trending
```

### Example: Arcanum (Arcane Mage)
```
Elder archmage Arcanum, human male with long white hair and flowing beard,
wearing ornate blue velvet robes with gold trim and arcane symbols,
wielding a crystal staff glowing with blue magical energy,
standing in a powerful pose, wise and commanding expression,
ancient arcane tower interior background with floating magical tomes,
blue and gold magical lighting with particle effects,
masterpiece, best quality, cinematic lighting, dramatic composition, 
rich colors, highly detailed, fantasy art, professional illustration,
upper body portrait, sharp focus, 8k uhd, artstation trending
```

### Example: Maulk (Fire Demon)
```
Demon warlord Maulk, red-skinned muscular orc with black hair and tusks,
wearing spiked black iron armor with skull decorations,
wielding a massive blood-stained greatsword dripping with lava,
battle-ready stance, fierce aggressive expression showing fangs,
volcanic wasteland background with flowing lava and smoke,
orange and red fire rim lighting, embers floating in air,
masterpiece, best quality, cinematic lighting, dramatic composition, 
rich colors, highly detailed, fantasy art, professional illustration,
upper body portrait, sharp focus, 8k uhd, artstation trending
```

---

## 🗺️ TERRAIN TILE PROMPTS

### Template Structure
```
[BIOME] terrain, [DESCRIPTION], [FEATURES], 
[ATMOSPHERE], [LIGHTING CONDITIONS],
seamless texture, top-down view, slightly stylized,
hand-painted texture style, game asset, 
saturated colors, clear readable details,
masterpiece, best quality, highly detailed
```

### Example: Volcano Tile
```
Volcanic terrain, black obsidian rock ground with flowing lava rivers,
cracks emitting orange glow, scattered volcanic rocks and ash,
smoke and heat distortion in air, dramatic fiery lighting,
seamless texture, top-down 3/4 view, slightly stylized,
hand-painted texture style, game asset,
saturated warm colors, clear readable details,
masterpiece, best quality, highly detailed
```

### Example: Forest Tile
```
Enchanted forest terrain, mossy ground with ferns and mushrooms,
tall pine trees, scattered fallen logs, magical fireflies,
soft dappled sunlight filtering through canopy, mystical atmosphere,
seamless texture, top-down 3/4 view, slightly stylized,
hand-painted texture style, game asset,
rich green and gold colors, clear readable details,
masterpiece, best quality, highly detailed
```

---

## 🎴 UNIT CARD PROMPTS

### Template Structure
```
[FANTASY RACE] [CLASS], [DESCRIPTION], 
[ELEMENT] themed, [ACTION POSE], 
wearing [ARMOR/OUTFIT], wielding [WEAPON],
[DYNAMIC ACTION], [FACIAL EXPRESSION],
[ENVIRONMENT HINT], [ELEMENTAL EFFECTS],
card illustration, character focused, dynamic composition,
masterpiece, best quality, cinematic lighting, dramatic angle,
rich colors, highly detailed, fantasy art, professional illustration,
sharp focus, artstation trending
```

### Example: Fire Orc Berserker
```
Orc berserker, muscular red-skinned warrior with tribal scars,
fire themed, charging into battle pose, furious battle cry expression,
wearing fur and leather armor with bone decorations,
wielding a massive flaming battle axe with glowing runes,
volcanic battlefield background with smoke and fire,
sparks and embers flying, fire trail behind weapon,
card illustration, character focused, dynamic diagonal composition,
masterpiece, best quality, cinematic lighting, dramatic low angle,
rich warm colors, highly detailed, fantasy art, professional illustration,
sharp focus, artstation trending
```

### Example: Shadow Assassin
```
Shadow assassin, lithe human female with purple eyes and dark hair,
shadow themed, mid-leap assassination pose, cold determined expression,
wearing dark leather armor with hood and face partially covered,
wielding twin daggers dripping with purple shadow energy,
dark void realm background with floating skulls and shadow wisps,
purple shadow aura surrounding body, smoke effects,
card illustration, character focused, dynamic action composition,
masterpiece, best quality, cinematic lighting, dramatic rim light,
rich dark purple colors, highly detailed, fantasy art, professional illustration,
sharp focus, artstation trending
```

---

## 🖼️ BACKGROUND PROMPTS

### Template Structure
```
[FANTASY SETTING], [TIME OF DAY], [ATMOSPHERE],
[KEY ELEMENTS], [DEPTH LAYERS],
[LIGHTING], [COLOR GRADING],
epic scale, atmospheric perspective, blurred background,
masterpiece, best quality, cinematic composition,
rich colors, highly detailed, fantasy art,
8k uhd, matte painting style
```

### Example: Battlefield Background
```
Epic fantasy battlefield, sunset golden hour, misty atmospheric,
distant armies clashing, dragons flying in sky, war banners,
foreground: grass and rocks, midground: battlefield, background: mountains and sky,
warm golden lighting with long shadows, dramatic clouds,
navy blue and gold color grading with orange highlights,
epic scale, atmospheric perspective, slightly blurred for UI overlay,
masterpiece, best quality, cinematic composition,
rich colors, highly detailed, fantasy art,
8k uhd, matte painting style
```

---

## 🚀 Batch Generation Workflow

### Step 1: Prepare Prompt List
Create `prompts/titans.txt`, `prompts/terrain.txt`, `prompts/cards.txt`

### Step 2: Generate Script
```bash
#!/bin/bash
# generate.sh
while IFS= read -r prompt; do
  curl -X POST http://localhost:8080/chat \
    -H "Content-Type: application/json" \
    -d "{\"prompt\": \"Generate image: $prompt\"}"
  sleep 2
done < prompts/titans.txt
```

### Step 3: Post-Processing
- Resize to target dimensions
- Run through quality check
- Apply color correction per element
- Export to game assets folder

---

## 📊 Quality Checklist

Before accepting generated asset:
- [ ] Style matches reference images
- [ ] Colors match element palette
- [ ] Lighting is dramatic and cinematic
- [ ] No modern/anime/photorealistic artifacts
- [ ] Background supports subject
- [ ] 1024x1024 resolution (portraits)
- [ ] PNG format with transparency where needed

---

## 🔧 Technical Specs

### Output Settings
- **Resolution:** 1024x1024 (portraits), 512x512 (terrain), 512x768 (cards)
- **Format:** PNG
- **Color Space:** sRGB
- **Naming:** `kebab-case.png`

### FLUX Settings (ComfyUI)
- **Model:** FLUX.1 [dev/pro]
- **Steps:** 28-35
- **CFG Scale:** 3.5-4.5
- **Sampler:** Euler a / DPM++ 2M Karras
