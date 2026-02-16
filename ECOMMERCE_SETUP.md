# Troves & Coves E-Commerce Setup Guide

This guide will help you set up the complete e-commerce functionality for Troves & Coves.

## Overview

The e-commerce system consists of:
- ✅ **Order Creation API** - POST /api/orders (Complete)
- ✅ **Order Retrieval API** - GET /api/orders/:id (Complete)
- ✅ **Order Status Update** - POST /api/orders/:id/status (Complete)
- ✅ **Order Confirmation Page** - Complete checkout flow (Complete)
- ✅ **PostgreSQL Database** - Persistent data storage (Implementation ready)
- ✅ **Stripe Integration** - Payment processing (Implementation ready)

## Prerequisites

1. **Node.js 18+** installed
2. **PostgreSQL 14+** database (Neon, Supabase, or self-hosted)
3. **Stripe account** with test keys (or live keys for production)

## Database Setup

### Option 1: Neon (Recommended - Free Tier)

1. Go to [Neon](https://neon.tech) and create a free account
2. Create a new project called "trovesandcoves"
3. Copy the Connection string (starts with `postgresql://`)
4. Run the following command to push the schema:

```bash
# Set your DATABASE_URL
export DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# Push the database schema
npm run db:push
```

### Option 2: Supabase (Free Tier)

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > Database > Connection string
4. Copy the URI and use "Session mode" for the connection string
5. Follow the same steps as Option 1 to push the schema

### Option 3: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database:
```bash
createdb trovesandcoves
```
3. Update DATABASE_URL in .env:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/trovesandcoves
```
4. Run migrations:
```bash
npm run db:push
```

## Stripe Setup

### 1. Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign up or log in
3. Go to Developers > API keys
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

### 2. Configure Environment Variables

Create or update `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/trovesandcoves

# Stripe - TEST MODE
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_publishable_key_here

# For production, use live keys (sk_live_ and pk_live_)
```

### 3. Set Up Stripe Webhooks (Optional but Recommended)

1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the webhook secret and add to .env:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Running the Application

### Development Mode

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The server will run on `http://localhost:5000`

### Production Build

```bash
# Build frontend
npm run build:frontend

# Start production server
NODE_ENV=production npm start
```

## Testing the E-Commerce Flow

### 1. Browse Products
- Navigate to `http://localhost:5000/products`
- Browse through different categories

### 2. Add to Cart
- Click on any product
- Click "Add to Cart"
- Check cart in the drawer

### 3. Checkout Process
1. Go to Cart
2. Click "Proceed to Checkout"
3. Fill in:
   - Contact information (email, name, phone)
   - Shipping address
   - Billing address (can be same as shipping)
4. Enter test card details:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
5. Click "Complete Order"

### 4. Order Confirmation
- After successful payment, you'll be redirected to `/order-confirmation`
- You'll see:
  - Order number
  - Order details
  - Items purchased
  - Shipping address
  - Next steps

## API Endpoints

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/status` - Update order status

### Payment
- `POST /api/create-payment-intent` - Create Stripe payment intent

### Products
- `GET /api/products` - List all products (with optional category filter)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

## Database Schema

### Orders Table
- `id` - Auto-increment ID
- `sessionId` - Session identifier
- `userId` - User ID (if logged in)
- `status` - Order status (pending, processing, shipped, delivered, cancelled)
- `totalAmount` - Total order amount
- `currency` - Currency code (default: CAD)
- `shippingAddress` - Shipping address
- `billingAddress` - Billing address
- `customerEmail` - Customer email
- `customerPhone` - Customer phone
- `stripePaymentIntentId` - Stripe payment intent ID
- `createdAt` - Order creation timestamp

### Order Items Table
- `id` - Auto-increment ID
- `orderId` - Reference to orders table
- `productId` - Reference to products table
- `quantity` - Item quantity
- `price` - Price per item at time of order

## Deployment

### GitHub Pages + Cloudflare Workers (Recommended for Free Hosting)

1. **Frontend to GitHub Pages:**
   ```bash
   npm run build:github-pages
   npm run deploy:github-pages
   ```

2. **Backend to Cloudflare Workers:**
   ```bash
   npm run deploy:cloudflare
   ```

### Traditional Hosting (VPS, etc.)

1. Set environment variables on the server
2. Build the application:
   ```bash
   npm run build
   ```
3. Use PM2 to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start npm --name "trovesandcoves" -- start
   ```
4. Set up Nginx as a reverse proxy (optional but recommended)

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL is correct
- Check if PostgreSQL is running
- Verify SSL settings in connection string

### Stripe Payment Errors
- Ensure STRIPE_SECRET_KEY is correct
- Check that API keys match the mode (test vs live)
- Verify webhook configuration (if using webhooks)

### Order Not Creating
- Check if cart has items
- Verify all required fields are filled
- Check server logs for error messages

### Build Errors
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/reverb256/trovesandcoves/issues)
- Contact support@trovesandcoves.ca

## Next Steps

1. **Set up production Stripe keys** - Get live API keys from Stripe
2. **Configure email notifications** - Set up transactional emails (SendGrid, Mailgun, etc.)
3. **Set up shipping** - Configure shipping rates and carriers
4. **Add analytics** - Google Analytics, Facebook Pixel, etc.
5. **SEO optimization** - Add meta tags, sitemap, robots.txt
