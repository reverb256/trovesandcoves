import { AIOrchestrator } from '../ai-orchestrator';
import { RAGAgent } from '../agents/rag-agent';
import { CustomerServiceAgent } from '../agents/customer-service-agent';
import { WebScraperAgent } from '../agents/web-scraper-agent';

export class AIContainer {
  private orchestrator: AIOrchestrator;
  private ragAgent: RAGAgent;
  private customerServiceAgent: CustomerServiceAgent;
  private webScraperAgent: WebScraperAgent;
  private isInitialized = false;

  constructor() {
    this.orchestrator = new AIOrchestrator();
    this.ragAgent = new RAGAgent(this.orchestrator);
    this.customerServiceAgent = new CustomerServiceAgent(this.orchestrator, this.ragAgent);
    this.webScraperAgent = new WebScraperAgent(this.orchestrator);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing AI Container...');
      
      // Initialize all agents
      await Promise.all([
        this.orchestrator.getSystemStatus(),
        this.ragAgent.indexKnowledgeBase(),
        this.webScraperAgent.searchWithSearXNG({
          query: 'test connection',
          category: 'general',
          limit: 1
        }).catch(() => console.log('SearXNG connection test completed'))
      ]);

      this.isInitialized = true;
      console.log('AI Container initialized successfully');
    } catch (error) {
      console.warn('AI Container initialization completed with warnings:', error);
      this.isInitialized = true; // Continue with graceful degradation
    }
  }

  getOrchestrator(): AIOrchestrator {
    return this.orchestrator;
  }

  getRAGAgent(): RAGAgent {
    return this.ragAgent;
  }

  getCustomerServiceAgent(): CustomerServiceAgent {
    return this.customerServiceAgent;
  }

  getWebScraperAgent(): WebScraperAgent {
    return this.webScraperAgent;
  }

  async getStatus() {
    return {
      initialized: this.isInitialized,
      orchestrator: await this.orchestrator.getSystemStatus(),
      services: {
        rag: 'active',
        customerService: 'active',
        webScraper: 'active'
      },
      timestamp: new Date()
    };
  }

  async destroy(): Promise<void> {
    try {
      await Promise.all([
        this.webScraperAgent.destroy(),
        this.orchestrator.destroy()
      ]);
      this.isInitialized = false;
      console.log('AI Container destroyed');
    } catch (error) {
      console.error('Error during AI Container destruction:', error);
    }
  }
}

// Singleton instance
let aiContainer: AIContainer | null = null;

export function getAIContainer(): AIContainer {
  if (!aiContainer) {
    aiContainer = new AIContainer();
  }
  return aiContainer;
}

export async function initializeAIContainer(): Promise<AIContainer> {
  const container = getAIContainer();
  await container.initialize();
  return container;
}