import {
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct, type ProductWithCategory,
  type CartItem, type InsertCartItem, type CartItemWithProduct,
  type Order, type InsertOrder, type OrderWithItems,
  type OrderItem, type InsertOrderItem,
  type ContactSubmission, type InsertContactSubmission,
  type NewsletterSubscription, type InsertNewsletterSubscription,
  type IStorage
} from "@shared/types";
import { crystalJewelryImages, categoryDescriptions } from "./mock-data";
import { ETSY_PRODUCTS } from "./seed-etsy-products";

// Re-export IStorage for convenience
export type { IStorage } from "@shared/types";

// Local storage interface for MemStorage class implementation

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private contactSubmissions: Map<number, ContactSubmission>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;

  private currentUserId: number;
  private currentCategoryId: number;
  private currentProductId: number;
  private currentCartItemId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentContactId: number;
  private currentNewsletterId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.contactSubmissions = new Map();
    this.newsletterSubscriptions = new Map();

    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentContactId = 1;
    this.currentNewsletterId = 1;

    this.seedData();
  }

  private seedData() {
    // Product categories featuring authentic crystal jewelry collections
    const crystalNecklacesCategory: Category = {
      id: this.currentCategoryId++,
      name: "Crystal Necklaces",
      slug: "crystal-necklaces",
      description: "Handcrafted crystal necklaces featuring authentic gemstones and wire wrapping.",
      imageUrl: crystalJewelryImages.lepidolite[0]
    };
    
    const gemstoneNecklacesCategory: Category = {
      id: this.currentCategoryId++,
      name: "Gemstone Necklaces",
      slug: "gemstone-necklaces",
      description: "Elegant gemstone necklaces with premium materials and refined craftsmanship.",
      imageUrl: crystalJewelryImages.turquoise[0]
    };

    const leatherCordCategory: Category = {
      id: this.currentCategoryId++,
      name: "Leather Cord Pendants",
      slug: "leather-cord-pendants",
      description: "Artisan leather cord pendants showcasing natural crystals and stones.",
      imageUrl: crystalJewelryImages.citrine[0]
    };

    this.categories.set(crystalNecklacesCategory.id, crystalNecklacesCategory);
    this.categories.set(gemstoneNecklacesCategory.id, gemstoneNecklacesCategory);
    this.categories.set(leatherCordCategory.id, leatherCordCategory);

    // Authentic product inventory from TrovesandCoves Etsy store
    const lepidoliteNecklace: Product = {
      id: this.currentProductId++,
      name: "Wire Wrapped Crystal Pendant Collection",
      description: "A curated collection of wire-wrapped crystal pendants featuring lepidolite, obsidian, and citrine. Each stone is hand-wrapped with 14k gold-filled wire, creating unique statement pieces. Lepidolite offers calming purple tones, obsidian provides grounding contrast, and citrine adds warm golden highlights. Handcrafted with attention to detail, each necklace is one of a kind.",
      price: "90.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.lepidolite[0],
      imageUrls: crystalJewelryImages.lepidolite,
      sku: "TC-LEP-001",
      stockQuantity: 1,
      weight: "25g",
      materials: ["Wire wrap", "Gold filled", "Stone"],
      gemstones: ["Lepidolite", "Obsidian", "Citrine"],
      careInstructions: "Clean gently with a soft cloth. Store separately to prevent scratching and protect the wire wrapping.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const turquoiseBeadedNecklace: Product = {
      id: this.currentProductId++,
      name: "Gold Chain Crystal Necklace with Wire Wrapped Pendant",
      description: "A delicate gold chain necklace featuring a wire-wrapped clear quartz pendant. The crystal is hand-wrapped in 14k gold-filled wire, suspended from a dainty chain that catches the light beautifully. A refined piece perfect for everyday elegance or special occasions.",
      price: "70.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.turquoise[0],
      imageUrls: crystalJewelryImages.turquoise,
      sku: "TC-TUR-001",
      stockQuantity: 1,
      weight: "30g",
      materials: ["Gold Filled", "Wire wrap", "Crystal"],
      gemstones: ["Clear Quartz"],
      careInstructions: "Keep dry and polish gently with a soft cloth. Store separately to prevent scratching.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const citrineNecklace: Product = {
      id: this.currentProductId++,
      name: "Citrine, Pearl, and Hematite Necklace Set",
      description: "An elegant two-piece set featuring a choker and longer necklace. The choker combines luminous pearls with hematite accents, while the companion necklace showcases wire-wrapped citrine stones interspersed with pearls and hematite. Warm golden tones complement the refined sterling silver and gold-filled components.",
      price: "200.00",
      categoryId: gemstoneNecklacesCategory.id,
      imageUrl: crystalJewelryImages.citrine[0],
      imageUrls: crystalJewelryImages.citrine,
      sku: "TC-CIT-SET-001",
      stockQuantity: 1,
      weight: "45g",
      materials: ["Citrine", "Pearl strung", "Gold filled", "14k", "14k gold filled", "Pearl", "Hematite", "EMF protecting", "Crystal", "Stone", "Mineral"],
      gemstones: ["Citrine", "Hematite", "Pearl"],
      careInstructions: "Keep dry and clean gently with a soft cloth. Store in a jewelry box or pouch.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const lapisLazuliPendant: Product = {
      id: this.currentProductId++,
      name: "Lapis Lazuli Wire Wrapped Pendant on Leather Cord",
      description: "A striking lapis lazuli pendant hand-wrapped and suspended from a brown leather cord. The deep blue stone naturally speckled with pyrite creates a bold, architectural statement. The 15-inch leather cord with a simple closure gives this piece an earthy, refined quality.",
      price: "40.00",
      categoryId: leatherCordCategory.id,
      imageUrl: crystalJewelryImages.lapisLazuli[0],
      imageUrls: crystalJewelryImages.lapisLazuli,
      sku: "TC-LAP-001",
      stockQuantity: 1,
      weight: "20g",
      materials: ["Leather", "Stone"],
      gemstones: ["Lapis Lazuli"],
      careInstructions: "Remove before water exposure. Store in a soft cloth pouch to protect the leather.",
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
    };

    const roseQuartzPendant: Product = {
      id: this.currentProductId++,
      name: "Medium Rose Quartz Pendant, Wire Wrapped, Brown Leather",
      description: "A soft pink rose quartz pendant hangs from a brown leather cord. The raw stone's gentle pink hue provides warmth against the earthy leather. Hand-wrapped setting showcases the stone's natural form. An 18-inch length with a simple, secure closure.",
      price: "40.00",
      categoryId: leatherCordCategory.id,
      imageUrl: crystalJewelryImages.roseQuartz[0],
      imageUrls: crystalJewelryImages.roseQuartz,
      sku: "TC-ROS-001",
      stockQuantity: 1,
      weight: "22g",
      materials: ["Leather", "Stone"],
      gemstones: ["Rose Quartz"],
      careInstructions: "Clean gently with a soft cloth. Avoid harsh chemicals and prolonged sun exposure.",
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
    };

    const lapisLazuliMensNecklace: Product = {
      id: this.currentProductId++,
      name: "Men's Lapis Lazuli Necklace on Leather Cord",
      description: "A substantial lapis lazuli pendant on an extended 26-inch brown leather cord. The rich blue stone with natural pyrite inclusions makes a bold statement. Hand-wrapped setting emphasizes the stone's character. The longer length creates a strong, masculine presence.",
      price: "40.00",
      categoryId: leatherCordCategory.id,
      imageUrl: crystalJewelryImages.lapisLeather[0],
      imageUrls: crystalJewelryImages.lapisLeather,
      sku: "TC-LAP-MEN-001",
      stockQuantity: 1,
      weight: "25g",
      materials: ["Leather", "Stone"],
      gemstones: ["Lapis Lazuli"],
      careInstructions: "Protect leather from water. Store in a cool, dry place. Wipe stone gently with a soft cloth.",
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
    };

    const lapisLazuliOnyx: Product = {
      id: this.currentProductId++,
      name: "Five-Stone Lapis Lazuli and Onyx Necklace",
      description: "A unique five-stone necklace combining lapis lazuli, onyx, smoky quartz, jade, and lava stone. The deep blues of lapis contrast beautifully with the black onyx and translucent quartz. Jade adds subtle green depth while the lava stone provides texture. A harmonious composition that balances varied colors and materials.",
      price: "80.00",
      categoryId: gemstoneNecklacesCategory.id,
      imageUrl: crystalJewelryImages.lapisMixedStones[0],
      imageUrls: crystalJewelryImages.lapisMixedStones,
      sku: "TC-LAP-ONY-001",
      stockQuantity: 1,
      weight: "35g",
      materials: ["Stone"],
      gemstones: ["Lapis Lazuli", "Onyx", "Smoky Quartz", "Jade", "Lava Stone"],
      careInstructions: "The lava stone can absorb essential oils for fragrance. Store separately to protect softer stones. Clean gently with a soft cloth.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const turquoiseLapisNecklace: Product = {
      id: this.currentProductId++,
      name: "Turquoise and Lapis Lazuli Beaded Necklace",
      description: "A 21-inch beaded necklace featuring turquoise beads, lapis lazuli, pink pearls, and hematite accents. The turquoise brings vibrant blue-green tones while lapis adds deeper blue notes. Pink pearls provide soft contrast and hematite offers subtle metallic shimmer. A delicate leaf pendant completes this one-of-a-kind piece with a gold-filled clasp.",
      price: "70.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.turquoiseBeaded[0],
      imageUrls: crystalJewelryImages.turquoiseBeaded,
      sku: "TC-TUR-BEAD-001",
      stockQuantity: 1,
      weight: "32g",
      materials: ["Stone", "Turquoise", "Lapis Lazuli", "Pink Pearl", "Hematite", "Gold Filled"],
      gemstones: ["Turquoise", "Lapis Lazuli", "Hematite", "Pink Pearl"],
      careInstructions: "Protect from water and chemicals. Clean pearls gently with a soft cloth. Store in a padded jewelry box.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    const upcycledEnamelPendant: Product = {
      id: this.currentProductId++,
      name: "Upcycled Enamel Pendant with Citrine and Peridot",
      description: "A unique upcycled enamel flower pendant adorned with citrine and peridot stones. The gold-plated enamel bloom serves as a stationary focal point on a 14-inch 14k gold-filled curb chain. Citrine adds warm golden tones while peridot provides fresh green accents. A distinctive piece that combines vintage charm with modern refinement.",
      price: "80.00",
      categoryId: crystalNecklacesCategory.id,
      imageUrl: crystalJewelryImages.upcycledEnamel[0],
      imageUrls: crystalJewelryImages.upcycledEnamel,
      sku: "TC-UPC-ENA-001",
      stockQuantity: 1,
      weight: "18g",
      materials: ["14k Gold Filled", "Gold Plated Enamel", "18KGF", "5mm Curb Chain"],
      gemstones: ["Citrine", "Peridot"],
      careInstructions: "Remove before water exposure. Polish gently with a soft cloth. Store separately to protect the enamel finish.",
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
    };

    // Store all products in the system
    [lepidoliteNecklace, turquoiseBeadedNecklace, citrineNecklace, lapisLazuliPendant, roseQuartzPendant, lapisLazuliMensNecklace, lapisLazuliOnyx, turquoiseLapisNecklace, upcycledEnamelPendant].forEach(product => {
      this.products.set(product.id, product);
    });

    // Add Etsy products from your shop
    ETSY_PRODUCTS.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  private generateDiscountCode(): string {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `CRYSTAL-${code}`;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phone: insertUser.phone || null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStripeInfo(userId: number, customerId: string, subscriptionId?: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { 
      ...user, 
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId || null
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null,
      imageUrl: insertCategory.imageUrl || null
    };
    this.categories.set(id, category);
    return category;
  }

  // Product operations
  async getProducts(categoryId?: number): Promise<ProductWithCategory[]> {
    let products = Array.from(this.products.values());
    
    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }

    return products.map(product => ({
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    }));
  }

  async getProduct(id: number): Promise<ProductWithCategory | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    return {
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    };
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(p => p.sku === sku);
  }

  async getFeaturedProducts(): Promise<ProductWithCategory[]> {
    const products = Array.from(this.products.values()).filter(p => p.isFeatured);
    return products.map(product => ({
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    }));
  }

  async searchProducts(query: string): Promise<ProductWithCategory[]> {
    const lowerQuery = query.toLowerCase();
    const products = Array.from(this.products.values()).filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.materials?.some(m => m.toLowerCase().includes(lowerQuery)) ||
      p.gemstones?.some(g => g.toLowerCase().includes(lowerQuery))
    );

    return products.map(product => ({
      ...product,
      category: product.categoryId ? this.categories.get(product.categoryId) : undefined
    }));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = {
      ...insertProduct,
      id,
      categoryId: insertProduct.categoryId || null,
      imageUrls: insertProduct.imageUrls || null,
      stockQuantity: insertProduct.stockQuantity || 0,
      weight: insertProduct.weight || null,
      materials: insertProduct.materials || null,
      gemstones: insertProduct.gemstones || null,
      careInstructions: insertProduct.careInstructions || null,
      isActive: insertProduct.isActive !== undefined ? insertProduct.isActive : true,
      isFeatured: insertProduct.isFeatured !== undefined ? insertProduct.isFeatured : false,
      createdAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProductStock(productId: number, quantity: number): Promise<Product> {
    const product = this.products.get(productId);
    if (!product) throw new Error("Product not found");

    const updatedProduct = { ...product, stockQuantity: quantity };
    this.products.set(productId, updatedProduct);
    return updatedProduct;
  }

  async updateProduct(productId: number, updates: Partial<Product>): Promise<Product> {
    const product = this.products.get(productId);
    if (!product) throw new Error("Product not found");

    const updatedProduct = { ...product, ...updates };
    this.products.set(productId, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(productId: number): Promise<void> {
    if (!this.products.has(productId)) {
      throw new Error("Product not found");
    }
    this.products.delete(productId);
  }

  // Cart operations
  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    
    return items.map(item => {
      const product = this.products.get(item.productId!);
      if (!product) throw new Error("Product not found");
      
      return {
        ...item,
        product
      };
    });
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertItem.sessionId && item.productId === insertItem.productId
    );

    if (existingItem) {
      // Update quantity instead of creating new item
      const updatedItem = { 
        ...existingItem, 
        quantity: existingItem.quantity + (insertItem.quantity || 1)
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }

    const id = this.currentCartItemId++;
    const product = this.products.get(insertItem.productId || 0);
    const cartItem: CartItem = {
      ...insertItem,
      id,
      createdAt: new Date(),
      productId: insertItem.productId || 0,
      quantity: insertItem.quantity || 1,
      product: product || { id: insertItem.productId || 0, name: 'Unknown', description: '', price: '', imageUrl: '', categoryId: 0 }
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem> {
    const item = this.cartItems.get(id);
    if (!item) throw new Error("Cart item not found");
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToDelete = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.sessionId === sessionId)
      .map(([id, _]) => id);
    
    itemsToDelete.forEach(id => this.cartItems.delete(id));
  }

  // Order operations
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: insertOrder.status || "pending",
      sessionId: insertOrder.sessionId || ""
    };
    this.orders.set(id, order);
    return order;
  }

  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { 
      ...insertOrderItem, 
      id,
      productId: insertOrderItem.productId || null,
      orderId: insertOrderItem.orderId || null
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = Array.from(this.orderItems.values())
      .filter(item => item.orderId === id)
      .map(item => {
        const product = this.products.get(item.productId!);
        if (!product) throw new Error("Product not found");
        
        return {
          ...item,
          product
        };
      });

    return {
      ...order,
      items
    };
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const order = this.orders.get(id);
    if (!order) throw new Error("Order not found");
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Contact operations
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentContactId++;
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id,
      createdAt: new Date(),
      phone: insertSubmission.phone || null,
      isConsultation: insertSubmission.isConsultation || false,
      preferredDate: insertSubmission.preferredDate || null
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values());
  }

  // Newsletter operations
  async createNewsletterSubscription(insertSubscription: InsertNewsletterSubscription): Promise<NewsletterSubscription> {
    // Check for existing subscription
    const existing = await this.getNewsletterSubscriptionByEmail(insertSubscription.email);
    if (existing) {
      throw new Error("Email already subscribed");
    }

    const id = this.currentNewsletterId++;
    const discountCode = this.generateDiscountCode();

    const subscription: NewsletterSubscription = {
      id,
      email: insertSubscription.email,
      firstName: insertSubscription.firstName,
      discountCode,
      subscribedAt: new Date(),
      isActive: true
    };

    this.newsletterSubscriptions.set(id, subscription);
    return subscription;
  }

  async getNewsletterSubscriptionByEmail(email: string): Promise<NewsletterSubscription | undefined> {
    return Array.from(this.newsletterSubscriptions.values()).find(
      sub => sub.email === email && sub.isActive
    );
  }

  async getNewsletterSubscriptions(): Promise<NewsletterSubscription[]> {
    return Array.from(this.newsletterSubscriptions.values()).filter(sub => sub.isActive);
  }
}

export const storage = new MemStorage();
