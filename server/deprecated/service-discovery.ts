
import { EventEmitter } from 'events';

interface ServiceCandidate {
  name: string;
  baseUrl: string;
  testEndpoint: string;
  apiKeyRequired: boolean;
  freeQuota: number;
  features: string[];
}

export class ServiceDiscovery extends EventEmitter {
  private knownServices: ServiceCandidate[] = [
    {
      name: 'Fireworks AI Free',
      baseUrl: 'https://api.fireworks.ai',
      testEndpoint: '/inference/v1/completions',
      apiKeyRequired: true,
      freeQuota: 1000000, // 1M tokens free
      features: ['text', 'fast']
    },
    {
      name: 'Anyscale Free',
      baseUrl: 'https://api.anyscale.com',
      testEndpoint: '/v1/completions',
      apiKeyRequired: true,
      freeQuota: 100000,
      features: ['text', 'llama']
    },
    {
      name: 'Together Free Tier',
      baseUrl: 'https://api.together.xyz',
      testEndpoint: '/inference',
      apiKeyRequired: true,
      freeQuota: 200000,
      features: ['text', 'image']
    },
    {
      name: 'Modal Labs Free',
      baseUrl: 'https://api.modal.com',
      testEndpoint: '/v1/inference',
      apiKeyRequired: false,
      freeQuota: 50000,
      features: ['text', 'serverless']
    },
    {
      name: 'RunPod Free',
      baseUrl: 'https://api.runpod.ai',
      testEndpoint: '/v2/inference',
      apiKeyRequired: true,
      freeQuota: 30000,
      features: ['text', 'image', 'gpu']
    },
    {
      name: 'Lepton AI Free',
      baseUrl: 'https://api.lepton.ai',
      testEndpoint: '/api/v1/completions',
      apiKeyRequired: false,
      freeQuota: 100000,
      features: ['text', 'fast']
    }
  ];

  async discoverServices(): Promise<ServiceCandidate[]> {
    const availableServices: ServiceCandidate[] = [];
    
    for (const service of this.knownServices) {
      try {
        const isAvailable = await this.testService(service);
        if (isAvailable) {
          availableServices.push(service);
          console.log(`✅ Discovered working service: ${service.name}`);
        }
      } catch (error) {
        console.log(`❌ Service unavailable: ${service.name}`);
      }
    }
    
    return availableServices;
  }

  private async testService(service: ServiceCandidate): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${service.baseUrl}${service.testEndpoint}`, {
        method: 'HEAD', // Use HEAD to avoid hitting quotas
        signal: controller.signal,
        headers: {
          'User-Agent': 'Troves-and-Coves/1.0 (Service Discovery)'
        }
      });
      
      clearTimeout(timeoutId);
      
      // Accept 200, 401 (auth required), or 405 (method not allowed)
      return [200, 401, 405].includes(response.status);
      
    } catch (error) {
      return false;
    }
  }

  async getProxyServices(): Promise<ServiceCandidate[]> {
    // Check for public proxy services that aggregate multiple AI providers
    const proxyServices = [
      {
        name: 'OpenRouter Free',
        baseUrl: 'https://openrouter.ai/api/v1',
        testEndpoint: '/models',
        apiKeyRequired: false,
        freeQuota: 50000,
        features: ['text', 'multi-provider', 'proxy']
      },
      {
        name: 'AI/ML API Free',
        baseUrl: 'https://api.aimlapi.com',
        testEndpoint: '/v1/completions',
        apiKeyRequired: false,
        freeQuota: 25000,
        features: ['text', 'proxy']
      }
    ];

    const available: ServiceCandidate[] = [];
    for (const proxy of proxyServices) {
      if (await this.testService(proxy)) {
        available.push(proxy);
      }
    }
    
    return available;
  }

  async findFreeGPUServices(): Promise<ServiceCandidate[]> {
    // Services with free GPU inference
    const gpuServices = [
      {
        name: 'Replicate Free Tier',
        baseUrl: 'https://api.replicate.com',
        testEndpoint: '/v1/predictions',
        apiKeyRequired: true,
        freeQuota: 1000, // predictions
        features: ['image', 'video', 'gpu']
      },
      {
        name: 'Banana Free',
        baseUrl: 'https://api.banana.dev',
        testEndpoint: '/v4/inference',
        apiKeyRequired: true,
        freeQuota: 500,
        features: ['image', 'text', 'gpu']
      }
    ];

    const available: ServiceCandidate[] = [];
    for (const gpu of gpuServices) {
      if (await this.testService(gpu)) {
        available.push(gpu);
      }
    }
    
    return available;
  }

  async autoDiscoverAll(): Promise<ServiceCandidate[]> {
    console.log('🔍 Starting automatic service discovery...');
    
    const [regular, proxy, gpu] = await Promise.all([
      this.discoverServices(),
      this.getProxyServices(),
      this.findFreeGPUServices()
    ]);
    
    const allServices = [...regular, ...proxy, ...gpu];
    console.log(`🎉 Discovered ${allServices.length} working services`);
    
    return allServices;
  }
}
