// Vercel serverless function for products
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { products, categories } from '../../../shared/schema.js';
import { eq, and, isNull } from 'drizzle-orm';

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
    const { method, query } = req;

    switch (method) {
      case 'GET':
        if (query.id) {
          // Get single product
          const id = parseInt(query.id);
          if (isNaN(id)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Invalid product ID' }));
          }

          const product = await db
            .select()
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .where(eq(products.id, id))
            .limit(1);

          if (product.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Product not found' }));
          }

          const productWithCategory = {
            ...product[0].products,
            category: product[0].categories
          };

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(productWithCategory));
        } else if (query.featured) {
          // Get featured products
          const featuredProducts = await db
            .select()
            .from(products)
            .where(and(eq(products.isFeatured, true), eq(products.isActive, true)))
            .limit(6);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(featuredProducts));
        } else {
          // Get all products with optional category filter
          let whereCondition = eq(products.isActive, true);

          if (query.category && query.category !== 'all') {
            const category = await db
              .select()
              .from(categories)
              .where(eq(categories.slug, query.category))
              .limit(1);

            if (category.length > 0) {
              whereCondition = and(
                whereCondition,
                eq(products.categoryId, category[0].id)
              );
            }
          }

          const allProducts = await db
            .select({
              ...products,
              category: categories
            })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .where(whereCondition);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify(allProducts));
        }

      default:
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  } catch (error) {
    console.error('Products API error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }));
  }
}