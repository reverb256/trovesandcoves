import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { AIOrchestrator } from '../ai-orchestrator';

interface ScrapeRequest {
  url: string;
  selectors?: string[];
  waitFor?: string;
  screenshot?: boolean;
  type: 'content' | 'search' | 'product' | 'market';
}

interface ScrapeResult {
  url: string;
  title: string;
  content: string;
  metadata: any;
  screenshot?: string;
  timestamp: Date;
}

interface SearchQuery {
  query: string;
  category?: string;
  region?: string;
  limit?: number;
}

export class WebScraperAgent {
  private browser: any = null;
  private aiOrchestrator: AIOrchestrator;
  private searxngInstances: string[] = [
    'https://searx.be',
    'https://search.sapti.me',
    'https://searx.work',
    'https://searx.ninja',
    'https://searx.fmac.xyz'
  ];

  constructor(aiOrchestrator: AIOrchestrator) {
    this.aiOrchestrator = aiOrchestrator;
    this.initializeBrowser();
  }

  private async initializeBrowser() {
    try {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
      console.log('Headless browser initialized successfully');
    } catch (error) {
      console.error('Failed to initialize browser:', error);
    }
  }

  async searchWithSearXNG(searchQuery: SearchQuery): Promise<any[]> {
    const { query, category = 'general', region = 'en-CA', limit = 10 } = searchQuery;
    
    for (const instance of this.searxngInstances) {
      try {
        const searchUrl = `${instance}/search?q=${encodeURIComponent(query)}&category_${category}=1&format=json`;
        
        const response = await axios.get(searchUrl, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TrovesAndCoves/1.0; +https://trovesandcoves.com)'
          }
        });

        if (response.data && response.data.results) {
          const results = response.data.results.slice(0, limit);
          
          // Enhance results with AI analysis
          const enhancedResults = await this.enhanceSearchResults(results, query);
          
          return enhancedResults;
        }
      } catch (error) {
        console.warn(`SearXNG instance ${instance} failed:`, error.message);
        continue;
      }
    }
    
    throw new Error('All SearXNG instances unavailable');
  }

  private async enhanceSearchResults(results: any[], originalQuery: string): Promise<any[]> {
    try {
      const aiRequest = {
        prompt: `Analyze these search results for query "${originalQuery}" and rank them by relevance to crystal healing, jewelry, and wellness. 
                 Add relevance scores and extract key insights. Results: ${JSON.stringify(results.slice(0, 5))}
                 Return JSON with enhanced results including relevanceScore, insights, and category.`,
        type: 'text' as const,
        priority: 'low' as const,
        maxTokens: 800
      };

      const response = await this.aiOrchestrator.processRequest(aiRequest);
      
      try {
        const enhanced = JSON.parse(response.content);
        return enhanced.results || results;
      } catch (parseError) {
        return results.map(r => ({ ...r, relevanceScore: 0.5, category: 'general' }));
      }
    } catch (error) {
      return results;
    }
  }

  async scrapeCompetitorPricing(productType: string): Promise<any[]> {
    const searchQuery = `${productType} crystal jewelry price canada site:etsy.com OR site:amazon.ca`;
    
    try {
      const searchResults = await this.searchWithSearXNG({
        query: searchQuery,
        category: 'shopping',
        limit: 20
      });

      const pricingData = [];
      
      for (const result of searchResults.slice(0, 10)) {
        try {
          const scrapeResult = await this.scrapePage({
            url: result.url,
            type: 'product',
            selectors: ['.price', '.cost', '[data-price]', '.currency']
          });

          if (scrapeResult.metadata.prices && scrapeResult.metadata.prices.length > 0) {
            pricingData.push({
              url: result.url,
              title: result.title,
              prices: scrapeResult.metadata.prices,
              source: this.extractDomain(result.url),
              scrapedAt: new Date()
            });
          }
        } catch (scrapeError) {
          console.warn(`Failed to scrape ${result.url}:`, scrapeError.message);
        }
      }

      return pricingData;
    } catch (error) {
      console.error('Competitor pricing scrape failed:', error);
      return [];
    }
  }

  async scrapePage(request: ScrapeRequest): Promise<ScrapeResult> {
    if (!this.browser) {
      await this.initializeBrowser();
    }

    const page = await this.browser.newPage();
    
    try {
      await page.setUserAgent('Mozilla/5.0 (compatible; TrovesAndCoves/1.0; +https://trovesandcoves.com)');
      await page.setViewport({ width: 1920, height: 1080 });
      
      await page.goto(request.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      if (request.waitFor) {
        await page.waitForSelector(request.waitFor, { timeout: 10000 });
      }

      // Extract content
      const pageData = await page.evaluate((selectors) => {
        const result: any = {
          title: document.title,
          content: document.body.innerText.slice(0, 5000),
          metadata: {}
        };

        // Extract specific selectors if provided
        if (selectors && selectors.length > 0) {
          result.metadata.extracted = {};
          selectors.forEach(selector => {
            const elements = Array.from(document.querySelectorAll(selector));
            result.metadata.extracted[selector] = elements.map(el => el.textContent?.trim()).filter(Boolean);
          });
        }

        // Extract pricing information
        const priceSelectors = ['.price', '.cost', '[data-price]', '.currency', '.amount'];
        const prices = [];
        priceSelectors.forEach(selector => {
          const elements = Array.from(document.querySelectorAll(selector));
          elements.forEach(el => {
            const text = el.textContent?.trim();
            if (text && /[\$\€\£\¥]?\d+\.?\d*/.test(text)) {
              prices.push(text);
            }
          });
        });
        result.metadata.prices = [...new Set(prices)];

        return result;
      }, request.selectors || []);

      let screenshot = null;
      if (request.screenshot) {
        screenshot = await page.screenshot({ 
          encoding: 'base64',
          fullPage: false,
          clip: { x: 0, y: 0, width: 1200, height: 800 }
        });
      }

      return {
        url: request.url,
        title: pageData.title,
        content: pageData.content,
        metadata: pageData.metadata,
        screenshot,
        timestamp: new Date()
      };

    } finally {
      await page.close();
    }
  }

  async marketResearch(topic: string): Promise<any> {
    const queries = [
      `${topic} market trends 2024`,
      `${topic} consumer behavior canada`,
      `${topic} price analysis market research`,
      `${topic} industry insights statistics`
    ];

    const results = [];
    
    for (const query of queries) {
      try {
        const searchResults = await this.searchWithSearXNG({
          query,
          category: 'news',
          limit: 5
        });

        for (const result of searchResults.slice(0, 3)) {
          try {
            const scrapeResult = await this.scrapePage({
              url: result.url,
              type: 'market'
            });

            results.push({
              query,
              source: result.url,
              title: result.title,
              content: scrapeResult.content.slice(0, 2000),
              relevanceScore: result.relevanceScore || 0.5,
              scrapedAt: new Date()
            });
          } catch (error) {
            console.warn(`Failed to scrape market research from ${result.url}`);
          }
        }
      } catch (error) {
        console.warn(`Market research query failed: ${query}`);
      }
    }

    // Analyze and synthesize findings with AI
    try {
      const aiRequest = {
        prompt: `Analyze this market research data for ${topic} and provide key insights, trends, and recommendations.
                 Data: ${JSON.stringify(results.slice(0, 10))}
                 Return structured insights with: trends, opportunities, threats, recommendations.`,
        type: 'text' as const,
        priority: 'medium' as const,
        maxTokens: 1000
      };

      const response = await this.aiOrchestrator.processRequest(aiRequest);
      
      try {
        const insights = JSON.parse(response.content);
        return {
          topic,
          insights,
          rawData: results,
          generatedAt: new Date()
        };
      } catch (parseError) {
        return {
          topic,
          insights: { summary: response.content },
          rawData: results,
          generatedAt: new Date()
        };
      }
    } catch (error) {
      return {
        topic,
        insights: { summary: 'Market research completed but analysis unavailable' },
        rawData: results,
        generatedAt: new Date()
      };
    }
  }

  async monitorKeywords(keywords: string[]): Promise<any[]> {
    const results = [];
    
    for (const keyword of keywords) {
      try {
        const searchResults = await this.searchWithSearXNG({
          query: keyword,
          category: 'general',
          limit: 15
        });

        // Track ranking positions and trends
        const keywordData = {
          keyword,
          results: searchResults.map((result, index) => ({
            position: index + 1,
            url: result.url,
            title: result.title,
            snippet: result.content || result.description,
            domain: this.extractDomain(result.url),
            relevanceScore: result.relevanceScore || 0.5
          })),
          competitors: this.analyzeCompetitors(searchResults),
          timestamp: new Date()
        };

        results.push(keywordData);
      } catch (error) {
        console.warn(`Keyword monitoring failed for: ${keyword}`);
      }
    }

    return results;
  }

  private analyzeCompetitors(searchResults: any[]): any[] {
    const competitors = new Map();
    
    searchResults.forEach((result, index) => {
      const domain = this.extractDomain(result.url);
      if (!competitors.has(domain)) {
        competitors.set(domain, {
          domain,
          appearances: 0,
          bestPosition: index + 1,
          averagePosition: 0,
          urls: []
        });
      }
      
      const competitor = competitors.get(domain);
      competitor.appearances++;
      competitor.bestPosition = Math.min(competitor.bestPosition, index + 1);
      competitor.urls.push(result.url);
    });

    return Array.from(competitors.values())
      .sort((a, b) => a.bestPosition - b.bestPosition)
      .slice(0, 10);
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'unknown';
    }
  }

  async generateContentIdeas(niche: string): Promise<any> {
    try {
      // Search for trending topics
      const trendingTopics = await this.searchWithSearXNG({
        query: `${niche} trending topics 2024 blog ideas`,
        category: 'general',
        limit: 20
      });

      // Search for competitor content
      const competitorContent = await this.searchWithSearXNG({
        query: `${niche} "how to" "guide" "tips" site:blog OR site:medium.com`,
        category: 'general',
        limit: 15
      });

      // Combine and analyze with AI
      const aiRequest = {
        prompt: `Based on this research data, generate 20 unique content ideas for ${niche} that would engage customers and drive sales.
                 Trending data: ${JSON.stringify(trendingTopics.slice(0, 10))}
                 Competitor content: ${JSON.stringify(competitorContent.slice(0, 10))}
                 Return JSON array with: title, description, contentType, keywords, difficulty, engagement_potential.`,
        type: 'text' as const,
        priority: 'medium' as const,
        maxTokens: 1200
      };

      const response = await this.aiOrchestrator.processRequest(aiRequest);
      
      try {
        const contentIdeas = JSON.parse(response.content);
        return {
          niche,
          ideas: contentIdeas,
          researchSources: {
            trending: trendingTopics.length,
            competitors: competitorContent.length
          },
          generatedAt: new Date()
        };
      } catch (parseError) {
        return {
          niche,
          ideas: [],
          summary: response.content,
          generatedAt: new Date()
        };
      }
    } catch (error) {
      console.error('Content idea generation failed:', error);
      return {
        niche,
        ideas: [],
        error: 'Research unavailable',
        generatedAt: new Date()
      };
    }
  }

  async destroy() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}