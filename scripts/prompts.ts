/**
 * FLUX Prompt Library - Unified Style Guide
 * 
 * Based on STYLE_GUIDE.md - All prompts follow cinematic fantasy style
 */

// ============================================================================
// UNIVERSAL STYLE MODIFIERS
// ============================================================================

const UNIVERSAL_STYLE = 
  'masterpiece, best quality, cinematic lighting, dramatic composition, ' +
  'rich colors, highly detailed, fantasy art, professional illustration, ' +
  'sharp focus, 8k uhd, artstation trending';

const NEGATIVE_STYLE = 
  'anime, cartoon, 3d render, blurry, low quality, distorted, deformed, ' +
  'oversaturated, modern, futuristic, abstract background';

// ============================================================================
// TITAN PORTRAIT PROMPTS
// ============================================================================

export interface TitanPrompt {
  id: string;
  name: string;
  element: 'fire' | 'water' | 'earth' | 'wind' | 'shadow' | 'arcane';
  prompt: string;
  colorPalette: string;
}

export const TITAN_PROMPTS: TitanPrompt[] = [
  {
    id: 'arcanum',
    name: 'Archmage Arcanum',
    element: 'arcane',
    colorPalette: 'blue, purple, gold',
    prompt: 
      'Elder archmage Arcanum, human male with long flowing white hair and majestic beard, ' +
      'wearing ornate deep blue velvet robes with intricate gold embroidery and arcane runes, ' +
      'wielding a crystal staff glowing with intense blue magical energy and floating sparks, ' +
      'standing in commanding pose with raised staff, wise powerful expression, piercing blue eyes, ' +
      'ancient arcane tower interior background with floating magical tomes and glowing symbols, ' +
      'blue and gold magical lighting with particle effects and lens flare, ' +
      'cinematic rim lighting, dramatic shadows, rich color grading, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'maulk',
    name: 'Bloodlord Maulk',
    element: 'fire',
    colorPalette: 'red, orange, black',
    prompt: 
      'Demon warlord Maulk, muscular red-skinned orc with wild black hair and large tusks, ' +
      'wearing heavy spiked black iron armor decorated with skulls and bone trophies, ' +
      'wielding a massive blood-stained greatsword dripping with molten lava, ' +
      'aggressive battle-ready stance, fierce snarling expression showing sharp fangs, glowing yellow eyes, ' +
      'volcanic wasteland background with flowing lava rivers and smoke plumes, ' +
      'orange and red fire rim lighting, embers floating in air, dramatic heat distortion, ' +
      'intense warm color grading, menacing atmosphere, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'nyx',
    name: 'Shadow Queen Nyx',
    element: 'shadow',
    colorPalette: 'purple, black, magenta',
    prompt: 
      'Shadow assassin queen Nyx, lithe human female with long flowing dark purple hair and glowing violet eyes, ' +
      'wearing sleek black leather armor with high collar and face partially covered by shadow veil, ' +
      'dual wielding enchanted daggers dripping with purple shadow essence, ' +
      'dynamic mid-leap combat pose, cold calculating expression, ' +
      'dark void realm background with floating ethereal skulls and shadow wisps, ' +
      'purple and magenta magical rim lighting, smoke effects, dramatic chiaroscuro, ' +
      'mysterious dark atmosphere, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'sylvana',
    name: 'Sylvana the Ancient',
    element: 'earth',
    colorPalette: 'green, gold, brown',
    prompt: 
      'Forest elf druid Sylvana, graceful female with long flowing emerald green hair and pointed ears, ' +
      'wearing elegant green leaf-adorned dress with golden vine accessories, ' +
      'wielding a living wooden staff crowned with glowing orange crystal and blooming flowers, ' +
      'serene standing pose with staff raised, gentle mystical expression, vibrant green eyes, ' +
      'enchanted ancient forest background with towering trees and floating golden spores, ' +
      'soft dappled sunlight filtering through leaves, magical golden glow, ' +
      'natural earthy color palette, ethereal atmosphere, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'solara',
    name: 'Solara Dragonguard',
    element: 'wind',
    colorPalette: 'gold, silver, red',
    prompt: 
      'Dragon knight Solara, noble warrior with long flowing silver-blonde hair and regal features, ' +
      'wearing ornate silver plate armor with gold filigree and red cape flowing in wind, ' +
      'wielding an elegant winged spear and shield with dragon emblem, ' +
      'heroic standing pose looking to horizon, determined noble expression, piercing gaze, ' +
      'dragon wings partially visible behind shoulders, ' +
      'floating sky castle background above clouds at golden hour sunset, ' +
      'warm golden rim lighting, dramatic clouds, majestic atmosphere, ' +
      UNIVERSAL_STYLE,
  },
];

// ============================================================================
// TERRAIN TILE PROMPTS
// ============================================================================

export interface TerrainPrompt {
  id: string;
  name: string;
  prompt: string;
}

export const TERRAIN_PROMPTS: TerrainPrompt[] = [
  {
    id: 'plain',
    name: 'Grassland Plains',
    prompt: 
      'Grassy meadow terrain, rolling green hills with wildflowers and tall grass, ' +
      'winding dirt path, scattered rocks and small bushes, ' +
      'bright sunny day with fluffy white clouds, warm natural lighting, ' +
      'seamless texture, top-down 3/4 view, slightly stylized hand-painted game asset, ' +
      'rich green and gold colors, clear readable details, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'forest',
    name: 'Enchanted Forest',
    prompt: 
      'Dense enchanted forest terrain, mossy ground covered with ferns mushrooms and fallen leaves, ' +
      'tall ancient pine and oak trees, scattered fallen logs, ' +
      'magical fireflies and golden spores floating in air, mystical atmosphere, ' +
      'soft dappled sunlight filtering through dense canopy, ' +
      'seamless texture, top-down 3/4 view, slightly stylized hand-painted game asset, ' +
      'rich green and brown colors with golden accents, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'mountain',
    name: 'Rocky Mountain',
    prompt: 
      'Rocky mountain terrain, grey stone peaks with patches of snow and ice, ' +
      'scattered boulders and rocky outcrops, sparse hardy vegetation, ' +
      'clear crisp alpine air, bright daylight with sharp shadows, ' +
      'seamless texture, top-down 3/4 view, slightly stylized hand-painted game asset, ' +
      'cool grey and white colors with blue shadows, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'water',
    name: 'Crystal Waters',
    prompt: 
      'Crystal clear ocean water terrain, gentle waves with foam patterns, ' +
      'shallow turquoise water revealing sandy bottom, scattered seashells and small rocks, ' +
      'sunlight reflecting on water surface, peaceful serene atmosphere, ' +
      'seamless texture, top-down 3/4 view, slightly stylized hand-painted game asset, ' +
      'rich blue and turquoise colors with white foam accents, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'volcano',
    name: 'Volcanic Wasteland',
    prompt: 
      'Volcanic wasteland terrain, black obsidian rock ground with flowing lava rivers, ' +
      'cracks in ground emitting orange glow, scattered volcanic rocks and ash, ' +
      'smoke and heat distortion in air, dangerous fiery atmosphere, ' +
      'dramatic lighting from below by lava glow, ' +
      'seamless texture, top-down 3/4 view, slightly stylized hand-painted game asset, ' +
      'dark blacks and greys with bright orange and red lava, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'swamp',
    name: 'Murky Swamp',
    prompt: 
      'Murky swamp terrain, stagnant dark water with algae and lily pads, ' +
      'twisted dead trees with hanging moss, scattered rocks and rotting logs, ' +
      'thick mist and fog hovering over water, eerie mysterious atmosphere, ' +
      'dim filtered light through fog, ' +
      'seamless texture, top-down 3/4 view, slightly stylized hand-painted game asset, ' +
      'dark greens and browns with murky teal water, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'ruins',
    name: 'Ancient Ruins',
    prompt: 
      'Ancient temple ruins terrain, cracked stone tiles with overgrown moss and vines, ' +
      'fallen pillars and broken statues, scattered ancient debris, ' +
      'glowing magical runes on stone surfaces, mysterious atmosphere, ' +
      'soft magical lighting from glowing symbols, ' +
      'seamless texture, top-down 3/4 view, slightly stylized hand-painted game asset, ' +
      'grey stone with golden glowing accents and green moss, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'desert',
    name: 'Golden Desert',
    prompt: 
      'Golden desert terrain, rolling sand dunes with wind patterns, ' +
      'scattered desert rocks and dry vegetation, bleached animal bones, ' +
      'hot dry atmosphere with heat shimmer, ' +
      'harsh bright sunlight creating deep shadows, ' +
      'seamless texture, top-down 3/4 view, slightly stylized hand-painted game asset, ' +
      'warm gold and tan colors with orange shadows, ' +
      UNIVERSAL_STYLE,
  },
];

// ============================================================================
// CARD ART PROMPTS
// ============================================================================

export interface CardPrompt {
  id: string;
  name: string;
  element: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  prompt: string;
}

export const CARD_PROMPTS: CardPrompt[] = [
  // Fire Cards
  {
    id: 'orc-berserker',
    name: 'Orc Berserker',
    element: 'fire',
    rarity: 'common',
    prompt: 
      'Orc berserker warrior, muscular red-skinned with tribal scars and war paint, ' +
      'wearing fur and leather armor with bone decorations, ' +
      'wielding massive flaming battle axe with glowing runes, ' +
      'charging into battle pose with furious battle cry, ' +
      'volcanic battlefield background with smoke and fire, sparks flying, ' +
      'dynamic diagonal composition, warm fire lighting, ' +
      UNIVERSAL_STYLE,
  },
  {
    id: 'fire-elemental',
    name: 'Fire Elemental',
    element: 'fire',
    rarity: 'rare',
    prompt: 
      'Fire elemental creature, humanoid figure made of living flames, ' +
      'burning intense core with swirling fire body, ' +
      'rising from magma with arms raised, ' +
      'lava pool background with erupting sparks, ' +
      'dramatic backlighting through flames, ' +
      UNIVERSAL_STYLE,
  },
  // Shadow Cards
  {
    id: 'shadow-assassin',
    name: 'Shadow Assassin',
    element: 'shadow',
    rarity: 'common',
    prompt: 
      'Shadow assassin, cloaked figure in dark hood with face hidden in shadow, ' +
      'wielding twin daggers dripping with purple shadow energy, ' +
      'crouched ready to strike pose on rooftop, ' +
      'dark void realm background with floating skulls, ' +
      'purple rim lighting, dramatic shadows, ' +
      UNIVERSAL_STYLE,
  },
  // Add more cards as needed...
];

// ============================================================================
// BACKGROUND PROMPTS
// ============================================================================

export const BACKGROUND_PROMPTS = {
  'character-select': 
    'Epic arena gate entrance, massive stone archway with burning torches, ' +
    'mysterious fog and dramatic lighting, ' +
    'dark cloudy sky with rays of light breaking through, ' +
    'ancient tournament grounds atmosphere, ' +
    'cinematic wide composition, atmospheric perspective, ' +
    UNIVERSAL_STYLE,
    
  'battle-day': 
    'Epic fantasy battlefield at golden hour, rolling grassy plains, ' +
    'distant mountains and dramatic clouds, ' +
    'faint smoke from distant battles, war banners visible, ' +
    'bright warm sunlight, heroic atmosphere, ' +
    'cinematic wide composition, matte painting style, ' +
    UNIVERSAL_STYLE,
    
  'battle-night': 
    'Epic fantasy battlefield at moonlit night, dark rolling hills, ' +
    'massive full moon illuminating scene, magical aurora in sky, ' +
    'campfires and torchlight scattered across field, ' +
    'cool blue and purple lighting, mystical atmosphere, ' +
    'cinematic wide composition, matte painting style, ' +
    UNIVERSAL_STYLE,
    
  'victory': 
    'Triumphant victory scene, confetti and celebration, ' +
    'cheering crowd in background, bright golden lighting, ' +
    'heroic champion standing victorious, raised arms, ' +
    'epic architecture and banners, festive atmosphere, ' +
    'cinematic composition, warm golden color grading, ' +
    UNIVERSAL_STYLE,
};

// ============================================================================
// EXPORT HELPERS
// ============================================================================

export function getPromptById(id: string): string | undefined {
  const titan = TITAN_PROMPTS.find(t => t.id === id);
  if (titan) return titan.prompt;
  
  const terrain = TERRAIN_PROMPTS.find(t => t.id === id);
  if (terrain) return terrain.prompt;
  
  const card = CARD_PROMPTS.find(c => c.id === id);
  if (card) return card.prompt;
  
  return (BACKGROUND_PROMPTS as Record<string, string>)[id];
}

export function getAllPrompts(): Array<{ id: string; name: string; prompt: string; category: string }> {
  return [
    ...TITAN_PROMPTS.map(t => ({ ...t, category: 'titan' })),
    ...TERRAIN_PROMPTS.map(t => ({ ...t, category: 'terrain' })),
    ...CARD_PROMPTS.map(c => ({ ...c, category: 'card' })),
    ...Object.entries(BACKGROUND_PROMPTS).map(([id, prompt]) => ({ 
      id, name: id, prompt, category: 'background' 
    })),
  ];
}
