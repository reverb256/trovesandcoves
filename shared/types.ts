// Type definitions for Troves & Coves showcase site
// These replace the Drizzle ORM schema that was removed

// ============================================================================
// Error Handling Types
// ============================================================================

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}

export type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };

// ============================================================================
// Base Types - made more flexible for the showcase site
// ============================================================================

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  images?: string[] | null;
  imageUrls?: string[] | null; // Alias for backward compatibility
  categoryId: number | null;
  category?: Category | null;
  materials?: string[] | null;
  gemstones?: string[] | null;
  inStock?: boolean; // Optional - derived from stockQuantity
  featured?: boolean;
  isFeatured?: boolean; // Alias for backward compatibility
  isActive?: boolean; // For product visibility
  slug?: string;
  sku?: string;
  stockQuantity?: number | null; // For inventory tracking
  weight?: string | null; // For shipping calculations
  careInstructions?: string | null; // Care instructions for the jewelry
  metadata?: Record<string, unknown> | null;
  createdAt?: Date | null;
  listingUrl?: string | null; // Etsy listing URL for sync tracking
  // Additional UI properties
  isNew?: boolean;
  isOnSale?: boolean;
  originalPrice?: string;
  crystalType?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface CartItem {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  product: Product;
  createdAt: Date;
}

export interface Order {
  id: number;
  sessionId: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  billingAddress?: string | null;
  totalAmount: string;
  status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  userId?: number | null;
  stripePaymentIntentId?: string | null;
}

export interface OrderItem {
  id: number;
  orderId: number | null;
  productId: number | null;
  quantity: number;
  price: string;
  product?: Product | null;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  phone?: string | null;
  preferredDate?: string | null;
  isConsultation?: boolean;
  createdAt: Date;
}

// Newsletter subscriptions
export interface NewsletterSubscription {
  id: number;
  email: string;
  firstName: string;
  discountCode: string;
  subscribedAt: Date;
  isActive: boolean;
}

export interface SubscribeRequest {
  email: string;
  firstName: string;
}

export interface SubscribeResponse {
  success: boolean;
  discountCode?: string;
  message?: string;
}

export interface User {
  id: number;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  password?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Collections (for compatibility with schema imports)
export const users = [];
export const categories = [];
export const products = [];
export const cartItems = [];
export const orders = [];
export const orderItems = [];
export const contactSubmissions = [];
export const newsletterSubscriptions = [];

// ============================================================================
// Insert Types - flexible with null values
// ============================================================================

export type InsertProduct = Omit<Product, 'id'>;
export type InsertCategory = Omit<Category, 'id'>;
export type InsertCartItem = Omit<CartItem, 'id' | 'product' | 'createdAt'>;
export type InsertOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertOrderItem = Omit<OrderItem, 'id' | 'product'>;
export type InsertContactSubmission = Omit<
  ContactSubmission,
  'id' | 'createdAt'
>;
export type InsertUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type InsertNewsletterSubscription = Omit<
  NewsletterSubscription,
  'id' | 'discountCode' | 'subscribedAt' | 'isActive'
>;

// ============================================================================
// Extended Types (with relations) - more flexible
// ============================================================================

export type ProductWithCategory = Product & { category?: Category | null };
export type CartItemWithProduct = CartItem;
export type OrderWithItems = Order & { items?: OrderItem[] };

// ============================================================================
// Zod Schema Stubs (for validation, can be implemented later)
// ============================================================================

import { z } from 'zod';

export const insertContactSubmissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
  preferredDate: z.string().optional(),
  isConsultation: z.boolean().optional().default(false),
});

export const insertCartItemSchema = z.object({
  sessionId: z.string(),
  productId: z.number(),
  quantity: z.number().min(1),
});

export const insertOrderSchema = z.object({
  sessionId: z.string(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().optional(),
  billingAddress: z.string().optional(),
  totalAmount: z.string(),
  status: z.string().default('pending'),
  currency: z.string().default('CAD'),
});

// ============================================================================
// Storage Interface
// ============================================================================

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(
    userId: number,
    customerId: string,
    subscriptionId?: string | null
  ): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product operations
  getProducts(categoryId?: number): Promise<ProductWithCategory[]>;
  getProduct(id: number): Promise<ProductWithCategory | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<ProductWithCategory[]>;
  searchProducts(query: string): Promise<ProductWithCategory[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(productId: number, quantity: number): Promise<Product>;

  // Cart operations
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order>;

  // Contact operations
  createContactSubmission(
    submission: InsertContactSubmission
  ): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;

  // Newsletter operations
  createNewsletterSubscription(
    subscription: InsertNewsletterSubscription
  ): Promise<NewsletterSubscription>;
  getNewsletterSubscriptionByEmail(
    email: string
  ): Promise<NewsletterSubscription | undefined>;
  getNewsletterSubscriptions(): Promise<NewsletterSubscription[]>;
}
