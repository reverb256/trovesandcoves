import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Search, Sparkles, TrendingUp, Target } from 'lucide-react';

// Minimal AI assistant that appears only when needed
export function SmartSearchBar({ onResults }: { onResults?: (results: any[]) => void }) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const smartSearch = useMutation({
    mutationFn: async (searchQuery: string) => {
      const response = await apiRequest('POST', '/api/scrape/search', {
        query: searchQuery,
        category: 'general',
        limit: 8
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (onResults) {
        onResults(data.results);
      }
    }
  });

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      smartSearch.mutate(searchQuery);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search crystals, properties, or intentions..."
            className="pl-10 border-gold/20 focus:ring-gold focus:border-gold"
          />
          {smartSearch.isPending && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin w-4 h-4 border-2 border-gold border-t-transparent rounded-full" />
            </div>
          )}
        </div>
        
        <Button
          onClick={() => handleSearch(query)}
          disabled={smartSearch.isPending || !query.trim()}
          className="bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Smart suggestions that appear subtly */}
      {isExpanded && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2">
          <div className="space-y-1">
            {[
              `Find ${query} for healing`,
              `${query} crystal properties`,
              `Best ${query} jewelry`,
              `${query} chakra alignment`
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch(suggestion);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
              >
                <Sparkles className="w-3 h-3 inline mr-2 text-gold" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Subtle market insights that appear in product listings
export function SubtleMarketInsights({ category }: { category?: string }) {
  const { data: insights } = useQuery({
    queryKey: ['/api/scrape/market-research', category],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/scrape/market-research', {
        topic: category || 'crystal jewelry'
      });
      return response.json();
    },
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 240000
  });

  if (!insights?.insights) return null;

  return (
    <div className="bg-gradient-to-r from-gold/5 to-amber-50 border border-gold/20 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-gold" />
        <h3 className="font-semibold text-gray-900">Market Trends</h3>
        <Badge variant="secondary" className="text-xs">Live Data</Badge>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4 text-sm">
        {insights.insights.trends && (
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Trending</h4>
            <p className="text-gray-600">{insights.insights.trends}</p>
          </div>
        )}
        
        {insights.insights.opportunities && (
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Popular</h4>
            <p className="text-gray-600">{insights.insights.opportunities}</p>
          </div>
        )}
        
        {insights.insights.recommendations && (
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Recommended</h4>
            <p className="text-gray-600">{insights.insights.recommendations}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Invisible competitor price monitoring
export function PriceIntelligence({ productType, currentPrice }: { productType: string; currentPrice: number }) {
  const { data: pricingData } = useQuery({
    queryKey: ['/api/scrape/competitor-pricing', productType],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/scrape/competitor-pricing', {
        productType
      });
      return response.json();
    },
    refetchInterval: 600000, // Refresh every 10 minutes
    staleTime: 480000
  });

  if (!pricingData?.analysis) return null;

  const { averagePrice, priceRange } = pricingData.analysis;
  const isCompetitive = currentPrice <= averagePrice;
  const savings = averagePrice - currentPrice;

  return (
    <div className="mt-2">
      {isCompetitive && savings > 5 && (
        <Badge className="bg-green-100 text-green-800 text-xs">
          <Target className="w-3 h-3 mr-1" />
          ${savings.toFixed(0)} below market average
        </Badge>
      )}
      
      {!isCompetitive && (
        <Badge variant="outline" className="text-xs text-gray-600">
          Market range: ${priceRange.min} - ${priceRange.max}
        </Badge>
      )}
    </div>
  );
}

// Content optimization suggestions (admin only)
export function ContentOptimizer({ niche }: { niche: string }) {
  const [isVisible, setIsVisible] = useState(false);
  
  const { data: contentIdeas } = useQuery({
    queryKey: ['/api/scrape/content-ideas', niche],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/scrape/content-ideas', {
        niche
      });
      return response.json();
    },
    enabled: isVisible,
    staleTime: 1800000 // 30 minutes
  });

  // Only show to admin users (check can be added here)
  const isAdmin = window.location.pathname.includes('/admin');
  
  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="bg-white shadow-lg border-gold/20"
      >
        <Sparkles className="w-4 h-4 mr-1" />
        Content Ideas
      </Button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-3">Content Opportunities</h3>
          
          {contentIdeas?.ideas?.slice(0, 5).map((idea: any, idx: number) => (
            <div key={idx} className="mb-3 p-3 border border-gray-100 rounded">
              <h4 className="font-medium text-sm">{idea.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{idea.description}</p>
              <div className="flex gap-1 mt-2">
                {idea.keywords?.slice(0, 3).map((keyword: string, kidx: number) => (
                  <Badge key={kidx} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Keyword monitoring for SEO (background process)
export function KeywordMonitor() {
  const keywords = [
    'crystal jewelry canada',
    'healing crystals winnipeg',
    'wire wrapped jewelry',
    'crystal necklaces',
    'amethyst jewelry'
  ];

  useQuery({
    queryKey: ['/api/scrape/keyword-monitor'],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/scrape/keyword-monitor', {
        keywords
      });
      return response.json();
    },
    refetchInterval: 1800000, // Check every 30 minutes
    staleTime: 1500000
  });

  // This component runs invisibly in the background
  return null;
}