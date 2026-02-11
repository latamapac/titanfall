/**
 * Dragonamachia Factions Data
 * 
 * The four ideological factions battling for dominance
 * Each with unique visual identity, playstyle, and lore
 */

export interface FactionDef {
  id: string;
  name: string;
  shortName: string;
  sigil: string;
  colors: {
    primary: string;
    secondary: string;
    signal: string;
    dark: string;
  };
  visualCode: {
    materials: string[];
    patterns: string[];
    effects: string[];
    silhouette: string;
  };
  philosophy: string;
  foundingMyth: string;
  territory: string;
  aesthetic: string;
  playstyle: string;
  element: string;
}

export const FACTIONS: Record<string, FactionDef> = {
  'iron-church': {
    id: 'iron-church',
    name: 'The Iron Church',
    shortName: 'Iron',
    sigil: 'Anvil and Crown',
    colors: {
      primary: '#8B4513',
      secondary: '#CD853F',
      signal: '#FF6B35',
      dark: '#3D2817'
    },
    visualCode: {
      materials: ['forged iron', 'bronze', 'obsidian'],
      patterns: ['geometric runes', 'etched filigree', 'crest motifs'],
      effects: ['ash embers', 'metal shards', 'geometric glyph locks'],
      silhouette: 'vertical, rigid, armored'
    },
    philosophy: 'Order through strength, faith through forge',
    foundingMyth: 'The First Smith who hammered law into metal',
    territory: 'The Forge-Cities, volcanic highlands',
    aesthetic: 'Blunt, ceremonial, rune-forged, weighty',
    playstyle: 'Tank / Defense',
    element: 'earth'
  },

  'verdant-covenant': {
    id: 'verdant-covenant',
    name: 'The Verdant Covenant',
    shortName: 'Verdant',
    sigil: 'Thorn-Circle and Bloom',
    colors: {
      primary: '#228B22',
      secondary: '#90EE90',
      signal: '#ADFF2F',
      dark: '#1B4D1B'
    },
    visualCode: {
      materials: ['living bark', 'thorned vines', 'symbiotic moss'],
      patterns: ['intertwined vines', 'leaf spirals', 'organic curves'],
      effects: ['pollen motes', 'green aura flux', 'twisting vines'],
      silhouette: 'flowing, asymmetric, grown not made'
    },
    philosophy: 'Life consumes, life endures, life conquers',
    foundingMyth: 'The First Seed that cracked stone and claimed cities',
    territory: 'The Overgrown Ruins, living forests',
    aesthetic: 'Organic, symbiotic, curving, alive',
    playstyle: 'Growth / Swarm',
    element: 'nature'
  },

  'stormbound': {
    id: 'stormbound',
    name: 'The Stormbound',
    shortName: 'Storm',
    sigil: 'Lightning-Vane and Cloud',
    colors: {
      primary: '#4169E1',
      secondary: '#87CEEB',
      signal: '#00FFFF',
      dark: '#191970'
    },
    visualCode: {
      materials: ['sky-crystal', 'lightning-glass', 'wind-wrought metal'],
      patterns: ['segmented arcs', 'circuit-like nodes', 'spiral gusts'],
      effects: ['electric arcs', 'wind ribbons', 'blue spark clusters'],
      silhouette: 'swept-back, aerodynamic, ascending'
    },
    philosophy: 'Freedom is the only law, the sky is the only throne',
    foundingMyth: 'The First Wind that scattered tyrants like leaves',
    territory: 'The Sky-Towers, floating citadels',
    aesthetic: 'Aerodynamic, electric, ascending, wild',
    playstyle: 'Speed / Air',
    element: 'wind'
  },

  'esoteric-scholarium': {
    id: 'esoteric-scholarium',
    name: 'The Esoteric Scholarium',
    shortName: 'Scholarium',
    sigil: 'Unblinking Eye and Open Tome',
    colors: {
      primary: '#4B0082',
      secondary: '#8A2BE2',
      signal: '#FFD700',
      dark: '#2E0854'
    },
    visualCode: {
      materials: ['void-crystal', 'star-metal', 'liquid memory'],
      patterns: ['concentric circles', 'eye motifs', 'impossible geometries'],
      effects: ['floating sigils', 'glimmering eyes', 'reality distortions'],
      silhouette: 'orbital, layered, gravitating elements'
    },
    philosophy: 'Knowledge is power, secrets are weapons, truth is malleable',
    foundingMyth: 'The First Thought that questioned reality and rewrote it',
    territory: 'The Library-Dimensions, folded spaces',
    aesthetic: 'Mysterious, layered, glowing, cerebral',
    playstyle: 'Control / Magic',
    element: 'arcane'
  }
};

export const FACTION_LIST = Object.values(FACTIONS);
