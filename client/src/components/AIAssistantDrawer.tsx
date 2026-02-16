import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Minimize2, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your crystal wisdom guide. I can help you find the perfect healing stones, understand crystal properties, or answer questions about our jewelry collections. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message: userMessage.content,
        context: "crystal_jewelry_assistant"
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm currently experiencing some technical difficulties. Please feel free to contact us directly for immediate assistance with your crystal jewelry needs.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 group"
          >
            {/* Turquoise Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-teal-400/20 animate-pulse group-hover:from-cyan-400/30 group-hover:to-teal-400/30"></div>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping"></div>
            
            <MessageCircle className="w-6 h-6 text-primary-foreground relative z-10" />
            
            {/* Glow rings */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/10 to-teal-400/10 scale-110 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/5 to-teal-400/5 scale-125 animate-pulse delay-75"></div>
          </Button>
        </div>
      )}

      {/* Drawer */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full max-w-md h-96 z-50 flex flex-col">
          {/* Background layers for depth */}
          <div className="absolute inset-0 bg-background/90 backdrop-blur-md rounded-tl-lg"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 to-background/85 backdrop-blur-lg rounded-tl-lg"></div>
          <div className="absolute inset-0 border-l border-t border-border/50 rounded-tl-lg shadow-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-tl-lg"></div>
          
          {/* Content container */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-teal-400/20 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Crystal Wisdom Guide</h3>
                  <p className="text-xs text-muted-foreground">Your mystical jewelry assistant</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground border'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 opacity-70 ${
                        message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground border p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about crystals, jewelry, or spiritual guidance..."
                  className="flex-1 bg-input border-border text-foreground placeholder-muted-foreground"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!input.trim() || isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}