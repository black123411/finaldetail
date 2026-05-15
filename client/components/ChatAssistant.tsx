import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { getGeminiKey } from '../lib/config';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

// Initialize inside the component to pick up dynamic key changes
export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm your detailing concierge. Tell me about your vehicle's condition, and I'll recommend the perfect package for you!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = getGeminiKey();
      if (!apiKey) throw new Error('MISSING_KEY');
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: userMessage,
        config: {
          systemInstruction: "You are a professional detailing concierge for 'Bryan's Showroom Quality Detailing'. We are a premium detailing service based in Bellevue, Nebraska, serving the entire Omaha metro area. Your goal is to help customers choose the right detailing package. We offer: 1. Showroom Full Detail (Interior & Exterior), 2. Interior Reset, 3. Exterior Enhancement, 4. Paint Correction (Stage 1 & 2), 5. Ceramic Coating. Our primary operations are based out of our dedicated Bellevue location, which ensures the highest quality environment for coatings and paint corrections. We offer pick-up and drop-off options, as well as scheduled maintenance for established clients. We require a $50 deposit for bookings. Be helpful, professional, and recommend specific packages based on their car's condition. Keep responses concise and friendly.",
        },
      });

      const botResponse = response.text || "I'm sorry, I couldn't process that. How else can I help you?";
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      const isMissingKey = !getGeminiKey();
      const errorMessage = isMissingKey 
        ? "The Gemini API Key is missing. Please add GEMINI_API_KEY to the project secrets or enter it in the Admin Setup Wizard."
        : "I'm having a bit of trouble connecting to the AI right now. Please try again or check your API quota!";
      
      setMessages(prev => [...prev, { role: 'bot', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl border border-zinc-200 w-[350px] sm:w-[400px] overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="bg-zinc-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Detailing Assistant</h3>
                  <p className="text-[10px] text-zinc-400">Online & Ready to Help</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-zinc-800 p-1 rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="h-[400px] overflow-y-auto p-4 space-y-4 bg-zinc-50"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-zinc-900' : 'bg-white border border-zinc-200'}`}>
                      {msg.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-zinc-600" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-zinc-900 text-white rounded-tr-none' 
                        : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-zinc-600" />
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-zinc-200 text-zinc-800 rounded-tl-none shadow-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-zinc-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about a service..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full p-3 pr-12 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-900 disabled:opacity-50 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <p className="text-[10px] text-center text-zinc-400 mt-3">
                Powered by AI • Recommendations are estimates
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-zinc-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-zinc-800 transition-colors"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
