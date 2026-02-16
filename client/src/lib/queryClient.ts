import { QueryClient, QueryFunction } from "@tanstack/react-query";

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
  // Route API calls through Cloudflare for GitHub Pages deployment, local for development
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
  const cloudflareApiBase = 'https://api.trovesandcoves.ca';
  const finalUrl = url.startsWith('/api/') && !isDevelopment ? `${cloudflareApiBase}${url}` : url;
  
  const sessionId = localStorage.getItem('trovesandcoves_session') || crypto.randomUUID();
  if (!localStorage.getItem('trovesandcoves_session')) {
    localStorage.setItem('trovesandcoves_session', sessionId);
  }

  const res = await fetch(finalUrl, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      'x-session-id': sessionId,
      'x-platform': isDevelopment ? 'development' : 'github-pages'
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
    // Route API calls through Cloudflare for GitHub Pages deployment, local for development
    const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
    const cloudflareApiBase = 'https://api.trovesandcoves.ca';
    const url = queryKey[0] as string;
    const finalUrl = url.startsWith('/api/') && !isDevelopment ? `${cloudflareApiBase}${url}` : url;
    
    const sessionId = localStorage.getItem('trovesandcoves_session') || crypto.randomUUID();
    if (!localStorage.getItem('trovesandcoves_session')) {
      localStorage.setItem('trovesandcoves_session', sessionId);
    }

    const res = await fetch(finalUrl, {
      credentials: "include",
      headers: {
        'x-session-id': sessionId,
        'x-platform': isDevelopment ? 'development' : 'github-pages'
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
