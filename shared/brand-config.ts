/**
 * TROVES & COVES BRAND CONFIGURATION
 * CLIENT-SPECIFIED - ROBIN KROEKER
 * LOCKED DESIGN LANGUAGE - DO NOT MODIFY WITHOUT AUTHORIZATION
 *
 * ════════════════════════════════════════════════════════════════
 * CLIENT'S EXACT SPECIFICATIONS
 * ════════════════════════════════════════════════════════════════
 *
 * COLORS (Hex):
 * • Turquoise: #4abfbf
 * • Gold 1:     #deb55b
 * • Gold 2:     #e1af2f
 * • Background: #faf8f3 (linen/off-white - "not so harsh on the eyes")
 *
 * FONTS:
 * • Alex Brush        - Script font for "Coves"
 * • Libre Baskerville  - Serif font for "Troves" and headings
 * • Montserrat        - Supporting text/UI elements
 *
 * NEEDED:
 * • Brand colors, feel, brand voice
 * • Mission statement
 * • About the designer (Robin)
 * • Foundation materials
 *
 * ════════════════════════════════════════════════════════════════
 */

export const BRAND_CONFIG = {
  // CORE BRAND IDENTITY - IMMUTABLE
  name: {
    primary: "Troves", // Turquoise, Libre Baskerville
    secondary: "Coves", // Gold, Alex Brush script
    separator: "&", // Gold accent
    tagline: "Handcrafted Crystal Jewelry • Winnipeg"
  },

  // CLIENT'S EXACT COLOR SPECIFICATIONS (Robin)
  colors: {
    // Primary brand colors
    turquoise: "#4abfbf", // Client's exact turquoise
    gold1: "#deb55b", // Client's first gold shade
    gold2: "#e1af2f", // Client's second gold shade
    background: "#faf8f3", // Client's linen/off-white background

    // Semantic color aliases
    trovesTurquoise: "#4abfbf",
    covesGold: "#e1af2f",
    separatorGold: "#deb55b",
    linenBackground: "#faf8f3",

    // Supporting palette - LUXURY PALETTE 2026 (Robin's exact spec)
    textPrimary: "#1f1f1f",   // Soft black / charcoal - main text
    textSecondary: "#5f5f5f", // Muted grey - secondary text
    lightText: "#faf8f3",     // Linen background
    accent: "#4abfbf"         // Primary brand accent
  },

  // CLIENT'S FONT SPECIFICATIONS
  typography: {
    // "Troves" styling - Libre Baskerville
    troves: {
      fontFamily: "'Libre Baskerville', serif",
      fontWeight: "700",
      color: "#4abfbf",
      textTransform: "uppercase" as const,
      letterSpacing: "0.08em"
    },

    // "Coves" styling - Alex Brush
    coves: {
      fontFamily: "'Alex Brush', cursive",
      fontWeight: "400",
      fontStyle: "normal",
      color: "#e1af2f"
    },

    // Body & UI - Montserrat
    body: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: "400",
      color: "#1f1f1f" // LUXURY PALETTE - soft black/charcoal
    },

    // Headings - Libre Baskerville
    heading: {
      fontFamily: "'Libre Baskerville', serif",
      fontWeight: "700",
      color: "#1f1f1f" // LUXURY PALETTE - soft black/charcoal
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

  // VOICE AND MESSAGING - Luxury Brand Positioning
  voice: {
    tone: "refined, intentional, elevated",
    personality: "authentic, confident, timeless",
    approach: "curated jewelry for modern style",
    expertise: "14k gold-plated jewelry, natural crystals, statement pieces"
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
    brandVoice: "Empowering, transformative, intentional - elevate style and spirit through crafted pieces",
    colorUsage: "Use #4abfbf for Troves, #e1af2f/#deb55b for Coves, #faf8f3 for backgrounds",
    imagery: "Statement necklaces and bracelets, 14k gold-plated chains, natural crystals, handcrafted quality",
    messaging: "Power of transformation, crafted with intention, empower your energy, enhance your presence, bold femininity and masculine strength"
  },

  // IMMUTABLE RULES - CLIENT SPECIFIED
  rules: {
    logoOrdering: "Always 'Troves & Coves' - never reverse",
    colorConsistency: "#4abfbf for Troves, #e1af2f/#deb55b for Coves - no exceptions",
    fontPairing: "Libre Baskerville for Troves, Alex Brush for Coves - locked pairing",
    background: "#faf8f3 (linen) for primary backgrounds",
    brandIntegrity: "All responses must reflect transformative crystal jewelry expertise—elevating style and spirit through crafted intention"
  }
} as const;

// TYPE DEFINITIONS FOR ENFORCEMENT
export type TrovesCoovesBrand = typeof BRAND_CONFIG;
export type BrandColors = typeof BRAND_CONFIG.colors;
export type BrandTypography = typeof BRAND_CONFIG.typography;

// VALIDATION HELPERS
export function validateBrandCompliance(_element: unknown): boolean {
  // Add validation logic to ensure brand guidelines are followed
  return true;
}

export function getBrandColor(colorKey: keyof BrandColors): string {
  return BRAND_CONFIG.colors[colorKey];
}

export function getBrandFont(element: 'troves' | 'coves' | 'body' | 'heading'): string {
  return BRAND_CONFIG.typography[element].fontFamily;
}