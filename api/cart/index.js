// Vercel serverless function for cart management
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { cartItems, products } from '../../../shared/schema.js';
import { eq, and } from 'drizzle-orm';

// Database connection
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// CORS headers for GitHub Pages
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://reverb256.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// Generate or retrieve session ID from header
function getSessionId(req) {
  // Use Authorization header or custom session header
  const sessionId = req.headers['x-session-id'] || 
                   req.headers.authorization?.replace('Bearer ', '') ||
                   `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return sessionId;
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    return res.end();
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { method, query, body } = req;
    const sessionId = getSessionId(req);

    switch (method) {
      case 'GET':
        // Get cart items for session
        const cartItemsData = await db
          .select({
            ...cartItems,
            product: products
          })
          .from(cartItems)
          .leftJoin(products, eq(cartItems.productId, products.id))
          .where(eq(cartItems.sessionId, sessionId));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(cartItemsData));

      case 'POST':
        // Add item to cart
        if (!body.productId || !body.quantity) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Product ID and quantity are required' }));
        }

        const productExists = await db
          .select()
          .from(products)
          .where(and(eq(products.id, body.productId), eq(products.isActive, true)))
          .limit(1);

        if (productExists.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Product not found or inactive' }));
        }

        const newCartItem = await db
          .insert(cartItems)
          .values({
            sessionId,
            productId: body.productId,
            quantity: body.quantity
          })
          .returning();

        const cartItemWithProduct = await db
          .select({
            ...cartItems,
            product: products
          })
          .from(cartItems)
          .leftJoin(products, eq(cartItems.productId, products.id))
          .where(eq(cartItems.id, newCartItem[0].id))
          .limit(1);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(cartItemWithProduct[0]));

      case 'PUT':
        if (!query.id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Cart item ID is required' }));
        }

        const cartItemId = parseInt(query.id);
        const { quantity } = body;

        if (quantity <= 0) {
          await db
            .delete(cartItems)
            .where(and(
              eq(cartItems.id, cartItemId),
              eq(cartItems.sessionId, sessionId)
            ));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: 'Item removed from cart' }));
        }

        const updatedItem = await db
          .update(cartItems)
          .set({ quantity })
          .where(and(
            eq(cartItems.id, cartItemId),
            eq(cartItems.sessionId, sessionId)
          ))
          .returning();

        if (updatedItem.length === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Cart item not found' }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(updatedItem[0]));

      case 'DELETE':
        if (!query.id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Cart item ID is required' }));
        }

        const deleteItemId = parseInt(query.id);
        const deleted = await db
          .delete(cartItems)
          .where(and(
            eq(cartItems.id, deleteItemId),
            eq(cartItems.sessionId, sessionId)
          ));

        if (deleted.rowCount === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Cart item not found' }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Item removed from cart' }));

      default:
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } catch (error) {
    console.error('Cart API error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }));
  }
}