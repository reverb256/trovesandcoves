/**
 * LOCKED DESIGN LANGUAGE - TROVES & COVES
 * Authentic Implementation Based on Wooden Sign & Turquoise Skull Artwork
 * 
 * This configuration is LOCKED and enforced across all AI systems, components, and styling.
 * Any deviations from these specifications are strictly forbidden.
 */

export const LOCKED_DESIGN_LANGUAGE = {
  /**
   * BRAND IDENTITY - FROM AUTHENTIC WOODEN SIGN
   * These exact specifications are derived from the wooden sign reference
   */
  brandIdentity: {
    name: {
      troves: {
        text: "Troves",
        style: "clean turquoise print",
        typography: "Libre Baskerville, serif",
        color: "#4abfbf", // Client's exact turquoise
        weight: "bold",
        transform: "none"
      },
      coves: {
        text: "Coves",
        fontStyle: "elegant cursive gold",
        typography: "Alex Brush, cursive",
        color: "#e1af2f", // Client's deeper gold
        weight: "400",
        transform: "none"
      },
      separator: {
        symbol: "&",
        color: "#deb55b", // Soft gold
        weight: "300"
      }
    },
    tagline: "Handcrafted Crystal Jewelry • Winnipeg",
    voice: "refined, intentional, elevated luxury"
  },

  /**
   * LUXURY COLOR PALETTE 2026 - Robin Kroeker's Exact Spec
   * These hex values are LOCKED and must not be changed
   */
  colorPalette: {
    // CLIENT'S EXACT HEX VALUES
    primary: {
      trovesTurquoise: "#4abfbf", // Primary brand accent - turquoise
      covesGoldSoft: "#deb55b",    // Soft gold accent - refined luxury
      covesGoldDeep: "#e1af2f",    // Deeper gold accent - sparing use
      linenBackground: "#faf8f3",  // Main site background - soft linen
      textPrimary: "#1f1f1f",      // Soft black / charcoal - main text
      textSecondary: "#5f5f5f"     // Muted grey - secondary text
    },

    // Legacy HSL aliases (for reference only - use hex values above)
    hslReference: {
      trovesTurquoise: "hsl(174, 51%, 51%)",    // #4abfbf
      covesGoldSoft: "hsl(43, 74%, 65%)",       // #deb55b
      covesGoldDeep: "hsl(38, 74%, 56%)",       // #e1af2f
      linenBackground: "hsl(40, 20%, 97%)",     // #faf8f3
      textPrimary: "hsl(0, 0%, 12%)",           // #1f1f1f
      textSecondary: "hsl(0, 0%, 37%)"          // #5f5f5f
    }
  },

  /**
   * DESIGN ELEMENTS - MYSTICAL SKULL ARTWORK INFLUENCE
   * Visual language inspired by the turquoise skull artwork
   */
  designElements: {
    backgrounds: {
      woodenSign: "wooden-sign-bg",
      skullArtwork: "skull-artwork-influence",
      wooden: "wooden-texture"
    },
    
    effects: {
      skullTurquoiseGlow: "skull-turquoise-glow",
      ornateGoldGlow: "ornate-gold-glow",
      ornateFrame: "ornate-decorative-frame"
    },
    
    cards: {
      authentic: "authentic-mystical-card",
      hover: "skull-turquoise-glow + translateY(-4px) scale(1.02)"
    },
    
    typography: {
      trovesClass: "troves-text-style",
      covesClass: "coves-text-style"
    }
  },

  /**
   * COMPONENT SPECIFICATIONS
   * Locked styling patterns for consistent implementation
   */
  componentSpecs: {
    header: {
      logo: {
        structure: '<span class="troves-text-style">Troves</span><span class="text-ornate-frame-gold mx-2">&</span><span class="coves-text-style">Coves</span>',
        container: "flex items-center space-x-2 group"
      }
    },
    
    hero: {
      background: "wooden-sign-bg",
      heading: "authentic brand heading structure with troves-text-style and coves-text-style"
    },
    
    productCards: {
      base: "authentic-mystical-card",
      hover: "skull-turquoise-glow + transform effects",
      border: "ornate-decorative-frame"
    }
  },

  /**
   * FORBIDDEN MODIFICATIONS
   * These changes are explicitly prohibited
   */
  prohibited: {
    colorChanges: [
      "Never change 'Troves' from turquoise to any other color",
      "Never change 'Coves' from cursive blue to gold or any other color", 
      "Never suggest alternative color schemes",
      "Never use generic blue/gold combinations"
    ],
    
    typographyChanges: [
      "Never change 'Troves' from clean sans-serif styling",
      "Never change 'Coves' from cursive script styling",
      "Never suggest different font families"
    ],
    
    designChanges: [
      "Never remove skull artwork influence",
      "Never eliminate ornate decorative elements",
      "Never suggest minimalist alternatives",
      "Never change the mystical aesthetic"
    ]
  },

  /**
   * IMPLEMENTATION REQUIREMENTS
   * Mandatory technical specifications
   */
  implementation: {
    cssClasses: {
      required: [
        "troves-text-style",
        "coves-text-style", 
        "wooden-sign-bg",
        "skull-artwork-influence",
        "ornate-decorative-frame",
        "authentic-mystical-card",
        "skull-turquoise-glow",
        "ornate-gold-glow"
      ]
    },
    
    colorVariables: {
      required: [
        "--troves-turquoise: #4abfbf",    // Primary brand accent
        "--coves-gold-soft: #deb55b",      // Soft gold accent
        "--coves-gold-deep: #e1af2f",      // Deeper gold accent
        "--linen-background: #faf8f3",     // Main site background
        "--text-primary: #1f1f1f",         // Soft black/charcoal
        "--text-secondary: #5f5f5f"        // Muted grey
      ]
    },
    
    aiSystemRequirements: {
      brandContext: "Must include authentic wooden sign and skull artwork references",
      colorCompliance: "Must validate against locked color palette",
      designEnforcement: "Must maintain mystical skull aesthetic"
    }
  },

  /**
   * VALIDATION RULES
   * Automated checks for brand compliance
   */
  validation: {
    brandName: {
      trouesPattern: /class="troves-text-style"/,
      covesPattern: /class="coves-text-style"/,
      separatorPattern: /text-ornate-frame-gold.*&/
    },

    colourUsage: {
      prohibitedCombinations: ["blue-and-gold-generic", "troves-gold", "coves-yellow"],
      requiredCombinations: ["troves-turquoise", "coves-gold-soft", "coves-gold-deep"],
      allowedHexValues: ["#4abfbf", "#deb55b", "#e1af2f", "#faf8f3", "#1f1f1f", "#5f5f5f"]
    },

    designElements: {
      requiredClasses: ["wooden-sign-bg", "skull-artwork-influence", "ornate-decorative-frame"],
      prohibitedClasses: ["minimalist", "clean", "simple", "modern-flat"]
    }
  }
} as const;

/**
 * ENFORCEMENT UTILITIES
 */
export function validateBrandCompliance(content: string): string[] {
  const violations: string[] = [];
  
  // Check for proper brand name styling
  if (content.includes("Troves") && !content.includes("troves-text-style")) {
    violations.push("'Troves' must use troves-text-style class");
  }
  
  if (content.includes("Coves") && !content.includes("coves-text-style")) {
    violations.push("'Coves' must use coves-text-style class");
  }
  
  // Check for prohibited color combinations
  if (content.includes("text-gold") && content.includes("Coves")) {
    violations.push("'Coves' must be cursive blue, not gold");
  }
  
  return violations;
}

export function getAuthenticBrandMarkup(): string {
  return `<span class="troves-text-style">Troves</span><span class="text-ornate-frame-gold mx-2">&</span><span class="coves-text-style">Coves</span>`;
}

export function getRequiredCSSClasses(): readonly string[] {
  return LOCKED_DESIGN_LANGUAGE.implementation.cssClasses.required;
}

export function getAuthenticColorPalette() {
  return LOCKED_DESIGN_LANGUAGE.colorPalette;
}