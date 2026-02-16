import { RAGAgent } from '../agents/rag-agent';
import { CustomerServiceAgent } from '../agents/customer-service-agent';
import { AIOrchestrator } from '../ai-orchestrator';

export class IntelligenceContainer {
  private ragAgent: RAGAgent;
  private customerServiceAgent: CustomerServiceAgent;
  private orchestrator: AIOrchestrator;
  private isInitialized = false;

  constructor(orchestrator: AIOrchestrator) {
    this.orchestrator = orchestrator;
    this.ragAgent = new RAGAgent(orchestrator);
    this.customerServiceAgent = new CustomerServiceAgent(orchestrator, this.ragAgent);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing Intelligence Container...');
      
      // Initialize knowledge base
      await this.ragAgent.buildKnowledgeBase();
      
      this.isInitialized = true;
      console.log('Intelligence Container initialized');
    } catch (error) {
      console.warn('Intelligence Container initialized with warnings');
      this.isInitialized = true;
    }
  }

  async processPersonalization(preferences: any, context: string) {
    const personalizeRequest = {
      prompt: `Based on user preferences: ${JSON.stringify(preferences)} and context: ${context}, 
               generate personalized crystal and jewelry recommendations with reasons and confidence scores.
               Return JSON with recommendations array containing: id, name, reason, confidence, crystalProperties.`,
      type: 'text' as const,
      priority: 'medium' as const
    };

    return await this.orchestrator.processRequest(personalizeRequest);
  }

  async handleCustomerConsultation(message: string, context: string, sessionId: string) {
    return await this.customerServiceAgent.handleInquiry({
      message,
      sessionId,
      userId: null,
      type: 'consultation',
      metadata: { context }
    });
  }

  async processSmartSearch(query: string, mode: string) {
    let searchPrompt = '';
    
    if (mode === 'intent') {
      searchPrompt = `User intent: "${query}". Find crystals and jewelry that match this intention.
                     Focus on the emotional, spiritual, or practical needs expressed.`;
    } else if (mode === 'visual') {
      searchPrompt = `Analyze the uploaded image and find similar crystals or jewelry pieces.
                     Identify colors, shapes, and crystal types if visible.`;
    } else {
      searchPrompt = `Search for crystals and jewelry matching: "${query}".
                     Include both exact matches and related items.`;
    }

    const searchRequest = {
      prompt: searchPrompt + ` Return results as JSON array with: id, name, description, price, crystalType, properties.`,
      type: 'text' as const,
      priority: 'medium' as const
    };

    return await this.orchestrator.processRequest(searchRequest);
  }

  async generateMarketInsights(products: any[], context: string) {
    const insightsRequest = {
      prompt: `Analyze these products: ${JSON.stringify(products.slice(0, 5))} 
               and provide market insights including trending crystal, most popular item, 
               and AI recommendation. Return as JSON with: trending, popular, recommended fields.`,
      type: 'text' as const,
      priority: 'low' as const
    };

    return await this.orchestrator.processRequest(insightsRequest);
  }

  async calculateShippingInfo(location: string, orderValue: number) {
    const aiRequest = {
      prompt: `Calculate shipping information for location: "${location}" with order value: ${orderValue}. 
               Winnipeg/Manitoba: Free over $50, else $8.99. Canada: Free over $75, else $14.99. 
               International: Free over $100, else $29.99. Return JSON with: cost, freeShippingThreshold, estimatedDays, method.`,
      type: 'text' as const,
      priority: 'low' as const,
      maxTokens: 200
    };

    return await this.orchestrator.processRequest(aiRequest);
  }

  async getStatus() {
    return {
      initialized: this.isInitialized,
      knowledgeBase: 'active',
      customerService: 'active',
      orchestrator: await this.orchestrator.getSystemStatus(),
      timestamp: new Date()
    };
  }

  getRAGAgent(): RAGAgent {
    return this.ragAgent;
  }

  getCustomerServiceAgent(): CustomerServiceAgent {
    return this.customerServiceAgent;
  }
}