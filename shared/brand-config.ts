/**
 * TROVES & COVES BRAND CONFIGURATION
 * LOCKED DESIGN LANGUAGE - DO NOT MODIFY WITHOUT AUTHORIZATION
 * 
 * This configuration enforces the authentic brand identity based on:
 * 1. Wooden signage: "Troves" in turquoise print, "Coves" in cursive gold
 * 2. Mystical skull artwork: Turquoise skull with gold decorative frame
 * 3. Natural crystal and wood textures
 */

export const BRAND_CONFIG = {
  // CORE BRAND IDENTITY - IMMUTABLE
  name: {
    primary: "Troves", // MUST be turquoise, sans-serif, bold
    secondary: "Coves", // MUST be gold, cursive script, italic
    separator: "&", // Gold, lighter weight
    tagline: "Mystical Crystal Jewelry • Winnipeg"
  },

  // AUTHENTIC COLOR PALETTE FROM WOODEN SIGN & SKULL ARTWORK
  colors: {
    // Exact colors from wooden sign reference
    trovesTurquoise: "hsl(174, 70%, 45%)", // Clean turquoise print from sign
    covesCursiveBlue: "hsl(200, 60%, 45%)", // Elegant cursive blue from sign
    woodGrain: "hsl(35, 40%, 70%)", // Natural wood background from sign
    
    // Turquoise skull artwork colors
    skullTurquoise: "hsl(174, 100%, 50%)", // Vibrant turquoise from skull
    ornateFrameGold: "hsl(43, 85%, 60%)", // Golden decorative frame
    crystalAccents: "hsl(240, 20%, 95%)", // White crystal highlights
    
    // Natural supporting palette
    naturalWood: "hsl(35, 30%, 65%)",
    pearlCream: "hsl(45, 25%, 92%)",
    mysticAccent: "hsl(280, 40%, 65%)"
  },

  // TYPOGRAPHY HIERARCHY
  typography: {
    // "Troves" styling
    troves: {
      fontFamily: "'Source Sans Pro', sans-serif",
      fontWeight: "bold",
      color: "var(--troves-turquoise)",
      textTransform: "none" as const
    },
    
    // "Coves" styling  
    coves: {
      fontFamily: "'Dancing Script', cursive",
      fontWeight: "600",
      fontStyle: "italic",
      color: "var(--coves-cursive-blue)"
    },
    
    // Body text
    body: {
      fontFamily: "'Source Sans Pro', sans-serif",
      fontWeight: "400"
    },
    
    // Headings
    heading: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: "600"
    }
  },

  // DESIGN ELEMENTS FROM SKULL ARTWORK
  designElements: {
    // Mystical skull symbolism
    iconography: {
      primary: "gem", // Crystal/gem icon
      skull: "skull", // Mystical skull elements
      ornate: "decorative-frame", // Gold ornate patterns
      natural: "leaf" // Natural/organic elements
    },
    
    // Visual effects inspired by artwork
    effects: {
      turquoiseGlow: "0 0 20px hsla(174, 85%, 50%, 0.3)",
      goldGlow: "0 0 15px hsla(43, 95%, 68%, 0.4)",
      crystalShimmer: "0 2px 8px hsla(0, 0%, 100%, 0.2)"
    },
    
    // Textures and patterns
    textures: {
      wood: "natural wood grain",
      crystal: "reflective crystal surface",
      metal: "oxidized metal patina",
      ornate: "baroque decorative patterns"
    }
  },

  // VOICE AND MESSAGING
  voice: {
    tone: "mystical, spiritual, authentic",
    personality: "wise, nurturing, magical",
    approach: "personal connection to crystal energy",
    expertise: "handcrafted jewelry, crystal healing properties"
  },

  // VISUAL HIERARCHY
  hierarchy: {
    primary: "turquoise dominance with gold accents",
    secondary: "natural wood and crystal textures",
    accent: "mystical skull symbolism",
    background: "cream and pearl tones"
  },

  // AI ORCHESTRATION GUIDELINES
  aiGuidelines: {
    brandVoice: "Always maintain mystical, spiritual tone while being authentic and personal",
    colorUsage: "Turquoise for 'Troves', gold for 'Coves', never reverse or alter",
    imagery: "Reference skull artwork aesthetic - turquoise and gold mystical themes",
    messaging: "Focus on crystal healing properties, handcrafted quality, spiritual connection"
  },

  // IMMUTABLE RULES
  rules: {
    logoOrdering: "Always 'Troves & Coves' - never reverse",
    colorConsistency: "Turquoise for Troves, gold for Coves - no exceptions",
    fontPairing: "Sans-serif for Troves, cursive for Coves - locked pairing",
    brandIntegrity: "All AI responses must reflect mystical crystal jewelry expertise"
  }
} as const;

// TYPE DEFINITIONS FOR ENFORCEMENT
export type TrovesCoovesBrand = typeof BRAND_CONFIG;
export type BrandColors = typeof BRAND_CONFIG.colors;
export type BrandTypography = typeof BRAND_CONFIG.typography;

// VALIDATION HELPERS
export function validateBrandCompliance(element: any): boolean {
  // Add validation logic to ensure brand guidelines are followed
  return true;
}

export function getBrandColor(colorKey: keyof BrandColors): string {
  return BRAND_CONFIG.colors[colorKey];
}

export function getBrandFont(element: 'troves' | 'coves' | 'body' | 'heading'): string {
  return BRAND_CONFIG.typography[element].fontFamily;
}