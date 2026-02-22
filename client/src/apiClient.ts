import { API_URL, FRONTEND_URL, API_TIMEOUT_MS, API_RETRY_ATTEMPTS } from '@shared/config';

const API_BASE_URL = API_URL;

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  timeout?: number;
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
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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
  retries = API_RETRY_ATTEMPTS
): Promise<unknown> {
  const sessionId = SessionManager.getSessionId();
  const url = `${API_BASE_URL}${endpoint}`;
  const timeout = options.timeout || API_TIMEOUT_MS;

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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...defaultOptions,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        let errorCode: string | undefined;

        try {
          const errorData = await response.json();
          errorMessage = (errorData as { error?: string; message?: string }).error ||
                        (errorData as { error?: string; message?: string }).message ||
                        errorMessage;

          // Set error code based on status
          if (response.status === 401) errorCode = 'UNAUTHORIZED';
          else if (response.status === 403) errorCode = 'FORBIDDEN';
          else if (response.status === 404) errorCode = 'NOT_FOUND';
          else if (response.status >= 500) errorCode = 'SERVER_ERROR';
        } catch {
          // If response is not JSON, use default message
        }

        throw new ApiError(errorMessage, response.status, errorCode);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      lastError = error;

      // Don't retry on ApiError (except 5xx errors)
      if (error instanceof ApiError) {
        if (error.status && error.status >= 500 && attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }

      if (attempt < retries && error instanceof Error && error.name !== 'AbortError') {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Handle timeout or other errors
  if (lastError instanceof Error) {
    if (lastError.name === 'AbortError') {
      throw new ApiError('Request timeout. Please check your connection and try again.', undefined, 'TIMEOUT');
    }
    throw new ApiError(lastError.message, undefined, 'NETWORK_ERROR');
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
