// Authentic Troves and Coves Product Catalog
// Based on actual Etsy inventory and jewelry images provided

export const authenticProducts = [
  {
    id: 1,
    name: "Lepidolite 14k Gold Filled Necklace, Curb Chain, Upcycled Flower Pendant, Wire Wrapped",
    description: "Wire-wrapped lepidolite crystal featuring an upcycled magnolia flower pendant on 14k gold filled curb chain. Promotes peace, nurturing, and mood stabilization. Handcrafted in Winnipeg with authentic materials.",
    price: 9000, // $90.00 CAD (matching Etsy)
    categorySlug: "crystal-necklaces",
    sku: "TC-LEP-FLOWER-001",
    stockQuantity: 1,
    featured: true,
    tags: ["lepidolite", "14k-gold-filled", "wire-wrapped", "magnolia", "upcycled", "curb-chain", "peace", "nurturing", "mood-stabilizing"],
    materials: ["14k Gold Filled Wire", "Lepidolite Crystal", "Upcycled Enamel Pendant", "14k Gold Filled Curb Chain"],
    gemstones: ["Lepidolite - peace, nurturing, mood stabilizing, emotional balance"],
    metaphysicalProperties: "Lepidolite is known as the 'grandmother stone' for its nurturing, calming energy. Helps with stress relief, emotional balance, and peaceful sleep."
  },
  {
    id: 2,
    name: "Unique Turquoise Beaded Necklace, Pearl Strung, Lapis Lazuli, Pink Pearl, Hematite, Leaf",
    description: "One-of-a-kind handmade necklace featuring turquoise beads, pearls, lapis lazuli, pink pearls, hematite, and gold filled leaf pendant. Each piece is completely unique and made with love in Winnipeg.",
    price: 7000, // $70.00 CAD (matching Etsy)
    categorySlug: "crystal-necklaces", 
    sku: "TC-TUR-UNIQUE-002",
    stockQuantity: 1,
    featured: true,
    tags: ["turquoise", "pearl", "lapis-lazuli", "pink-pearl", "hematite", "gold-filled", "leaf", "handmade", "one-of-a-kind"],
    materials: ["Turquoise Beads", "Natural Pearls", "Lapis Lazuli", "Pink Pearls", "Hematite", "Gold Filled Leaf Pendant"],
    gemstones: ["Turquoise - protection, healing", "Lapis Lazuli - wisdom, truth", "Hematite - grounding, strength"],
    metaphysicalProperties: "Turquoise offers protection and healing, lapis lazuli enhances wisdom and communication, while hematite provides grounding energy."
  },
  {
    id: 3,
    name: "Pretty Handwrapped Citrine, Pearl, Hematite, Crystal Necklace",
    description: "Elegant handwrapped citrine crystal with pearls and hematite. Perfect gift for her - mothers, girlfriends, sisters for birthdays and special occasions. Promotes abundance and joy.",
    price: 20000, // $200.00 CAD (matching Etsy)
    categorySlug: "crystal-necklaces",
    sku: "TC-CIT-HANDWRAP-003", 
    stockQuantity: 1,
    featured: true,
    tags: ["citrine", "handwrapped", "pearl", "hematite", "crystal", "gift", "mothers", "birthday", "special-occasion"],
    materials: ["Natural Citrine", "Freshwater Pearls", "Hematite Beads", "Gold Wire Wrapping"],
    gemstones: ["Citrine - abundance, manifestation, joy", "Hematite - grounding, protection"],
    metaphysicalProperties: "Citrine is the stone of abundance and manifestation, bringing joy and positive energy while hematite provides grounding and protection."
  },
  {
    id: 4,
    name: "Upcycled Gold Plated Enamel Pendant, 14k Gold Filled Necklace, Chain, 18KGF Lobster Clasp, Citrine, Peridot, Good Fortune, Lucky, Confident",
    description: "Sacred transformation of vintage enamel flower into divine talisman. This ethereal piece channels ancient wisdom through sustainable upcycling, adorned with luminous citrine for manifestation and peridot for heart healing. The sacred white magnolia blossom represents purity, nobility, and spiritual awakening.",
    price: 8500, // $85.00 CAD (updated price)
    categorySlug: "crystal-necklaces",
    sku: "TC-UPC-ENA-001",
    stockQuantity: 1,
    featured: true,
    tags: ["upcycled", "gold-plated", "enamel", "14k-gold-filled", "citrine", "peridot", "good-fortune", "lucky", "confident", "magnolia", "sustainable"],
    materials: ["14k Gold Filled", "Gold Plated Enamel", "18KGF", "Citrine", "Peridot"],
    gemstones: ["Citrine - manifestation, abundance", "Peridot - heart healing, renewal"],
    metaphysicalProperties: "Sacred white magnolia represents purity and spiritual awakening. Citrine manifests abundance and confidence while peridot opens the heart to divine love and healing transformation."
  },
  {
    id: 5,
    name: "Wire Wrapped Lapis Lazuli Pendant with Beaded Necklace",
    description: "Beautiful wire wrapped lapis lazuli pendant with turquoise and obsidian beading. Features a brass square accent for geometric balance. Enhances wisdom, truth, and spiritual insight.",
    price: 8500, // $85.00 CAD
    categorySlug: "wire-wrapped",
    sku: "TC-LAPIS-WIRE-005",
    stockQuantity: 1,
    featured: true,
    tags: ["lapis-lazuli", "wire-wrapped", "turquoise", "obsidian", "brass", "wisdom", "truth", "spiritual"],
    materials: ["Lapis Lazuli", "Copper Wire Wrapping", "Turquoise Beads", "Obsidian Beads", "Brass Square Accent"],
    gemstones: ["Lapis Lazuli - wisdom, truth, royal energy", "Turquoise - protection", "Obsidian - grounding"],
    metaphysicalProperties: "Lapis lazuli has been treasured since ancient times for enhancing wisdom, truth, and spiritual insight. Combined with protective turquoise and grounding obsidian."
  },
  {
    id: 6,
    name: "Raw Pink Crystal Wire Wrapped Pendant",
    description: "Delicate raw pink crystal (likely rose quartz or pink tourmaline) wrapped in copper wire on leather cord. Perfect for heart chakra healing and promoting self-love and compassion.",
    price: 6500, // $65.00 CAD
    categorySlug: "wire-wrapped",
    sku: "TC-PINK-RAW-006",
    stockQuantity: 1,
    featured: false,
    tags: ["raw-crystal", "pink", "wire-wrapped", "copper", "leather-cord", "heart-chakra", "self-love", "compassion"],
    materials: ["Raw Pink Crystal", "Copper Wire", "Leather Cord"],
    gemstones: ["Pink Crystal - love, compassion, emotional healing"],
    metaphysicalProperties: "Pink crystals are deeply connected to the heart chakra, promoting self-love, compassion, and emotional healing."
  },
  {
    id: 7,
    name: "Pearl and Citrine Bracelet with Gold Accents",
    description: "Elegant bracelet combining cream pearls with golden citrine chips and gold-toned spacer beads. Perfect for layering or wearing alone. Brings abundance and elegance to any outfit.",
    price: 5500, // $55.00 CAD
    categorySlug: "bracelets",
    sku: "TC-PEARL-CIT-BRAC-007",
    stockQuantity: 2,
    featured: false,
    tags: ["pearl", "citrine", "bracelet", "gold-accents", "abundance", "elegance", "layering"],
    materials: ["Freshwater Pearls", "Citrine Chips", "Gold-toned Spacer Beads", "Elastic Cord"],
    gemstones: ["Pearls - purity, wisdom", "Citrine - abundance, joy"],
    metaphysicalProperties: "Pearls bring wisdom and purity while citrine attracts abundance and joy. A perfect combination for prosperity and elegance."
  },
  {
    id: 8,
    name: "Coral Rose and Pearl Bracelet",
    description: "Delicate bracelet featuring coral rose accent with cream and grey pearls. Soft, feminine energy perfect for gentle healing and emotional balance.",
    price: 4500, // $45.00 CAD  
    categorySlug: "bracelets",
    sku: "TC-CORAL-PEARL-008",
    stockQuantity: 1,
    featured: false,
    tags: ["coral-rose", "pearl", "bracelet", "feminine", "healing", "emotional-balance", "gentle"],
    materials: ["Coral Rose Accent", "Cream Pearls", "Grey Pearls", "Elastic Cord"],
    gemstones: ["Coral - emotional healing", "Pearls - calming, wisdom"],
    metaphysicalProperties: "Coral promotes emotional healing and balance, while pearls provide calming energy and inner wisdom."
  },
  {
    id: 9,
    name: "Howlite and Smoky Quartz Bracelet",
    description: "Grounding bracelet combining white howlite with smoky quartz and bronze accents. Perfect for stress relief, calming anxiety, and maintaining emotional balance throughout the day.",
    price: 5000, // $50.00 CAD
    categorySlug: "bracelets", 
    sku: "TC-HOWL-SMOKY-009",
    stockQuantity: 1,
    featured: false,
    tags: ["howlite", "smoky-quartz", "bronze", "grounding", "stress-relief", "anxiety", "emotional-balance"],
    materials: ["White Howlite", "Smoky Quartz", "Bronze Spacer Beads", "Elastic Cord"],
    gemstones: ["Howlite - calming, stress relief", "Smoky Quartz - grounding, protection"],
    metaphysicalProperties: "Howlite is excellent for calming anger and stress, while smoky quartz provides grounding and releases negative energy."
  }
];

export const authenticCategories = [
  {
    id: 1,
    name: "Crystal Necklaces",
    slug: "crystal-necklaces",
    description: "Handcrafted crystal necklaces featuring authentic gemstones, wire wrapping, and sustainable materials. Each piece is designed to enhance your natural energy and personal style."
  },
  {
    id: 2,
    name: "Healing Crystals",
    slug: "healing-crystals",
    description: "Carefully selected healing crystals and gemstone jewelry designed to support your wellness journey. Each piece includes information about metaphysical properties and care instructions."
  },
  {
    id: 3,
    name: "Wire Wrapped",
    slug: "wire-wrapped",
    description: "Artisan wire wrapped crystal pendants and jewelry pieces. Each crystal is hand-selected and wrapped with precision using high-quality metals for durability and beauty."
  },
  {
    id: 4,
    name: "Bracelets",
    slug: "bracelets", 
    description: "Crystal and gemstone bracelets perfect for daily wear or special occasions. Designed for comfort and style while providing the metaphysical benefits of authentic crystals."
  }
];