import { EventEmitter } from 'events';
import { AIOrchestrator, AIRequest, AIResponse } from '../ai-orchestrator';

interface AgentConfig {
  name: string;
  role: string;
  systemPrompt: string;
  capabilities: string[];
  priority: 'low' | 'medium' | 'high';
}

interface AgentMemory {
  shortTerm: Array<{ timestamp: Date; content: string; type: 'user' | 'system' | 'tool' }>;
  longTerm: Map<string, any>;
  context: Map<string, any>;
}

interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
}

abstract class BaseAgent extends EventEmitter {
  protected config: AgentConfig;
  protected memory: AgentMemory;
  protected tools: Map<string, Tool>;
  protected orchestrator: AIOrchestrator;
  protected isActive: boolean = false;
  protected children: BaseAgent[] = [];
  protected parent: BaseAgent | null = null;

  constructor(config: AgentConfig, orchestrator: AIOrchestrator) {
    super();
    this.config = config;
    this.orchestrator = orchestrator;
    this.memory = {
      shortTerm: [],
      longTerm: new Map(),
      context: new Map()
    };
    this.tools = new Map();
    this.initializeTools();
  }

  protected abstract initializeTools(): void;

  public async processMessage(message: string, context?: any): Promise<string> {
    this.isActive = true;
    this.emit('started', { agent: this.config.name, message });

    try {
      // Add to short-term memory
      this.addToMemory('user', message);

      // Build complete prompt with context
      const prompt = this.buildPrompt(message, context);

      // Get AI response
      const aiRequest: AIRequest = {
        prompt,
        maxTokens: 500,
        temperature: 0.7,
        priority: this.config.priority
      };

      const response = await this.orchestrator.processRequest(aiRequest);
      
      // Process any tool calls in the response
      const processedResponse = await this.processToolCalls(response.content);
      
      // Add to memory
      this.addToMemory('system', processedResponse);

      this.emit('completed', { agent: this.config.name, response: processedResponse });
      return processedResponse;

    } catch (error) {
      const errorMsg = `Agent ${this.config.name} encountered an error: ${error.message}`;
      this.emit('error', { agent: this.config.name, error: errorMsg });
      return this.generateFallbackResponse(message);
    } finally {
      this.isActive = false;
    }
  }

  protected buildPrompt(message: string, context?: any): string {
    const recentMemory = this.memory.shortTerm.slice(-5);
    const memoryContext = recentMemory.map(m => `${m.type}: ${m.content}`).join('\n');
    
    const availableTools = Array.from(this.tools.keys()).join(', ');
    
    return `${this.config.systemPrompt}

ROLE: ${this.config.role}
CAPABILITIES: ${this.config.capabilities.join(', ')}
AVAILABLE TOOLS: ${availableTools}

RECENT CONTEXT:
${memoryContext}

${context ? `ADDITIONAL CONTEXT: ${JSON.stringify(context)}` : ''}

USER MESSAGE: ${message}

Please respond appropriately using your role and capabilities. If you need to use tools, format your response with tool calls in this format:
TOOL_CALL: tool_name(parameter1=value1, parameter2=value2)

RESPONSE:`;
  }

  protected async processToolCalls(response: string): Promise<string> {
    const toolCallRegex = /TOOL_CALL:\s*(\w+)\((.*?)\)/g;
    let processedResponse = response;
    let match;

    while ((match = toolCallRegex.exec(response)) !== null) {
      const toolName = match[1];
      const paramsStr = match[2];
      
      if (this.tools.has(toolName)) {
        try {
          const params = this.parseToolParams(paramsStr);
          const tool = this.tools.get(toolName)!;
          const result = await tool.execute(params);
          
          // Replace tool call with result
          processedResponse = processedResponse.replace(
            match[0], 
            `[${toolName} executed: ${JSON.stringify(result)}]`
          );
          
          this.addToMemory('tool', `${toolName}: ${JSON.stringify(result)}`);
        } catch (error) {
          processedResponse = processedResponse.replace(
            match[0], 
            `[${toolName} failed: ${error.message}]`
          );
        }
      }
    }

    return processedResponse;
  }

  protected parseToolParams(paramsStr: string): Record<string, any> {
    const params: Record<string, any> = {};
    const paramPairs = paramsStr.split(',').map(p => p.trim());
    
    for (const pair of paramPairs) {
      const [key, value] = pair.split('=').map(s => s.trim());
      if (key && value) {
        // Simple parsing - could be enhanced
        params[key] = value.replace(/["']/g, '');
      }
    }
    
    return params;
  }

  protected addToMemory(type: 'user' | 'system' | 'tool', content: string): void {
    this.memory.shortTerm.push({
      timestamp: new Date(),
      content,
      type
    });

    // Keep only last 20 short-term memories
    if (this.memory.shortTerm.length > 20) {
      this.memory.shortTerm = this.memory.shortTerm.slice(-20);
    }
  }

  protected generateFallbackResponse(message: string): string {
    const fallbacks = [
      `I understand your request about "${message.substring(0, 50)}..." but I'm experiencing technical difficulties. Let me try a different approach.`,
      `I'm currently unable to process that request fully, but I can provide some general guidance based on what you're asking.`,
      `There seems to be a temporary issue with my processing. Could you rephrase your request or try again?`
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  public async spawnChildAgent(config: AgentConfig): Promise<BaseAgent> {
    // This would be implemented by specific agent types
    throw new Error('spawnChildAgent must be implemented by subclass');
  }

  public getStatus() {
    return {
      name: this.config.name,
      role: this.config.role,
      isActive: this.isActive,
      memorySize: this.memory.shortTerm.length,
      capabilities: this.config.capabilities,
      tools: Array.from(this.tools.keys()),
      children: this.children.length
    };
  }

  public setContext(key: string, value: any): void {
    this.memory.context.set(key, value);
  }

  public getContext(key: string): any {
    return this.memory.context.get(key);
  }

  public registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  public destroy(): void {
    this.children.forEach(child => child.destroy());
    this.removeAllListeners();
  }
}

export { BaseAgent, AgentConfig, AgentMemory, Tool };