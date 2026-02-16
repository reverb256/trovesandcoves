import { AIOrchestrator } from '../ai-orchestrator';
import { SearchContainer } from './search-container';
import { IntelligenceContainer } from './intelligence-container';

export class ContainerManager {
  private orchestrator: AIOrchestrator;
  private searchContainer: SearchContainer;
  private intelligenceContainer: IntelligenceContainer;
  private isInitialized = false;

  constructor() {
    this.orchestrator = new AIOrchestrator();
    this.searchContainer = new SearchContainer(this.orchestrator);
    this.intelligenceContainer = new IntelligenceContainer(this.orchestrator);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing Container Manager...');
      
      await Promise.all([
        this.searchContainer.initialize(),
        this.intelligenceContainer.initialize()
      ]);

      this.isInitialized = true;
      console.log('All AI containers initialized successfully');
    } catch (error) {
      console.warn('Container initialization completed with warnings:', error);
      this.isInitialized = true;
    }
  }

  getSearchContainer(): SearchContainer {
    return this.searchContainer;
  }

  getIntelligenceContainer(): IntelligenceContainer {
    return this.intelligenceContainer;
  }

  getOrchestrator(): AIOrchestrator {
    return this.orchestrator;
  }

  async getSystemStatus() {
    return {
      initialized: this.isInitialized,
      containers: {
        search: await this.searchContainer.getStatus(),
        intelligence: await this.intelligenceContainer.getStatus()
      },
      orchestrator: await this.orchestrator.getSystemStatus(),
      timestamp: new Date()
    };
  }

  async destroy(): Promise<void> {
    try {
      await Promise.all([
        this.searchContainer.destroy(),
        this.orchestrator.destroy()
      ]);
      this.isInitialized = false;
      console.log('Container Manager destroyed');
    } catch (error) {
      console.error('Error during container destruction:', error);
    }
  }
}

// Singleton instance
let containerManager: ContainerManager | null = null;

export function getContainerManager(): ContainerManager {
  if (!containerManager) {
    containerManager = new ContainerManager();
  }
  return containerManager;
}

export async function initializeContainers(): Promise<ContainerManager> {
  const manager = getContainerManager();
  await manager.initialize();
  return manager;
}