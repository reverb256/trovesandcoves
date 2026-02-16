import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Eye, Clock, TrendingUp, Users, Sparkles, Calendar, Moon, Sun, Heart, ShoppingBag, Zap, Target } from 'lucide-react';

interface ProductInsight {
  id: string;
  productId: number;
  viewingTime: number;
  emotionalResonance: number;
  purchaseIntent: number;
  crystalAlignment: string[];
  personalityMatch: number;
  energeticProfile: string;
  recommendedTiming: string;
  complementaryProducts: number[];
  chakraAlignment: string[];
  moonPhaseRecommendation: string;
}

interface SmartProductInsightsProps {
  productId: number;
  userBehavior: {
    timeViewing: number;
    interactions: string[];
    previousPurchases: string[];
  };
}

export default function SmartProductInsights({ productId, userBehavior }: SmartProductInsightsProps) {
  const [insights, setInsights] = useState<ProductInsight | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: aiInsights, isLoading } = useQuery({
    queryKey: ['product-insights', productId, userBehavior.timeViewing],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/ai/product-insights', {
        productId,
        userBehavior,
        timestamp: new Date().toISOString()
      });
      return response.json();
    },
    enabled: userBehavior.timeViewing > 15
  });

  useEffect(() => {
    if (aiInsights) {
      setInsights(aiInsights);
    }
  }, [aiInsights]);

  if (isLoading || !insights) {
    return (
      <Card className="border-troves-turquoise/20 bg-gradient-to-br from-white to-troves-turquoise/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-troves-turquoise">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="text-sm">Analyzing your crystal connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMoonPhaseIcon = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'new moon': return '🌑';
      case 'waxing': return '🌒';
      case 'full moon': return '🌕';
      case 'waning': return '🌖';
      default: return '🌙';
    }
  };

  const getEnergeticColor = (profile: string) => {
    switch (profile.toLowerCase()) {
      case 'high vibration': return 'from-violet-500 to-purple-600';
      case 'grounding': return 'from-amber-600 to-orange-700';
      case 'healing': return 'from-emerald-500 to-green-600';
      case 'protective': return 'from-slate-600 to-gray-700';
      default: return 'from-troves-turquoise to-blue-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Insights */}
      <Card className="border-troves-turquoise/20 bg-gradient-to-br from-white to-troves-turquoise/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-troves-turquoise" />
            Your Crystal Connection Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Emotional Resonance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                Emotional Resonance
              </span>
              <span className="text-sm text-muted-foreground">{insights.emotionalResonance}%</span>
            </div>
            <Progress value={insights.emotionalResonance} className="h-2" />
          </div>

          {/* Purchase Intent */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                Purchase Intent
              </span>
              <span className="text-sm text-muted-foreground">{insights.purchaseIntent}%</span>
            </div>
            <Progress value={insights.purchaseIntent} className="h-2" />
          </div>

          {/* Personality Match */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                Personality Alignment
              </span>
              <span className="text-sm text-muted-foreground">{insights.personalityMatch}%</span>
            </div>
            <Progress value={insights.personalityMatch} className="h-2" />
          </div>

          {/* Energetic Profile */}
          <div className="p-3 rounded-lg bg-gradient-to-r ${getEnergeticColor(insights.energeticProfile)} text-white">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="font-medium">Energetic Profile: {insights.energeticProfile}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Insights */}
      {showAdvanced && (
        <Card className="border-elegant-gold/20 bg-gradient-to-br from-white to-elegant-gold/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Moon className="h-5 w-5 text-elegant-gold" />
              Advanced Crystal Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chakra Alignment */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-violet-500"></div>
                Chakra Alignment
              </h4>
              <div className="flex flex-wrap gap-1">
                {insights.chakraAlignment.map((chakra, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {chakra}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Moon Phase Recommendation */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-lg">{getMoonPhaseIcon(insights.moonPhaseRecommendation)}</span>
                Optimal Timing
              </h4>
              <p className="text-sm text-muted-foreground">
                Best purchased during {insights.moonPhaseRecommendation} for maximum energetic alignment
              </p>
            </div>

            {/* Crystal Properties Match */}
            <div>
              <h4 className="font-medium mb-2">Your Crystal Affinities</h4>
              <div className="flex flex-wrap gap-1">
                {insights.crystalAlignment.map((property, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-troves-turquoise/30">
                    {property}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Recommended Timing */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-indigo-900">Perfect Timing</span>
              </div>
              <p className="text-sm text-indigo-700">{insights.recommendedTiming}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Toggle Advanced Insights */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="button-interactive hover-sparkle border-troves-turquoise/30"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Crystal Insights
          <Sparkles className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}