/**
 * Cloudflare Client for GitHub Pages Integration
 * Maintains all advanced features through edge computing
 */

const CLOUDFLARE_API_BASE = 'https://api.trovesandcoves.ca';

class CloudflareClient {
  private baseUrl: string;
  private sessionId: string;

  constructor() {
    this.baseUrl = CLOUDFLARE_API_BASE;
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('trovesandcoves_session');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('trovesandcoves_session', sessionId);
    }
    return sessionId;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'x-session-id': this.sessionId,
      'x-platform': 'github-pages'
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
  async getProducts() {
    return this.makeRequest('/api/products');
  }

  async getFeaturedProducts() {
    return this.makeRequest('/api/products/featured');
  }

  async getProduct(id: string | number) {
    return this.makeRequest(`/api/products/${id}`);
  }

  async searchProducts(query: string) {
    return this.makeRequest(`/api/search?q=${encodeURIComponent(query)}`);
  }

  // Cart API methods
  async getCart() {
    return this.makeRequest('/api/cart');
  }

  async addToCart(productId: number, quantity: number) {
    return this.makeRequest('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: number, quantity: number) {
    return this.makeRequest('/api/cart', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: number) {
    return this.makeRequest(`/api/cart/${productId}`, {
      method: 'DELETE',
    });
  }

  // AI-powered features
  async getAIRecommendations(productId: number, userId?: string) {
    return this.makeRequest('/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ productId, userId }),
    });
  }

  async getMarketAnalysis() {
    return this.makeRequest('/ai/market-analysis');
  }

  // Analytics and tracking
  async trackEvent(event: string, data: any = {}) {
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
  async getCustomerInsights() {
    return this.makeRequest('/ai/customer-insights');
  }

  // Inventory management
  async checkInventory(productId: number) {
    return this.makeRequest(`/api/inventory/${productId}`);
  }

  // Real-time features
  async subscribeToUpdates(callback: (data: any) => void) {
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
  getAIRecommendations,
  getMarketAnalysis,
  trackEvent,
  getCustomerInsights,
  checkInventory,
  subscribeToUpdates
} = cloudflareClient;