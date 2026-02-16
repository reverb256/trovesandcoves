// Vercel serverless function for orders management
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { orders, orderItems, cartItems, products } from '../../../shared/schema.js';
import { eq, and } from 'drizzle-orm';

// Database connection
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// CORS headers for GitHub Pages
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || 'https://reverb256.github.io',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// Generate or retrieve session ID from header
function getSessionId(req) {
  const sessionId = req.headers['x-session-id'] || 
                   req.headers.authorization?.replace('Bearer ', '') ||
                   `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return sessionId;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    return res.end();
  }

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { method, query, body } = req;
    const sessionId = getSessionId(req);

    switch (method) {
      case 'POST':
        const currentCartItems = await db
          .select({
            cartItem: cartItems,
            product: products
          })
          .from(cartItems)
          .leftJoin(products, eq(cartItems.productId, products.id))
          .where(eq(cartItems.sessionId, sessionId));

        if (currentCartItems.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Cart is empty' }));
        }

        const totalAmount = currentCartItems.reduce((sum, item) => {
          return sum + parseFloat(item.product.price) * item.cartItem.quantity;
          }, 0);

        const newOrder = await db
          .insert(orders)
          .values({
            sessionId,
            totalAmount: totalAmount.toString(),
            currency: 'CAD',
            shippingAddress: body.shippingAddress,
            billingAddress: body.billingAddress,
            customerEmail: body.customerEmail,
            customerPhone: body.customerPhone,
            stripePaymentIntentId: body.stripePaymentIntentId,
            status: 'pending'
          })
          .returning();

        for (const cartItem of currentCartItems) {
          await db
            .insert(orderItems)
            .values({
              orderId: newOrder[0].id,
              productId: cartItem.cartItem.productId,
              quantity: cartItem.cartItem.quantity,
              price: cartItem.product.price
            });
        }

        await db
          .delete(cartItems)
          .where(eq(cartItems.sessionId, sessionId));

        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(newOrder[0]));

      case 'GET':
        if (query.id) {
          const orderId = parseInt(query.id);
          if (isNaN(orderId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid order ID' }));
          }

          const order = await db
            .select()
            .from(orders)
            .where(eq(orders.id, orderId))
            .limit(1);

          if (order.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Order not found' }));
          }

          const items = await db
            .select({
              orderItem: orderItems,
              product: products
            })
            .from(orderItems)
            .leftJoin(products, eq(orderItems.productId, products.id))
            .where(eq(orderItems.orderId, orderId));

          const orderWithItems = {
            ...order[0],
            items: items.map(item => ({
              ...item.orderItem,
              product: item.product
            }))
          };

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(orderWithItems));
        } else {
          const sessionOrders = await db
            .select()
            .from(orders)
            .where(eq(orders.sessionId, sessionId))
            .orderBy(orders.createdAt);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(sessionOrders));
        }

      case 'PUT':
        if (!query.id) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Order ID is required' }));
        }

        const orderId = parseInt(query.id);
        const { status, paymentIntentId } = body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid order status' }));
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (paymentIntentId) updateData.stripePaymentIntentId = paymentIntentId;

        const updatedOrder = await db
          .update(orders)
          .set(updateData)
          .where(eq(orders.id, orderId))
          .returning();

        if (updatedOrder.length === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Order not found' }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(updatedOrder[0]));

      default:
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } catch (error) {
    console.error('Orders API error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }));
  }
}