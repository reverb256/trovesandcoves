// Cloudflare Worker types
declare global {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<{
      keys: Array<{ name: string; expiration?: number; metadata?: any }>;
      list_complete: boolean;
      cursor?: string;
    }>;
  }

  interface ExecutionContext {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
  }

  interface Request {
    cf?: {
      colo: string;
      country: string;
      city: string;
      continent: string;
      latitude: string;
      longitude: string;
      postalCode: string;
      metroCode: string;
      region: string;
      regionCode: string;
      timezone: string;
    };
  }
}

export {};