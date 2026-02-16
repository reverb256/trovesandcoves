import { BaseAgent, AgentConfig, Tool } from './base-agent';
import { RAGAgent } from './rag-agent';
import { AIOrchestrator } from '../ai-orchestrator';
import { storage } from '../storage';

class CustomerServiceAgent extends BaseAgent {
  private ragAgent: RAGAgent;

  constructor(orchestrator: AIOrchestrator, ragAgent: RAGAgent) {
    const config: AgentConfig = {
      name: 'CustomerService-Agent',
      role: 'Customer Service Specialist for Crystal Jewelry',
      systemPrompt: `You are a friendly and knowledgeable customer service agent for Troves and Coves, a crystal jewelry business in Winnipeg. You specialize in:

1. Product recommendations based on customer needs
2. Crystal healing properties and spiritual guidance
3. Order assistance and shipping information
4. Local Winnipeg delivery and pickup options
5. Jewelry care and maintenance advice
6. Crystal consultation bookings

Always maintain a warm, helpful tone while providing accurate information. When discussing crystal properties, present them as traditional beliefs rather than medical claims. Focus on the craftsmanship and beauty of the jewelry alongside any spiritual aspects.`,
      capabilities: [
        'Product recommendations',
        'Order assistance',
        'Shipping and delivery info',
        'Crystal guidance',
        'Care instructions',
        'Consultation booking',
        'Local Winnipeg services'
      ],
      priority: 'high'
    };

    super(config, orchestrator);
    this.ragAgent = ragAgent;
  }

  protected initializeTools(): void {
    this.registerTool({
      name: 'recommend_products',
      description: 'Recommend products based on customer needs, intentions, or crystal preferences',
      parameters: { 
        intention: 'string', 
        priceRange: 'string', 
        style: 'string',
        crystalType: 'string'
      },
      execute: async (params) => this.recommendProducts(params)
    });

    this.registerTool({
      name: 'check_order_status',
      description: 'Check the status of a customer order',
      parameters: { orderId: 'number' },
      execute: async (params) => this.checkOrderStatus(params.orderId)
    });

    this.registerTool({
      name: 'calculate_shipping',
      description: 'Calculate shipping costs and delivery timeframes',
      parameters: { location: 'string', orderValue: 'number' },
      execute: async (params) => this.calculateShipping(params.location, params.orderValue)
    });

    this.registerTool({
      name: 'book_consultation',
      description: 'Help customers book crystal consultations',
      parameters: { 
        customerEmail: 'string',
        preferredDate: 'string',
        consultationType: 'string'
      },
      execute: async (params) => this.bookConsultation(params)
    });

    this.registerTool({
      name: 'get_care_instructions',
      description: 'Provide care instructions for specific crystals or jewelry pieces',
      parameters: { crystalType: 'string', metalType: 'string' },
      execute: async (params) => this.getCareInstructions(params)
    });
  }

  private async recommendProducts(params: any): Promise<any> {
    try {
      const { intention, priceRange, style, crystalType } = params;
      
      // Get all products from storage
      const products = await storage.getProducts();
      
      // Filter based on criteria
      let filteredProducts = products.filter(p => p.stockQuantity > 0);

      // Filter by crystal type if specified
      if (crystalType) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(crystalType.toLowerCase())
        );
      }

      // Filter by price range if specified
      if (priceRange) {
        const [min, max] = this.parsePriceRange(priceRange);
        if (min !== null || max !== null) {
          filteredProducts = filteredProducts.filter(p => {
            const price = parseFloat(p.price);
            return (min === null || price >= min) && (max === null || price <= max);
          });
        }
      }

      // Get crystal properties for matching intentions
      const recommendations = [];
      for (const product of filteredProducts.slice(0, 5)) {
        const crystalInfo = await this.ragAgent.lookupCrystalProperties(
          this.extractCrystalName(product.name)
        );
        
        const match = this.matchIntention(intention, crystalInfo);
        
        recommendations.push({
          product,
          crystalInfo: crystalInfo.error ? null : crystalInfo,
          intentionMatch: match,
          reasoning: this.buildRecommendationReasoning(product, crystalInfo, intention)
        });
      }

      // Sort by intention match score
      recommendations.sort((a, b) => b.intentionMatch - a.intentionMatch);

      return {
        recommendations: recommendations.slice(0, 3),
        totalFound: filteredProducts.length,
        searchCriteria: { intention, priceRange, style, crystalType }
      };

    } catch (error) {
      return { error: 'Failed to generate recommendations' };
    }
  }

  private parsePriceRange(priceRange: string): [number | null, number | null] {
    const range = priceRange.toLowerCase();
    
    if (range.includes('under') || range.includes('below')) {
      const match = range.match(/(\d+)/);
      return [null, match ? parseInt(match[1]) : null];
    }
    
    if (range.includes('over') || range.includes('above')) {
      const match = range.match(/(\d+)/);
      return [match ? parseInt(match[1]) : null, null];
    }
    
    if (range.includes('-') || range.includes('to')) {
      const matches = range.match(/(\d+).*?(\d+)/);
      return matches ? [parseInt(matches[1]), parseInt(matches[2])] : [null, null];
    }
    
    return [null, null];
  }

  private extractCrystalName(productName: string): string {
    const crystalNames = ['lepidolite', 'turquoise', 'citrine', 'lapis', 'rose quartz', 'amethyst', 'clear quartz'];
    const nameLower = productName.toLowerCase();
    
    for (const crystal of crystalNames) {
      if (nameLower.includes(crystal)) {
        return crystal;
      }
    }
    
    return productName.split(' ')[0];
  }

  private matchIntention(intention: string, crystalInfo: any): number {
    if (!intention || crystalInfo?.error) return 0;
    
    const intentionLower = intention.toLowerCase();
    const properties = crystalInfo.properties || [];
    const healing = crystalInfo.healing?.toLowerCase() || '';
    
    let score = 0;
    
    // Check for direct property matches
    for (const property of properties) {
      if (intentionLower.includes(property.toLowerCase())) {
        score += 3;
      }
    }
    
    // Check healing description
    if (healing.includes(intentionLower)) {
      score += 2;
    }
    
    // Specific intention mappings
    const intentionMappings = {
      'love': ['love', 'heart', 'relationship', 'compassion'],
      'anxiety': ['calming', 'anxiety', 'stress', 'peace'],
      'prosperity': ['abundance', 'wealth', 'success', 'manifestation'],
      'protection': ['protection', 'shield', 'safety', 'grounding'],
      'healing': ['healing', 'health', 'wellness', 'recovery'],
      'communication': ['communication', 'throat', 'expression', 'speaking']
    };
    
    for (const [key, keywords] of Object.entries(intentionMappings)) {
      if (intentionLower.includes(key)) {
        for (const keyword of keywords) {
          if (properties.some(p => p.toLowerCase().includes(keyword)) || 
              healing.includes(keyword)) {
            score += 1;
          }
        }
      }
    }
    
    return score;
  }

  private buildRecommendationReasoning(product: any, crystalInfo: any, intention: string): string {
    const reasons = [];
    
    if (crystalInfo && !crystalInfo.error) {
      reasons.push(`${crystalInfo.name} is known for ${crystalInfo.properties.slice(0, 2).join(' and ')}`);
      
      if (intention) {
        const match = this.matchIntention(intention, crystalInfo);
        if (match > 0) {
          reasons.push(`particularly suitable for your interest in ${intention}`);
        }
      }
    }
    
    reasons.push(`beautiful ${product.category?.name.toLowerCase() || 'jewelry piece'} handcrafted in Winnipeg`);
    reasons.push(`currently in stock at $${product.price}`);
    
    return reasons.join(', ');
  }

  private async checkOrderStatus(orderId: number): Promise<any> {
    try {
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return { error: 'Order not found. Please check your order number.' };
      }

      const statusInfo = this.getStatusDescription(order.status);
      
      return {
        order,
        statusDescription: statusInfo,
        estimatedDelivery: this.calculateDeliveryEstimate(order),
        trackingInfo: this.getTrackingInfo(order.status)
      };
    } catch (error) {
      return { error: 'Unable to retrieve order information. Please try again.' };
    }
  }

  private getStatusDescription(status: string): string {
    const statusMap = {
      'pending': 'Your order has been received and is being prepared.',
      'processing': 'Your jewelry is being carefully crafted and prepared for shipping.',
      'shipped': 'Your order has been shipped and is on its way to you.',
      'delivered': 'Your order has been successfully delivered.',
      'cancelled': 'This order has been cancelled.'
    };
    
    return statusMap[status] || 'Order status information is being updated.';
  }

  private calculateDeliveryEstimate(order: any): string {
    const createdDate = new Date(order.createdAt);
    const now = new Date();
    const daysSinceOrder = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (order.status === 'delivered') {
      return 'Delivered';
    }
    
    if (order.shippingAddress.toLowerCase().includes('winnipeg')) {
      return `${Math.max(1, 3 - daysSinceOrder)} business days remaining (local delivery)`;
    }
    
    return `${Math.max(1, 7 - daysSinceOrder)} business days remaining`;
  }

  private getTrackingInfo(status: string): string {
    if (status === 'shipped') {
      return 'Tracking information will be sent to your email once available.';
    }
    return 'Tracking will be provided when your order ships.';
  }

  private async calculateShipping(location: string, orderValue: number): Promise<any> {
    const shippingInfo = await this.ragAgent.getShippingInfo(location);
    
    let cost = 0;
    let freeShippingEligible = false;
    
    if (shippingInfo.type === 'local' && orderValue >= 75) {
      cost = 0;
      freeShippingEligible = true;
    } else if (shippingInfo.type === 'local') {
      cost = 10;
    } else if (shippingInfo.type === 'national') {
      cost = Math.max(15, orderValue * 0.08);
    } else {
      cost = Math.max(25, orderValue * 0.12);
    }
    
    return {
      ...shippingInfo,
      cost: cost.toFixed(2),
      freeShippingEligible,
      freeShippingThreshold: shippingInfo.type === 'local' ? 75 : null,
      amountToFreeShipping: freeShippingEligible ? 0 : Math.max(0, 75 - orderValue)
    };
  }

  private async bookConsultation(params: any): Promise<any> {
    try {
      const { customerEmail, preferredDate, consultationType } = params;
      
      const consultation = await storage.createContactSubmission({
        email: customerEmail,
        name: 'Crystal Consultation Booking',
        phone: null,
        subject: `${consultationType} Consultation Request`,
        message: `Consultation booking request for ${consultationType}`,
        isConsultation: true,
        preferredDate: new Date(preferredDate)
      });
      
      return {
        bookingId: consultation.id,
        message: 'Your consultation request has been received! We will contact you within 24 hours to confirm your appointment.',
        consultationType,
        preferredDate,
        nextSteps: [
          'Check your email for confirmation',
          'Prepare any questions about crystals or jewelry',
          'Consider your intentions and goals for the consultation'
        ]
      };
    } catch (error) {
      return { 
        error: 'Unable to book consultation at this time. Please try contacting us directly.',
        fallback: 'You can reach us through the contact form or email for consultation bookings.'
      };
    }
  }

  private async getCareInstructions(params: any): Promise<any> {
    const { crystalType, metalType } = params;
    
    // Get crystal-specific care from RAG
    let crystalCare = null;
    if (crystalType) {
      const crystalInfo = await this.ragAgent.lookupCrystalProperties(crystalType);
      crystalCare = crystalInfo?.care;
    }
    
    const metalCareInstructions = {
      'gold filled': {
        cleaning: 'Clean with warm soapy water and soft cloth',
        storage: 'Store in dry place, preferably in individual pouches',
        warnings: 'Avoid harsh chemicals and abrasive materials'
      },
      'sterling silver': {
        cleaning: 'Use silver polishing cloth or mild silver cleaner',
        storage: 'Store with anti-tarnish strips in airtight container',
        warnings: 'Remove before swimming, exercising, or applying lotions'
      },
      'copper': {
        cleaning: 'Clean with lemon juice and salt, rinse thoroughly',
        storage: 'Store in dry environment to prevent oxidation',
        warnings: 'Patina development is natural and can be embraced or removed'
      }
    };
    
    const metalCare = metalType ? metalCareInstructions[metalType.toLowerCase()] : null;
    
    return {
      crystalCare,
      metalCare,
      generalTips: [
        'Cleanse crystals energetically with moonlight or sage',
        'Avoid exposing crystals to direct sunlight for extended periods',
        'Remove jewelry before water activities',
        'Store pieces separately to prevent scratching'
      ],
      localService: 'Professional cleaning and repair services available in Winnipeg'
    };
  }

  public async handleCustomerInquiry(message: string, context?: any): Promise<string> {
    // Enhanced processing with RAG integration
    const relevantInfo = await this.ragAgent.searchKnowledge(message);
    
    const enhancedContext = {
      ...context,
      retrievedKnowledge: relevantInfo
    };
    
    return this.processMessage(message, enhancedContext);
  }
}

export { CustomerServiceAgent };