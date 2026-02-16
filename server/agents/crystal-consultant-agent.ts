import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface AgentMemory {
  userPreferences: {
    favoriteStones: string[];
    chakraFocus: string[];
    intentionTypes: string[];
    priceRange: [number, number];
    stylePreferences: string[];
  };
  conversationHistory: ChatCompletionMessageParam[];
  currentSession: {
    viewedProducts: number[];
    timeSpent: number;
    interactionPattern: 'browsing' | 'focused' | 'deciding' | 'purchasing';
    emotionalState: 'curious' | 'overwhelmed' | 'confident' | 'hesitant';
  };
  recommendations: {
    crystalMatches: Array<{
      stone: string;
      compatibility: number;
      reasoning: string;
    }>;
    timingAdvice: string;
    careInstructions: string[];
  };
}

export class CrystalConsultantAgent {
  private memory: AgentMemory;
  private systemPrompt: string;

  constructor() {
    this.memory = this.initializeMemory();
    this.systemPrompt = this.buildSystemPrompt();
  }

  private initializeMemory(): AgentMemory {
    return {
      userPreferences: {
        favoriteStones: [],
        chakraFocus: [],
        intentionTypes: [],
        priceRange: [0, 500],
        stylePreferences: []
      },
      conversationHistory: [],
      currentSession: {
        viewedProducts: [],
        timeSpent: 0,
        interactionPattern: 'browsing',
        emotionalState: 'curious'
      },
      recommendations: {
        crystalMatches: [],
        timingAdvice: '',
        careInstructions: []
      }
    };
  }

  private buildSystemPrompt(): string {
    return `You are Sage, an expert crystal consultant for Troves & Coves, a mystical Canadian crystal jewelry boutique. You combine deep crystal knowledge with modern shopping psychology to guide customers toward their perfect spiritual jewelry.

CORE EXPERTISE:
- Crystal properties, chakra alignments, and energetic healing
- Wire-wrapped jewelry craftsmanship and care
- Spiritual timing (moon phases, seasonal energies)
- Canadian crystal traditions and local metaphysical practices
- Shopping psychology and gentle sales guidance

PERSONALITY:
- Wise yet approachable, like a trusted spiritual mentor
- Respectful of all spiritual beliefs and practices
- Focused on authentic connections between person and crystal
- Knowledgeable about jewelry quality and craftsmanship
- Sensitive to customer budget and emotional state

TOOLS AVAILABLE:
- analyzeUserBehavior: Understand shopping patterns and emotional state
- recommendCrystals: Suggest stones based on needs and compatibility
- checkInventory: Verify product availability and details
- calculateCompatibility: Assess crystal-person energetic alignment
- provideCareGuidance: Offer maintenance and cleansing instructions
- assessTiming: Recommend optimal purchase/wearing timing

APPROACH:
1. Listen deeply to understand true needs (not just stated wants)
2. Ask clarifying questions about intentions and current life situation
3. Provide education before making sales suggestions
4. Respect budget constraints and offer alternatives
5. Focus on long-term satisfaction over immediate sales
6. Incorporate Canadian values of mindfulness and ethical consumption

Remember: Every crystal chooses its person. Your role is facilitating that sacred connection.`;
  }

  async processUserMessage(message: string, context?: any): Promise<{
    response: string;
    actions: Array<{ type: string; data: any }>;
    updatedMemory: Partial<AgentMemory>;
  }> {
    // Update session context
    if (context) {
      this.updateSessionContext(context);
    }

    // Add user message to conversation history
    this.memory.conversationHistory.push({
      role: 'user',
      content: message
    });

    // Analyze message intent and emotional state
    const intent = this.analyzeMessageIntent(message);
    const emotionalState = this.detectEmotionalState(message);
    
    // Update emotional state in memory
    this.memory.currentSession.emotionalState = emotionalState;

    // Generate response based on intent and current memory
    const response = await this.generateContextualResponse(message, intent);
    
    // Determine actions to take
    const actions = this.determineActions(intent, message);

    // Update memory based on conversation
    const memoryUpdates = this.updateMemoryFromInteraction(message, intent);

    // Add assistant response to history
    this.memory.conversationHistory.push({
      role: 'assistant',
      content: response
    });

    return {
      response,
      actions,
      updatedMemory: memoryUpdates
    };
  }

  private updateSessionContext(context: any) {
    if (context.viewedProducts) {
      this.memory.currentSession.viewedProducts = [...new Set([
        ...this.memory.currentSession.viewedProducts,
        ...context.viewedProducts
      ])];
    }
    if (context.timeSpent) {
      this.memory.currentSession.timeSpent = context.timeSpent;
    }
    if (context.interactionPattern) {
      this.memory.currentSession.interactionPattern = context.interactionPattern;
    }
  }

  private analyzeMessageIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('stress') || lowerMessage.includes('calm')) {
      return 'healing_emotional';
    }
    if (lowerMessage.includes('meditation') || lowerMessage.includes('spiritual') || lowerMessage.includes('chakra')) {
      return 'spiritual_growth';
    }
    if (lowerMessage.includes('protection') || lowerMessage.includes('negative energy')) {
      return 'protection';
    }
    if (lowerMessage.includes('love') || lowerMessage.includes('relationship') || lowerMessage.includes('heart')) {
      return 'love_relationships';
    }
    if (lowerMessage.includes('abundance') || lowerMessage.includes('money') || lowerMessage.includes('success')) {
      return 'prosperity';
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
      return 'price_inquiry';
    }
    if (lowerMessage.includes('care') || lowerMessage.includes('clean') || lowerMessage.includes('maintain')) {
      return 'care_instructions';
    }
    if (lowerMessage.includes('size') || lowerMessage.includes('fit') || lowerMessage.includes('length')) {
      return 'sizing';
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
      return 'greeting';
    }
    
    return 'general_inquiry';
  }

  private detectEmotionalState(message: string): 'curious' | 'overwhelmed' | 'confident' | 'hesitant' {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('confused') || lowerMessage.includes('don\'t know') || lowerMessage.includes('overwhelmed')) {
      return 'overwhelmed';
    }
    if (lowerMessage.includes('exactly') || lowerMessage.includes('perfect') || lowerMessage.includes('definitely')) {
      return 'confident';
    }
    if (lowerMessage.includes('maybe') || lowerMessage.includes('not sure') || lowerMessage.includes('hesitant')) {
      return 'hesitant';
    }
    
    return 'curious';
  }

  private async generateContextualResponse(message: string, intent: string): Promise<string> {
    const recentHistory = this.memory.conversationHistory.slice(-6); // Last 3 exchanges
    const userPrefs = this.memory.userPreferences;
    const sessionState = this.memory.currentSession;

    // Generate response based on intent and current state
    switch (intent) {
      case 'healing_emotional':
        return this.generateHealingResponse(message, userPrefs, sessionState);
      
      case 'spiritual_growth':
        return this.generateSpiritualResponse(message, userPrefs);
      
      case 'protection':
        return this.generateProtectionResponse(message, userPrefs);
      
      case 'love_relationships':
        return this.generateLoveResponse(message, userPrefs);
      
      case 'prosperity':
        return this.generateProsperityResponse(message, userPrefs);
      
      case 'price_inquiry':
        return this.generatePriceResponse(message, userPrefs);
      
      case 'care_instructions':
        return this.generateCareResponse(message, userPrefs);
      
      case 'sizing':
        return this.generateSizingResponse(message);
      
      case 'greeting':
        return this.generateGreetingResponse(sessionState);
      
      default:
        return this.generateGeneralResponse(message, userPrefs);
    }
  }

  private generateHealingResponse(message: string, userPrefs: any, sessionState: any): string {
    const recommendedStones = ['amethyst', 'lepidolite', 'rose quartz', 'moonstone'];
    const timeAdvice = this.getCurrentMoonPhaseAdvice();
    
    return `I sense you're seeking emotional healing and inner peace. Based on your energy, I'm drawn to recommend ${recommendedStones[0]} - it's particularly powerful for calming anxiety and promoting restful sleep.

Our ${recommendedStones[0]} pieces are wire-wrapped with sterling silver to enhance the stone's natural vibrations. ${timeAdvice}

Would you like me to show you our current ${recommendedStones[0]} collection, or would you prefer to explore what specific emotional support you're seeking?`;
  }

  private generateSpiritualResponse(message: string, userPrefs: any): string {
    return `Your spiritual journey calls for crystals that enhance connection to higher wisdom. Clear quartz amplifies intentions, while amethyst deepens meditation and opens the third eye chakra.

For someone on a conscious spiritual path, I often recommend starting with a clear quartz pendant for daily wear - it's like having a spiritual amplifier that works with your personal energy.

What aspects of your spiritual practice would you most like to enhance? Meditation depth, psychic abilities, or perhaps connection to divine guidance?`;
  }

  private generateProtectionResponse(message: string, userPrefs: any): string {
    return `Protection energy is essential in our modern world. Black tourmaline is our most powerful protective stone - it creates an energetic shield while grounding excess energy to the earth.

Our black tourmaline pieces are especially popular with sensitive individuals who work in challenging environments or crowded spaces. The wire wrapping actually enhances the protective field around your aura.

Are you looking for daily protection, or do you have specific situations where you need extra energetic shielding?`;
  }

  private generateLoveResponse(message: string, userPrefs: any): string {
    return `Love begins within and radiates outward. Rose quartz is the master of heart healing - it teaches us to love ourselves unconditionally before attracting healthy relationships.

Our rose quartz pieces are particularly special because we charge them under full moons to enhance their loving vibrations. Many customers tell us their relationships transformed after wearing rose quartz consistently.

Are you focusing on self-love and healing, or looking to attract new love into your life?`;
  }

  private generateProsperityResponse(message: string, userPrefs: any): string {
    return `True abundance flows when we align with our highest purpose. Citrine is known as the merchant's stone - it doesn't just attract money, but helps you recognize and act on opportunities.

Our citrine pieces work best when you wear them while setting clear intentions about your goals. The energy builds over time, supporting both practical action and energetic alignment.

What kind of abundance are you looking to cultivate? Financial prosperity, creative opportunities, or perhaps recognition for your talents?`;
  }

  private generatePriceResponse(message: string, userPrefs: any): string {
    return `I believe the right crystal will make itself known regardless of budget. Our pieces range from $25 for simple wire-wrapped stones to $200 for complex statement pieces.

What's beautiful about crystal work is that a $30 piece chosen with intention can be more powerful than an expensive crystal purchased without connection. I'm here to help you find what resonates, not push you toward higher prices.

Would you like to share your comfortable range so I can focus on pieces that will work for both your energy and your budget?`;
  }

  private generateCareResponse(message: string, userPrefs: any): string {
    return `Crystal care is both practical and energetic. For the physical jewelry: gentle soap and warm water, avoiding harsh chemicals that could damage the wire wrapping.

Energetically, I recommend cleansing under running water while setting intention, then charging under moonlight or with sage smoke. Some crystals like selenite can actually cleanse other stones.

Which crystals are you caring for? Different stones have specific needs - some love sunlight while others prefer moonlight, and a few (like amethyst) can fade in direct sun.`;
  }

  private generateSizingResponse(message: string): string {
    return `Perfect fit enhances both beauty and energy flow. Most of our necklaces are adjustable from 16-20 inches, which works for most people. For pendants, we recommend wearing them at heart chakra level for maximum energetic benefit.

If you have specific sizing needs, I can arrange for custom length adjustments. Many customers prefer longer chains for layering or shorter ones for close-to-heart wearing.

Are you looking for a specific length, or would you like guidance on what works best energetically for your intended purpose?`;
  }

  private generateGreetingResponse(sessionState: any): string {
    const timeBasedGreeting = this.getTimeBasedGreeting();
    
    return `${timeBasedGreeting} and welcome to Troves & Coves! I'm Sage, your crystal consultant. I'm here to help you discover jewelry that resonates with your unique energy and intentions.

Whether you're new to crystals or a seasoned collector, I love helping people find pieces that truly speak to their soul. Each crystal has its own personality and purpose.

What draws you to crystal jewelry today? Are you seeking something specific, or would you like me to guide you through discovering what might serve your highest good?`;
  }

  private generateGeneralResponse(message: string, userPrefs: any): string {
    return `I'm here to help you explore the beautiful world of crystal jewelry. Every piece in our collection is chosen for both its energetic properties and artistic craftsmanship.

Whether you're curious about specific stones, looking for guidance on intentions, or simply browsing our sacred collection, I'm here to offer personalized guidance without any pressure.

What aspect of crystal jewelry interests you most? The healing properties, the artistry of wire wrapping, or perhaps you have a specific life situation you'd like crystal support for?`;
  }

  private determineActions(intent: string, message: string): Array<{ type: string; data: any }> {
    const actions = [];

    // Always analyze compatibility when stones are mentioned
    if (this.mentionsCrystals(message)) {
      actions.push({
        type: 'analyzeCompatibility',
        data: { stones: this.extractMentionedCrystals(message) }
      });
    }

    // Suggest inventory check for specific inquiries
    if (intent === 'price_inquiry' || intent === 'sizing') {
      actions.push({
        type: 'checkInventory',
        data: { intent }
      });
    }

    // Trigger timing analysis for spiritual inquiries
    if (intent === 'spiritual_growth' || intent === 'healing_emotional') {
      actions.push({
        type: 'assessTiming',
        data: { currentPhase: this.getCurrentMoonPhase() }
      });
    }

    return actions;
  }

  private updateMemoryFromInteraction(message: string, intent: string): Partial<AgentMemory> {
    const updates: Partial<AgentMemory> = {};

    // Extract and store preferences
    if (intent === 'healing_emotional') {
      updates.userPreferences = {
        ...this.memory.userPreferences,
        intentionTypes: [...this.memory.userPreferences.intentionTypes, 'emotional_healing']
      };
    }

    // Extract mentioned crystals and add to favorites if positive sentiment
    const mentionedCrystals = this.extractMentionedCrystals(message);
    if (mentionedCrystals.length > 0 && this.hasPositiveSentiment(message)) {
      updates.userPreferences = {
        ...this.memory.userPreferences,
        favoriteStones: [...new Set([...this.memory.userPreferences.favoriteStones, ...mentionedCrystals])]
      };
    }

    return updates;
  }

  private mentionsCrystals(message: string): boolean {
    const crystals = ['amethyst', 'quartz', 'citrine', 'lepidolite', 'tourmaline', 'moonstone', 'labradorite'];
    return crystals.some(crystal => message.toLowerCase().includes(crystal));
  }

  private extractMentionedCrystals(message: string): string[] {
    const crystals = ['amethyst', 'quartz', 'citrine', 'lepidolite', 'tourmaline', 'moonstone', 'labradorite'];
    return crystals.filter(crystal => message.toLowerCase().includes(crystal));
  }

  private hasPositiveSentiment(message: string): boolean {
    const positiveWords = ['love', 'like', 'beautiful', 'perfect', 'amazing', 'wonderful'];
    return positiveWords.some(word => message.toLowerCase().includes(word));
  }

  private getCurrentMoonPhase(): string {
    // Simplified moon phase calculation
    const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent'];
    const now = new Date();
    const phaseIndex = Math.floor((now.getDate() % 29.5) / 3.69);
    return phases[phaseIndex] || 'New Moon';
  }

  private getCurrentMoonPhaseAdvice(): string {
    const phase = this.getCurrentMoonPhase();
    switch (phase) {
      case 'New Moon':
        return 'The new moon energy is perfect for setting intentions with new crystals.';
      case 'Full Moon':
        return 'Full moon energy amplifies crystal properties - an ideal time for meaningful purchases.';
      case 'Waxing':
        return 'Waxing moon supports growth and manifestation - excellent timing for prosperity stones.';
      case 'Waning':
        return 'Waning moon energy supports release and healing - perfect for emotional clearing stones.';
      default:
        return 'The current lunar energy supports crystal work and conscious purchasing.';
    }
  }

  private getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  // Public methods for external use
  public getMemory(): AgentMemory {
    return { ...this.memory };
  }

  public updateMemory(updates: Partial<AgentMemory>): void {
    this.memory = { ...this.memory, ...updates };
  }

  public resetSession(): void {
    this.memory.currentSession = {
      viewedProducts: [],
      timeSpent: 0,
      interactionPattern: 'browsing',
      emotionalState: 'curious'
    };
    this.memory.conversationHistory = [];
  }
}