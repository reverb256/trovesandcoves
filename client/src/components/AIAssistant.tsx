import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Image, Volume2, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio';
  provider?: string;
  model?: string;
}

interface AIStatus {
  totalEndpoints: number;
  availableEndpoints: number;
  processing: boolean;
  endpoints: Array<{
    name: string;
    isAvailable: boolean;
    lastChecked: Date;
  }>;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Welcome to Troves & Coves! I'm your AI crystal jewelry consultant. I can help you discover the perfect crystals for your needs, provide care instructions, and generate custom product images. How can I assist you today?",
      timestamp: new Date(),
      provider: 'System',
      model: 'assistant'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus | null>(null);
  const [requestType, setRequestType] = useState<'text' | 'image' | 'audio'>('text');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchAIStatus();
    const interval = setInterval(fetchAIStatus, 30000); // Check status every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAIStatus = async () => {
    try {
      const response = await apiRequest('GET', '/api/ai/status');
      const data = await response.json();
      setAiStatus(data);
    } catch (error) {
      console.error('Failed to fetch AI status:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/ai/chat', {
        prompt: input,
        type: requestType,
        maxTokens: 500,
        temperature: 0.7,
        priority: 'medium'
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.content,
        timestamp: new Date(),
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaUrl ? (requestType === 'image' ? 'image' : 'audio') : undefined,
        provider: data.provider,
        model: data.model
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or contact our support team for immediate assistance.",
        timestamp: new Date(),
        provider: 'Error Handler',
        model: 'fallback'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getProviderColor = (provider?: string) => {
    if (!provider) return 'bg-gray-100 text-gray-800';
    if (provider.includes('Pollinations')) return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    if (provider.includes('Local')) return 'bg-amber-100 text-amber-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto">
      {/* AI Status Bar */}
      <Card className="mb-4 border-gold/20 bg-gradient-to-r from-black/5 to-gold/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-5 w-5 text-gold" />
            AI Assistant Status
            {aiStatus && (
              <Badge variant={aiStatus.availableEndpoints > 0 ? "default" : "destructive"} className="ml-auto">
                {aiStatus.availableEndpoints}/{aiStatus.totalEndpoints} Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {aiStatus?.endpoints?.map((endpoint, index) => (
              <Badge
                key={index}
                variant={endpoint.isAvailable ? "default" : "secondary"}
                className={`${endpoint.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {endpoint.name}
              </Badge>
            )) || (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                AI system status checking...
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Request Type Selector */}
      <Card className="mb-4 border-gold/20">
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Button
              variant={requestType === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRequestType('text')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Text Chat
            </Button>
            <Button
              variant={requestType === 'image' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRequestType('image')}
              className="flex items-center gap-2"
            >
              <Image className="h-4 w-4" />
              Generate Image
            </Button>
            <Button
              variant={requestType === 'audio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRequestType('audio')}
              className="flex items-center gap-2"
            >
              <Volume2 className="h-4 w-4" />
              Generate Audio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="flex-1 border-gold/20 backdrop-blur-sm bg-white/95">
        <CardContent className="p-0 h-full">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-gold to-amber-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 mt-1 flex-shrink-0" />
                      ) : (
                        <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-gold" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {message.mediaUrl && message.mediaType === 'image' && (
                          <div className="mt-2">
                            <img
                              src={message.mediaUrl}
                              alt="Generated crystal jewelry image"
                              className="rounded-lg max-w-full h-auto shadow-lg"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        )}

                        {message.mediaUrl && message.mediaType === 'audio' && (
                          <div className="mt-2">
                            <audio controls className="w-full">
                              <source src={message.mediaUrl} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.provider && (
                            <Badge className={`text-xs ${getProviderColor(message.provider)}`}>
                              {message.provider} • {message.model}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gold" />
                    <span className="text-sm text-gray-600">
                      {requestType === 'image' ? 'Generating image...' : 
                       requestType === 'audio' ? 'Generating audio...' : 
                       'Thinking...'}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Input */}
      <Card className="mt-4 border-gold/20">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                requestType === 'image' 
                  ? "Describe the crystal jewelry image you'd like me to generate..."
                  : requestType === 'audio'
                  ? "Enter text for audio narration..."
                  : "Ask me about crystals, jewelry care, or our products..."
              }
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-gold to-amber-500 hover:from-gold/90 hover:to-amber-500/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {requestType === 'image' ? 'Generate' : requestType === 'audio' ? 'Speak' : 'Send'}
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Sparkles className="h-3 w-3" />
            <span>
              {requestType === 'image' && 'AI will generate high-quality, watermark-free crystal jewelry images'}
              {requestType === 'audio' && 'AI will create professional audio narration for consultations'}
              {requestType === 'text' && 'AI powered by multiple intelligent systems for comprehensive crystal expertise'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}