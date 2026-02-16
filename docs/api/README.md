# API Documentation

## 🌐 Overview

The Troves & Coves API provides endpoints for managing products, cart operations, search functionality, and AI-powered features. The API is deployed on Cloudflare Workers for global performance and reliability.

### Base URLs

- **Production**: `https://troves-coves-api.your-subdomain.workers.dev`
- **Development**: `http://localhost:3000`

### Authentication

Most endpoints are public and don't require authentication. For cart operations, include a session ID header:

```http
X-Session-ID: your-session-id
```

## 📋 Endpoints

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
    "imageUrl": "https://example.com/image.jpg",
    "description": "Handcrafted wire-wrapped crystal pendant",
    "inStock": true,
    "featured": true
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
    "featured": true,
    ...
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
  "imageUrl": "https://example.com/image.jpg",
  "description": "Handcrafted wire-wrapped crystal pendant",
  "inStock": true,
  "featured": true
}
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

### Search

#### Search Products
```http
GET /api/search?q={query}
```

**Parameters:**
- `q` (string): Search query

**Response:**
```json
[
  {
    "id": 1,
    "name": "Wire Wrapped Crystal Pendant",
    "description": "Handcrafted wire-wrapped crystal pendant",
    "category": "Pendants",
    ...
  }
]
```

### AI Features

#### Get Recommendations
```http
POST /ai/recommendations
```

**Body:**
```json
{
  "productId": 1,
  "userId": "optional-user-id"
}
```

**Response:**
```json
[
  {
    "productId": 2,
    "reason": "Complementary healing properties for emotional balance"
  },
  {
    "productId": 3,
    "reason": "Aesthetic harmony with rose gold wire wrapping"
  }
]
```

#### Market Analysis
```http
GET /ai/market-analysis
```

**Response:**
```json
{
  "popularCategories": ["Healing Crystals", "Wire Wrapped Jewellery"],
  "seasonalTrends": "Spring collection showing increased demand",
  "priceInsights": "Premium handcrafted pieces commanding higher prices",
  "customerPreferences": "Canadian customers prefer authentic crystals"
}
```

### Analytics

#### Track Event
```http
POST /analytics/track
```

**Body:**
```json
{
  "event": "product_view",
  "data": {
    "productId": 1,
    "category": "Pendants"
  }
}
```

**Response:**
```json
{
  "success": true
}
```

## 🔧 Error Handling

### Standard Error Response
```json
{
  "error": "Error message",
  "code": 400,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### HTTP Status Codes

- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `429` - Rate Limited (redirects to GitHub Pages)
- `500` - Internal Server Error
- `503` - Service Unavailable

### Rate Limiting

The API has a daily limit of 90,000 requests. When exceeded:

```json
{
  "error": "Daily request limit reached",
  "message": "Redirecting to static site for continued browsing",
  "redirect": "https://username.github.io/troves-coves"
}
```

## 🚀 Free Tier Optimizations

### Caching
- **Products**: Cached for 1 hour
- **Cart**: Session-based with 24-hour TTL
- **Analytics**: Sampled at 10% to save storage

### Request Optimization
- Automatic rate limiting at 90% of free tier
- Fallback to GitHub Pages when limits reached
- Aggressive response caching

### Storage Management
- **Products**: Stored in `PRODUCTS_KV`
- **Cart Sessions**: Stored in `CART_KV` with TTL
- **Analytics**: Stored in `ANALYTICS_KV` with 30-day retention

## 🔒 Security

### CORS
Cross-origin requests are allowed from:
- `https://trovesandcoves.ca`
- `https://*.github.io`
- `localhost` (development)

### Headers
Standard security headers are applied:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `Cache-Control`

### Data Protection
- No sensitive data stored in KV
- Session IDs are client-generated
- Analytics data is anonymized

## 📊 Monitoring

### Request Tracking
Daily request counts are automatically tracked and logged.

### Error Logging
All errors are logged with:
- Timestamp
- Error message
- Request details
- User agent
- IP address (if available)

### Performance Metrics
- Response times
- Cache hit rates
- KV read/write operations
- Request volume by endpoint

## 🛠️ Development

### Local Testing
```bash
# Start local development server
npm run dev

# Test Cloudflare Worker locally
npm run cf:dev
```

### Environment Variables
```env
# API Configuration
ANTHROPIC_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here

# Rate Limiting
MAX_REQUESTS_PER_DAY=90000
REQUEST_LIMIT_ENABLED=true

# Caching
CACHE_TTL=3600
ENABLE_CACHING=true
```

### Testing Endpoints
```bash
# Test product endpoint
curl https://your-worker.workers.dev/api/products

# Test with session
curl -H "X-Session-ID: test-session" \
     https://your-worker.workers.dev/api/cart
```

## 📚 SDKs and Examples

### JavaScript/TypeScript
```typescript
// Fetch products
const products = await fetch('/api/products').then(r => r.json());

// Add to cart
await fetch('/api/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Session-ID': sessionId
  },
  body: JSON.stringify({ productId: 1, quantity: 1 })
});
```

### React Hook Example
```typescript
import { useQuery } from '@tanstack/react-query';

function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(r => r.json()),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
```

---

For more examples and integration guides, see the [Development Guide](../development/README.md).
