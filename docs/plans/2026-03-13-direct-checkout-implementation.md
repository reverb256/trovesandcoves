# Direct Checkout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement complete checkout infrastructure with Stripe, PayPal, and E-Transfer payment options for Canadian customers.

**Architecture:** Server-side order processing with PostgreSQL, client-side checkout flow with payment provider integrations, tax calculation by province, shipping zones.

**Tech Stack:** Node.js/Express API, PostgreSQL (Neon), Stripe SDK, PayPal SDK, React Hook Form, Zod validation

---

## Task 1: Set up PostgreSQL database schema

**Files:**
- Create: `server/database/migrations/001_create_orders.sql`
- Create: `server/database/schema.ts`

**Step 1: Write the database migration**

```sql
-- server/database/migrations/001_create_orders.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table (optional guest checkout initially)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'received', -- received, processing, shipped, delivered, cancelled
  payment_method VARCHAR(20) NOT NULL, -- stripe, paypal, etransfer
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
  subtotal DECIMAL(10,2) NOT NULL,
  gst DECIMAL(10,2) DEFAULT 0,
  pst DECIMAL(10,2) DEFAULT 0,
  hst DECIMAL(10,2) DEFAULT 0,
  tax_total DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,

  -- Shipping address
  shipping_name VARCHAR(255) NOT NULL,
  shipping_street VARCHAR(255) NOT NULL,
  shipping_city VARCHAR(100) NOT NULL,
  shipping_province VARCHAR(50) NOT NULL,
  shipping_postal_code VARCHAR(10) NOT NULL,
  shipping_country VARCHAR(2) DEFAULT 'CA',

  -- E-Transfer specific
  etransfer_pending_at TIMESTAMP,

  -- Payment provider IDs
  stripe_payment_intent_id VARCHAR(255),
  paypal_order_id VARCHAR(255),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

**Step 2: Write the TypeScript schema types**

```typescript
// server/database/schema.ts

export interface Customer {
  id: string;
  email: string;
  name?: string;
  created_at: Date;
  updated_at: Date;
}

export enum OrderStatus {
  Received = 'received',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum PaymentMethod {
  Stripe = 'stripe',
  PayPal = 'paypal',
  ETransfer = 'etransfer',
}

export enum PaymentStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
  Refunded = 'refunded',
}

export interface Address {
  name: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country?: string; // Default 'CA'
}

export interface Order {
  id: string;
  customer_id?: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  gst: number;
  pst: number;
  hst: number;
  tax_total: number;
  shipping: number;
  total: number;
  shipping_name: string;
  shipping_street: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  shipping_country: string;
  etransfer_pending_at?: Date;
  stripe_payment_intent_id?: string;
  paypal_order_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
}

export interface TaxBreakdown {
  gst: number;
  pst: number;
  hst: number;
  total: number;
  provinceName: string;
}

export interface CartOrderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}
```

**Step 3: Commit**

```bash
git add server/database/migrations/ server/database/schema.ts
git commit -m "feat: add database schema for orders

- Create customers, orders, and order_items tables
- Add indexes for performance
- Add updated_at trigger
- Define TypeScript types
"
```

---

## Task 2: Create tax calculation library

**Files:**
- Create: `server/lib/tax.ts`

**Step 1: Write the tax calculation library**

```typescript
// server/lib/tax.ts
import type { TaxBreakdown } from '../database/schema';

export interface TaxRate {
  gst: number;      // Goods and Services Tax (federal)
  pst: number;      // Provincial Sales Tax
  hst: number;      // Harmonized Sales Tax (combines gst+pst)
  name: string;
}

// Canadian tax rates (as of 2026)
const TAX_RATES: Record<string, TaxRate> = {
  // HST provinces (harmonized tax)
  'ON': { gst: 0, pst: 0, hst: 0.13, name: 'Ontario' },
  'NB': { gst: 0, pst: 0, hst: 0.15, name: 'New Brunswick' },
  'NS': { gst: 0, pst: 0, hst: 0.15, name: 'Nova Scotia' },
  'PE': { gst: 0, pst: 0, hst: 0.15, name: 'Prince Edward Island' },
  'NL': { gst: 0, pst: 0, hst: 0.15, name: 'Newfoundland and Labrador' },

  // GST + PST provinces
  'AB': { gst: 0.05, pst: 0, hst: 0, name: 'Alberta' },
  'BC': { gst: 0.05, pst: 0.07, hst: 0, name: 'British Columbia' },
  'MB': { gst: 0.05, pst: 0.07, hst: 0, name: 'Manitoba' },
  'QC': { gst: 0.05, pst: 0.09975, hst: 0, name: 'Quebec' }, // QST is 9.975%
  'SK': { gst: 0.05, pst: 0.06, hst: 0, name: 'Saskatchewan' },

  // Territories (GST only)
  'NT': { gst: 0.05, pst: 0, hst: 0, name: 'Northwest Territories' },
  'NU': { gst: 0.05, pst: 0, hst: 0, name: 'Nunavut' },
  'YT': { gst: 0.05, pst: 0, hst: 0, name: 'Yukon' },
};

/**
 * Calculate tax for a given subtotal and province
 */
export function calculateTax(subtotal: number, province: string): TaxBreakdown {
  const rate = TAX_RATES[province.toUpperCase()];

  if (!rate) {
    // Default to GST only for unknown/invalid provinces
    return {
      gst: subtotal * 0.05,
      pst: 0,
      hst: 0,
      total: subtotal * 0.05,
      provinceName: 'Unknown',
    };
  }

  const gst = subtotal * rate.gst;
  const pst = subtotal * rate.pst;
  const hst = subtotal * rate.hst;

  return {
    gst,
    pst,
    hst,
    total: gst + pst + hst,
    provinceName: rate.name,
  };
}

/**
 * Get tax rate for a province (for display purposes)
 */
export function getTaxRate(province: string): TaxRate | null {
  return TAX_RATES[province.toUpperCase()] || null;
}

/**
 * Get all provinces for select options
 */
export function getProvinces(): Array<{ code: string; name: string }> {
  return Object.entries(TAX_RATES).map(([code, data]) => ({
    code,
    name: data.name,
  }));
}

/**
 * Validate Canadian postal code
 */
export function isValidPostalCode(postalCode: string): boolean {
  // Canadian postal code format: A1A 1A1
  const pattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  return pattern.test(postalCode.trim());
}
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add server/lib/tax.ts
git commit -m "feat: add Canadian tax calculation

- GST, PST, HST rates for all provinces and territories
- Calculate tax by province
- Validate Canadian postal codes
- Get provinces list for form selects
"
```

---

## Task 3: Create shipping rate library

**Files:**
- Create: `server/lib/shipping.ts`

**Step 1: Write the shipping calculation library**

```typescript
// server/lib/shipping.ts

export interface ShippingRate {
  zone: string;
  provinces: string[];
  rate: number;
  freeThreshold?: number; // Free shipping over this amount
  estimatedDays: string;
}

const SHIPPING_RATES: ShippingRate[] = [
  {
    zone: 'Local (Manitoba)',
    provinces: ['MB'],
    rate: 0,
    freeThreshold: 100,
    estimatedDays: '1-2 business days',
  },
  {
    zone: 'Canada',
    provinces: ['AB', 'BC', 'SK', 'ON', 'QC', 'NB', 'NS', 'PE', 'NL', 'NT', 'NU', 'YT'],
    rate: 15,
    freeThreshold: 150,
    estimatedDays: '3-5 business days',
  },
  {
    zone: 'United States',
    provinces: [], // Using provinces array for country codes here
    rate: 25,
    freeThreshold: 200,
    estimatedDays: '5-10 business days',
  },
  {
    zone: 'International',
    provinces: [],
    rate: 40,
    freeThreshold: 250,
    estimatedDays: '10-20 business days',
  },
];

/**
 * Calculate shipping rate based on destination and subtotal
 */
export function calculateShipping(
  subtotal: number,
  province?: string,
  country: string = 'CA'
): { rate: number; zone: string; estimatedDays: string } {
  let zone: ShippingRate | undefined;

  // Check if it's a Canadian province
  if (country === 'CA' && province) {
    zone = SHIPPING_RATES.find(rate =>
      rate.provinces.includes(province.toUpperCase())
    );
  }

  // Default to international if no match
  if (!zone) {
    zone = country === 'US'
      ? SHIPPING_RATES.find(r => r.zone === 'United States')
      : SHIPPING_RATES.find(r => r.zone === 'International');
  }

  // Final fallback
  if (!zone) {
    zone = SHIPPING_RATES[SHIPPING_RATES.length - 1];
  }

  // Check for free shipping threshold
  if (zone.freeThreshold && subtotal >= zone.freeThreshold) {
    return {
      rate: 0,
      zone: zone.zone,
      estimatedDays: zone.estimatedDays,
    };
  }

  return {
    rate: zone.rate,
    zone: zone.zone,
    estimatedDays: zone.estimatedDays,
  };
}

/**
 * Get shipping info for display (without calculating)
 */
export function getShippingInfo(province?: string, country: string = 'CA'): {
  rate: number;
  freeThreshold: number;
  zone: string;
  estimatedDays: string;
} | null {
  let zone: ShippingRate | undefined;

  if (country === 'CA' && province) {
    zone = SHIPPING_RATES.find(rate =>
      rate.provinces.includes(province.toUpperCase())
    );
  }

  if (!zone) {
    zone = country === 'US'
      ? SHIPPING_RATES.find(r => r.zone === 'United States')
      : SHIPPING_RATES.find(r => r.zone === 'International');
  }

  return zone ? {
    rate: zone.rate,
    freeThreshold: zone.freeThreshold || 0,
    zone: zone.zone,
    estimatedDays: zone.estimatedDays,
  } : null;
}

/**
 * Get all shipping zones
 */
export function getAllShippingZones(): ShippingRate[] {
  return SHIPPING_RATES;
}
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add server/lib/shipping.ts
git commit -m "feat: add shipping rate calculation

- Zone-based shipping for Canada, US, International
- Free shipping thresholds
- Estimated delivery times
- Province-based lookup for Canadian orders
"
```

---

## Task 4: Create database connection and query functions

**Files:**
- Create: `server/database/connection.ts`
- Create: `server/database/queries.ts`

**Step 1: Write database connection**

```typescript
// server/database/connection.ts
import { Pool, PoolConfig } from 'pg';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const config: PoolConfig = {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    };
    pool = new Pool(config);
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const pool = getPool();
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error', { text, error });
    throw error;
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
```

**Step 2: Write order queries**

```typescript
// server/database/queries.ts
import { query } from './connection';
import type { Order, OrderItem, CartOrderItem, Address } from './schema';

export interface CreateOrderInput {
  customerEmail: string;
  customerName?: string;
  items: CartOrderItem[];
  paymentMethod: 'stripe' | 'paypal' | 'etransfer';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  stripePaymentIntentId?: string;
  paypalOrderId?: string;
}

/**
 * Create a new order with items
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    // Create or get customer
    let customerId: string | undefined;
    const customerResult = await client.query(
      `INSERT INTO customers (email, name)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET name = $2
       RETURNING id`,
      [input.customerEmail.toLowerCase(), input.customerName]
    );
    customerId = customerResult.rows[0].id;

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (
        customer_id, payment_method, subtotal, gst, pst, hst, tax_total, shipping, total,
        shipping_name, shipping_street, shipping_city, shipping_province, shipping_postal_code, shipping_country,
        stripe_payment_intent_id, paypal_order_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        customerId,
        input.paymentMethod,
        input.subtotal,
        input.tax.gst || 0,
        input.tax.pst || 0,
        input.tax.hst || 0,
        input.tax,
        input.shipping,
        input.total,
        input.shippingAddress.name,
        input.shippingAddress.street,
        input.shippingAddress.city,
        input.shippingAddress.province,
        input.shippingAddress.postalCode,
        input.shippingAddress.country || 'CA',
        input.stripePaymentIntentId || null,
        input.paypalOrderId || null,
      ]
    );

    const order = orderResult.rows[0] as Order;

    // Create order items
    for (const item of input.items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.productId, item.productName, item.price, item.quantity]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  const result = await query('SELECT * FROM orders WHERE id = $1', [orderId]);
  return result.rows[0] || null;
}

/**
 * Get orders by customer email
 */
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const result = await query(
    `SELECT o.* FROM orders o
     JOIN customers c ON c.id = o.customer_id
     WHERE c.email = $1
     ORDER BY o.created_at DESC`,
    [email.toLowerCase()]
  );
  return result.rows;
}

/**
 * Get order items for an order
 */
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const result = await query(
    'SELECT * FROM order_items WHERE order_id = $1',
    [orderId]
  );
  return result.rows;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<Order | null> {
  const result = await query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
    [status, orderId]
  );
  return result.rows[0] || null;
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: string
): Promise<Order | null> {
  const result = await query(
    'UPDATE orders SET payment_status = $1 WHERE id = $2 RETURNING *',
    [paymentStatus, orderId]
  );
  return result.rows[0] || null;
}

// Re-export getPool for connection import
import { getPool } from './connection';
```

**Step 3: Add pg dependency**

Run: `npm install pg`

Run: `npm install --save-dev @types/pg`

**Step 4: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 5: Commit**

```bash
git add server/database/connection.ts server/database/queries.ts package.json package-lock.json
git commit -m "feat: add database connection and order queries

- PostgreSQL connection pooling
- Create order with transaction
- Get order by ID, email
- Update order/payment status
"
```

---

## Task 5: Create shared types for checkout

**Files:**
- Modify: `shared/types.ts`

**Step 1: Add checkout types to shared/types.ts**

Read current `shared/types.ts` and add at end:

```typescript
// Checkout types
export interface CheckoutAddress {
  name: string;
  email: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface TaxBreakdown {
  gst: number;
  pst: number;
  hst: number;
  total: number;
  provinceName: string;
}

export interface ShippingInfo {
  rate: number;
  zone: string;
  estimatedDays: string;
  freeThreshold?: number;
}

export interface OrderSummary {
  subtotal: number;
  tax: TaxBreakdown;
  shipping: number;
  total: number;
}

export interface CheckoutValidation {
  isValid: boolean;
  errors: Record<string, string>;
}
```

**Step 2: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 3: Commit**

```bash
git add shared/types.ts
git commit -m "feat: add checkout types to shared types"
```

---

## Task 6: Create checkout API routes

**Files:**
- Create: `server/routes/checkout.ts`
- Modify: `server/routes.ts`

**Step 1: Write checkout routes**

```typescript
// server/routes/checkout.ts
import { Router } from 'express';
import { calculateTax } from '../lib/tax';
import { calculateShipping } from '../lib/shipping';
import { createOrder, getOrderById } from '../database/queries';
import type { CartOrderItem, Address } from '../database/schema';

const router = Router();

/**
 * POST /api/checkout/calculate-tax
 * Calculate tax for a given subtotal and province
 */
router.post('/calculate-tax', (req, res) => {
  try {
    const { subtotal, province } = req.body;

    if (typeof subtotal !== 'number' || subtotal < 0) {
      return res.status(400).json({ error: 'Invalid subtotal' });
    }

    if (typeof province !== 'string' || province.length !== 2) {
      return res.status(400).json({ error: 'Invalid province code' });
    }

    const tax = calculateTax(subtotal, province);
    res.json(tax);
  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate tax' });
  }
});

/**
 * POST /api/checkout/calculate-shipping
 * Calculate shipping for a given subtotal and location
 */
router.post('/calculate-shipping', (req, res) => {
  try {
    const { subtotal, province, country } = req.body;

    if (typeof subtotal !== 'number' || subtotal < 0) {
      return res.status(400).json({ error: 'Invalid subtotal' });
    }

    const shipping = calculateShipping(
      subtotal,
      province,
      country || 'CA'
    );

    res.json(shipping);
  } catch (error) {
    console.error('Shipping calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate shipping' });
  }
});

/**
 * POST /api/checkout/create-order
 * Create an order (for E-Transfer or after payment confirmation)
 */
router.post('/create-order', async (req, res) => {
  try {
    const {
      customerEmail,
      customerName,
      items,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
    } = req.body;

    // Validation
    if (!customerEmail || !items?.length || !paymentMethod || !shippingAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (
      typeof subtotal !== 'number' ||
      typeof tax !== 'number' ||
      typeof shipping !== 'number' ||
      typeof total !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid amounts' });
    }

    // E-Transfer orders are created immediately with pending payment
    if (paymentMethod === 'etransfer') {
      const order = await createOrder({
        customerEmail,
        customerName,
        items,
        paymentMethod: 'etransfer',
        subtotal,
        tax: { gst: 0, pst: 0, hst: 0, total: tax }, // Simplified
        shipping,
        total,
        shippingAddress,
        etransferPendingAt: new Date(),
      });

      return res.json({
        orderId: order.id,
        status: order.status,
        paymentStatus: order.payment_status,
        etransferDetails: {
          email: process.env.ETRANSFER_EMAIL || 'payments@trovesandcoves.ca',
          amount: total,
          message: `Order ${order.id}`,
        },
      });
    }

    // Stripe and PayPal orders are created after payment
    res.status(400).json({
      error: 'Please complete payment first for Stripe/PayPal orders',
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * GET /api/checkout/order/:id
 * Get order by ID
 */
router.get('/order/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Order lookup error:', error);
    res.status(500).json({ error: 'Failed to lookup order' });
  }
});

export default router;
```

**Step 2: Add checkout routes to main routes**

Update `server/routes.ts`:

```typescript
import checkoutRoutes from './routes/checkout';

// Add to router
app.use('/api/checkout', checkoutRoutes);
```

**Step 3: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 4: Commit**

```bash
git add server/routes/checkout.ts server/routes.ts
git commit -m "feat: add checkout API routes

- Calculate tax by province
- Calculate shipping by location
- Create E-Transfer orders
- Get order by ID
"
```

---

## Task 7: Create Stripe payment integration

**Files:**
- Create: `server/lib/stripe.ts`
- Create: `server/routes/stripe.ts`

**Step 1: Install Stripe SDK**

Run: `npm install stripe`

**Step 2: Write Stripe library**

```typescript
// server/lib/stripe.ts
import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripe = new Stripe(secretKey, {
      apiVersion: '2025-01-27.acacia',
      typescript: true,
    });
  }
  return stripe;
}

export interface CreatePaymentIntentParams {
  amount: number; // in dollars
  currency: string;
  customerId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const stripe = getStripe();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(params.amount * 100), // Convert to cents
    currency: params.currency.toLowerCase(),
    customer: params.customerId,
    receipt_email: params.customerEmail,
    metadata: params.metadata || {},
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}

export async function getPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  const stripe = getStripe();
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

export interface constructWebhookEventParams {
  payload: string | Buffer;
  signature: string;
  secret: string;
}

export function constructWebhookEvent({
  payload,
  signature,
  secret,
}: constructWebhookEventParams): Stripe.Event {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
```

**Step 3: Write Stripe routes**

```typescript
// server/routes/stripe.ts
import { Router, Request, Response } from 'express';
import { createPaymentIntent, constructWebhookEvent } from '../lib/stripe';
import { createOrder, updatePaymentStatus } from '../database/queries';
import type { CartOrderItem, Address } from '../database/schema';

const router = Router();

/**
 * POST /api/stripe/create-payment-intent
 * Create a payment intent for checkout
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    const {
      amount,
      currency = 'cad',
      customerEmail,
      orderId,
    } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const result = await createPaymentIntent({
      amount,
      currency,
      customerEmail,
      metadata: orderId ? { orderId } : undefined,
    });

    res.json(result);
  } catch (error: any) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create payment intent',
    });
  }
});

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events
 */
router.post('/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  let event;

  try {
    event = constructWebhookEvent({
      payload: req.body,
      signature,
      secret: webhookSecret,
    });
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);

      // Update order status if metadata contains orderId
      const orderId = paymentIntent.metadata.orderId;
      if (orderId) {
        await updatePaymentStatus(orderId, 'completed');
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', paymentIntent.id);

      const orderId = paymentIntent.metadata.orderId;
      if (orderId) {
        await updatePaymentStatus(orderId, 'failed');
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

export default router;
```

**Step 4: Add Stripe routes to main routes**

Update `server/routes.ts`:

```typescript
import stripeRoutes from './routes/stripe';

app.use('/api/stripe', stripeRoutes);
```

**Step 5: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 6: Commit**

```bash
git add server/lib/stripe.ts server/routes/stripe.ts server/routes.ts package.json package-lock.json
git commit -m "feat: add Stripe payment integration

- Create payment intents
- Handle payment succeeded/failed webhooks
- Update order payment status
"
```

---

## Task 8: Create PayPal payment integration

**Files:**
- Create: `server/lib/paypal.ts`
- Create: `server/routes/paypal.ts`

**Step 1: Install PayPal SDK**

Run: `npm install @paypal/checkout-server-sdk`

**Step 2: Write PayPal library**

```typescript
// server/lib/paypal.ts
import { PayPalHttpClient, OAuthAuthorizeRequest } from '@paypal/checkout-server-sdk';

let client: PayPalHttpClient | null = null;

export function getPayPalClient(): PayPalHttpClient {
  if (!client) {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    // Using PayPal sandbox or production based on environment
    const environment = process.env.NODE_ENV === 'production'
      ? new PayPal.core.LiveEnvironment(clientId, clientSecret)
      : new PayPal.core.SandboxEnvironment(clientId, clientSecret);

    client = new PayPalHttpClient(environment);
  }

  return client;
}

export interface CreateOrderParams {
  amount: number;
  currency: string;
  description?: string;
}

export async function createPayPalOrder(
  params: CreateOrderParams
): Promise { id: string }> {
  const client = getPayPalClient();

  const request = new PayPal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: params.currency.toUpperCase(),
        value: params.amount.toFixed(2),
      },
      description: params.description,
    }],
    application_context: {
      brand_name: 'Troves & Coves',
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
      return_url: `${process.env.SITE_URL || 'http://localhost:5173'}/checkout/confirm`,
      cancel_url: `${process.env.SITE_URL || 'http://localhost:5173'}/checkout`,
    },
  });

  const response = await client.execute(request);
  return {
    id: response.result.id,
  };
}

export async function capturePayPalOrder(
  orderId: string
): Promise<PayPal.orders.Order> {
  const client = getPayPalClient();

  const request = new PayPal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  const response = await client.execute(request);
  return response.result;
}

export async function getPayPalOrder(
  orderId: string
): Promise<PayPal.orders.Order> {
  const client = getPayPalClient();

  const request = new PayPal.orders.OrdersGetRequest(orderId);
  const response = await client.execute(request);
  return response.result;
}
```

**Step 3: Write PayPal routes**

```typescript
// server/routes/paypal.ts
import { Router } from 'express';
import { createPayPalOrder, capturePayPalOrder } from '../lib/paypal';
import { createOrder, updatePaymentStatus } from '../database/queries';
import type { CartOrderItem, Address } from '../database/schema';

const router = Router();

/**
 * POST /api/paypal/create-order
 * Create a PayPal order for checkout
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'cad', description } = req.body;

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const result = await createPayPalOrder({
      amount,
      currency,
      description: description || 'Troves & Coves Purchase',
    });

    res.json({ orderId: result.id });
  } catch (error: any) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create PayPal order',
    });
  }
});

/**
 * POST /api/paypal/capture-order
 * Capture a completed PayPal payment
 */
router.post('/capture-order', async (req, res) => {
  try {
    const { orderId, checkoutData } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'PayPal order ID required' });
    }

    // Capture the payment
    const capturedOrder = await capturePayPalOrder(orderId);

    if (capturedOrder.status === 'COMPLETED') {
      // Create the order in our database
      const { customerEmail, customerName, items, subtotal, tax, shipping, total, shippingAddress } = checkoutData;

      const order = await createOrder({
        customerEmail,
        customerName,
        items,
        paymentMethod: 'paypal',
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        paypalOrderId: orderId,
      });

      return res.json({
        success: true,
        orderId: order.id,
      });
    }

    res.status(400).json({
      error: 'Payment not completed',
      status: capturedOrder.status,
    });
  } catch (error: any) {
    console.error('PayPal capture error:', error);
    res.status(500).json({
      error: error.message || 'Failed to capture PayPal payment',
    });
  }
});

export default router;
```

**Step 4: Add PayPal routes to main routes**

Update `server/routes.ts`:

```typescript
import paypalRoutes from './routes/paypal';

app.use('/api/paypal', paypalRoutes);
```

**Step 5: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 6: Commit**

```bash
git add server/lib/paypal.ts server/routes/paypal.ts server/routes.ts package.json package-lock.json
git commit -m "feat: add PayPal payment integration

- Create PayPal orders
- Capture PayPal payments
- Create orders after successful capture
"
```

---

## Task 9: Create client-side checkout pages

**Files:**
- Create: `client/src/pages/Checkout.tsx`
- Create: `client/src/components/checkout/ShippingForm.tsx`
- Create: `client/src/components/checkout/PaymentMethodSelector.tsx`
- Create: `client/src/components/checkout/OrderSummary.tsx`
- Modify: `client/src/App.tsx`

**Step 1: Create ShippingForm component**

```tsx
// client/src/components/checkout/ShippingForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CheckoutAddress } from '@shared/types';

const PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
];

const shippingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().length(2, 'Province is required'),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid postal code'),
  country: z.string().default('CA'),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData & CheckoutAddress) => void;
  defaultValues?: Partial<ShippingFormData>;
  isLoading?: boolean;
}

export function ShippingForm({
  onSubmit,
  defaultValues,
  isLoading = false,
}: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: 'CA',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Full Name *
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email *
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="street" className="block text-sm font-medium mb-1">
          Street Address *
        </label>
        <input
          {...register('street')}
          type="text"
          id="street"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
        />
        {errors.street && (
          <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            City *
          </label>
          <input
            {...register('city')}
            type="text"
            id="city"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="province" className="block text-sm font-medium mb-1">
            Province *
          </label>
          <select
            {...register('province')}
            id="province"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          >
            <option value="">Select province</option>
            {PROVINCES.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
          {errors.province && (
            <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
          Postal Code *
        </label>
        <input
          {...register('postalCode')}
          type="text"
          id="postalCode"
          placeholder="A1A 1A1"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={isLoading}
        />
        {errors.postalCode && (
          <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-on py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
}
```

**Step 2: Create PaymentMethodSelector component**

```tsx
// client/src/components/checkout/PaymentMethodSelector.tsx
import { CreditCard, PayPal } from 'lucide-react';

export type PaymentMethod = 'stripe' | 'paypal' | 'etransfer';

interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
  subtotal: number;
}

export function PaymentMethodSelector({
  selected,
  onSelect,
  subtotal,
}: PaymentMethodSelectorProps) {
  const methods: PaymentMethodOption[] = [
    {
      id: 'stripe',
      name: 'Credit Card',
      description: 'Pay securely with Visa, Mastercard, or Amex',
      icon: <CreditCard size={24} />,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: <PayPal size={24} />,
    },
    {
      id: 'etransfer',
      name: 'E-Transfer',
      description: 'Interac e-Transfer (Canada only)',
      icon: <span className="text-2xl">📧</span>,
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Payment Method</h3>
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          disabled={method.disabled}
          className={`w-full flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
            selected === method.id
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300'
          } ${method.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex-shrink-0">{method.icon}</div>
          <div className="flex-1 text-left">
            <div className="font-semibold">{method.name}</div>
            <div className="text-sm text-on-surface-variant">
              {method.description}
            </div>
          </div>
          <div className="flex-shrink-0">
            <div
              className={`w-5 h-5 rounded-full border-2 ${
                selected === method.id
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}
            >
              {selected === method.id && (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
```

**Step 3: Create OrderSummary component**

```tsx
// client/src/components/checkout/OrderSummary.tsx
import type { CartItem, TaxBreakdown, ShippingInfo } from '@shared/types';
import { formatPrice } from '@/lib/format-price';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  tax: TaxBreakdown | null;
  shipping: ShippingInfo | null;
  total: number;
  loading?: boolean;
}

export function OrderSummary({
  items,
  subtotal,
  tax,
  shipping,
  total,
  loading = false,
}: OrderSummaryProps) {
  return (
    <div className="bg-surface-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      {/* Items */}
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-3">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <div className="font-medium">{item.product.name}</div>
              <div className="text-sm text-on-surface-variant">
                Qty: {item.quantity}
              </div>
            </div>
            <div className="font-semibold">
              {formatPrice(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-on-surface-variant">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {tax && (
          <>
            {tax.gst > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">GST ({tax.provinceName})</span>
                <span>{formatPrice(tax.gst)}</span>
              </div>
            )}
            {tax.pst > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">PST ({tax.provinceName})</span>
                <span>{formatPrice(tax.pst)}</span>
              </div>
            )}
            {tax.hst > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">HST ({tax.provinceName})</span>
                <span>{formatPrice(tax.hst)}</span>
              </div>
            )}
          </>
        )}

        {shipping && (
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Shipping</span>
            {shipping.rate === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              <span>{formatPrice(shipping.rate)}</span>
            )}
          </div>
        )}

        <div className="border-t pt-2 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{loading ? '...' : formatPrice(total)}</span>
        </div>
      </div>

      {/* Free shipping notice */}
      {shipping && shipping.freeThreshold && subtotal < shipping.freeThreshold && (
        <p className="text-sm text-green-600 mt-3">
          Add {formatPrice(shipping.freeThreshold - subtotal)} more for free
          shipping!
        </p>
      )}
    </div>
  );
}
```

**Step 4: Create main Checkout page**

```tsx
// client/src/pages/Checkout.tsx
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { ShippingForm, type ShippingFormData } from '@/components/checkout/ShippingForm';
import { PaymentMethodSelector, type PaymentMethod } from '@/components/checkout/PaymentMethodSelector';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/format-price';
import type { TaxBreakdown, ShippingInfo } from '@shared/types';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/products' },
  { name: 'Checkout', path: '/checkout' },
];

type CheckoutStep = 'shipping' | 'payment' | 'confirm';

export function Checkout() {
  const [, navigate] = useLocation();
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('stripe');
  const [tax, setTax] = useState<TaxBreakdown | null>(null);
  const [shipping, setShipping] = useState<ShippingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => subtotal + (tax?.total || 0) + (shipping?.rate || 0),
    [subtotal, tax, shipping]
  );

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/products');
    }
  }, [items.length, navigate]);

  const handleShippingSubmit = async (data: ShippingFormData) => {
    setIsLoading(true);
    setShippingData(data);

    try {
      // Calculate tax
      const taxResponse = await fetch('/api/checkout/calculate-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtotal, province: data.province }),
      });
      const taxData = await taxResponse.json();
      setTax(taxData);

      // Calculate shipping
      const shippingResponse = await fetch('/api/checkout/calculate-shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subtotal, province: data.province, country: data.country }),
      });
      const shippingData = await shippingResponse.json();
      setShipping(shippingData);

      setStep('payment');
    } catch (error) {
      console.error('Error calculating totals:', error);
      alert('Failed to calculate totals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      if (selectedPayment === 'etransfer') {
        // Create E-Transfer order
        const response = await fetch('/api/checkout/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerEmail: shippingData!.email,
            customerName: shippingData!.name,
            items: items.map((item) => ({
              productId: item.product.id,
              productName: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
            })),
            paymentMethod: 'etransfer',
            subtotal,
            tax: tax?.total || 0,
            shipping: shipping?.rate || 0,
            total,
            shippingAddress: shippingData,
          }),
        });

        const data = await response.json();

        if (data.orderId) {
          clearCart();
          navigate(`/checkout/confirmation/${data.orderId}`);
        }
      } else if (selectedPayment === 'stripe') {
        // Create Stripe payment intent
        const response = await fetch('/api/stripe/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            currency: 'cad',
            customerEmail: shippingData!.email,
          }),
        });

        const data = await response.json();

        if (data.clientSecret) {
          // Store checkout data for after payment
          sessionStorage.setItem(
            'checkoutData',
            JSON.stringify({
              customerEmail: shippingData!.email,
              customerName: shippingData!.name,
              items: items.map((item) => ({
                productId: item.product.id,
                productName: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
              })),
              subtotal,
              tax,
              shipping,
              total,
              shippingAddress: shippingData,
            })
          );

          // Redirect to Stripe payment (in real implementation, use Stripe Elements)
          alert('Stripe payment integration would happen here. Use E-Transfer for testing.');
        }
      } else if (selectedPayment === 'paypal') {
        // Create PayPal order
        const response = await fetch('/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            currency: 'cad',
            description: 'Troves & Coves Purchase',
          }),
        });

        const data = await response.json();

        if (data.orderId) {
          // Store checkout data
          sessionStorage.setItem(
            'checkoutData',
            JSON.stringify({
              customerEmail: shippingData!.email,
              customerName: shippingData!.name,
              items: items.map((item) => ({
                productId: item.product.id,
                productName: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
              })),
              subtotal,
              tax,
              shipping,
              total,
              shippingAddress: shippingData,
            })
          );

          // Redirect to PayPal
          alert(`PayPal order created: ${data.orderId}. Redirect to PayPal in production.`);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <SEOHead
        title="Checkout | Secure Payment | Troves & Coves"
        description="Complete your crystal jewelry purchase. Secure checkout with multiple payment options."
        path="/checkout"
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface mb-6"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </button>

        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`flex items-center gap-2 ${
                  step === 'shipping' ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === 'shipping' ? 'border-primary bg-primary text-primary-on' : 'border-gray-300'
                  }`}
                >
                  1
                </div>
                <span className="font-medium">Shipping</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200" />
              <div
                className={`flex items-center gap-2 ${
                  step === 'payment' ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step === 'payment' ? 'border-primary bg-primary text-primary-on' : 'border-gray-300'
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>

            {step === 'shipping' && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <ShippingForm onSubmit={handleShippingSubmit} isLoading={isLoading} />
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-6">
                  <PaymentMethodSelector
                    selected={selectedPayment}
                    onSelect={setSelectedPayment}
                    subtotal={subtotal}
                  />

                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-primary text-primary-on py-4 rounded-lg font-semibold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CreditCard size={20} />
                    {isLoading ? 'Processing...' : `Pay ${formatPrice(total)}`}
                  </button>

                  <button
                    onClick={() => setStep('shipping')}
                    className="w-full text-center text-on-surface-variant hover:text-on-surface"
                  >
                    ← Back to shipping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right column - order summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
}
```

**Step 5: Create formatPrice utility**

```typescript
// client/src/lib/format-price.ts
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}
```

**Step 6: Add checkout route to App.tsx**

```tsx
import { Checkout } from '@/pages/Checkout';

<Route path="/checkout" component={Checkout} />
```

**Step 7: Install required dependencies**

Run: `npm install react-hook-form @hookform/resolvers zod`

**Step 8: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 9: Commit**

```bash
git add client/src/pages/Checkout.tsx client/src/components/checkout/ client/src/lib/format-price.ts client/src/App.tsx package.json package-lock.json
git commit -m "feat: add checkout page

- Multi-step checkout (shipping → payment)
- Shipping form with validation
- Payment method selection (Stripe, PayPal, E-Transfer)
- Order summary with tax/shipping calculation
- Responsive design
"
```

---

## Task 10: Create checkout confirmation page

**Files:**
- Create: `client/src/pages/CheckoutConfirmation.tsx`
- Modify: `client/src/App.tsx`

**Step 1: Write confirmation page**

```tsx
// client/src/pages/CheckoutConfirmation.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { Check, Mail, Home } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { Button } from '@/components/ui/button';
import type { Order } from '@shared/types';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Checkout', path: '/checkout' },
  { name: 'Order Confirmation', path: '/checkout/confirmation' },
];

export function CheckoutConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/checkout/order/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading your order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-8">We couldn't find your order. Please contact us if you believe this is an error.</p>
        <Button onClick={() => (window.location.href = '/contact')}>
          Contact Support
        </Button>
      </div>
    );
  }

  const isETransfer = order.payment_method === 'etransfer';

  return (
    <>
      <SEOHead
        title={`Order Confirmation - ${order.id}`}
        description="Thank you for your order! We'll send you a confirmation email shortly."
        path={`/checkout/confirmation/${order.id}`}
      />
      <BreadcrumbSchema items={breadcrumbItems} />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-600" size={40} />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            {isETransfer ? 'Order Received!' : 'Payment Successful!'}
          </h1>

          <p className="text-xl text-on-surface-variant mb-8">
            Thank you for your order. We've sent a confirmation email to{' '}
            <span className="font-medium">{order.shipping_name}</span>.
          </p>

          {/* E-Transfer notice */}
          {isETransfer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Mail size={20} />
                Complete Your Payment
              </h3>
              <p className="mb-3">
                Please send an Interac e-Transfer to complete your order:
              </p>
              <div className="bg-white rounded p-4 mb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-on-surface-variant">Amount:</span>
                  <span className="font-semibold">
                    ${order.total.toFixed(2)} CAD
                  </span>
                  <span className="text-on-surface-variant">Email:</span>
                  <span className="font-semibold">
                    payments@trovesandcoves.ca
                  </span>
                  <span className="text-on-surface-variant">Message:</span>
                  <span className="font-semibold">{order.id}</span>
                </div>
              </div>
              <p className="text-sm text-on-surface-variant">
                Your order will be processed once we receive your e-Transfer.
                Orders are typically shipped within 1-2 business days.
              </p>
            </div>
          )}

          {/* Order details */}
          <div className="bg-surface-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-4">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Order Number:</span>
                <span className="font-mono">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status:</span>
                <span className="font-semibold capitalize">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Payment Method:</span>
                <span className="capitalize">
                  {order.payment_method === 'etransfer'
                    ? 'E-Transfer'
                    : order.payment_method}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total:</span>
                <span className="font-bold text-lg">
                  ${order.total.toFixed(2)} CAD
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => (window.location.href = '/products')}>
              Continue Shopping
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => (window.location.href = '/')}
            >
              <Home size={18} className="mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Shipping notice */}
          <p className="mt-8 text-sm text-on-surface-variant">
            You'll receive a shipping confirmation email when your order is on
            its way.
          </p>
        </div>
      </div>
    </>
  );
}
```

**Step 2: Add route to App.tsx**

```tsx
import { CheckoutConfirmation } from '@/pages/CheckoutConfirmation';

<Route path="/checkout/confirmation/:id" component={CheckoutConfirmation} />
```

**Step 3: Run TypeScript check**

Run: `npm run check`

Expected: No errors

**Step 4: Commit**

```bash
git add client/src/pages/CheckoutConfirmation.tsx client/src/App.tsx
git commit -m "feat: add checkout confirmation page

- Order success display
- E-Transfer payment instructions
- Order summary details
- Navigation to continue shopping
"
```

---

## Task 11: Update environment variables

**Files:**
- Modify: `.env.example`

**Step 1: Add checkout environment variables**

```bash
# Database
DATABASE_URL=postgresql://user:password@host/database

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
VITE_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_WEBHOOK_ID=...

# E-Transfer
ETRANSFER_EMAIL=payments@trovesandcoves.ca

# Site
SITE_URL=https://trovesandcoves.ca
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add checkout environment variables

- Database connection
- Stripe keys
- PayPal credentials
- E-Transfer email
- Site URL
"
```

---

## Task 12: Test checkout flow

**Files:**
- Test: Manual verification

**Step 1: Test E-Transfer checkout flow**

Run: `npm run dev`

Test:
1. Add items to cart
2. Go to checkout
3. Fill out shipping form
4. Select E-Transfer
5. Complete order
6. Verify confirmation page displays
7. Check order was created in database

**Step 2: Test tax calculation**

Visit different province selections and verify:
- Manitoba: 5% GST + 7% PST = 12%
- Ontario: 13% HST
- Alberta: 5% GST only
- Quebec: 5% GST + 9.975% QST

**Step 3: Test shipping calculation**

Verify:
- Manitoba: Free over $100, otherwise $0
- Other Canada: Free over $150, otherwise $15
- Free shipping notice appears when close to threshold

**Step 4: Run tests**

Run: `npm run test`

Expected: All tests pass

**Step 5: Build production**

Run: `npm run build`

Expected: Build succeeds

---

## Task 13: Create completion report

**Files:**
- Create: `docs/plans/2026-03-13-checkout-completion-report.md`

**Step 1: Write completion report**

```markdown
# Direct Checkout Completion Report

**Date:** 2026-03-13
**Phase:** Direct Checkout (Phase 4)

## Completed Tasks

### 1. Database Setup
- [x] PostgreSQL schema for orders, customers, order items
- [x] Database connection pooling
- [x] Order creation queries with transactions
- [x] Order lookup queries

### 2. Tax & Shipping
- [x] Canadian tax calculation (GST, PST, HST)
- [x] Shipping zones (Canada, US, International)
- [x] Free shipping thresholds
- [x] API endpoints for calculations

### 3. Payment Integrations
- [x] Stripe payment intents
- [x] Stripe webhook handler
- [x] PayPal order creation
- [x] PayPal order capture
- [x] E-Transfer (manual) flow

### 4. Checkout Flow
- [x] Multi-step checkout (shipping → payment)
- [x] Form validation with Zod
- [x] Payment method selection
- [x] Order summary with live totals
- [x] Confirmation page

## Results

### Before
- All purchases went through Etsy
- No direct checkout capability
- No customer data capture

### After
- Full checkout with 3 payment methods
- Canadian tax calculation by province
- Zone-based shipping with free thresholds
- Order tracking in database

## Expected Impact
- Capture Canadian sales directly (15% target rate)
- Reduced Etsy fees (5% + payment processing)
- Customer email acquisition for marketing
- Better data on customer preferences
```

**Step 2: Commit report**

```bash
git add docs/plans/2026-03-13-checkout-completion-report.md
git commit -m "docs: add checkout completion report"
```

---

## Testing Checklist

Before marking this complete, verify:

- [ ] Database tables created successfully
- [ ] Tax calculation correct for all provinces
- [ ] Shipping zones work correctly
- [ ] E-Transfer checkout flow works end-to-end
- [ ] Order is created in database after checkout
- [ ] Confirmation page displays correctly
- [ ] Form validation works (invalid email, postal code)
- [ ] All tests pass: `npm run test`
- [ ] TypeScript check passes: `npm run check`
- [ ] Production build succeeds: `npm run build`

---

**Total Estimated Time:** 8-10 hours

**Dependencies:**
- None (can be done independently after Phase 1)
- Requires PostgreSQL database setup (Neon recommended)

**Next Phase:** Phase 5 - Analytics & Monitoring

---

## Continuation After Context Compression

If this session is compressed and you need to continue:

1. **Current Progress:** You completed Phase 4 (Direct Checkout)
2. **Next Step:** Implement Phase 5 (Analytics & Monitoring)
3. **Key Files Created:**
   - `server/database/migrations/001_create_orders.sql` - Database schema
   - `server/lib/tax.ts` - Tax calculation
   - `server/lib/shipping.ts` - Shipping calculation
   - `server/lib/stripe.ts` - Stripe integration
   - `server/lib/paypal.ts` - PayPal integration
   - `server/routes/checkout.ts` - Checkout API
   - `server/routes/stripe.ts` - Stripe webhooks
   - `server/routes/paypal.ts` - PayPal endpoints
   - `client/src/pages/Checkout.tsx` - Checkout page
   - `client/src/pages/CheckoutConfirmation.tsx` - Confirmation page
   - `client/src/components/checkout/` - Checkout components
4. **Design Reference:** `docs/plans/2026-03-13-comprehensive-improvements-design.md` - Phase 5 section
5. **Environment Variables Needed:**
   - `DATABASE_URL` - PostgreSQL connection
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` - Stripe
   - `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET` - PayPal
   - `ETRANSFER_EMAIL` - E-Transfer recipient
   - `SITE_URL` - Site URL for redirects

Continue to Phase 5 implementation plan at `docs/plans/2026-03-13-analytics-implementation.md`
