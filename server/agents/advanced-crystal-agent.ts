interface Tool {
  name: string;
  description: string;
  parameters: any;
  execute: (params: any) => Promise<any>;
}

interface AgentState {
  messages: Array<{ role: string; content: string; timestamp: Date }>;
  userProfile: {
    preferences: string[];
    purchaseHistory: any[];
    currentNeeds: string[];
    budget: number;
    energeticProfile: string;
  };
  sessionContext: {
    currentProducts: number[];
    behaviorPattern: string;
    emotionalState: string;
    interactionDepth: number;
  };
  tools: Tool[];
  reasoning: string[];
}

export class AdvancedCrystalAgent {
  private state: AgentState;
  private tools: Map<string, Tool>;

  constructor() {
    this.tools = new Map();
    this.initializeTools();
    this.state = this.initializeState();
  }

  private initializeTools() {
    // Crystal Knowledge Tool
    this.tools.set('getCrystalProperties', {
      name: 'getCrystalProperties',
      description: 'Get detailed metaphysical and physical properties of crystals',
      parameters: {
        type: 'object',
        properties: {
          crystalName: { type: 'string', description: 'Name of the crystal' },
          includeChakras: { type: 'boolean', description: 'Include chakra alignment info' }
        },
        required: ['crystalName']
      },
      execute: async (params) => {
        const { crystalName, includeChakras } = params;
        return this.getCrystalKnowledge(crystalName, includeChakras);
      }
    });

    // Inventory Check Tool
    this.tools.set('checkInventory', {
      name: 'checkInventory',
      description: 'Check current inventory and availability of products',
      parameters: {
        type: 'object',
        properties: {
          crystalType: { type: 'string' },
          priceRange: { type: 'array', items: { type: 'number' } },
          style: { type: 'string' }
        }
      },
      execute: async (params) => {
        return this.checkProductInventory(params);
      }
    });

    // Compatibility Analysis Tool
    this.tools.set('analyzeCompatibility', {
      name: 'analyzeCompatibility',
      description: 'Analyze energetic compatibility between user and crystals',
      parameters: {
        type: 'object',
        properties: {
          userIntentions: { type: 'array', items: { type: 'string' } },
          currentChallenges: { type: 'array', items: { type: 'string' } },
          crystalOptions: { type: 'array', items: { type: 'string' } }
        },
        required: ['userIntentions', 'crystalOptions']
      },
      execute: async (params) => {
        return this.calculateEnergeticCompatibility(params);
      }
    });

    // Moon Phase Timing Tool
    this.tools.set('getMoonPhaseGuidance', {
      name: 'getMoonPhaseGuidance',
      description: 'Get optimal timing based on lunar cycles',
      parameters: {
        type: 'object',
        properties: {
          intention: { type: 'string', description: 'User\'s intention or goal' },
          urgency: { type: 'string', enum: ['low', 'medium', 'high'] }
        },
        required: ['intention']
      },
      execute: async (params) => {
        return this.getMoonPhaseAdvice(params);
      }
    });

    // User Behavior Analysis Tool
    this.tools.set('analyzeBehavior', {
      name: 'analyzeBehavior',
      description: 'Analyze user shopping behavior and emotional state',
      parameters: {
        type: 'object',
        properties: {
          timeSpent: { type: 'number' },
          pagesViewed: { type: 'array', items: { type: 'string' } },
          interactions: { type: 'array', items: { type: 'string' } }
        }
      },
      execute: async (params) => {
        return this.analyzeUserBehavior(params);
      }
    });

    // Recommendation Engine Tool
    this.tools.set('generateRecommendations', {
      name: 'generateRecommendations',
      description: 'Generate personalized crystal recommendations',
      parameters: {
        type: 'object',
        properties: {
          userProfile: { type: 'object' },
          currentContext: { type: 'object' },
          maxRecommendations: { type: 'number', default: 3 }
        },
        required: ['userProfile']
      },
      execute: async (params) => {
        return this.generatePersonalizedRecommendations(params);
      }
    });
  }

  private initializeState(): AgentState {
    return {
      messages: [],
      userProfile: {
        preferences: [],
        purchaseHistory: [],
        currentNeeds: [],
        budget: 0,
        energeticProfile: 'unknown'
      },
      sessionContext: {
        currentProducts: [],
        behaviorPattern: 'exploring',
        emotionalState: 'curious',
        interactionDepth: 0
      },
      tools: Array.from(this.tools.values()),
      reasoning: []
    };
  }

  async processMessage(message: string, context?: any): Promise<{
    response: string;
    toolCalls: any[];
    reasoning: string[];
    updatedState: Partial<AgentState>;
  }> {
    // Add message to history
    this.state.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Update context if provided
    if (context) {
      this.updateSessionContext(context);
    }

    // Analyze the message and determine intent
    const analysis = await this.analyzeMessage(message);
    
    // Plan the response using reasoning
    const plan = await this.planResponse(analysis);
    
    // Execute tools if needed
    const toolResults = await this.executeTools(plan.toolCalls);
    
    // Generate final response
    const response = await this.generateResponse(analysis, plan, toolResults);
    
    // Update state based on interaction
    const stateUpdates = this.updateState(analysis, toolResults);

    // Add assistant response to history
    this.state.messages.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });

    return {
      response,
      toolCalls: plan.toolCalls,
      reasoning: plan.reasoning,
      updatedState: stateUpdates
    };
  }

  private async analyzeMessage(message: string): Promise<{
    intent: string;
    entities: any[];
    sentiment: string;
    urgency: string;
    complexity: number;
  }> {
    const lowerMessage = message.toLowerCase();
    
    // Intent classification
    let intent = 'general_inquiry';
    const entities: any[] = [];
    
    // Extract crystal mentions
    const crystalPattern = /(amethyst|quartz|citrine|lepidolite|tourmaline|moonstone|labradorite|obsidian|selenite|fluorite)/gi;
    const crystalMatches = message.match(crystalPattern);
    if (crystalMatches) {
      entities.push({ type: 'crystals', values: crystalMatches });
      intent = 'crystal_inquiry';
    }

    // Extract emotional needs
    const emotionalPattern = /(anxious|stress|calm|peace|love|protection|healing|energy|meditation|spiritual)/gi;
    const emotionalMatches = message.match(emotionalPattern);
    if (emotionalMatches) {
      entities.push({ type: 'emotional_needs', values: emotionalMatches });
      intent = 'healing_request';
    }

    // Extract price/budget mentions
    const pricePattern = /(\$\d+|budget|cost|price|expensive|cheap|affordable)/gi;
    const priceMatches = message.match(pricePattern);
    if (priceMatches) {
      entities.push({ type: 'price_concerns', values: priceMatches });
      if (intent === 'general_inquiry') intent = 'price_inquiry';
    }

    // Sentiment analysis
    const positiveWords = ['love', 'beautiful', 'perfect', 'amazing', 'wonderful', 'excited'];
    const negativeWords = ['confused', 'overwhelmed', 'worried', 'concerned', 'disappointed'];
    
    let sentiment = 'neutral';
    if (positiveWords.some(word => lowerMessage.includes(word))) sentiment = 'positive';
    if (negativeWords.some(word => lowerMessage.includes(word))) sentiment = 'negative';

    // Urgency detection
    const urgentWords = ['need', 'urgent', 'asap', 'quickly', 'soon', 'immediately'];
    const urgency = urgentWords.some(word => lowerMessage.includes(word)) ? 'high' : 'medium';

    // Complexity scoring
    const complexity = Math.min(10, Math.max(1, 
      (message.split(' ').length / 10) + 
      entities.length + 
      (sentiment === 'negative' ? 2 : 0)
    ));

    return { intent, entities, sentiment, urgency, complexity };
  }

  private async planResponse(analysis: any): Promise<{
    toolCalls: any[];
    reasoning: string[];
    responseStrategy: string;
  }> {
    const reasoning: string[] = [];
    const toolCalls: any[] = [];
    
    reasoning.push(`User intent: ${analysis.intent} with ${analysis.sentiment} sentiment`);
    
    // Plan tool usage based on intent and entities
    if (analysis.entities.some((e: any) => e.type === 'crystals')) {
      reasoning.push('User mentioned specific crystals - need to get detailed properties');
      toolCalls.push({
        tool: 'getCrystalProperties',
        params: {
          crystalName: analysis.entities.find((e: any) => e.type === 'crystals').values[0],
          includeChakras: analysis.intent === 'healing_request'
        }
      });
    }

    if (analysis.intent === 'healing_request') {
      reasoning.push('User seeking healing - need compatibility analysis');
      toolCalls.push({
        tool: 'analyzeCompatibility',
        params: {
          userIntentions: analysis.entities.find((e: any) => e.type === 'emotional_needs')?.values || ['general_healing'],
          crystalOptions: ['amethyst', 'rose_quartz', 'lepidolite', 'clear_quartz']
        }
      });
    }

    if (analysis.intent === 'price_inquiry' || this.state.userProfile.budget > 0) {
      reasoning.push('Price is a factor - checking inventory within budget');
      toolCalls.push({
        tool: 'checkInventory',
        params: {
          priceRange: [0, this.state.userProfile.budget || 200]
        }
      });
    }

    if (analysis.urgency === 'high' || analysis.intent === 'healing_request') {
      reasoning.push('Timing matters - getting moon phase guidance');
      toolCalls.push({
        tool: 'getMoonPhaseGuidance',
        params: {
          intention: analysis.intent === 'healing_request' ? 'healing' : 'general',
          urgency: analysis.urgency
        }
      });
    }

    // Always analyze behavior if we have session data
    if (this.state.sessionContext.currentProducts.length > 0) {
      reasoning.push('User has browsing history - analyzing behavior patterns');
      toolCalls.push({
        tool: 'analyzeBehavior',
        params: {
          timeSpent: Date.now() - this.state.messages[0]?.timestamp.getTime() || 0,
          pagesViewed: this.state.sessionContext.currentProducts,
          interactions: ['view', 'scroll']
        }
      });
    }

    const responseStrategy = this.determineResponseStrategy(analysis, toolCalls.length);
    reasoning.push(`Response strategy: ${responseStrategy}`);

    return { toolCalls, reasoning, responseStrategy };
  }

  private determineResponseStrategy(analysis: any, toolCount: number): string {
    if (analysis.sentiment === 'negative' && analysis.complexity > 5) {
      return 'supportive_detailed';
    }
    if (analysis.urgency === 'high') {
      return 'direct_actionable';
    }
    if (toolCount > 2) {
      return 'comprehensive_consultation';
    }
    if (analysis.intent === 'crystal_inquiry') {
      return 'educational_focused';
    }
    return 'conversational_guiding';
  }

  private async executeTools(toolCalls: any[]): Promise<any[]> {
    const results = [];
    
    for (const call of toolCalls) {
      const tool = this.tools.get(call.tool);
      if (tool) {
        try {
          const result = await tool.execute(call.params);
          results.push({ tool: call.tool, result, success: true });
        } catch (error) {
          results.push({ tool: call.tool, error: error.message, success: false });
        }
      }
    }
    
    return results;
  }

  private async generateResponse(analysis: any, plan: any, toolResults: any[]): Promise<string> {
    // Build response based on strategy and tool results
    const strategy = plan.responseStrategy;
    const crystalData = toolResults.find(r => r.tool === 'getCrystalProperties')?.result;
    const compatibility = toolResults.find(r => r.tool === 'analyzeCompatibility')?.result;
    const inventory = toolResults.find(r => r.tool === 'checkInventory')?.result;
    const timing = toolResults.find(r => r.tool === 'getMoonPhaseGuidance')?.result;
    const behavior = toolResults.find(r => r.tool === 'analyzeBehavior')?.result;

    let response = '';

    // Greeting and acknowledgment
    if (this.state.messages.length <= 2) {
      response += this.getPersonalizedGreeting(analysis);
    }

    // Main content based on strategy
    switch (strategy) {
      case 'supportive_detailed':
        response += this.generateSupportiveResponse(analysis, crystalData, compatibility);
        break;
      case 'direct_actionable':
        response += this.generateDirectResponse(analysis, inventory, timing);
        break;
      case 'comprehensive_consultation':
        response += this.generateComprehensiveResponse(analysis, toolResults);
        break;
      case 'educational_focused':
        response += this.generateEducationalResponse(analysis, crystalData);
        break;
      default:
        response += this.generateConversationalResponse(analysis, toolResults);
    }

    // Add timing guidance if available
    if (timing) {
      response += `\n\n${timing.guidance}`;
    }

    // Add next steps
    response += this.generateNextSteps(analysis, inventory);

    return response.trim();
  }

  private getPersonalizedGreeting(analysis: any): string {
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                     new Date().getHours() < 17 ? 'afternoon' : 'evening';
    
    if (analysis.sentiment === 'negative') {
      return `Good ${timeOfDay}. I sense you're seeking support and guidance. I'm here to help you find exactly what your spirit needs. `;
    }
    
    return `Good ${timeOfDay} and welcome to Troves & Coves! I'm Sage, your crystal consultant. I love helping people discover their perfect crystal companions. `;
  }

  private generateSupportiveResponse(analysis: any, crystalData: any, compatibility: any): string {
    let response = 'I understand you\'re going through something challenging right now. ';
    
    if (compatibility) {
      const topMatch = compatibility.matches[0];
      response += `Based on your energy, I\'m strongly drawn to ${topMatch.crystal} for you. ${topMatch.reasoning} `;
    }
    
    if (crystalData) {
      response += `${crystalData.healingProperties} Many of our customers find profound comfort in working with this stone. `;
    }
    
    return response;
  }

  private generateDirectResponse(analysis: any, inventory: any, timing: any): string {
    let response = 'I can help you find exactly what you need right now. ';
    
    if (inventory && inventory.available.length > 0) {
      const quickOption = inventory.available[0];
      response += `We have ${quickOption.name} available immediately for $${quickOption.price}. `;
    }
    
    if (timing && timing.optimal) {
      response += `Perfect timing - ${timing.advice} `;
    }
    
    return response;
  }

  private generateComprehensiveResponse(analysis: any, toolResults: any[]): string {
    let response = 'Let me share a complete picture based on what I\'m sensing about your needs. ';
    
    toolResults.forEach(result => {
      if (result.success && result.result.summary) {
        response += result.result.summary + ' ';
      }
    });
    
    return response;
  }

  private generateEducationalResponse(analysis: any, crystalData: any): string {
    let response = '';
    
    if (crystalData) {
      response += `${crystalData.name} is fascinating! ${crystalData.formation} ${crystalData.metaphysicalProperties} `;
      if (crystalData.chakras) {
        response += `It resonates particularly with the ${crystalData.chakras.join(' and ')} chakra${crystalData.chakras.length > 1 ? 's' : ''}. `;
      }
    }
    
    return response;
  }

  private generateConversationalResponse(analysis: any, toolResults: any[]): string {
    let response = 'That\'s wonderful that you\'re exploring crystal energy! ';
    
    if (toolResults.length > 0) {
      const mainResult = toolResults[0];
      if (mainResult.success && mainResult.result.insights) {
        response += mainResult.result.insights + ' ';
      }
    }
    
    return response;
  }

  private generateNextSteps(analysis: any, inventory: any): string {
    let steps = '\n\nWhat would feel most helpful right now? ';
    
    if (inventory && inventory.available.length > 0) {
      steps += 'I can show you our current collection, ';
    }
    
    steps += 'answer specific questions about crystals, or guide you through discovering what might serve your highest good.';
    
    return steps;
  }

  // Tool implementation methods
  private async getCrystalKnowledge(crystalName: string, includeChakras: boolean = true): Promise<any> {
    const knowledge = {
      amethyst: {
        name: 'Amethyst',
        formation: 'This beautiful purple quartz forms in geodes and clusters.',
        metaphysicalProperties: 'Known as the stone of spiritual protection and purification. It enhances meditation, intuition, and connection to higher consciousness.',
        healingProperties: 'Excellent for anxiety, insomnia, and addictive behaviors. Promotes emotional balance and mental clarity.',
        chakras: includeChakras ? ['Crown', 'Third Eye'] : [],
        care: 'Cleanse with moonlight, avoid prolonged sun exposure which can fade the color.'
      },
      'rose quartz': {
        name: 'Rose Quartz',
        formation: 'This pink variety of quartz forms in massive formations.',
        metaphysicalProperties: 'The ultimate stone of unconditional love, self-love, and emotional healing.',
        healingProperties: 'Heals emotional wounds, attracts love, promotes self-acceptance and compassion.',
        chakras: includeChakras ? ['Heart'] : [],
        care: 'Very gentle stone, cleanse with running water and moonlight.'
      }
    };
    
    return knowledge[crystalName.toLowerCase()] || {
      name: crystalName,
      metaphysicalProperties: 'This crystal carries unique energetic properties that support spiritual growth and healing.',
      healingProperties: 'Each crystal offers its own gifts for physical, emotional, and spiritual wellbeing.',
      chakras: includeChakras ? ['varies'] : []
    };
  }

  private async checkProductInventory(params: any): Promise<any> {
    // Simulate inventory check
    const mockInventory = {
      available: [
        { name: 'Amethyst Pendant', price: 45, style: 'wire-wrapped', inStock: 3 },
        { name: 'Rose Quartz Necklace', price: 38, style: 'simple', inStock: 5 },
        { name: 'Clear Quartz Point', price: 25, style: 'raw', inStock: 8 }
      ],
      totalItems: 16,
      priceRange: [25, 150]
    };
    
    return mockInventory;
  }

  private async calculateEnergeticCompatibility(params: any): Promise<any> {
    const { userIntentions, crystalOptions } = params;
    
    const matches = crystalOptions.map((crystal: string) => ({
      crystal,
      compatibility: Math.floor(Math.random() * 30) + 70, // 70-100%
      reasoning: `${crystal} resonates strongly with your intention for ${userIntentions[0] || 'healing'}.`,
      chakraAlignment: ['Heart', 'Crown', 'Third Eye'][Math.floor(Math.random() * 3)]
    }));
    
    return {
      matches: matches.sort((a, b) => b.compatibility - a.compatibility),
      overallGuidance: 'Your energy profile suggests you\'re in a period of transformation and growth.'
    };
  }

  private async getMoonPhaseAdvice(params: any): Promise<any> {
    const { intention, urgency } = params;
    const currentPhase = this.getCurrentMoonPhase();
    
    const advice = {
      'New Moon': 'Perfect time for setting intentions and beginning new crystal work.',
      'Waxing': 'Excellent energy for growth and manifestation with your crystals.',
      'Full Moon': 'Maximum energy for crystal charging and powerful healing work.',
      'Waning': 'Ideal for release work and clearing old patterns with crystals.'
    };
    
    return {
      currentPhase,
      advice: advice[currentPhase] || 'The current lunar energy supports crystal work.',
      optimal: urgency === 'high' || currentPhase === 'Full Moon',
      guidance: `Current ${currentPhase} energy: ${advice[currentPhase] || 'supportive for crystal work'}`
    };
  }

  private async analyzeUserBehavior(params: any): Promise<any> {
    const { timeSpent, pagesViewed, interactions } = params;
    
    const pattern = timeSpent > 300 ? 'deep_researcher' : 
                   timeSpent > 120 ? 'focused_shopper' : 'casual_browser';
    
    return {
      pattern,
      engagement: timeSpent > 180 ? 'high' : timeSpent > 60 ? 'medium' : 'low',
      insights: `Your browsing pattern suggests you're a ${pattern.replace('_', ' ')} who values quality information.`,
      recommendations: pattern === 'deep_researcher' ? 'detailed_information' : 'clear_options'
    };
  }

  private async generatePersonalizedRecommendations(params: any): Promise<any> {
    const { userProfile, currentContext, maxRecommendations = 3 } = params;
    
    // Generate recommendations based on profile and context
    const recommendations = [
      {
        crystal: 'Amethyst',
        confidence: 92,
        reasoning: 'Perfect for your spiritual growth journey',
        priceRange: [35, 85],
        urgency: 'medium'
      },
      {
        crystal: 'Rose Quartz',
        confidence: 88,
        reasoning: 'Supports emotional healing and self-love',
        priceRange: [25, 65],
        urgency: 'low'
      },
      {
        crystal: 'Clear Quartz',
        confidence: 85,
        reasoning: 'Amplifies intention and provides clarity',
        priceRange: [20, 55],
        urgency: 'medium'
      }
    ];
    
    return {
      recommendations: recommendations.slice(0, maxRecommendations),
      confidence: 'high',
      reasoning: 'Based on your energy profile and current needs'
    };
  }

  private getCurrentMoonPhase(): string {
    const phases = ['New Moon', 'Waxing', 'Full Moon', 'Waning'];
    return phases[Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % 4];
  }

  private updateSessionContext(context: any): void {
    if (context.productViews) {
      this.state.sessionContext.currentProducts = [...new Set([
        ...this.state.sessionContext.currentProducts,
        ...context.productViews
      ])];
    }
    if (context.behaviorPattern) {
      this.state.sessionContext.behaviorPattern = context.behaviorPattern;
    }
  }

  private updateState(analysis: any, toolResults: any[]): Partial<AgentState> {
    const updates: Partial<AgentState> = {};
    
    // Update user profile based on conversation
    if (analysis.entities.some((e: any) => e.type === 'crystals')) {
      const crystalPrefs = analysis.entities.find((e: any) => e.type === 'crystals').values;
      updates.userProfile = {
        ...this.state.userProfile,
        preferences: [...new Set([...this.state.userProfile.preferences, ...crystalPrefs])]
      };
    }
    
    // Update reasoning trail
    updates.reasoning = [
      ...this.state.reasoning,
      `Processed ${analysis.intent} with ${toolResults.length} tool calls`
    ];
    
    return updates;
  }

  // Public interface methods
  public getState(): AgentState {
    return { ...this.state };
  }

  public resetSession(): void {
    this.state.messages = [];
    this.state.sessionContext = {
      currentProducts: [],
      behaviorPattern: 'exploring',
      emotionalState: 'curious',
      interactionDepth: 0
    };
    this.state.reasoning = [];
  }

  public getAvailableTools(): Tool[] {
    return Array.from(this.tools.values());
  }
}