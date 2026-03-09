/**
 * Cloudflare Client for GitHub Pages Integration
 * Maintains all advanced features through edge computing
 */

import { getOrCreateSessionId, isDevelopment } from './session-utils';

const CLOUDFLARE_API_BASE = import.meta.env.VITE_CLOUDFLARE_API || 'https://api.trovesandcoves.ca';

interface WebSocketCallback {
  (data: unknown): void;
}

class CloudflareClient {
  private readonly baseUrl: string;
  private readonly sessionId: string;
  private readonly platform: string;

  constructor() {
    this.baseUrl = CLOUDFLARE_API_BASE;
    this.sessionId = getOrCreateSessionId();
    this.platform = isDevelopment ? 'development' : 'github-pages';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-session-id': this.sessionId,
      'x-platform': this.platform
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Product API methods
  async getProducts(): Promise<unknown> {
    return this.makeRequest('/api/products');
  }

  async getFeaturedProducts(): Promise<unknown> {
    return this.makeRequest('/api/products/featured');
  }

  async getProduct(id: string | number): Promise<unknown> {
    return this.makeRequest(`/api/products/${id}`);
  }

  async searchProducts(query: string): Promise<unknown> {
    return this.makeRequest(`/api/search?q=${encodeURIComponent(query)}`);
  }

  // Cart API methods
  async getCart(): Promise<unknown> {
    return this.makeRequest('/api/cart');
  }

  async addToCart(productId: number, quantity: number): Promise<unknown> {
    return this.makeRequest('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: number, quantity: number): Promise<unknown> {
    return this.makeRequest('/api/cart', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: number): Promise<unknown> {
    return this.makeRequest(`/api/cart/${productId}`, {
      method: 'DELETE',
    });
  }

  // Analytics and tracking
  async trackEvent(event: string, data: Record<string, unknown> = {}): Promise<void> {
    try {
      await this.makeRequest('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ event, data }),
      });
    } catch (error) {
      // Analytics failures shouldn't break the user experience
      console.warn('Analytics tracking failed:', error);
    }
  }

  // Customer insights
  async getCustomerInsights(): Promise<unknown> {
    return this.makeRequest('/ai/customer-insights');
  }

  // Inventory management
  async checkInventory(productId: number): Promise<unknown> {
    return this.makeRequest(`/api/inventory/${productId}`);
  }

  // Real-time features
  subscribeToUpdates(callback: WebSocketCallback): WebSocket {
    // WebSocket connection through Cloudflare for real-time updates
    const wsUrl = this.baseUrl.replace('https://', 'wss://') + '/ws';
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  }
}

// Create singleton instance
export const cloudflareClient = new CloudflareClient();

// Export individual methods for convenience
export const {
  getProducts,
  getFeaturedProducts,
  getProduct,
  searchProducts,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  trackEvent,
  getCustomerInsights,
  checkInventory,
  subscribeToUpdates
} = cloudflareClient;
