// AAA Game Design System - Titanfall Chronicles

export const factions = {
  kargath: {
    name: 'Kargath',
    title: 'Iron Church',
    colors: {
      primary: '#E84430',
      dark: '#8B2E1C',
      light: '#FF6B4A',
      glow: 'rgba(232, 68, 48, 0.6)',
    },
    gradients: {
      frame: 'linear-gradient(135deg, #2A1815 0%, #4A2520 50%, #2A1815 100%)',
      glow: 'radial-gradient(circle, rgba(232,68,48,0.4) 0%, transparent 70%)',
    },
    shadows: {
      drop: '0 10px 40px rgba(232, 68, 48, 0.3)',
      inner: 'inset 0 2px 10px rgba(0,0,0,0.5)',
    },
  },
  thalor: {
    name: 'Thalor',
    title: 'Verdant Covenant',
    colors: {
      primary: '#D4A030',
      dark: '#8B6914',
      light: '#F0C050',
      glow: 'rgba(212, 160, 48, 0.6)',
    },
    gradients: {
      frame: 'linear-gradient(135deg, #1F2A15 0%, #354A20 50%, #1F2A15 100%)',
      glow: 'radial-gradient(circle, rgba(212,160,48,0.4) 0%, transparent 70%)',
    },
    shadows: {
      drop: '0 10px 40px rgba(212, 160, 48, 0.3)',
      inner: 'inset 0 2px 10px rgba(0,0,0,0.5)',
    },
  },
  sylara: {
    name: 'Sylara',
    title: 'Stormbound',
    colors: {
      primary: '#30D4C8',
      dark: '#1A8B84',
      light: '#4AFFF0',
      glow: 'rgba(48, 212, 200, 0.6)',
    },
    gradients: {
      frame: 'linear-gradient(135deg, #0A1A2E 0%, #1A3A5E 50%, #0A1A2E 100%)',
      glow: 'radial-gradient(circle, rgba(48,212,200,0.4) 0%, transparent 70%)',
    },
    shadows: {
      drop: '0 10px 40px rgba(48, 212, 200, 0.3)',
      inner: 'inset 0 2px 10px rgba(0,0,0,0.5)',
    },
  },
  nyx: {
    name: 'Nyx',
    title: 'Void Covenant',
    colors: {
      primary: '#9D30D4',
      dark: '#5A1A7A',
      light: '#D080FF',
      glow: 'rgba(157, 48, 212, 0.6)',
    },
    gradients: {
      frame: 'linear-gradient(135deg, #1A0A2E 0%, #2E1A4A 50%, #1A0A2E 100%)',
      glow: 'radial-gradient(circle, rgba(157,48,212,0.4) 0%, transparent 70%)',
    },
    shadows: {
      drop: '0 10px 40px rgba(157, 48, 212, 0.3)',
      inner: 'inset 0 2px 10px rgba(0,0,0,0.5)',
    },
  },
  elandor: {
    name: 'Elandor',
    title: 'Arcane Order',
    colors: {
      primary: '#3B82F6',
      dark: '#1E40AF',
      light: '#60A5FA',
      glow: 'rgba(59, 130, 246, 0.6)',
    },
    gradients: {
      frame: 'linear-gradient(135deg, #0A152E 0%, #1A2A5E 50%, #0A152E 100%)',
      glow: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
    },
    shadows: {
      drop: '0 10px 40px rgba(59, 130, 246, 0.3)',
      inner: 'inset 0 2px 10px rgba(0,0,0,0.5)',
    },
  },
};

export const rarity = {
  common: {
    color: '#9CA3AF',
    glow: 'rgba(156, 163, 175, 0.3)',
    shine: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
  },
  uncommon: {
    color: '#22C55E',
    glow: 'rgba(34, 197, 94, 0.4)',
    shine: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.2), transparent)',
  },
  rare: {
    color: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.5)',
    shine: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)',
  },
  epic: {
    color: '#A855F7',
    glow: 'rgba(168, 85, 247, 0.6)',
    shine: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)',
  },
  legendary: {
    color: '#EAB308',
    glow: 'rgba(234, 179, 8, 0.7)',
    shine: 'linear-gradient(90deg, transparent, rgba(234,179,8,0.5), transparent)',
  },
};

export const animations = {
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    dramatic: '800ms',
  },
  
  keyframes: {
    pulse: `@keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }`,
    
    glow: `@keyframes glow {
      0%, 100% { filter: brightness(1) drop-shadow(0 0 5px currentColor); }
      50% { filter: brightness(1.2) drop-shadow(0 0 20px currentColor); }
    }`,
    
    float: `@keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }`,
    
    shine: `@keyframes shine {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }`,
    
    damage: `@keyframes damage {
      0% { transform: scale(1); filter: brightness(1); }
      25% { transform: scale(1.2); filter: brightness(2) sepia(1) hue-rotate(-50deg) saturate(5); }
      50% { transform: scale(0.95); filter: brightness(0.5); }
      100% { transform: scale(1); filter: brightness(1); }
    }`,
    
    heal: `@keyframes heal {
      0% { transform: scale(1); filter: brightness(1); }
      50% { transform: scale(1.1); filter: brightness(1.5) sepia(1) hue-rotate(90deg) saturate(3); }
      100% { transform: scale(1); filter: brightness(1); }
    }`,
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
};

export const typography = {
  fontFamily: {
    display: '"Cinzel", "Trajan Pro", serif',
    body: '"Inter", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  sizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
  },
};
