import type { GameMap } from '../types/game';

export const MAPS: GameMap[] = [
  {
    name: 'Verdant Valley',
    desc: 'Forests and gentle hills provide cover and elevation.',
    tiles: [
      [{ t: 'forest', h: 1 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'forest', h: 1 }],
      [{ t: 'plain', h: 0 }, { t: 'forest', h: 1 }, { t: 'plain', h: 0 }, { t: 'plain', h: 0 }, { t: 'plain', h: 0 }, { t: 'forest', h: 1 }, { t: 'plain', h: 0 }],
      [{ t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'forest', h: 1 }, { t: 'hill', h: 2 }, { t: 'forest', h: 1 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }],
      [{ t: 'plain', h: 0 }, { t: 'forest', h: 1 }, { t: 'plain', h: 0 }, { t: 'plain', h: 0 }, { t: 'plain', h: 0 }, { t: 'forest', h: 1 }, { t: 'plain', h: 0 }],
      [{ t: 'forest', h: 1 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'forest', h: 1 }],
    ],
  },
  {
    name: 'Obsidian Peaks',
    desc: 'Volcanic mountains dominate this fiery landscape.',
    tiles: [
      [{ t: 'mountain', h: 3 }, { t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'volcano', h: 1 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }, { t: 'mountain', h: 3 }],
      [{ t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'volcano', h: 1 }, { t: 'plain', h: 0 }, { t: 'volcano', h: 1 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }],
      [{ t: 'plain', h: 0 }, { t: 'volcano', h: 1 }, { t: 'hill', h: 2 }, { t: 'mountain', h: 3 }, { t: 'hill', h: 2 }, { t: 'volcano', h: 1 }, { t: 'plain', h: 0 }],
      [{ t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'volcano', h: 1 }, { t: 'plain', h: 0 }, { t: 'volcano', h: 1 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }],
      [{ t: 'mountain', h: 3 }, { t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'volcano', h: 1 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }, { t: 'mountain', h: 3 }],
    ],
  },
  {
    name: 'Tidal Marshes',
    desc: 'Swamps and waterways create a treacherous battlefield.',
    tiles: [
      [{ t: 'plain', h: 0 }, { t: 'swamp', h: 0 }, { t: 'water', h: 0 }, { t: 'plain', h: 0 }, { t: 'water', h: 0 }, { t: 'swamp', h: 0 }, { t: 'plain', h: 0 }],
      [{ t: 'swamp', h: 0 }, { t: 'plain', h: 0 }, { t: 'swamp', h: 0 }, { t: 'water', h: 0 }, { t: 'swamp', h: 0 }, { t: 'plain', h: 0 }, { t: 'swamp', h: 0 }],
      [{ t: 'water', h: 0 }, { t: 'swamp', h: 0 }, { t: 'hill', h: 1 }, { t: 'swamp', h: 0 }, { t: 'hill', h: 1 }, { t: 'swamp', h: 0 }, { t: 'water', h: 0 }],
      [{ t: 'swamp', h: 0 }, { t: 'plain', h: 0 }, { t: 'swamp', h: 0 }, { t: 'water', h: 0 }, { t: 'swamp', h: 0 }, { t: 'plain', h: 0 }, { t: 'swamp', h: 0 }],
      [{ t: 'plain', h: 0 }, { t: 'swamp', h: 0 }, { t: 'water', h: 0 }, { t: 'plain', h: 0 }, { t: 'water', h: 0 }, { t: 'swamp', h: 0 }, { t: 'plain', h: 0 }],
    ],
  },
  {
    name: 'Arcane Ruins',
    desc: 'Mystical terrain infused with ancient magical energy.',
    tiles: [
      [{ t: 'ruins', h: 0 }, { t: 'plain', h: 0 }, { t: 'ruins', h: 1 }, { t: 'hill', h: 1 }, { t: 'ruins', h: 1 }, { t: 'plain', h: 0 }, { t: 'ruins', h: 0 }],
      [{ t: 'plain', h: 0 }, { t: 'ruins', h: 0 }, { t: 'plain', h: 0 }, { t: 'ruins', h: 1 }, { t: 'plain', h: 0 }, { t: 'ruins', h: 0 }, { t: 'plain', h: 0 }],
      [{ t: 'ruins', h: 1 }, { t: 'plain', h: 0 }, { t: 'ruins', h: 2 }, { t: 'mountain', h: 3 }, { t: 'ruins', h: 2 }, { t: 'plain', h: 0 }, { t: 'ruins', h: 1 }],
      [{ t: 'plain', h: 0 }, { t: 'ruins', h: 0 }, { t: 'plain', h: 0 }, { t: 'ruins', h: 1 }, { t: 'plain', h: 0 }, { t: 'ruins', h: 0 }, { t: 'plain', h: 0 }],
      [{ t: 'ruins', h: 0 }, { t: 'plain', h: 0 }, { t: 'ruins', h: 1 }, { t: 'hill', h: 1 }, { t: 'ruins', h: 1 }, { t: 'plain', h: 0 }, { t: 'ruins', h: 0 }],
    ],
  },
  {
    name: "Dragon's Spine",
    desc: 'A mountain ridge with diverse terrain on all sides.',
    tiles: [
      [{ t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'mountain', h: 3 }, { t: 'forest', h: 1 }, { t: 'mountain', h: 3 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }],
      [{ t: 'plain', h: 0 }, { t: 'forest', h: 1 }, { t: 'hill', h: 2 }, { t: 'plain', h: 0 }, { t: 'hill', h: 2 }, { t: 'forest', h: 1 }, { t: 'plain', h: 0 }],
      [{ t: 'forest', h: 1 }, { t: 'swamp', h: 0 }, { t: 'plain', h: 0 }, { t: 'volcano', h: 2 }, { t: 'plain', h: 0 }, { t: 'swamp', h: 0 }, { t: 'forest', h: 1 }],
      [{ t: 'plain', h: 0 }, { t: 'forest', h: 1 }, { t: 'hill', h: 2 }, { t: 'plain', h: 0 }, { t: 'hill', h: 2 }, { t: 'forest', h: 1 }, { t: 'plain', h: 0 }],
      [{ t: 'hill', h: 1 }, { t: 'plain', h: 0 }, { t: 'mountain', h: 3 }, { t: 'forest', h: 1 }, { t: 'mountain', h: 3 }, { t: 'plain', h: 0 }, { t: 'hill', h: 1 }],
    ],
  },
];
