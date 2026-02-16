import { EventEmitter } from 'events';
import { BRAND_CONFIG, validateBrandCompliance } from '@shared/brand-config';
import { imagePreservationService } from './services/image-preservation';
import { privacyGuard, canadianCompliance } from './security/data-privacy';

interface APIEndpoint {
  name: string;
  baseUrl: string;
  models: string[];
  isAvailable: boolean;
  lastChecked: Date;
  rateLimitRemaining?: number;
  rateLimitReset?: Date;
  priority: number;
  cost: number;
  features: string[];
}

interface AIRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
  priority?: 'low' | 'medium' | 'high';
  type?: 'text' | 'image' | 'audio';
}

interface AIResponse {
  content: string;
  model: string;
  provider: string;
  tokensUsed: number;
  timestamp: Date;
  mediaUrl?: string;
}

class APIDiscoveryAgent extends EventEmitter {
  private readonly REPLIT_MEMORY_LIMIT = 384; // MB (512MB - 128MB reserved)
  private readonly REPLIT_CPU_CORES = 1;
  private cloudflareOrchestrator: any;

  private endpoints: APIEndpoint[] = [
    {
      name: 'Cloudflare Edge AI',
      baseUrl: process.env.CLOUDFLARE_WORKER_URL || 'https://troves-and-coves.workers.dev',
      models: ['edge-llm', 'cf-ai-gateway'],
      isAvailable: true,
      lastChecked: new Date(),
      rateLimitRemaining: 100000, // Cloudflare free tier
      priority: 1,
      cost: 0,
      features: ['text', 'edge-processing', 'global-cdn', 'unlimited-bandwidth']
    },
    {
      name: 'Local Resource Manager',
      baseUrl: 'internal://replit',
      models: ['memory-optimized', 'cpu-efficient'],
      isAvailable: true,
      lastChecked: new Date(),
      rateLimitRemaining: 100,
      priority: 10, // Lowest priority - use only when necessary
      cost: 1,
      features: ['text', 'fallback-only', 'memory-constrained']
    },
    {
      name: 'Pollinations AI',
      baseUrl: 'https://text.pollinations.ai',
      models: ['openai', 'mistral', 'llama', 'claude'],
      isAvailable: true,
      lastChecked: new Date(),
      rateLimitRemaining: 1000,
      priority: 2,
      cost: 0,
      features: ['text', 'fast', 'free', 'privacy-friendly']
    },
    {
      name: 'Pollinations Image',
      baseUrl: 'https://image.pollinations.ai/prompt',
      models: ['flux', 'turbo'],
      isAvailable: true,
      lastChecked: new Date(),
      rateLimitRemaining: 1000,
      priority: 2,
      cost: 0,
      features: ['image', 'watermark-removal', 'high-quality', 'commercial-use', 'free']
    },
    {
      name: 'Pollinations Audio',
      baseUrl: 'https://audio.pollinations.ai',
      models: ['bark', 'musicgen'],
      isAvailable: true,
      lastChecked: new Date(),
      rateLimitRemaining: 1000,
      priority: 2,
      cost: 0,
      features: ['audio', 'voice-synthesis', 'professional-quality', 'free']
    },
    {
      name: 'Hugging Face Free',
      baseUrl: 'https://api-inference.huggingface.co',
      models: ['microsoft/DialoGPT-medium', 'gpt2', 'facebook/blenderbot-400M-distill'],
      isAvailable: true,
      lastChecked: new Date(),
      priority: 3,
      cost: 0,
      features: ['text', 'conversational', 'open-source', 'free']
    }
  ];
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.startPeriodicChecks();
  }

  private startPeriodicChecks() {
    this.checkInterval = setInterval(() => {
      this.checkAllEndpoints();
    }, 300000); // Check every 5 minutes
  }

  private async checkEndpoint(endpoint: APIEndpoint): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Skip check for Pollinations endpoints as they're always available
      if (endpoint.name.includes('Pollinations')) {
        endpoint.isAvailable = true;
        endpoint.lastChecked = new Date();
        clearTimeout(timeoutId);
        return true;
      }

      const response = await fetch(endpoint.baseUrl, { 
        signal: controller.signal,
        method: 'HEAD'
      });

      clearTimeout(timeoutId);
      endpoint.isAvailable = response.ok;
      endpoint.lastChecked = new Date();

      return response.ok;
    } catch (error) {
      endpoint.isAvailable = false;
      endpoint.lastChecked = new Date();
      return false;
    }
  }

  private async checkAllEndpoints() {
    const promises = this.endpoints.map(endpoint => this.checkEndpoint(endpoint));
    await Promise.all(promises);

    this.emit('endpointsUpdated', this.endpoints);
  }

  public getAvailableEndpoints(): APIEndpoint[] {
    return this.endpoints.filter(endpoint => endpoint.isAvailable);
  }

  public getBestEndpoint(priority: 'low' | 'medium' | 'high' = 'medium', type: 'text' | 'image' | 'audio' = 'text'): APIEndpoint | null {
    const available = this.getAvailableEndpoints();

    if (available.length === 0) return null;

    // Always prioritize local LLM proxy for text processing when available
    if (type === 'text') {
      const localProxy = available.find(e => e.name === 'Local LLM Proxy');
      if (localProxy) {
        console.log('Using local LLM proxy for enhanced privacy');
        return localProxy;
      }
    }

    // Prioritize Pollinations for specific types (free tier only)
    if (type === 'image') {
      const pollinationsImage = available.find(e => e.name === 'Pollinations Image');
      if (pollinationsImage) return pollinationsImage;
    }

    if (type === 'audio') {
      const pollinationsAudio = available.find(e => e.name === 'Pollinations Audio');
      if (pollinationsAudio) return pollinationsAudio;
    }

    // For text, fallback to free services only
    if (type === 'text') {
      const freeTextServices = available.filter(e => 
        e.features.includes('free') && 
        (e.name === 'Pollinations AI' || e.name === 'Hugging Face Free')
      );

      if (freeTextServices.length > 0) {
        return freeTextServices[0];
      }
    }

    // Final fallback: any free service
    const freeServices = available.filter(e => e.cost === 0);
    return freeServices.length > 0 ? freeServices[0] : null;
  }

  public destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

class AIOrchestrator extends EventEmitter {
  private discoveryAgent: APIDiscoveryAgent;
  private requestQueue: AIRequest[] = [];
  private processing: boolean = false;
  private fallbackResponses: Map<string, AIResponse> = new Map();
  private serviceDiscovery: any;
  private endpoints: any;
  private cloudflareOrchestrator: any;

  constructor() {
    super();

    // Initialize Cloudflare orchestrator for edge processing
    try {
      this.cloudflareOrchestrator = createCloudflareOrchestrator();
    } catch (error) {
      console.log('Cloudflare orchestrator not available, using local processing');
    }

    this.serviceDiscovery = new ServiceDiscovery();
    this.discoveryAgent = new APIDiscoveryAgent();

    this.discoveryAgent.on('endpointsUpdated', (endpoints) => {
      this.emit('endpointsUpdated', endpoints);
    });
  }

  public async processRequest(request: AIRequest): Promise<AIResponse> {
    try {
      // Enforce brand compliance on the request
      const brandCompliantRequest = this.enforceBrandCompliance(request);

      const requestType = brandCompliantRequest.type || 'text';
      const endpoint = this.discoveryAgent.getBestEndpoint(brandCompliantRequest.priority, requestType);

      if (!endpoint) {
        throw new Error('No available AI endpoints');
      }

      const response = await this.makeAPIRequest(endpoint, brandCompliantRequest);

      // Validate response follows brand guidelines
      const validatedResponse = this.validateBrandResponse(response);

      // Cache successful responses for fallback
      const cacheKey = this.generateCacheKey(brandCompliantRequest);
      this.fallbackResponses.set(cacheKey, validatedResponse);

      return validatedResponse;
    } catch (error) {
      console.error('AI request failed:', error);

      // Try fallback response
      const cacheKey = this.generateCacheKey(request);
      const fallback = this.fallbackResponses.get(cacheKey);

      if (fallback) {
        return {
          ...fallback,
          content: `[Fallback] ${fallback.content}`,
          timestamp: new Date()
        };
      }

      // Generate local response as last resort
      return this.generateLocalResponse(request);
    }
  }

  async makeRequestWithHA(request: AIRequest, maxRetries: number = 3): Promise<AIResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const endpoint = this.discoveryAgent.getBestEndpoint('medium', request.type || 'text');
        if (!endpoint) {
          throw new Error('No available endpoints');
        }

        const response = await this.makeAPIRequest(endpoint, request);
        return response;

      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt + 1} failed: ${lastError.message}`);

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }

    // All retries failed, return fallback response
    console.error('All endpoints failed, using local fallback');
    return this.generateLocalResponse(request);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async makeAPIRequest(endpoint: APIEndpoint, request: AIRequest): Promise<AIResponse> {
    try {
      // Prioritize local LLM proxy for sensitive requests
      if (endpoint.name === 'Local LLM Proxy') {
        return await this.makeLocalLLMRequest(request);
      } else if (endpoint.name === 'Pollinations AI') {
        return await this.makePollinationsTextRequest(request);
      } else if (endpoint.name === 'Pollinations Image') {
        return await this.makePollinationsImageRequest(request);
      } else if (endpoint.name === 'Pollinations Audio') {
        return await this.makePollinationsAudioRequest(request);
      } else if (endpoint.name === 'Hugging Face Free') {
        return await this.makeHuggingFaceRequest(request);
      }

      // Fallback to local processing for unknown endpoints
      return this.generateLocalResponse(request);
    } catch (error: any) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  private async makePollinationsTextRequest(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a knowledgeable crystal jewelry expert at Troves & Coves in Winnipeg. Provide helpful, accurate information about crystals, jewelry care, and product recommendations. Keep responses informative yet conversational.'
            },
            {
              role: 'user',
              content: request.prompt
            }
          ],
          model: request.model || 'openai',
          max_tokens: request.maxTokens || 500,
          temperature: request.temperature || 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`);
      }

      const data = await response.text();

      return {
        content: data.trim(),
        model: request.model || 'openai',
        provider: 'Pollinations AI',
        tokensUsed: Math.floor(data.length / 4),
        timestamp: new Date()
      };
    } catch (error: any) {
      throw new Error(`Pollinations text request failed: ${error.message}`);
    }
  }

  private async makePollinationsImageRequest(request: AIRequest): Promise<AIResponse> {
    try {
      // Enhanced prompt for crystal jewelry images with watermark removal
      const enhancedPrompt = `${request.prompt}, professional photography, high quality, clean background, no watermarks, no logos, commercial use, premium jewelry photography --style photorealistic --quality high --enhance --private`;
      const encodedPrompt = encodeURIComponent(enhancedPrompt);

      // Use Pollinations' direct image generation with watermark removal parameters
      const ephemeralImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Date.now()}&nologo=true&enhance=true&private=true&model=flux`;

      // Verify image accessibility
      const response = await fetch(ephemeralImageUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Image generation failed: ${response.status}`);
      }

      // Preserve the ephemeral image to permanent hosting
      let permanentImageUrl = ephemeralImageUrl;
      try {
        const preservationResult = await imagePreservationService.preserveImage(ephemeralImageUrl);
        permanentImageUrl = preservationResult.preservedUrl;
        console.log(`Image preserved: ${ephemeralImageUrl} -> ${permanentImageUrl}`);
      } catch (preservationError: any) {
        console.warn(`Failed to preserve image, using original: ${preservationError.message}`);
      }

      return {
        content: `Generated professional crystal jewelry image with watermark removal`,
        model: 'flux',
        provider: 'Pollinations Image',
        tokensUsed: 50,
        timestamp: new Date(),
        mediaUrl: permanentImageUrl
      };
    } catch (error: any) {
      throw new Error(`Pollinations image request failed: ${error.message}`);
    }
  }

  private async makePollinationsAudioRequest(request: AIRequest): Promise<AIResponse> {
    try {
      const audioUrl = `https://audio.pollinations.ai/bark?text=${encodeURIComponent(request.prompt)}&voice=professional_female&speed=1.0&enhance=true&private=true`;

      // Verify audio accessibility
      const response = await fetch(audioUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Audio generation failed: ${response.status}`);
      }

      return {
        content: `Generated professional audio narration for crystal jewelry consultation`,
        model: 'bark',
        provider: 'Pollinations Audio',
        tokensUsed: 25,
        timestamp: new Date(),
        mediaUrl: audioUrl
      };
    } catch (error: any) {
      throw new Error(`Pollinations audio request failed: ${error.message}`);
    }
  }

  private async makeLocalLLMRequest(request: AIRequest): Promise<AIResponse> {
    try {
      // Use privacy guard to anonymize data before processing
      const { anonymized, mappings } = privacyGuard.anonymizeRequest(request);

      // Check if local LLM proxy is available
      const response = await fetch('http://localhost:8080/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are a knowledgeable crystal jewelry expert at Troves & Coves in Winnipeg. Provide helpful, accurate information about crystals, jewelry care, and product recommendations. Keep responses informative yet conversational.'
            },
            {
              role: 'user',
              content: anonymized.prompt
            }
          ],
          model: anonymized.model || 'local-llama',
          max_tokens: anonymized.maxTokens || 500,
          temperature: anonymized.temperature || 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        // Fallback to local processing if proxy unavailable
        throw new Error('Local LLM proxy unavailable');
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'I apologize, but I cannot process your request at the moment.';

      const aiResponse: AIResponse = {
        content: content.trim(),
        model: anonymized.model || 'local-llama',
        provider: 'Local LLM Proxy',
        tokensUsed: data.usage?.total_tokens || Math.floor(content.length / 4),
        timestamp: new Date()
      };

      // Restore anonymized data
      return privacyGuard.restoreResponse(aiResponse, mappings);
    } catch (error: any) {
      // Fallback to privacy guard local processing
      try {
        return await privacyGuard.processLocally(request);
      } catch {
        throw new Error(`Local LLM request failed: ${error.message}`);
      }
    }
  }

  private async makeHuggingFaceRequest(request: AIRequest): Promise<AIResponse> {
    try {
      // Use privacy guard for external requests
      const { anonymized, mappings } = privacyGuard.anonymizeRequest(request);

      const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: anonymized.prompt,
          parameters: {
            max_length: anonymized.maxTokens || 500,
            temperature: anonymized.temperature || 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.generated_text || data[0]?.generated_text || 'I understand you need assistance with crystal jewelry. How can I help you today?';

      const aiResponse: AIResponse = {
        content: content.trim(),
        model: 'DialoGPT-medium',
        provider: 'Hugging Face Free',
        tokensUsed: Math.floor(content.length / 4),
        timestamp: new Date()
      };

      // Restore anonymized data
      return privacyGuard.restoreResponse(aiResponse, mappings);
    } catch (error: any) {
      throw new Error(`Hugging Face request failed: ${error.message}`);
    }
  }

  private generateCacheKey(request: AIRequest): string {
    return `${request.prompt.substring(0, 50)}_${request.model || 'default'}_${request.temperature || 0.7}`;
  }

  private generateLocalResponse(request: AIRequest): AIResponse {
    const responses = [
      "I understand you're looking for assistance with crystal jewelry. Based on your inquiry, I'd recommend exploring our lepidolite collection for emotional balance and stress relief.",
      "Our handcrafted pieces combine authentic crystals with premium materials. Each item is energetically cleansed and comes with care instructions.",
      "For healing properties, consider rose quartz for love and self-care, or clear quartz for amplification and clarity. Would you like specific recommendations?",
      "Our wire-wrapped designs are perfect for showcasing the natural beauty of crystals while providing a secure setting. They're available in gold-filled and sterling silver.",
      "I can help you learn about crystal properties, find the right piece for your needs, or provide care instructions for your jewelry."
    ];

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      model: 'local-fallback',
      provider: 'Local Fallback',
      tokensUsed: 75,
      timestamp: new Date()
    };
  }

  public async getSystemStatus() {
    const endpoints = this.discoveryAgent.getAvailableEndpoints();
    return {
      totalEndpoints: endpoints.length,
      availableEndpoints: endpoints.filter(e => e.isAvailable).length,
      queueSize: this.requestQueue.length,
      processing: this.processing,
      cacheSize: this.fallbackResponses.size,
      endpoints: endpoints.map(e => ({
        name: e.name,
        isAvailable: e.isAvailable,
        lastChecked: e.lastChecked,
        rateLimitRemaining: e.rateLimitRemaining
      }))
    };
  }

  private async startServiceDiscovery(): Promise<void> {
    // Auto-discover services every 10 minutes
    setInterval(async () => {
      try {
        const newServices = await this.serviceDiscovery.autoDiscoverAll();
        this.integrateDiscoveredServices(newServices);
      } catch (error) {
        console.log('Service discovery failed:', error);
      }
    }, 600000); // 10 minutes

    // Initial discovery
    setTimeout(() => this.startServiceDiscovery(), 5000); // Wait 5 seconds after startup
  }

  private integrateDiscoveredServices(services: any[]): void {
    let addedCount = 0;

    for (const service of services) {
      const exists = this.endpoints.find(e => e.name === service.name);
      if (!exists) {
        this.endpoints.push({
          name: service.name,
          baseUrl: service.baseUrl,
          models: ['auto-discovered'],
          isAvailable: true,
          lastChecked: new Date(),
          rateLimitRemaining: service.freeQuota,
          priority: 5, // Lower priority for auto-discovered
          cost: 0,
          features: service.features
        });
        addedCount++;
      }
    }

    if (addedCount > 0) {
      console.log(`🚀 Added ${addedCount} new services to orchestrator`);
      this.emit('servicesUpdated', { added: addedCount, total: this.endpoints.length });
    }
  }

  /**
   * Enforce brand compliance on AI requests
   */
  private enforceBrandCompliance(request: AIRequest): AIRequest {
    const brandContext = `
LOCKED BRAND GUIDELINES - TROVES & COVES MYSTICAL JEWELRY:
- "Troves" must be in turquoise print style (${BRAND_CONFIG.colors.trovesTurquoise})
- "Coves" must be in cursive blue style (${BRAND_CONFIG.colors.covesCursiveBlue})
- Design language: Mystical skull artwork with ornate decorative frames
- Color palette: Troves Turquoise, Coves Cursive Blue, Skull Turquoise, Ornate Frame Gold
- Typography: ${BRAND_CONFIG.typography.troves.fontFamily} for "Troves", ${BRAND_CONFIG.typography.coves.fontFamily} for "Coves"
- Voice: Mystical, spiritual, authentic crystal healing wisdom
- Products: Sacred crystal jewelry, healing gemstone talismans, wire-wrapped pendants
- Location: Winnipeg, Manitoba, Canada
- Business model: Website showcases, redirects to Etsy for purchases

FORBIDDEN DEVIATIONS:
- Never suggest different color schemes
- Never change typography choices
- Never alter the mystical skull aesthetic
- Never recommend non-spiritual messaging
- Always maintain ornate decorative elements
`;

    return {
      ...request,
      prompt: `${brandContext}\n\nUser Request: ${request.prompt}\n\nEnsure your response strictly follows the Troves & Coves brand guidelines above.`
    };
  }

  /**
   * Validate AI response follows brand guidelines
   */
  private validateBrandResponse(response: AIResponse): AIResponse {
    let content = response.content;

    // Check for brand compliance violations
    const violations = [];

    // Check for improper brand name usage
    if (content.includes('Troves & Coves') && !content.includes('mystical')) {
      violations.push('Missing mystical context');
    }

    // Check for off-brand color suggestions
    const offBrandColors = ['blue', 'red', 'green', 'purple'];
    offBrandColors.forEach(color => {
      if (content.toLowerCase().includes(color) && !content.includes('turquoise') && !content.includes('gold')) {
        violations.push(`Off-brand color mentioned: ${color}`);
      }
    });

    // Correct common violations
    content = content.replace(/Troves and Coves/g, 'Troves & Coves');
    content = content.replace(/blue/gi, 'turquoise');
    content = content.replace(/standard/gi, 'mystical');
    content = content.replace(/regular/gi, 'sacred');

    // Add mystical skull artwork context if missing
    if (!content.includes('mystical') && !content.includes('sacred')) {
      content = content.replace(/jewelry/gi, 'sacred crystal jewellery');
    }

    return {
      ...response,
      content,
      metadata: {
        ...response.metadata,
        brandCompliance: violations.length === 0,
        violations: violations.length > 0 ? violations : undefined
      }
    };
  }

  public destroy() {
    this.discoveryAgent?.destroy();
  }
}

class ServiceDiscovery {
    async autoDiscoverAll(): Promise<any[]> {
        // Simulate discovering multiple services
        return new Promise((resolve) => {
            setTimeout(() => {
                const services = [
                    {
                        name: 'Gemini Free',
                        baseUrl: 'https://gemini.example.com',
                        freeQuota: 500,
                        features: ['text', 'free', 'ai']
                    },
                    {
                        name: 'Llama 2 Free',
                        baseUrl: 'https://llama2.example.com',
                        freeQuota: 200,
                        features: ['text', 'free', 'ai']
                    }
                ];
                resolve(services);
            }, 2000);
        });
    }
}

function createCloudflareOrchestrator() {
    return {
        processRequest: async (request: AIRequest) => {
            // Simulate Cloudflare processing
            return {
                content: `[Cloudflare] Processed: ${request.prompt}`,
                model: 'cloudflare-llm',
                provider: 'Cloudflare',
                tokensUsed: 10,
                timestamp: new Date()
            };
        }
    };
}

export { AIOrchestrator, type AIRequest, type AIResponse };