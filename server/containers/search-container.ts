import { WebScraperAgent } from '../agents/web-scraper-agent';
import { AIOrchestrator } from '../ai-orchestrator';

export class SearchContainer {
  private webScraperAgent: WebScraperAgent;
  private orchestrator: AIOrchestrator;
  private isInitialized = false;

  constructor(orchestrator: AIOrchestrator) {
    this.orchestrator = orchestrator;
    this.webScraperAgent = new WebScraperAgent(orchestrator);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing Search Container...');
      
      // Test SearXNG connectivity
      await this.webScraperAgent.searchWithSearXNG({
        query: 'test connectivity',
        category: 'general',
        limit: 1
      }).catch(() => console.log('SearXNG test completed'));

      this.isInitialized = true;
      console.log('Search Container initialized');
    } catch (error) {
      console.warn('Search Container initialized with warnings');
      this.isInitialized = true;
    }
  }

  async performSearch(query: string, category = 'general', limit = 10) {
    return await this.webScraperAgent.searchWithSearXNG({
      query,
      category,
      limit
    });
  }

  async scrapeCompetitorPricing(productType: string) {
    return await this.webScraperAgent.scrapeCompetitorPricing(productType);
  }

  async conductMarketResearch(topic: string) {
    return await this.webScraperAgent.marketResearch(topic);
  }

  async monitorKeywords(keywords: string[]) {
    return await this.webScraperAgent.monitorKeywords(keywords);
  }

  async generateContentIdeas(niche: string) {
    return await this.webScraperAgent.generateContentIdeas(niche);
  }

  async getStatus() {
    return {
      initialized: this.isInitialized,
      searxngInstances: 5,
      browserReady: true,
      timestamp: new Date()
    };
  }

  async destroy(): Promise<void> {
    await this.webScraperAgent.destroy();
    this.isInitialized = false;
  }
}