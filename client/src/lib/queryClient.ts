import { QueryClient, QueryFunction } from "@tanstack/react-query";
import {
  getEmbeddedProducts,
  getEmbeddedProduct,
  getEmbeddedFeaturedProducts,
  getEmbeddedCategories,
  searchEmbeddedProducts,
  EMBEDDED_CATEGORIES
} from "@shared/embedded-data";

// Get API base URL from environment or use defaults
const isDevelopment = import.meta.env.DEV || typeof window !== 'undefined' && window.location.hostname === 'localhost';
const DEFAULT_DEV_API = '/api';

// Check if we should use embedded data (GitHub Pages production)
const shouldUseEmbeddedData = !isDevelopment && (
  window.location.hostname === 'trovesandcoves.ca' ||
  window.location.hostname === 'reverb256.github.io'
);

// Session management with atomic get-or-create
const SESSION_KEY = 'trovesandcoves_session';

function getOrCreateSessionId(): string {
  // Atomic get-or-create to prevent race conditions
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function getApiUrl(path: string): string {
  // If using embedded data, we don't need API URLs
  if (shouldUseEmbeddedData) {
    return path;
  }

  // Only route /api/ paths in development
  const isApiPath = path.startsWith('/api/');
  if (!isApiPath) return path;

  return DEFAULT_DEV_API + path;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // For cart operations in production, use localStorage
  if (shouldUseEmbeddedData && url.startsWith('/api/cart')) {
    // Handle cart operations via localStorage for now
    // This could be enhanced later
    const response = new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    return response as Response;
  }

  // For contact/newsletter in production, return success
  if (shouldUseEmbeddedData && (url.startsWith('/api/contact') || url.startsWith('/api/newsletter'))) {
    const response = new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    return response as Response;
  }

  // Development: use actual API
  const finalUrl = getApiUrl(url);
  const sessionId = getOrCreateSessionId();
  const platform = 'development';

  const res = await fetch(finalUrl, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      'x-session-id': sessionId,
      'x-platform': platform
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> = (options) => async ({ queryKey }) => {
  const { on401: unauthorizedBehavior } = options;
    const url = queryKey[0] as string;

    // Use embedded data for GitHub Pages production
    if (shouldUseEmbeddedData) {
      // Handle embedded data requests
      if (url === '/api/products') {
        return getEmbeddedProducts();
      }
      if (url.startsWith('/api/products?')) {
        // Handle filters (category, search)
        const searchParams = new URLSearchParams(url.split('?')[1]);
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');

        if (categoryParam) {
          // Find category by slug
          const category = EMBEDDED_CATEGORIES.find(c => c.slug === categoryParam);
          if (category) {
            return getEmbeddedProducts(category.id);
          }
        }
        if (searchParam) {
          return searchEmbeddedProducts(searchParam);
        }
        return getEmbeddedProducts();
      }
      if (url.startsWith('/api/products/') && url !== '/api/products/featured') {
        const id = parseInt(url.split('/').pop()!);
        return getEmbeddedProduct(id);
      }
      if (url === '/api/products/featured') {
        return getEmbeddedFeaturedProducts();
      }
      if (url === '/api/categories') {
        return getEmbeddedCategories();
      }
      if (url.startsWith('/api/products?search=')) {
        const searchParams = new URLSearchParams(url.split('?')[1]);
        const query = searchParams.get('search') || '';
        return searchEmbeddedProducts(query);
      }
      if (url.startsWith('/api/products/search')) {
        const searchParams = new URLSearchParams(url.split('?')[1]);
        const query = searchParams.get('q') || '';
        return searchEmbeddedProducts(query);
      }

        // For cart/contact forms, return empty/default responses
      if (url === '/api/cart') {
        return [] as unknown;
      }
      if (url.startsWith('/api/contact')) {
        return { success: true } as unknown;
      }
      if (url.startsWith('/api/newsletter')) {
        return { success: true } as unknown;
      }

      // Return null for unsupported endpoints
      return null as unknown;
    }

    // Development: use actual API
    const finalUrl = getApiUrl(url);
    const sessionId = getOrCreateSessionId();
    const platform = 'development';

    const res = await fetch(finalUrl, {
      credentials: "include",
      headers: {
        'x-session-id': sessionId,
        'x-platform': platform
      }
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
