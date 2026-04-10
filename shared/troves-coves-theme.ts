/**
 * TROVES & COVES - CUSTOM COLOR SCHEME
 * Based on turquoise skull cover image analysis
 * Compatible with Base24 tinted-theming format
 */

export const TROVES_COVES_SCHEME = {
  system: 'base24',
  name: 'Troves & Coves',
  author: 'Troves & Coves - Mystical Crystal Jewelry',
  variant: 'dark' as const,

  // Backgrounds - Dark mystical tones
  base00: '#1a1a1e', // Deepest background
  base01: '#232329', // Secondary background
  base02: '#2d2d36', // Tertiary background
  base03: '#3d3d4a', // Elevated surface

  // Foregrounds
  base04: '#a8a8b8', // Muted text
  base05: '#d4d4e0', // Primary text
  base06: '#e8e8f0', // Bright text
  base07: '#f5f5fa', // Pure white text

  // Core Brand Colors - From cover image analysis
  base08: '#40E0D0', // TURQUOISE - Primary brand color
  base09: '#D4AF37', // GOLD - Secondary/accent color
  base0A: '#FF69B4', // HOT PINK - Accent
  base0B: '#87CEEB', // SKY BLUE - Soft accent
  base0C: '#5FB4B4', // MUTED TURQUOISE - Secondary

  // Extended palette (base24)
  base10: '#1e2528', // Deep blue-green shadow
  base11: '#2a3337', // Warm stone background
  base12: '#3AE0D0', // BRIGHT TURQUOISE highlight
  base13: '#E4C247', // BRIGHT GOLD highlight
  base14: '#FF7BC4', // SOFT PINK
  base15: '#A0DEEB', // PALE BLUE
  base16: '#4090B0', // DEEP OCEAN
  base17: '#B84A90', // DEEP PINK
} as const;

// Semantic color mapping for the website
export const THEME_COLORS = {
  // Brand colors
  turquoise: {
    primary: '#40E0D0', // Main turquoise from skull
    muted: '#5FB4B4', // Muted variant
    dark: '#2A8A8A', // Dark variant
    glow: '#3AE0D0', // Bright highlight
  },
  gold: {
    primary: '#D4AF37', // Gold from frame/patches
    bright: '#E4C247', // Bright highlight
    muted: '#B89430', // Muted variant
  },
  pink: {
    primary: '#FF69B4', // Hot pink from cheeks
    soft: '#FF7BC4', // Soft variant
    deep: '#B84A90', // Deep variant
  },
  blue: {
    sky: '#87CEEB', // Sky blue from sockets
    pale: '#A0DEEB', // Pale variant
    ocean: '#4090B0', // Deep ocean
  },

  // Backgrounds
  background: {
    deepest: '#1a1a1e',
    dark: '#232329',
    elevated: '#3d3d4a',
    card: '#2d2d36',
  },

  // Text
  text: {
    primary: '#d4d4e0',
    muted: '#a8a8b8',
    bright: '#f5f5fa',
  },

  // Wood tones from frame
  wood: {
    light: '#DEB887',
    medium: '#C4A070',
    dark: '#A08050',
  },
} as const;

// HSL versions for CSS variables
export const THEME_HSL = {
  turquoise: {
    primary: '174 100% 56%', // #40E0D0
    muted: '174 48% 53%', // #5FB4B4
    dark: '174 54% 33%', // #2A8A8A
    glow: '174 86% 57%', // #3AE0D0
  },
  gold: {
    primary: '43 78% 53%', // #D4AF37
    bright: '45 73% 59%', // #E4C247
    muted: '40 60% 45%', // #B89430
  },
  pink: {
    primary: '330 100% 71%', // #FF69B4
    soft: '330 80% 73%', // #FF7BC4
    deep: '330 50% 51%', // #B84A90
  },
  blue: {
    sky: '197 71% 73%', // #87CEEB
    pale: '197 68% 78%', // #A0DEEB
    ocean: '195 51% 47%', // #4090B0
  },
} as const;

// CSS custom properties for the theme
export function getThemeCSSVariables(): string {
  return `
    /* Troves & Coves Theme - Based on Turquoise Skull Cover */
    :root {
      /* Turquoise palette */
      --turquoise-primary: ${THEME_COLORS.turquoise.primary};
      --turquoise-muted: ${THEME_COLORS.turquoise.muted};
      --turquoise-dark: ${THEME_COLORS.turquoise.dark};
      --turquoise-glow: ${THEME_COLORS.turquoise.glow};

      /* Gold palette */
      --gold-primary: ${THEME_COLORS.gold.primary};
      --gold-bright: ${THEME_COLORS.gold.bright};
      --gold-muted: ${THEME_COLORS.gold.muted};

      /* Pink palette */
      --pink-primary: ${THEME_COLORS.pink.primary};
      --pink-soft: ${THEME_COLORS.pink.soft};
      --pink-deep: ${THEME_COLORS.pink.deep};

      /* Blue palette */
      --blue-sky: ${THEME_COLORS.blue.sky};
      --blue-pale: ${THEME_COLORS.blue.pale};
      --blue-ocean: ${THEME_COLORS.blue.ocean};

      /* Backgrounds */
      --bg-deepest: ${THEME_COLORS.background.deepest};
      --bg-dark: ${THEME_COLORS.background.dark};
      --bg-elevated: ${THEME_COLORS.background.elevated};
      --bg-card: ${THEME_COLORS.background.card};

      /* Text */
      --text-primary: ${THEME_COLORS.text.primary};
      --text-muted: ${THEME_COLORS.text.muted};
      --text-bright: ${THEME_COLORS.text.bright};

      /* Wood tones */
      --wood-light: ${THEME_COLORS.wood.light};
      --wood-medium: ${THEME_COLORS.wood.medium};
      --wood-dark: ${THEME_COLORS.wood.dark};
    }
  `;
}
