/**
 * Embedded product data for production GitHub Pages deployment
 * This data is bundled with the frontend to avoid needing a separate API server
 *
 * Uses actual product photography from client/public/images/jewelry/
 */

import type { Product, Category, ProductWithCategory } from './types';

// Categories data (matches server/storage.ts seed data)
export const EMBEDDED_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Crystal Necklaces",
    slug: "crystal-necklaces",
    description: "Divine crystal necklaces channeling celestial energy through sacred gemstone alchemy. Each piece amplifies intention and manifestation while enhancing your unique presence.",
    imageUrl: "/images/jewelry/lepidolite-necklace-1.png"
  },
  {
    id: 2,
    name: "Healing Crystals",
    slug: "healing-crystals",
    description: "Sacred healing crystals selected for their energetic properties and spiritual significance. Each stone carries ancient wisdom and transformative power.",
    imageUrl: "/images/jewelry/gold-chain-crystal-1.png"
  },
  {
    id: 3,
    name: "Wire Wrapped Jewelry",
    slug: "wire-wrapped",
    description: "Hand-wrapped wire crystal jewelry crafted with mindful intention. Each piece combines raw crystal beauty with artistic wirework to create unique talismans.",
    imageUrl: "/images/jewelry/citrine-necklace-set-1.png"
  }
];

// Products data (matches server/storage.ts seed data)
export const EMBEDDED_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Wire Wrapped Crystal Pendant Collection",
    description: "Sacred collection of divine crystal pendants featuring lepidolite for tranquility, obsidian for protection, and citrine for manifestation. Each stone is lovingly wire-wrapped with golden intention, creating powerful talismans for spiritual awakening.",
    price: "90.00",
    categoryId: 1,
    imageUrl: "/images/jewelry/lepidolite-necklace-1.png",
    imageUrls: [
      "/images/jewelry/lepidolite-necklace-1.png",
      "/images/jewelry/lepidolite-flower-front-1.png",
      "/images/jewelry/lepidolite-flower-side-1.png",
      "/images/jewelry/lepidolite-flower-flat-1.png",
      "/images/jewelry/lepidolite-flower-hand-1.png"
    ],
    sku: "TC-LEP-001",
    stockQuantity: 1,
    weight: "25g",
    materials: ["Wire wrap", "Gold filled", "Stone"],
    gemstones: ["Lepidolite", "Obsidian", "Citrine"],
    careInstructions: "Honor these sacred talismans with moonlight cleansing and sage blessing. Store in sacred space away from harsh energies.",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2025-01-01")
  },
  {
    id: 2,
    name: "Gold Chain Crystal Necklace with Wire Wrapped Pendant",
    description: "Luminous gold chain adorned with sacred crystal pendant, lovingly wire-wrapped to channel divine energy. This celestial piece features a delicate crystal suspended in golden embrace.",
    price: "70.00",
    categoryId: 1,
    imageUrl: "/images/jewelry/gold-chain-crystal-1.png",
    imageUrls: ["/images/jewelry/gold-chain-crystal-1.png"],
    sku: "TC-TUR-001",
    stockQuantity: 1,
    weight: "30g",
    materials: ["Gold Filled", "Wire wrap", "Crystal"],
    gemstones: ["Clear Quartz"],
    careInstructions: "Protect from water's harsh embrace - honor your divine vessel's sacred materials.",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2025-01-02")
  },
  {
    id: 3,
    name: "Handwrapped Citrine, Pearl, Hematite, Crystal Necklace Set",
    description: "Divine twin vessel set channeling abundant solar manifestation through sacred citrine alchemy! The ethereal choker embraces throat chakra consciousness with luminous pink pearls and protective hematite grounding.",
    price: "200.00",
    categoryId: 2,
    imageUrl: "/images/jewelry/citrine-necklace-set-1.png",
    imageUrls: [
      "/images/jewelry/citrine-necklace-set-1.png",
      "/images/jewelry/citrine-pearl-set-full-1.png",
      "/images/jewelry/citrine-pearl-detail-1.png",
      "/images/jewelry/citrine-pearl-choker-1.png",
      "/images/jewelry/citrine-pearl-pendant-1.png",
      "/images/jewelry/citrine-flower-detail-1.png"
    ],
    sku: "TC-CIT-SET-001",
    stockQuantity: 1,
    weight: "45g",
    materials: ["Citrine", "Pearl strung", "Gold filled", "14k", "14k gold filled", "Pearl", "Hematite"],
    gemstones: ["Citrine", "Hematite", "Pearl"],
    careInstructions: "Honor with gentle reverence. Protect from moisture's harsh energy.",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2025-01-03")
  },
  {
    id: 4,
    name: "Lapis Lazuli, Wire Wrapped Necklace, Leather",
    description: "Sacred Lapis Lazuli vessel channeling ancient Egyptian royal consciousness through celestial blue depths. This divine talisman awakens third eye perception and psychic gifts. 15 inches of divine armor.",
    price: "40.00",
    categoryId: 3,
    imageUrl: "/images/jewelry/lapis-black-cord-1.png",
    imageUrls: [
      "/images/jewelry/lapis-black-cord-1.png",
      "/images/jewelry/authentic-lapis-pendant-1.png"
    ],
    sku: "TC-LAP-001",
    stockQuantity: 1,
    weight: "20g",
    materials: ["Leather", "Stone"],
    gemstones: ["Lapis Lazuli"],
    careInstructions: "Protect from water's harsh energy and chemical disruption.",
    isActive: true,
    isFeatured: false,
    createdAt: new Date("2025-01-04")
  },
  {
    id: 5,
    name: "Medium Rose Quartz Pendant, Wire Wrapped",
    description: "Divine Rose Quartz talisman on sacred brown leather cord. Embrace the infinite loving vibrations of this ethereal piece featuring a raw Rose Quartz pendant blessed with healing light. 18 inches.",
    price: "40.00",
    categoryId: 3,
    imageUrl: "/images/jewelry/authentic-rose-quartz-1.png",
    imageUrls: [
      "/images/jewelry/authentic-rose-quartz-1.png"
    ],
    sku: "TC-ROS-001",
    stockQuantity: 1,
    weight: "22g",
    materials: ["Leather", "Stone"],
    gemstones: ["Rose Quartz"],
    careInstructions: "Honor with gentle sacred touch. Shield from harsh chemical energies.",
    isActive: true,
    isFeatured: false,
    createdAt: new Date("2025-01-05")
  },
  {
    id: 6,
    name: "Lapis Lazuli, Brown Leather, Masculine Necklace",
    description: "Sacred masculine vessel channeling ancient pharaoh consciousness through divine Lapis Lazuli depths. This handcrafted talisman awakens inner king sovereignty. 26 inches of sacred masculine power.",
    price: "40.00",
    categoryId: 3,
    imageUrl: "/images/jewelry/lapis-leather-flower-display-1.png",
    imageUrls: [
      "/images/jewelry/lapis-leather-flower-display-1.png",
      "/images/jewelry/lapis-leather-flower-close-1.png",
      "/images/jewelry/lapis-leather-worn-1.png",
      "/images/jewelry/lapis-leather-worn-close-1.png"
    ],
    sku: "TC-LAP-MEN-001",
    stockQuantity: 1,
    weight: "25g",
    materials: ["Leather", "Stone"],
    gemstones: ["Lapis Lazuli"],
    careInstructions: "Honor leather's sacred nature - protect from water's embrace.",
    isActive: true,
    isFeatured: false,
    createdAt: new Date("2025-01-06")
  },
  {
    id: 7,
    name: "Unique Lapis Lazuli, Onyx, Smoky Quartz Multi-Stone Necklace",
    description: "Sacred five-stone harmony vessel weaving celestial wisdom through divine gemstone alchemy. Lapis Lazuli awakens third eye consciousness while Smoky Quartz grounds protective earthen energy.",
    price: "80.00",
    categoryId: 2,
    imageUrl: "/images/jewelry/lapis-mixed-stones-full-length-1.png",
    imageUrls: [
      "/images/jewelry/lapis-mixed-stones-full-length-1.png",
      "/images/jewelry/lapis-mixed-stones-flower-display-1.png",
      "/images/jewelry/lapis-mixed-stones-frame-display-1.png",
      "/images/jewelry/lapis-mixed-stones-frame-side-1.png",
      "/images/jewelry/lapis-mixed-stones-pendant-detail-1.png",
      "/images/jewelry/lapis-mixed-stones-pendant-close-1.png"
    ],
    sku: "TC-LAP-ONY-001",
    stockQuantity: 1,
    weight: "35g",
    materials: ["Stone"],
    gemstones: ["Lapis Lazuli", "Onyx", "Smoky Quartz", "Jade", "Lava Stone"],
    careInstructions: "Sacred lava stone absorbs blessed essential oils for enhanced spiritual practice.",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2025-01-07")
  },
  {
    id: 8,
    name: "Turquoise Beaded Necklace with Pearl Accents",
    description: "Sacred oceanic symphony vessel weaving ancient turquoise protection with celestial lapis wisdom. Divine turquoise channels protective fortune while enhancing sacred communication. 21 inches of divine protection.",
    price: "70.00",
    categoryId: 1,
    imageUrl: "/images/jewelry/turquoise-beaded-frame-display-1.png",
    imageUrls: [
      "/images/jewelry/turquoise-beaded-frame-display-1.png",
      "/images/jewelry/turquoise-beaded-flower-detail-1.png",
      "/images/jewelry/turquoise-beaded-flower-full-1.png",
      "/images/jewelry/turquoise-beaded-flat-layout-1.png",
      "/images/jewelry/turquoise-beaded-clasp-detail-1.png",
      "/images/jewelry/turquoise-beaded-worn-1.png"
    ],
    sku: "TC-TUR-BEAD-001",
    stockQuantity: 1,
    weight: "32g",
    materials: ["Stone", "Turquoise", "Lapis Lazuli", "Pink Pearl", "Hematite", "Gold Filled"],
    gemstones: ["Turquoise", "Lapis Lazuli", "Hematite", "Pink Pearl"],
    careInstructions: "Shield from water's harsh energy. Honor pearls with gentle reverence.",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2025-01-08")
  },
  {
    id: 9,
    name: "Upcycled Gold Plated Enamel Pendant Necklace",
    description: "Sacred alchemical transformation vessel born from upcycled enamel flower consciousness into divine stationary pendant power. Peridot channels heart prosperity while citrine ignites solar confidence manifestation.",
    price: "80.00",
    categoryId: 1,
    imageUrl: "/images/jewelry/gold-enamel-flower-1.png",
    imageUrls: [
      "/images/jewelry/gold-enamel-flower-1.png",
      "/images/jewelry/gold-enamel-flower-2.png",
      "/images/jewelry/gold-enamel-full-chain-1.png"
    ],
    sku: "TC-UPC-ENA-001",
    stockQuantity: 1,
    weight: "18g",
    materials: ["14k Gold Filled", "Gold Plated Enamel", "18KGF", "5mm Curb Chain"],
    gemstones: ["Citrine", "Peridot"],
    careInstructions: "Shield from water's harsh embrace to honor sacred longevity.",
    isActive: true,
    isFeatured: true,
    createdAt: new Date("2025-01-09")
  }
];

// Helper functions to work with embedded data
export function getEmbeddedCategories(): Category[] {
  return EMBEDDED_CATEGORIES;
}

export function getEmbeddedProducts(categoryId?: number): ProductWithCategory[] {
  let products = EMBEDDED_PRODUCTS.filter(p => p.isActive);

  if (categoryId) {
    products = products.filter(p => p.categoryId === categoryId);
  }

  return products.map(product => ({
    ...product,
    category: product.categoryId ? EMBEDDED_CATEGORIES.find(c => c.id === product.categoryId) : undefined
  }));
}

export function getEmbeddedProduct(id: number): ProductWithCategory | undefined {
  const product = EMBEDDED_PRODUCTS.find(p => p.id === id);
  if (!product) return undefined;

  return {
    ...product,
    category: product.categoryId ? EMBEDDED_CATEGORIES.find(c => c.id === product.categoryId) : undefined
  };
}

export function getEmbeddedFeaturedProducts(): ProductWithCategory[] {
  return EMBEDDED_PRODUCTS
    .filter(p => p.isActive && p.isFeatured)
    .map(product => ({
      ...product,
      category: product.categoryId ? EMBEDDED_CATEGORIES.find(c => c.id === product.categoryId) : undefined
    }));
}

export function searchEmbeddedProducts(query: string): ProductWithCategory[] {
  const lowerQuery = query.toLowerCase();
  return EMBEDDED_PRODUCTS
    .filter(p =>
      p.isActive &&
      (p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.materials?.some(m => m.toLowerCase().includes(lowerQuery)) ||
        p.gemstones?.some(g => g.toLowerCase().includes(lowerQuery)))
    )
    .map(product => ({
      ...product,
      category: product.categoryId ? EMBEDDED_CATEGORIES.find(c => c.id === product.categoryId) : undefined
    }));
}
