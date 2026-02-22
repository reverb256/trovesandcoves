const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://troves-coves-api.vercel.app'
  : 'http://localhost:3000';

const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://reverb256.github.io/troves-coves'
  : 'http://localhost:5173';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface CartItem {
  productId: number;
  quantity: number;
}

interface OrderData {
  [key: string]: unknown;
}

interface PaymentMetadata {
  [key: string]: unknown;
}

interface ContactFormData {
  [key: string]: unknown;
}

class SessionManager {
  static getSessionId(): string {
    let sessionId = sessionStorage.getItem('troves_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('troves_session', sessionId);
    }
    return sessionId;
  }

  static clearSession(): void {
    sessionStorage.removeItem('troves_session');
    localStorage.removeItem('troves_cart_backup');
  }

  static backupCart(cartData: unknown): void {
    localStorage.setItem('troves_cart_backup', JSON.stringify(cartData));
  }

  static getCartBackup(): unknown | null {
    const backup = localStorage.getItem('troves_cart_backup');
    return backup ? JSON.parse(backup) : null;
  }
}

export async function apiFetch(
  endpoint: string,
  options: RequestOptions = {},
  retries = 3
): Promise<unknown> {
  const sessionId = SessionManager.getSessionId();
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestOptions = {
    headers: {
      'Content-Type': 'application/json',
      'X-Session-ID': sessionId,
      ...(options.headers || {}),
    },
    ...options,
  };

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as { error?: string }).error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export const productsApi = {
  getAll: (category?: string) => apiFetch(category ? `/api/products?category=${category}` : '/api/products'),
  getFeatured: () => apiFetch('/api/products/featured'),
  getById: (id: number) => apiFetch(`/api/products?id=${id}`),
};

export const cartApi = {
  get: () => apiFetch('/api/cart'),
  add: (productId: number, quantity: number) =>
    apiFetch('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  update: (id: number, quantity: number) =>
    apiFetch(`/api/cart?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),
  remove: (id: number) =>
    apiFetch(`/api/cart?id=${id}`, { method: 'DELETE' }),
};

export const ordersApi = {
  create: (orderData: OrderData) =>
    apiFetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  getById: (id: number) => apiFetch(`/api/orders?id=${id}`),
  getAll: () => apiFetch('/api/orders'),
  updateStatus: (id: number, status: string, paymentIntentId?: string) =>
    apiFetch(`/api/orders?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, paymentIntentId }),
    }),
};

export const paymentsApi = {
  createIntent: (amount: number, metadata: PaymentMetadata = {}) =>
    apiFetch('/api/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ amount, ...metadata }),
    }),
};

export const contactApi = {
  submit: (formData: ContactFormData) =>
    apiFetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),
};

export const categoriesApi = {
  getAll: () => apiFetch('/api/categories'),
};

export const apiUtils = {
  SessionManager,
  getApiUrl: () => API_BASE_URL,
  getFrontendUrl: () => FRONTEND_URL,
  isProduction: () => process.env.NODE_ENV === 'production',
};

export default {
  fetch: apiFetch,
  products: productsApi,
  cart: cartApi,
  orders: ordersApi,
  payments: paymentsApi,
  contact: contactApi,
  categories: categoriesApi,
  utils: apiUtils,
};
