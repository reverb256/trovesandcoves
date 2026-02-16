import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface UserContext {
  currentPage: string;
  viewingProduct?: string;
  cartItems: number;
  timeOnPage: number;
  previousSearches: string[];
  interactionPattern: 'browsing' | 'focused' | 'deciding' | 'leaving';
  crystalPreferences: string[];
  priceRange?: [number, number];
  lastInteraction: Date;
}

interface ContextualSuggestion {
  type: 'product' | 'guidance' | 'care' | 'education' | 'offers';
  title: string;
  message: string;
  action?: string;
  urgency: 'low' | 'medium' | 'high';
  timing: number; // seconds to wait before showing
}

export function useContextualAI() {
  const [context, setContext] = useState<UserContext>({
    currentPage: window.location.pathname,
    cartItems: 0,
    timeOnPage: 0,
    previousSearches: [],
    interactionPattern: 'browsing',
    crystalPreferences: [],
    lastInteraction: new Date()
  });

  const [suggestions, setSuggestions] = useState<ContextualSuggestion[]>([]);
  const timeRef = useRef<NodeJS.Timeout>();
  const startTime = useRef(Date.now());

  // Track user behavior patterns
  useEffect(() => {
    const updateTimeOnPage = () => {
      setContext(prev => ({
        ...prev,
        timeOnPage: Math.floor((Date.now() - startTime.current) / 1000)
      }));
    };

    const interval = setInterval(updateTimeOnPage, 1000);
    return () => clearInterval(interval);
  }, []);

  // Detect interaction patterns
  useEffect(() => {
    const detectPattern = () => {
      const { timeOnPage, cartItems } = context;
      
      if (timeOnPage > 300 && cartItems === 0) {
        setContext(prev => ({ ...prev, interactionPattern: 'leaving' }));
      } else if (timeOnPage > 120 && cartItems > 0) {
        setContext(prev => ({ ...prev, interactionPattern: 'deciding' }));
      } else if (timeOnPage > 60) {
        setContext(prev => ({ ...prev, interactionPattern: 'focused' }));
      } else {
        setContext(prev => ({ ...prev, interactionPattern: 'browsing' }));
      }
    };

    const timeout = setTimeout(detectPattern, 5000);
    return () => clearTimeout(timeout);
  }, [context.timeOnPage, context.cartItems]);

  // Generate contextual suggestions
  const { data: aiSuggestions } = useQuery({
    queryKey: ['contextual-ai', context.currentPage, context.interactionPattern],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/ai/contextual', {
        context,
        timestamp: new Date().toISOString()
      });
      return response.json();
    },
    refetchInterval: 30000,
    enabled: context.timeOnPage > 10
  });

  useEffect(() => {
    if (aiSuggestions?.suggestions) {
      setSuggestions(aiSuggestions.suggestions);
    }
  }, [aiSuggestions]);

  const updateContext = (updates: Partial<UserContext>) => {
    setContext(prev => ({
      ...prev,
      ...updates,
      lastInteraction: new Date()
    }));
  };

  const trackSearch = (query: string) => {
    setContext(prev => ({
      ...prev,
      previousSearches: [...prev.previousSearches.slice(-4), query]
    }));
  };

  const trackCrystalInterest = (crystal: string) => {
    setContext(prev => ({
      ...prev,
      crystalPreferences: Array.from(new Set([...prev.crystalPreferences, crystal]))
    }));
  };

  return {
    context,
    suggestions,
    updateContext,
    trackSearch,
    trackCrystalInterest
  };
}