import { EdgeOptimizer } from './cloudflare-edge-optimizer';

interface CloudflareContext {
  env: {
    CACHE: KVNamespace;
    AI_ORCHESTRATOR_ENABLED: string;
    CACHE_TTL: string;
    API_RATE_LIMIT: string;
    ENVIRONMENT: string;
  };
  ctx: ExecutionContext;
}

export default {
  async fetch(request: Request, env: CloudflareContext['env'], ctx: CloudflareContext['ctx']): Promise<Response> {
    const optimizer = new EdgeOptimizer(env);
    const url = new URL(request.url);

    // Enable CORS for all requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route through edge optimizer
      const response = await optimizer.optimizeRequest(request);
      
      // Add CORS headers to response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

      return response;
    } catch (error) {
      console.error('Edge processing error:', error);
      
      // Fallback to origin server
      const originResponse = await fetch(request);
      
      // Add CORS headers to fallback response
      Object.entries(corsHeaders).forEach(([key, value]) => {
        originResponse.headers.set(key, value);
      });

      return originResponse;
    }
  }
};