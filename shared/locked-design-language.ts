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
        typography: "Source Sans Pro, sans-serif",
        color: "hsl(174, 70%, 45%)", // Exact from wooden sign
        weight: "bold",
        transform: "none"
      },
      coves: {
        text: "Coves", 
        style: "elegant cursive blue",
        typography: "Dancing Script, cursive",
        color: "hsl(200, 60%, 45%)", // Exact from wooden sign
        weight: "600",
        style: "italic"
      },
      separator: {
        symbol: "&",
        color: "hsl(43, 85%, 60%)", // Ornate frame gold
        weight: "300"
      }
    },
    tagline: "Mystical Crystal Jewelry • Winnipeg",
    voice: "mystical, spiritual, authentic crystal healing wisdom"
  },

  /**
   * AUTHENTIC COLOR PALETTE
   * Derived directly from wooden sign and turquoise skull artwork
   */
  colorPalette: {
    // Primary brand colors from wooden sign
    primary: {
      trovesTurquoise: "hsl(174, 70%, 45%)",
      covesCursiveBlue: "hsl(200, 60%, 45%)",
      woodGrain: "hsl(35, 40%, 70%)"
    },
    
    // Mystical skull artwork accent colors
    accent: {
      skullTurquoise: "hsl(174, 100%, 50%)",
      ornateFrameGold: "hsl(43, 85%, 60%)",
      crystalAccents: "hsl(240, 20%, 95%)"
    },
    
    // Supporting natural palette
    supporting: {
      naturalWood: "hsl(35, 30%, 65%)",
      pearlCream: "hsl(45, 25%, 92%)",
      mysticAccent: "hsl(280, 40%, 65%)"
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
        "--troves-turquoise: 174 70% 45%",
        "--coves-cursive-blue: 200 60% 45%", 
        "--wood-grain: 35 40% 70%",
        "--skull-turquoise: 174 100% 50%",
        "--ornate-frame-gold: 43 85% 60%",
        "--crystal-accents: 240 20% 95%"
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
      requiredCombinations: ["troves-turquoise", "coves-cursive-blue"]
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

export function getRequiredCSSClasses(): string[] {
  return LOCKED_DESIGN_LANGUAGE.implementation.cssClasses.required;
}

export function getAuthenticColorPalette() {
  return LOCKED_DESIGN_LANGUAGE.colorPalette;
}