import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

import {
  users, categories, products, cartItems, orders, orderItems, contactSubmissions,
  type User, type InsertUser,
  type Category, type InsertCategory,
  type Product, type InsertProduct, type ProductWithCategory,
  type CartItem, type InsertCartItem, type CartItemWithProduct,
  type Order, type InsertOrder, type OrderWithItems,
  type OrderItem, type InsertOrderItem,
  type ContactSubmission, type InsertContactSubmission
} from '@shared/schema';
import { eq, like } from 'drizzle-orm';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStripeInfo(userId: number, customerId: string, subscriptionId?: string): Promise<User>;

  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  getProducts(categoryId?: number): Promise<ProductWithCategory[]>;
  getProduct(id: number): Promise<ProductWithCategory | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<ProductWithCategory[]>;
  searchProducts(query: string): Promise<ProductWithCategory[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(productId: number, quantity: number): Promise<Product>;

  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(sessionId: string): Promise<void>;

  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  updateOrderStatus(id: number, status: string): Promise<Order>;

  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

export class PostgresStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserStripeInfo(userId: number, customerId: string, subscriptionId?: string): Promise<User> {
    const result = await db.update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId || null,
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(insertCategory).returning();
    return result[0];
  }

  async getProducts(categoryId?: number): Promise<ProductWithCategory[]> {
    const allCategories = await this.getCategories();

    if (categoryId) {
      const productList = await db.select().from(products).where(eq(products.categoryId, categoryId));
      return productList.map((product: any) => ({
        ...product,
        category: product.categoryId ? allCategories.find((c: Category) => c.id === product.categoryId) : undefined
      }));
    }

    const productList = await db.select().from(products);
    return productList.map((product: any) => ({
      ...product,
      category: product.categoryId ? allCategories.find((c: Category) => c.id === product.categoryId) : undefined
    }));
  }

  async getProduct(id: number): Promise<ProductWithCategory | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    if (!result[0]) return undefined;

    const product = result[0];
    let category: Category | undefined;

    if (product.categoryId) {
      category = await this.getCategory(product.categoryId);
    }

    return {
      ...product,
      category
    };
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.sku, sku));
    return result[0];
  }

  async getFeaturedProducts(): Promise<ProductWithCategory[]> {
    const productList = await db.select().from(products).where(eq(products.isFeatured, true));
    const allCategories = await this.getCategories();

    return productList.map((product: any) => ({
      ...product,
      category: product.categoryId ? allCategories.find((c: Category) => c.id === product.categoryId) : undefined
    }));
  }

  async searchProducts(query: string): Promise<ProductWithCategory[]> {
    const lowerQuery = `%${query.toLowerCase()}%`;
    const productList = await db.select().from(products)
      .where(
        like(products.name, lowerQuery)
      );
    const allCategories = await this.getCategories();

    return productList.map((product: any) => ({
      ...product,
      category: product.categoryId ? allCategories.find((c: Category) => c.id === product.categoryId) : undefined
    }));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(insertProduct).returning();
    return result[0];
  }

  async updateProductStock(productId: number, quantity: number): Promise<Product> {
    const result = await db.update(products)
      .set({ stockQuantity: quantity })
      .where(eq(products.id, productId))
      .returning();
    return result[0];
  }

  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));

    const result: CartItemWithProduct[] = [];
    for (const item of items) {
      if (item.productId) {
        const product = await this.getProduct(item.productId);
        if (product) {
          result.push({
            ...item,
            product
          });
        }
      }
    }

    return result;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const existingItems = await db.select().from(cartItems)
      .where(eq(cartItems.sessionId, insertItem.sessionId));

    const existingItem = existingItems.find(
      item => item.productId === insertItem.productId
    );

    if (existingItem) {
      const result = await db.update(cartItems)
        .set({
          quantity: existingItem.quantity + (insertItem.quantity || 1)
        })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return result[0];
    }

    const result = await db.insert(cartItems).values(insertItem).returning();
    return result[0];
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem> {
    const result = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return result[0];
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(sessionId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(insertOrder).returning();
    return result[0];
  }

  async addOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const result = await db.insert(orderItems).values(insertOrderItem).returning();
    return result[0];
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const orderResult = await db.select().from(orders).where(eq(orders.id, id));
    if (!orderResult[0]) return undefined;

    const order = orderResult[0];

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    const itemsWithProduct = [];

    for (const item of items) {
      if (item.productId) {
        const product = await this.getProduct(item.productId);
        if (product) {
          itemsWithProduct.push({
            ...item,
            product
          });
        }
      }
    }

    return {
      ...order,
      items: itemsWithProduct
    };
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    const result = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(insertSubmission).returning();
    return result[0];
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }
}

export const storage = process.env.DATABASE_URL
  ? new PostgresStorage()
  : (() => {
      const { MemStorage } = require('./storage');
      return new MemStorage();
    })();