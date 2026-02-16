import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Sparkles, Brain, Target, TrendingUp, ShoppingBag, Heart, Star, Filter, Search, Wand2, Gem, MessageSquare, ChevronRight, Lightbulb, Gift } from 'lucide-react';
import { MobileProductCard, MobileNavigation, MobileSearchFilter, MobileCartDrawer } from './MobileOptimized';

interface AIRecommendation {
  id: number;
  name: string;
  reason: string;
  confidence: number;
  crystalProperties: string[];
}

interface PersonalizationData {
  crystalAffinities: string[];
  purchaseHistory: string[];
  browsingBehavior: string[];
  personalityProfile: string;
  recommendations: AIRecommendation[];
}

// AI-powered personalized product recommendations
export function AIPersonalizedRecommendations() {
  const [personalization, setPersonalization] = useState<PersonalizationData | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: aiStatus } = useQuery({
    queryKey: ['/api/ai/status'],
    refetchInterval: 30000
  });

  const generateRecommendations = useMutation({
    mutationFn: async (userPreferences: any) => {
      const response = await apiRequest('POST', '/api/ai/personalize', {
        preferences: userPreferences,
        context: 'product_recommendations'
      });
      return response.json();
    },
    onSuccess: (data) => {
      setPersonalization(data);
    }
  });

  useEffect(() => {
    // Auto-generate initial recommendations based on browsing behavior
    if (aiStatus?.availableEndpoints > 0) {
      const userBehavior = {
        viewedCategories: ['crystal-necklaces', 'healing-crystals'],
        timeSpent: 'high',
        priceRange: 'mid-tier',
        deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop'
      };
      
      generateRecommendations.mutate(userBehavior);
    }
  }, [aiStatus]);

  if (!personalization) {
    return (
      <Card className="border-gold/20 bg-gradient-to-br from-white to-gold/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-gold" />
            AI Personal Curator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gold/20 bg-gradient-to-br from-white to-gold/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold" />
          Curated Just for You
          <Badge className="bg-green-100 text-green-800 text-xs ml-auto">
            AI Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {personalization.recommendations.slice(0, 3).map((rec) => (
            <div key={rec.id} className="p-4 border border-gold/20 rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-sm">{rec.name}</h4>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-gold" />
                  <span className="text-xs text-gold font-medium">{(rec.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {rec.crystalProperties.map((prop, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {prop}
                  </Badge>
                ))}
              </div>
              
              <Button size="sm" className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90">
                View Details
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-4 border-t border-gold/20">
          <Button 
            variant="outline" 
            onClick={() => generateRecommendations.mutate({ refresh: true })}
            disabled={generateRecommendations.isPending}
            className="border-gold/20 hover:bg-gold/5"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            Refresh Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// AI-powered virtual consultant
export function AIVirtualConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const { data: aiStatus } = useQuery({
    queryKey: ['/api/ai/status']
  });

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/ai/consult', {
        message,
        context: 'crystal_guidance',
        sessionId: localStorage.getItem('consultSessionId') || undefined
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, 
        { role: 'user', content: input },
        { role: 'assistant', content: data.response, recommendations: data.recommendations }
      ]);
      setInput('');
      
      if (data.sessionId) {
        localStorage.setItem('consultSessionId', data.sessionId);
      }
    }
  });

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 z-50 bg-white rounded-xl shadow-2xl border border-gold/20 flex flex-col">
      <div className="p-4 border-b border-gold/20 bg-gradient-to-r from-gold/10 to-amber-50 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-gold" />
            <h3 className="font-semibold">Crystal Advisor</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            ×
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-1">Ask about crystals, energy, and guidance</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Lightbulb className="h-8 w-8 text-gold mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-4">Start by asking about crystals or your intentions</p>
            <div className="space-y-2">
              {[
                "What crystal helps with anxiety?",
                "I need focus for studying",
                "Looking for love crystals"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 w-full text-left justify-start"
                  onClick={() => {
                    setInput(suggestion);
                    sendMessage.mutate(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-gold/10 ml-4' 
                : 'bg-gray-50 mr-4'
            }`}>
              <p className="text-sm">{msg.content}</p>
              {msg.recommendations && (
                <div className="mt-2 space-y-1">
                  {msg.recommendations.map((rec: any, recIdx: number) => (
                    <Badge key={recIdx} variant="secondary" className="text-xs mr-1">
                      {rec.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gold/20">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about crystals..."
            className="flex-1 text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && input.trim()) {
                sendMessage.mutate(input);
              }
            }}
          />
          <Button 
            size="sm"
            onClick={() => input.trim() && sendMessage.mutate(input)}
            disabled={sendMessage.isPending || !input.trim()}
            className="bg-gradient-to-r from-gold to-amber-500"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// AI-powered smart search with visual recognition
export function AISmartSearch({ onResults }: { onResults: (results: any[]) => void }) {
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'text' | 'visual' | 'intent'>('text');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const smartSearch = useMutation({
    mutationFn: async (searchData: any) => {
      const formData = new FormData();
      formData.append('query', searchData.query);
      formData.append('mode', searchData.mode);
      if (searchData.image) {
        formData.append('image', searchData.image);
      }

      const response = await fetch('/api/ai/smart-search', {
        method: 'POST',
        body: formData
      });
      return response.json();
    },
    onSuccess: (data) => {
      onResults(data.results);
    }
  });

  const handleSearch = () => {
    if (searchMode === 'visual' && imageFile) {
      smartSearch.mutate({ query, mode: searchMode, image: imageFile });
    } else if (query.trim()) {
      smartSearch.mutate({ query, mode: searchMode });
    }
  };

  return (
    <Card className="border-gold/20 bg-gradient-to-br from-white to-gold/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gold" />
          AI Smart Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {[
            { mode: 'text', icon: Search, label: 'Text' },
            { mode: 'visual', icon: Target, label: 'Visual' },
            { mode: 'intent', icon: Brain, label: 'Intent' }
          ].map(({ mode, icon: Icon, label }) => (
            <Button
              key={mode}
              variant={searchMode === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchMode(mode as any)}
              className={searchMode === mode ? 'bg-gradient-to-r from-gold to-amber-500' : 'border-gold/20'}
            >
              <Icon className="h-4 w-4 mr-1" />
              {label}
            </Button>
          ))}
        </div>

        {searchMode === 'visual' ? (
          <div className="space-y-3">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="border-gold/20"
            />
            <p className="text-sm text-gray-500">Upload an image to find similar crystals</p>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchMode === 'intent' 
                  ? "Describe what you need: 'I want peace and calm'"
                  : "Search crystals, properties, or intentions..."
              }
              className="border-gold/20"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            
            {searchMode === 'intent' && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Love & Relationships',
                  'Protection & Grounding',
                  'Clarity & Focus',
                  'Abundance & Success'
                ].map((intent) => (
                  <Button
                    key={intent}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(intent)}
                    className="text-xs border-gold/20 hover:bg-gold/5"
                  >
                    {intent}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={handleSearch}
          disabled={smartSearch.isPending || (!query.trim() && !imageFile)}
          className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90"
        >
          {smartSearch.isPending ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Search with AI
        </Button>
      </CardContent>
    </Card>
  );
}

// AI-enhanced product experience
export function AIEnhancedProductGrid({ products, onAddToCart }: any) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);

  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart']
  });

  const { data: aiStatus } = useQuery({
    queryKey: ['/api/ai/status'],
    refetchInterval: 30000
  });

  const generateInsights = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/insights', {
        products: products.slice(0, 10),
        context: 'product_analysis'
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAiInsights(data);
    }
  });

  useEffect(() => {
    if (products.length > 0 && aiStatus?.availableEndpoints > 0) {
      generateInsights.mutate();
    }
  }, [products, aiStatus]);

  const displayProducts = searchResults.length > 0 ? searchResults : products;

  return (
    <div className="space-y-6">
      {/* Mobile Navigation */}
      <MobileNavigation 
        isOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Search & Filter */}
      <MobileSearchFilter 
        onSearch={(term: string) => console.log('Search:', term)}
        onFilter={(filters: any) => console.log('Filter:', filters)}
      />

      {/* AI Insights Panel */}
      {aiInsights && (
        <Card className="border-gold/20 bg-gradient-to-br from-white to-gold/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-gold" />
              AI Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gold/20 rounded-lg">
                <Gift className="h-8 w-8 text-gold mx-auto mb-2" />
                <p className="font-semibold">{aiInsights.trending}</p>
                <p className="text-sm text-gray-600">Trending Crystal</p>
              </div>
              <div className="text-center p-4 border border-gold/20 rounded-lg">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="font-semibold">{aiInsights.popular}</p>
                <p className="text-sm text-gray-600">Most Loved</p>
              </div>
              <div className="text-center p-4 border border-gold/20 rounded-lg">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-semibold">{aiInsights.recommended}</p>
                <p className="text-sm text-gray-600">AI Recommended</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Smart Search */}
      <AISmartSearch onResults={setSearchResults} />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayProducts.map((product: any) => (
          <MobileProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Mobile Cart Drawer */}
      <MobileCartDrawer
        isOpen={mobileCartOpen}
        onClose={() => setMobileCartOpen(false)}
        cartItems={cartItems}
      />

      {/* Floating Cart Button for Mobile */}
      <div className="fixed bottom-20 right-6 z-40 lg:hidden">
        <Button
          onClick={() => setMobileCartOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90 shadow-lg"
        >
          <ShoppingBag className="h-6 w-6" />
          {cartItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
}