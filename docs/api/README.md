# API Documentation

## Overview

The Troves & Coves API provides endpoints for product browsing and cart operations. In production, the site is static with data embedded, but a development API is available for local development.

### Base URLs

- **Development**: `http://localhost:5000`
- **Production**: Static site (no API - data is embedded)

### Authentication

No authentication required. Cart operations use session-based storage with session IDs passed via headers.

---

## Endpoints

### Products

#### Get All Products

```http
GET /api/products
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Wire Wrapped Crystal Pendant",
    "price": "45.00",
    "category": "Pendants",
    "imageUrl": "/product-images/wire-wrapped-pendant.jpg",
    "description": "Handcrafted wire-wrapped crystal pendant",
    "inStock": true,
    "featured": true,
    "etsyListingId": "1234567890"
  }
]
```

#### Get Featured Products

```http
GET /api/products/featured
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Wire Wrapped Crystal Pendant",
    "featured": true
  }
]
```

#### Get Single Product

```http
GET /api/products/{id}
```

**Parameters:**

- `id` (integer): Product ID

**Response:**

```json
{
  "id": 1,
  "name": "Wire Wrapped Crystal Pendant",
  "price": "45.00",
  "category": "Pendants",
  "imageUrl": "/product-images/wire-wrapped-pendant.jpg",
  "description": "Handcrafted wire-wrapped crystal pendant with 14k gold-plated wire",
  "inStock": true,
  "featured": true,
  "materials": ["Amethyst", "14k Gold Plated Wire"],
  "etsyListingId": "1234567890"
}
```

#### Search Products

```http
GET /api/search?q={query}
```

**Parameters:**

- `q` (string): Search query for product names and descriptions

**Response:**

```json
[
  {
    "id": 1,
    "name": "Amethyst Pendant",
    "description": "...",
    "category": "Pendants"
  }
]
```

### Cart Operations

#### Get Cart

```http
GET /api/cart
```

**Headers:**

```http
X-Session-ID: your-session-id
```

**Response:**

```json
[
  {
    "productId": 1,
    "quantity": 2
  }
]
```

#### Add to Cart

```http
POST /api/cart
```

**Headers:**

```http
Content-Type: application/json
X-Session-ID: your-session-id
```

**Body:**

```json
{
  "productId": 1,
  "quantity": 1
}
```

**Response:**

```json
{
  "success": true
}
```

#### Update Cart Item

```http
PUT /api/cart/{productId}
```

**Headers:**

```http
Content-Type: application/json
X-Session-ID: your-session-id
```

**Body:**

```json
{
  "quantity": 3
}
```

**Response:**

```json
{
  "success": true
}
```

#### Remove from Cart

```http
DELETE /api/cart/{productId}
```

**Headers:**

```http
X-Session-ID: your-session-id
```

**Response:**

```json
{
  "success": true
}
```

#### Clear Cart

```http
DELETE /api/cart
```

**Headers:**

```http
X-Session-ID: your-session-id
```

**Response:**

```json
{
  "success": true
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": "Error message",
  "code": 400
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

---

## Development Setup

### Local Development Server

The development server combines Express (API) with Vite (frontend):

```bash
npm run dev
```

This starts:

- Frontend: `http://localhost:5173`
- API: `http://localhost:5000`

### Data Storage

In development, products are stored in-memory using the `MemStorage` class. Product data is seeded from `server/storage.ts`.

### Session Management

Cart data is stored server-side with session IDs. Sessions expire after 24 hours.

---

## Production Notes

### Static Site

In production, the site is fully static with:

- No API calls for product data (embedded in build)
- Cart functionality using localStorage
- Purchase redirects to Etsy storefront

### Optional Cloudflare Worker

A Cloudflare Worker can be deployed for:

- Etsy product synchronization
- Optional API endpoints
- Edge caching

See `cloudflare/` directory for worker configuration.

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Fetch products
const products = await fetch('/api/products').then(r => r.json());

// Add to cart
await fetch('/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Session-ID': sessionId,
  },
  body: JSON.stringify({ productId: 1, quantity: 1 }),
});
```

### React Hook Example

```typescript
import { useQuery } from '@tanstack/react-query';

function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(r => r.json()),
  });
}
```

---

## Data Models

### Product

```typescript
interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  imageUrl: string;
  description: string;
  inStock: boolean;
  featured: boolean;
  materials?: string[];
  etsyListingId?: string;
}
```

### CartItem

```typescript
interface CartItem {
  productId: number;
  quantity: number;
}
```

---

For more information, see:

- [Development Guide](../development/README.md)
- [CLAUDE.md](../../CLAUDE.md)
