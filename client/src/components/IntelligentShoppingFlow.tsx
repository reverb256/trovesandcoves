import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useContextualAI } from '@/hooks/useContextualAI';
import { ShoppingBag, Clock, AlertCircle, Gift, Zap, Eye, TrendingUp, Users, Sparkles } from 'lucide-react';

interface ShoppingTrigger {
  type: 'urgency' | 'social_proof' | 'personalized_offer' | 'educational' | 'timing';
  message: string;
  action: string;
  confidence: number;
  timing: number;
}

interface PurchasePattern {
  hesitationPoints: string[];
  motivators: string[];
  priceRange: [number, number];
  preferredTiming: string;
  socialInfluence: number;
}

export default function IntelligentShoppingFlow({ productId }: { productId: number }) {
  const { context, updateContext } = useContextualAI();
  const [activeFlow, setActiveFlow] = useState<string | null>(null);
  const [userPattern, setUserPattern] = useState<PurchasePattern | null>(null);
  const queryClient = useQueryClient();

  // Analyze user shopping behavior in real-time
  const { data: behaviorAnalysis } = useQuery({
    queryKey: ['behavior-analysis', productId, context.timeOnPage],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/ai/behavior-analysis', {
        productId,
        context,
        sessionData: {
          pageViews: window.history.length,
          scrollDepth: window.scrollY,
          mouseMovements: 'tracked',
          clickPattern: 'analyzed'
        }
      });
      return response.json();
    },
    enabled: context.timeOnPage > 20,
    refetchInterval: 15000
  });

  // Intelligent shopping triggers
  const triggerShoppingFlow = useMutation({
    mutationFn: async (trigger: ShoppingTrigger) => {
      const response = await apiRequest('POST', '/api/ai/shopping-trigger', {
        trigger,
        productId,
        userContext: context
      });
      return response.json();
    },
    onSuccess: (data) => {
      setActiveFlow(data.flowType);
      updateContext({ interactionPattern: 'focused' });
    }
  });

  useEffect(() => {
    if (behaviorAnalysis?.pattern) {
      setUserPattern(behaviorAnalysis.pattern);
    }

    // Trigger contextual flows based on behavior
    if (behaviorAnalysis?.triggers) {
      const highConfidenceTrigger = behaviorAnalysis.triggers.find(
        (t: ShoppingTrigger) => t.confidence > 0.8
      );
      
      if (highConfidenceTrigger && !activeFlow) {
        setTimeout(() => {
          triggerShoppingFlow.mutate(highConfidenceTrigger);
        }, highConfidenceTrigger.timing * 1000);
      }
    }
  }, [behaviorAnalysis]);

  // Hesitation intervention
  useEffect(() => {
    if (context.interactionPattern === 'leaving' && !activeFlow) {
      const interventionTrigger: ShoppingTrigger = {
        type: 'urgency',
        message: "This crystal resonates strongly with your energy. Others are also viewing it right now.",
        action: "secure_now",
        confidence: 0.9,
        timing: 0
      };
      triggerShoppingFlow.mutate(interventionTrigger);
    }
  }, [context.interactionPattern]);

  if (!behaviorAnalysis || !activeFlow) return null;

  const renderShoppingFlow = () => {
    switch (activeFlow) {
      case 'social_proof':
        return (
          <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 animate-gentle-bounce">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-amber-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-1">
                    High Interest Crystal
                  </h4>
                  <p className="text-sm text-amber-700 mb-3">
                    12 people viewed this in the last hour. 3 added to cart recently.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="button-interactive bg-amber-600 hover:bg-amber-700 text-white">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Secure Yours
                    </Button>
                    <Button size="sm" variant="outline" className="text-amber-700 border-amber-300">
                      View Similar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'personalized_offer':
        return (
          <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 crystal-glow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Gift className="h-5 w-5 text-emerald-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-emerald-900 mb-1">
                    Special Crystal Connection Offer
                  </h4>
                  <p className="text-sm text-emerald-700 mb-3">
                    Based on your crystal affinity profile, get 15% off this piece + free chakra alignment guide
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-emerald-100 text-emerald-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Valid for 20 minutes
                    </Badge>
                  </div>
                  <Button size="sm" className="button-interactive bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Claim Offer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'educational':
        return (
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">
                    Crystal Energy Match
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    This crystal's vibration aligns perfectly with your current energy needs. 
                    It's especially powerful for {userPattern?.motivators[0] || 'emotional healing'}.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="button-interactive bg-blue-600 hover:bg-blue-700 text-white">
                      Learn More
                    </Button>
                    <Button size="sm" variant="outline" className="text-blue-700 border-blue-300">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'urgency':
        return (
          <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 cart-wiggle">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">
                    Crystal Connection Alert
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    Your extended viewing suggests a strong energetic connection. 
                    This piece may not be available much longer.
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-red-100 text-red-800">
                      <Eye className="h-3 w-3 mr-1" />
                      High demand
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="button-interactive bg-red-600 hover:bg-red-700 text-white">
                      <Zap className="h-4 w-4 mr-1" />
                      Reserve Now
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-700 border-red-300">
                      Maybe Later
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'timing':
        return (
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-purple-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-purple-900 mb-1">
                    Perfect Timing Alignment
                  </h4>
                  <p className="text-sm text-purple-700 mb-3">
                    The current moon phase enhances this crystal's properties. 
                    Optimal time for manifestation and intention setting.
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🌙</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      Waxing Moon - Growth Energy
                    </Badge>
                  </div>
                  <Button size="sm" className="button-interactive bg-purple-600 hover:bg-purple-700 text-white">
                    Align with Timing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-50 animate-fade-in">
      {renderShoppingFlow()}
    </div>
  );
}