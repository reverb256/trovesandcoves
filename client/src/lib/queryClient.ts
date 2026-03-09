import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get API base URL from environment or use defaults
const isDevelopment = import.meta.env.DEV || typeof window !== 'undefined' && window.location.hostname === 'localhost';
const DEFAULT_DEV_API = '/api';
const DEFAULT_PROD_API = import.meta.env.VITE_CLOUDFLARE_API || 'https://api.trovesandcoves.ca';

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
  // Only route /api/ paths through Cloudflare in production
  const isApiPath = path.startsWith('/api/');
  if (!isApiPath) return path;

  return isDevelopment ? DEFAULT_DEV_API : DEFAULT_PROD_API + path;
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
  const finalUrl = getApiUrl(url);
  const sessionId = getOrCreateSessionId();
  const platform = isDevelopment ? 'development' : 'github-pages';

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
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const finalUrl = getApiUrl(url);
    const sessionId = getOrCreateSessionId();
    const platform = isDevelopment ? 'development' : 'github-pages';

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
