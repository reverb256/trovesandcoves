import axios from 'axios';

interface IONetAgentConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

interface AgentWorkflow {
  text: string;
  maxWords?: number;
  temperature?: number;
  agentType: 'reasoning' | 'summary' | 'sentiment' | 'translation' | 'moderation';
}

interface AgentResponse {
  results: string;
  metadata?: {
    confidence: number;
    reasoning?: string[];
    sentiment?: {
      score: number;
      label: string;
    };
  };
}

export class IONetCrystalAgent {
  private config: IONetAgentConfig;
  private availableAgents: Map<string, any> = new Map();

  constructor(apiKey?: string) {
    this.config = {
      apiKey: apiKey || process.env.IOINTELLIGENCE_API_KEY || '',
      baseUrl: 'https://api.intelligence.io.solutions/api/v1',
      model: 'meta-llama/Llama-3.3-70B-Instruct'
    };
  }

  async initialize(): Promise<void> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/agents`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.agents) {
        Object.entries(response.data.agents).forEach(([key, agent]: [string, any]) => {
          this.availableAgents.set(key, agent);
        });
      }
    } catch (error) {
      console.warn('Could not load io.net agents, falling back to local implementation');
    }
  }

  async processMessage(message: string, context?: any): Promise<{
    response: string;
    reasoning: string[];
    sentiment: any;
    recommendations: any[];
  }> {
    if (!this.config.apiKey) {
      throw new Error('IO.net API key required for advanced agent functionality');
    }

    // Use reasoning agent for complex crystal consultation
    const reasoning = await this.runReasoningAgent(message, context);
    
    // Analyze sentiment to understand user emotional state
    const sentiment = await this.runSentimentAgent(message);
    
    // Generate crystal-specific recommendations based on reasoning
    const recommendations = await this.generateCrystalRecommendations(reasoning, sentiment, context);
    
    // Create comprehensive response
    const response = await this.synthesizeResponse(message, reasoning, sentiment, recommendations);

    return {
      response,
      reasoning: reasoning.reasoning || [],
      sentiment,
      recommendations
    };
  }

  private async runReasoningAgent(message: string, context?: any): Promise<any> {
    const contextualPrompt = this.buildCrystalContextPrompt(message, context);

    try {
      const response = await axios.post(`${this.config.baseUrl}/chat/completions`, {
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: `You are Sage, an expert crystal consultant for Troves & Coves. Use logical reasoning to understand the customer's needs and provide thoughtful crystal guidance. Consider their emotional state, spiritual goals, and practical requirements.

            Crystal Expertise:
            - Amethyst: Calming, spiritual protection, meditation enhancement
            - Rose Quartz: Unconditional love, emotional healing, self-acceptance
            - Clear Quartz: Amplification, clarity, universal healing
            - Citrine: Abundance, confidence, creative energy
            - Lepidolite: Anxiety relief, emotional balance, peaceful sleep
            - Black Tourmaline: Protection, grounding, negative energy clearing
            - Moonstone: Intuition, new beginnings, feminine energy
            - Labradorite: Transformation, psychic abilities, aura protection

            Canadian Values: Mindful consumption, ethical sourcing, spiritual wellness

            Reasoning Process:
            1. Identify customer's primary need (emotional, spiritual, physical)
            2. Consider their current life situation and challenges
            3. Match crystal properties to specific requirements
            4. Factor in practical considerations (budget, style preferences)
            5. Provide clear rationale for recommendations`
          },
          {
            role: "user",
            content: contextualPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        analysis: response.data.choices[0].message.content,
        reasoning: this.extractReasoningSteps(response.data.choices[0].message.content)
      };
    } catch (error) {
      console.error('Reasoning agent error:', error);
      return this.getFallbackReasoning(message);
    }
  }

  private async runSentimentAgent(message: string): Promise<any> {
    try {
      const response = await axios.post(`${this.config.baseUrl}/chat/completions`, {
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: "Analyze the emotional tone and sentiment of this customer message. Focus on their emotional state, level of certainty, and underlying needs. Return a JSON object with sentiment score (-1 to 1), confidence (0-1), primary emotion, and urgency level."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      try {
        const sentimentData = JSON.parse(response.data.choices[0].message.content);
        return {
          score: sentimentData.sentiment || 0,
          confidence: sentimentData.confidence || 0.8,
          emotion: sentimentData.primary_emotion || 'neutral',
          urgency: sentimentData.urgency || 'medium',
          label: sentimentData.sentiment > 0.3 ? 'positive' : sentimentData.sentiment < -0.3 ? 'negative' : 'neutral'
        };
      } catch (parseError) {
        return this.parseSentimentFromText(response.data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Sentiment agent error:', error);
      return this.getFallbackSentiment(message);
    }
  }

  private async generateCrystalRecommendations(reasoning: any, sentiment: any, context?: any): Promise<any[]> {
    const recommendationPrompt = `Based on this analysis:
    Customer Analysis: ${reasoning.analysis}
    Emotional State: ${sentiment.emotion} (${sentiment.label})
    Urgency: ${sentiment.urgency}
    
    Generate 3 specific crystal jewelry recommendations with:
    1. Crystal name and key properties
    2. Why it matches their needs (specific reasoning)
    3. Suggested price range
    4. Optimal timing for purchase/use
    
    Format as JSON array with: {crystal, properties, reasoning, priceRange, timing, confidence}`;

    try {
      const response = await axios.post(`${this.config.baseUrl}/chat/completions`, {
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: "You are a crystal expert. Generate specific, practical recommendations based on customer analysis. Be precise and helpful."
          },
          {
            role: "user",
            content: recommendationPrompt
          }
        ],
        temperature: 0.5,
        max_tokens: 600
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      try {
        return JSON.parse(response.data.choices[0].message.content);
      } catch (parseError) {
        return this.parseRecommendationsFromText(response.data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Recommendations error:', error);
      return this.getFallbackRecommendations(sentiment);
    }
  }

  private async synthesizeResponse(message: string, reasoning: any, sentiment: any, recommendations: any[]): Promise<string> {
    const synthesisPrompt = `Create a warm, personalized response for a crystal jewelry customer based on:

    Original Message: "${message}"
    Analysis: ${reasoning.analysis}
    Customer Emotion: ${sentiment.emotion}
    Top Recommendation: ${recommendations[0]?.crystal || 'amethyst'}

    Guidelines:
    - Be warm and spiritually connected, like a trusted crystal mentor
    - Acknowledge their emotional state sensitively
    - Explain the recommendation with clear reasoning
    - Include practical details (care, timing, pricing)
    - Invite further conversation
    - Maximum 200 words
    - Natural, conversational tone`;

    try {
      const response = await axios.post(`${this.config.baseUrl}/chat/completions`, {
        model: this.config.model,
        messages: [
          {
            role: "system",
            content: "You are Sage, a wise and compassionate crystal consultant. Craft personalized responses that feel genuine and helpful."
          },
          {
            role: "user",
            content: synthesisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Synthesis error:', error);
      return this.generateFallbackResponse(message, recommendations[0]);
    }
  }

  private buildCrystalContextPrompt(message: string, context?: any): string {
    let prompt = `Customer message: "${message}"`;
    
    if (context) {
      if (context.viewedProducts?.length > 0) {
        prompt += `\n\nBrowsing context: Customer has viewed ${context.viewedProducts.length} products`;
      }
      if (context.timeOnPage > 0) {
        prompt += `\nTime spent: ${Math.floor(context.timeOnPage / 60)} minutes`;
      }
      if (context.interactionPattern) {
        prompt += `\nBehavior pattern: ${context.interactionPattern}`;
      }
      if (context.crystalPreferences?.length > 0) {
        prompt += `\nPrevious interests: ${context.crystalPreferences.join(', ')}`;
      }
    }

    prompt += `\n\nPlease analyze this customer's needs and provide reasoned crystal guidance. Consider their emotional state, spiritual goals, and practical requirements. Use step-by-step reasoning to reach your recommendations.`;

    return prompt;
  }

  private extractReasoningSteps(text: string): string[] {
    const lines = text.split('\n');
    const reasoningSteps: string[] = [];
    
    lines.forEach(line => {
      line = line.trim();
      if (line.match(/^\d+\./) || line.includes('because') || line.includes('therefore') || line.includes('since')) {
        reasoningSteps.push(line);
      }
    });

    return reasoningSteps.length > 0 ? reasoningSteps : [text.substring(0, 200) + '...'];
  }

  private parseSentimentFromText(text: string): any {
    const lowerText = text.toLowerCase();
    let score = 0;
    let emotion = 'neutral';

    if (lowerText.includes('positive') || lowerText.includes('happy') || lowerText.includes('excited')) {
      score = 0.7;
      emotion = 'positive';
    } else if (lowerText.includes('negative') || lowerText.includes('sad') || lowerText.includes('anxious')) {
      score = -0.7;
      emotion = 'concerned';
    } else if (lowerText.includes('neutral') || lowerText.includes('calm')) {
      score = 0;
      emotion = 'neutral';
    }

    return {
      score,
      confidence: 0.8,
      emotion,
      urgency: lowerText.includes('urgent') || lowerText.includes('soon') ? 'high' : 'medium',
      label: score > 0.3 ? 'positive' : score < -0.3 ? 'negative' : 'neutral'
    };
  }

  private parseRecommendationsFromText(text: string): any[] {
    const recommendations = [];
    const crystals = ['amethyst', 'rose quartz', 'clear quartz', 'citrine', 'lepidolite'];
    
    crystals.forEach(crystal => {
      if (text.toLowerCase().includes(crystal)) {
        recommendations.push({
          crystal,
          properties: `${crystal} properties for healing and spiritual growth`,
          reasoning: `${crystal} matches your current energy needs`,
          priceRange: [25, 85],
          timing: 'current moon phase supports this choice',
          confidence: 0.8
        });
      }
    });

    return recommendations.length > 0 ? recommendations.slice(0, 3) : this.getFallbackRecommendations({ emotion: 'neutral' });
  }

  // Fallback methods for when API is unavailable
  private getFallbackReasoning(message: string): any {
    return {
      analysis: `Based on your message, I sense you're seeking guidance with crystal healing. Let me help you find the right stone for your needs.`,
      reasoning: [
        'Analyzing your request for crystal guidance',
        'Considering emotional and spiritual needs',
        'Matching crystal properties to your requirements'
      ]
    };
  }

  private getFallbackSentiment(message: string): any {
    const anxietyWords = ['anxious', 'stress', 'worried', 'overwhelmed'];
    const loveWords = ['love', 'heart', 'relationship', 'romance'];
    const spiritualWords = ['spiritual', 'meditation', 'energy', 'chakra'];

    let emotion = 'curious';
    let score = 0;

    if (anxietyWords.some(word => message.toLowerCase().includes(word))) {
      emotion = 'concerned';
      score = -0.3;
    } else if (loveWords.some(word => message.toLowerCase().includes(word))) {
      emotion = 'hopeful';
      score = 0.5;
    } else if (spiritualWords.some(word => message.toLowerCase().includes(word))) {
      emotion = 'seeking';
      score = 0.2;
    }

    return {
      score,
      confidence: 0.7,
      emotion,
      urgency: 'medium',
      label: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral'
    };
  }

  private getFallbackRecommendations(sentiment: any): any[] {
    const baseRecommendations = [
      {
        crystal: 'amethyst',
        properties: 'Calming, spiritual protection, enhanced intuition',
        reasoning: 'Perfect for meditation and emotional balance',
        priceRange: [35, 75],
        timing: 'Excellent for evening use and bedtime',
        confidence: 0.9
      },
      {
        crystal: 'rose quartz',
        properties: 'Unconditional love, emotional healing, self-acceptance',
        reasoning: 'Supports heart chakra healing and self-love',
        priceRange: [25, 65],
        timing: 'Powerful during full moon for love work',
        confidence: 0.85
      },
      {
        crystal: 'clear quartz',
        properties: 'Amplification, clarity, universal healing',
        reasoning: 'Master healer that works with any intention',
        priceRange: [20, 55],
        timing: 'Can be used anytime for any purpose',
        confidence: 0.8
      }
    ];

    // Adjust recommendations based on sentiment
    if (sentiment.emotion === 'concerned' || sentiment.score < 0) {
      return [baseRecommendations[0], baseRecommendations[1]]; // Amethyst and Rose Quartz for healing
    } else if (sentiment.emotion === 'hopeful' || sentiment.score > 0.3) {
      return [baseRecommendations[1], baseRecommendations[2]]; // Rose Quartz and Clear Quartz for positive energy
    }

    return baseRecommendations;
  }

  private generateFallbackResponse(message: string, topRecommendation?: any): string {
    const crystal = topRecommendation?.crystal || 'amethyst';
    
    return `Thank you for reaching out about crystal guidance. Based on your message, I'm drawn to recommend ${crystal} for you. This beautiful stone offers ${topRecommendation?.properties || 'calming and protective energy'}.

${topRecommendation?.reasoning || `${crystal} is particularly powerful for emotional healing and spiritual growth`}. Our ${crystal} pieces range from $${topRecommendation?.priceRange?.[0] || 35} to $${topRecommendation?.priceRange?.[1] || 75}.

Would you like to see our current ${crystal} collection, or would you prefer to tell me more about what you're seeking so I can provide more personalized guidance?`;
  }

  public async getAvailableAgents(): Promise<any> {
    if (this.availableAgents.size === 0) {
      await this.initialize();
    }
    return Object.fromEntries(this.availableAgents);
  }

  public isConfigured(): boolean {
    return !!this.config.apiKey;
  }
}