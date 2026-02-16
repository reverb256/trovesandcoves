import { BaseAgent, AgentConfig, Tool } from './base-agent';
import { AIOrchestrator } from '../ai-orchestrator';
import { storage } from '../storage';

interface DocumentChunk {
  id: string;
  content: string;
  source: string;
  category: string;
  embedding?: number[];
  metadata: Record<string, any>;
}

interface SearchResult {
  chunk: DocumentChunk;
  similarity: number;
  relevance: number;
}

class RAGAgent extends BaseAgent {
  private documents: Map<string, DocumentChunk> = new Map();
  private categoryIndex: Map<string, string[]> = new Map();
  private knowledgeBase: {
    crystals: Map<string, any>;
    products: Map<string, any>;
    healing: Map<string, any>;
    winnipeg: Map<string, any>;
  };

  constructor(orchestrator: AIOrchestrator) {
    const config: AgentConfig = {
      name: 'RAG-Agent',
      role: 'Knowledge Retrieval and Information Specialist',
      systemPrompt: `You are a RAG (Retrieval-Augmented Generation) agent specializing in crystal jewelry, healing properties, and local Winnipeg business information. You have access to comprehensive knowledge about:

1. Crystal properties and healing benefits
2. Jewelry craftsmanship and materials
3. Local Winnipeg market and shipping
4. Product specifications and availability
5. Customer service best practices

Always provide accurate, helpful information based on retrieved knowledge. When you don't have specific information, clearly state limitations and suggest alternatives.`,
      capabilities: [
        'Document retrieval',
        'Semantic search',
        'Knowledge synthesis',
        'Product information',
        'Crystal properties lookup',
        'Local business information'
      ],
      priority: 'high'
    };

    super(config, orchestrator);
    this.knowledgeBase = {
      crystals: new Map(),
      products: new Map(),
      healing: new Map(),
      winnipeg: new Map()
    };
    this.initializeKnowledgeBase();
  }

  protected initializeTools(): void {
    this.registerTool({
      name: 'search_knowledge',
      description: 'Search the knowledge base for relevant information',
      parameters: { query: 'string', category: 'string' },
      execute: async (params) => this.searchKnowledge(params.query, params.category)
    });

    this.registerTool({
      name: 'get_product_info',
      description: 'Retrieve detailed product information',
      parameters: { productId: 'number' },
      execute: async (params) => this.getProductInfo(params.productId)
    });

    this.registerTool({
      name: 'lookup_crystal_properties',
      description: 'Get healing properties and information about specific crystals',
      parameters: { crystalName: 'string' },
      execute: async (params) => this.lookupCrystalProperties(params.crystalName)
    });

    this.registerTool({
      name: 'get_shipping_info',
      description: 'Get shipping and local delivery information for Winnipeg',
      parameters: { location: 'string' },
      execute: async (params) => this.getShippingInfo(params.location)
    });
  }

  private initializeKnowledgeBase(): void {
    // Crystal healing properties knowledge base
    this.knowledgeBase.crystals.set('lepidolite', {
      name: 'Lepidolite',
      properties: ['calming', 'anxiety relief', 'emotional balance', 'stress reduction'],
      chakra: 'Crown and Third Eye',
      color: 'Purple to lavender',
      hardness: '2.5-3',
      description: 'A lithium-rich mica that promotes emotional healing and tranquility. Known as the "stone of transition" for its ability to help during times of change.',
      healing: 'Reduces anxiety, promotes restful sleep, aids in emotional healing, balances mood swings',
      care: 'Gentle cleaning with soft cloth, avoid water exposure for extended periods'
    });

    this.knowledgeBase.crystals.set('turquoise', {
      name: 'Turquoise',
      properties: ['protection', 'communication', 'healing', 'wisdom'],
      chakra: 'Throat and Heart',
      color: 'Blue to blue-green',
      hardness: '5-6',
      description: 'A sacred stone of protection, communication, and spiritual expansion. Revered by many cultures for its powerful healing properties.',
      healing: 'Enhances communication, provides protection during travel, aids in emotional healing, promotes wisdom',
      care: 'Clean with soft brush and mild soap, store separately to avoid scratching'
    });

    this.knowledgeBase.crystals.set('citrine', {
      name: 'Citrine',
      properties: ['abundance', 'manifestation', 'joy', 'energy'],
      chakra: 'Solar Plexus and Sacral',
      color: 'Yellow to golden brown',
      hardness: '7',
      description: 'Known as the "merchant\'s stone" and "stone of abundance." Carries the power of the sun and brings joy, wonder, and enthusiasm.',
      healing: 'Attracts wealth and prosperity, enhances creativity, boosts self-confidence, promotes joy and positivity',
      care: 'Durable stone, can be cleaned with water and mild soap, charge in sunlight'
    });

    this.knowledgeBase.crystals.set('lapis-lazuli', {
      name: 'Lapis Lazuli',
      properties: ['wisdom', 'truth', 'royalty', 'honor'],
      chakra: 'Throat and Third Eye',
      color: 'Deep blue with gold flecks',
      hardness: '5-5.5',
      description: 'A stone of wisdom and truth, prized since ancient times. Encourages honesty, compassion, and moral integrity.',
      healing: 'Enhances intellectual ability, stimulates wisdom, promotes honesty, aids in communication',
      care: 'Clean gently with soft cloth, avoid harsh chemicals, store carefully'
    });

    this.knowledgeBase.crystals.set('rose-quartz', {
      name: 'Rose Quartz',
      properties: ['love', 'compassion', 'emotional healing', 'self-love'],
      chakra: 'Heart',
      color: 'Pale pink to deep rose',
      hardness: '7',
      description: 'The stone of unconditional love and infinite peace. The most important crystal for healing the heart and heart chakra.',
      healing: 'Promotes self-love, attracts romantic love, heals emotional wounds, reduces stress and tension',
      care: 'Fade-resistant, can be cleansed with water, charge in moonlight'
    });

    // Product knowledge from storage
    this.loadProductKnowledge();

    // Winnipeg local business knowledge
    this.knowledgeBase.winnipeg.set('shipping', {
      localDelivery: 'Free local delivery within Winnipeg city limits for orders over $75',
      canadaShipping: 'Canada Post standard shipping available across Manitoba and Canada',
      internationalShipping: 'International shipping available to select countries',
      processing: '1-3 business days processing time',
      packaging: 'Eco-friendly packaging with care instructions included'
    });

    this.knowledgeBase.winnipeg.set('business', {
      location: 'Winnipeg, Manitoba, Canada',
      timezone: 'Central Time (CST/CDT)',
      businessHours: 'Monday-Friday 9AM-6PM, Saturday 10AM-4PM CST',
      consultations: 'Virtual crystal consultations available by appointment',
      localEvents: 'Participation in Winnipeg artisan markets and crystal shows'
    });

    // Index documents for search
    this.indexKnowledgeBase();
  }

  private async loadProductKnowledge(): Promise<void> {
    try {
      const products = await storage.getProducts();
      products.forEach(product => {
        this.knowledgeBase.products.set(product.id.toString(), {
          ...product,
          searchTerms: [
            product.name.toLowerCase(),
            product.description?.toLowerCase() || '',
            product.category?.name.toLowerCase() || '',
            product.category?.slug || ''
          ]
        });
      });
    } catch (error) {
      console.error('Failed to load product knowledge:', error);
    }
  }

  private indexKnowledgeBase(): void {
    // Index crystal knowledge
    for (const [key, crystal] of Array.from(this.knowledgeBase.crystals.entries())) {
      const doc: DocumentChunk = {
        id: `crystal-${key}`,
        content: `${crystal.name}: ${crystal.description} Properties: ${crystal.properties.join(', ')}. Healing: ${crystal.healing}`,
        source: 'crystal-database',
        category: 'crystals',
        metadata: crystal
      };
      this.documents.set(doc.id, doc);
      this.addToIndex('crystals', doc.id);
    }

    // Index product knowledge
    for (const [key, product] of Array.from(this.knowledgeBase.products.entries())) {
      const doc: DocumentChunk = {
        id: `product-${key}`,
        content: `${product.name}: ${product.description || ''} Price: $${product.price} Category: ${product.category?.name || ''}`,
        source: 'product-database',
        category: 'products',
        metadata: product
      };
      this.documents.set(doc.id, doc);
      this.addToIndex('products', doc.id);
    }

    // Index business knowledge
    for (const [key, info] of Array.from(this.knowledgeBase.winnipeg.entries())) {
      const doc: DocumentChunk = {
        id: `winnipeg-${key}`,
        content: JSON.stringify(info),
        source: 'business-info',
        category: 'winnipeg',
        metadata: info
      };
      this.documents.set(doc.id, doc);
      this.addToIndex('winnipeg', doc.id);
    }
  }

  private addToIndex(category: string, docId: string): void {
    if (!this.categoryIndex.has(category)) {
      this.categoryIndex.set(category, []);
    }
    this.categoryIndex.get(category)!.push(docId);
  }

  public async searchKnowledge(query: string, category?: string): Promise<SearchResult[]> {
    const queryLower = query.toLowerCase();
    const results: SearchResult[] = [];

    // Simple keyword-based search (would be enhanced with embeddings in production)
    const documentsToSearch = category 
      ? (this.categoryIndex.get(category) || []).map(id => this.documents.get(id)!).filter(Boolean)
      : Array.from(this.documents.values());

    for (const doc of documentsToSearch) {
      const contentLower = doc.content.toLowerCase();
      let similarity = 0;

      // Simple scoring based on keyword matches
      const queryWords = queryLower.split(' ').filter(word => word.length > 2);
      for (const word of queryWords) {
        if (contentLower.includes(word)) {
          similarity += 1;
        }
      }

      if (similarity > 0) {
        results.push({
          chunk: doc,
          similarity,
          relevance: similarity / queryWords.length
        });
      }
    }

    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  }

  private async getProductInfo(productId: number): Promise<any> {
    try {
      const product = await storage.getProduct(productId);
      if (!product) {
        return { error: 'Product not found' };
      }

      // Enhance with crystal information if applicable
      const productName = product.name.toLowerCase();
      let crystalInfo = null;

      for (const [crystalName, info] of this.knowledgeBase.crystals) {
        if (productName.includes(crystalName)) {
          crystalInfo = info;
          break;
        }
      }

      return {
        product,
        crystalInfo,
        inStock: product.stockQuantity > 0,
        shippingEstimate: 'Ships within 1-3 business days from Winnipeg'
      };
    } catch (error) {
      return { error: 'Failed to retrieve product information' };
    }
  }

  public async lookupCrystalProperties(crystalName: string): Promise<any> {
    const normalizedName = crystalName.toLowerCase().replace(/\s+/g, '-');
    
    // Direct lookup
    if (this.knowledgeBase.crystals.has(normalizedName)) {
      return this.knowledgeBase.crystals.get(normalizedName);
    }

    // Search for partial matches
    for (const [key, crystal] of Array.from(this.knowledgeBase.crystals.entries())) {
      if (key.includes(normalizedName) || crystalName.toLowerCase().includes(key)) {
        return crystal;
      }
    }

    return {
      error: 'Crystal information not found',
      suggestion: 'Available crystals: ' + Array.from(this.knowledgeBase.crystals.keys()).join(', ')
    };
  }

  public async getShippingInfo(location: string): Promise<any> {
    const winnipegInfo = this.knowledgeBase.winnipeg.get('shipping');
    const businessInfo = this.knowledgeBase.winnipeg.get('business');

    const locationLower = location.toLowerCase();
    
    if (locationLower.includes('winnipeg') || locationLower.includes('manitoba')) {
      return {
        type: 'local',
        cost: 'Free for orders over $75',
        timeframe: '1-2 business days',
        details: winnipegInfo,
        businessHours: businessInfo?.businessHours
      };
    } else if (locationLower.includes('canada')) {
      return {
        type: 'national',
        cost: 'Calculated at checkout',
        timeframe: '3-7 business days',
        carrier: 'Canada Post',
        details: winnipegInfo
      };
    } else {
      return {
        type: 'international',
        cost: 'Calculated at checkout',
        timeframe: '7-14 business days',
        note: 'International shipping available to select countries',
        details: winnipegInfo
      };
    }
  }

  public async retrieveAndGenerate(query: string, context?: any): Promise<string> {
    try {
      // Search for relevant knowledge
      const searchResults = await this.searchKnowledge(query);
      
      // Build enhanced context with retrieved information
      const retrievedContext = searchResults.map(result => 
        `Source: ${result.chunk.source}\nContent: ${result.chunk.content}\nRelevance: ${result.relevance}`
      ).join('\n\n');

      const enhancedPrompt = `${this.config.systemPrompt}

RETRIEVED KNOWLEDGE:
${retrievedContext}

QUERY: ${query}
${context ? `ADDITIONAL CONTEXT: ${JSON.stringify(context)}` : ''}

Based on the retrieved knowledge above, provide a comprehensive and accurate response. If the retrieved information is insufficient, clearly indicate what information is missing and suggest alternatives.`;

      // Generate response using AI with retrieved context
      const response = await this.orchestrator.processRequest({
        prompt: enhancedPrompt,
        maxTokens: 800,
        temperature: 0.3,
        priority: this.config.priority
      });

      return response.content;
    } catch (error) {
      console.error('RAG retrieval and generation failed:', error);
      return this.generateFallbackResponse(query);
    }
  }
}

export { RAGAgent, DocumentChunk, SearchResult };