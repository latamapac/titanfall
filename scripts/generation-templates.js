/**
 * Dragonamachia - AI Generation Prompt Templates
 * 
 * Usage:
 *   import { generateHeroPrompt, generateCreaturePrompt } from './generation-templates.js';
 *   const prompt = generateHeroPrompt('warden', 'iron-church');
 */

import worldBible from '../lore/world-bible.json' assert { type: 'json' };

const FACTIONS = worldBible.factions;
const HEROES = worldBible.heroArchetypes;
const CREATURES = worldBible.creatures;

// Universal style foundation
const STYLE_FOUNDATION = {
  quality: "masterpiece, best quality, highly detailed, professional digital art",
  lighting: "cinematic lighting, dramatic rim light, atmospheric depth",
  composition: "bold silhouette, centered composition, clear focal point",
  anatomy: "grounded anatomy, mythic exaggeration where appropriate",
  negative: "anime, cartoon, blurry, low quality, deformed, bad anatomy"
};

/**
 * Generate hero character prompt
 */
export function generateHeroPrompt(heroId, factionId, options = {}) {
  const hero = HEROES[heroId];
  const faction = FACTIONS[factionId];
  
  if (!hero || !faction) {
    throw new Error(`Invalid hero (${heroId}) or faction (${factionId})`);
  }

  const {
    includeBackground = true,
    includeWeapon = true,
    pose = "default", // default, combat, triumphant
    lighting = "dramatic"
  } = options;

  // Build visual elements
  const elements = [];
  
  // Core character description
  elements.push(`${hero.name}, ${hero.role} hero from the ${faction.name}`);
  elements.push(`wearing ${hero.visualSignature.join(', ')}`);
  elements.push(`primary color ${faction.colors.primary}, signal color ${faction.colors.signal}`);
  
  // Materials and patterns
  if (faction.visualCode.materials) {
    elements.push(`materials: ${faction.visualCode.materials.join(', ')}`);
  }
  if (faction.visualCode.patterns) {
    elements.push(`patterns: ${faction.visualCode.patterns.join(', ')}`);
  }
  
  // Silhouette
  elements.push(`${faction.visualCode.silhouette} silhouette`);
  
  // Weapons
  if (includeWeapon && hero.weaponTypes) {
    elements.push(`wielding ${hero.weaponTypes[0]}`);
  }
  
  // Background
  if (includeBackground) {
    const locations = Object.values(worldBible.locations).filter(l => l.faction === factionId);
    if (locations.length > 0) {
      elements.push(`background: ${locations[0].name}, ${locations[0].visualElements.join(', ')}`);
    }
  }
  
  // Effects
  if (faction.visualCode.effects) {
    elements.push(`${faction.visualCode.effects[0]} effects`);
  }
  
  // Build final prompt
  const mainDescription = elements.join('. ');
  
  const prompt = `${mainDescription}. 
${STYLE_FOUNDATION.quality}. 
${STYLE_FOUNDATION.lighting}. 
${STYLE_FOUNDATION.composition}. 
${STYLE_FOUNDATION.anatomy}.
${faction.aesthetic} aesthetic.
Style: Bold silhouette, primary motif embedded in armor, signal color on focal elements.
`;

  return {
    prompt: prompt.replace(/\s+/g, ' ').trim(),
    negative: STYLE_FOUNDATION.negative,
    specs: {
      dimensions: "1024x1024",
      format: "PNG",
      hero: heroId,
      faction: factionId
    }
  };
}

/**
 * Generate creature prompt
 */
export function generateCreaturePrompt(creatureId, options = {}) {
  const creature = CREATURES[creatureId];
  if (!creature) {
    throw new Error(`Invalid creature: ${creatureId}`);
  }
  
  const faction = FACTIONS[creature.faction];
  
  const elements = [];
  elements.push(`${creature.name}, ${creature.type}`);
  elements.push(`visual code: ${creature.visualCode.join(', ')}`);
  elements.push(`from ${faction.name}`);
  elements.push(faction.visualCode.silhouette);
  
  if (faction.visualCode.materials) {
    elements.push(`constructed from ${faction.visualCode.materials.join(', ')}`);
  }
  
  const mainDescription = elements.join('. ');
  
  const prompt = `${mainDescription}.
Anatomy grounded in real biology where possible. Mythic exaggeration only if motif consequence.
${STYLE_FOUNDATION.quality}.
${STYLE_FOUNDATION.lighting}.
${STYLE_FOUNDATION.composition}.
`;

  return {
    prompt: prompt.replace(/\s+/g, ' ').trim(),
    negative: STYLE_FOUNDATION.negative,
    specs: {
      dimensions: "1024x1024",
      format: "PNG",
      creature: creatureId,
      faction: creature.faction,
      threatLevel: creature.threatLevel
    }
  };
}

/**
 * Generate equipment/weapon prompt
 */
export function generateEquipmentPrompt(equipmentType, factionId, options = {}) {
  const faction = FACTIONS[factionId];
  if (!faction) {
    throw new Error(`Invalid faction: ${factionId}`);
  }
  
  const weapons = worldBible.equipmentCategories.weapons[factionId] || [];
  const weaponName = options.weaponName || weapons[0] || "weapon";
  
  const elements = [];
  elements.push(`${faction.name} ${weaponName}`);
  elements.push(`${faction.aesthetic} aesthetic`);
  elements.push(`materials: ${faction.visualCode.materials.join(', ')}`);
  elements.push(`feels like it was used in ${faction.name}'s wars`);
  
  const prompt = `${elements.join('. ')}.
Weapon design, centered composition, ${STYLE_FOUNDATION.quality}, dramatic lighting.
Game asset, transparent background preferred.
`;

  return {
    prompt: prompt.replace(/\s+/g, ' ').trim(),
    specs: {
      dimensions: options.dimensions || "512x512",
      format: "PNG",
      type: equipmentType,
      faction: factionId
    }
  };
}

/**
 * Generate UI element prompt
 */
export function generateUIPrompt(elementType, factionId, options = {}) {
  const faction = FACTIONS[factionId];
  if (!faction) {
    throw new Error(`Invalid faction: ${factionId}`);
  }
  
  const templates = {
    "card-frame": `Card frame for ${faction.name}. ${faction.visualCode.patterns[0]} border design. ${faction.colors.primary} and ${faction.colors.signal}. Clean edges, game UI element.`,
    "button": `Button UI element, ${faction.name} style. ${faction.aesthetic} material feel. ${faction.visualCode.patterns[0]} details.`,
    "icon": `Icon symbol for ${faction.name}. Simplified, readable at small size. ${faction.sigil} motif.`,
    "panel": `UI panel frame, ${faction.name} aesthetic. ${faction.visualCode.materials[0]} texture. ${faction.visualCode.patterns[0]} border.`
  };
  
  const basePrompt = templates[elementType] || `UI element, ${faction.name} style`;
  
  const prompt = `${basePrompt}.
UI = World Extension. Visually belongs to universe, not pasted on.
${STYLE_FOUNDATION.quality}. Clean design, game asset.
Transparent background.
`;

  return {
    prompt: prompt.replace(/\s+/g, ' ').trim(),
    specs: {
      dimensions: options.dimensions || "512x512",
      format: "PNG",
      type: elementType,
      faction: factionId
    }
  };
}

/**
 * Generate spell effect description (for VFX artist)
 */
export function generateSpellEffectPrompt(effectType, factionId) {
  const faction = FACTIONS[factionId];
  if (!faction) {
    throw new Error(`Invalid faction: ${factionId}`);
  }
  
  const effects = faction.visualCode.effects || [];
  
  return {
    description: `${effectType} spell effect for ${faction.name}`,
    visualCode: effects,
    style: faction.aesthetic,
    colors: [faction.colors.primary, faction.colors.signal],
    reference: "Spell visuals are sign language, not effects for flash",
    deliverables: [
      "Animation spritesheet (8-12 frames)",
      "Particle texture",
      "Impact frame",
      "Looping ambient version"
    ]
  };
}

/**
 * Generate all prompts for a faction
 */
export function generateFactionPrompts(factionId) {
  const faction = FACTIONS[factionId];
  const prompts = {
    faction: factionId,
    heroes: [],
    creatures: [],
    equipment: [],
    ui: []
  };
  
  // Heroes for this faction
  Object.entries(HEROES).forEach(([id, hero]) => {
    if (hero.primaryFaction === factionId) {
      prompts.heroes.push({
        id: `hero-${id}`,
        ...generateHeroPrompt(id, factionId)
      });
    }
  });
  
  // Creatures for this faction
  Object.entries(CREATURES).forEach(([id, creature]) => {
    if (creature.faction === factionId) {
      prompts.creatures.push({
        id: `creature-${id}`,
        ...generateCreaturePrompt(id)
      });
    }
  });
  
  // Equipment
  const weapons = worldBible.equipmentCategories.weapons[factionId] || [];
  weapons.forEach(weapon => {
    prompts.equipment.push({
      id: `weapon-${weapon.toLowerCase().replace(/\s+/g, '-')}`,
      ...generateEquipmentPrompt('weapon', factionId, { weaponName: weapon })
    });
  });
  
  // UI elements
  ['card-frame', 'button', 'icon', 'panel'].forEach(uiType => {
    prompts.ui.push({
      id: `ui-${uiType}`,
      ...generateUIPrompt(uiType, factionId)
    });
  });
  
  return prompts;
}

/**
 * Generate complete asset manifest
 */
export function generateCompleteManifest() {
  const manifest = {
    project: "Dragonamachia",
    generated: new Date().toISOString(),
    factions: {}
  };
  
  Object.keys(FACTIONS).forEach(factionId => {
    manifest.factions[factionId] = generateFactionPrompts(factionId);
  });
  
  // Summary stats
  manifest.stats = {
    totalHeroes: Object.keys(HEROES).length,
    totalCreatures: Object.keys(CREATURES).length,
    totalFactions: Object.keys(FACTIONS).length,
    totalPrompts: Object.values(manifest.factions).reduce((sum, f) => 
      sum + f.heroes.length + f.creatures.length + f.equipment.length + f.ui.length, 0
    )
  };
  
  return manifest;
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const manifest = generateCompleteManifest();
  console.log(JSON.stringify(manifest, null, 2));
}
