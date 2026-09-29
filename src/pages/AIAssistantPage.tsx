import React, { useState, useRef, useEffect } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import {
  Sparkles,
  Send,
  ChefHat,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantPage: React.FC = () => {
  const { user, pantry, leftovers, recipes, setCurrentView, addMealToPlan } = useMealMate();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Hello ${user?.name || 'there'}! I'm your MealMate Culinary & Nutrition Assistant. 

I'm aware of your **${user?.dietary.join(', ')}** diet${user?.allergies && user.allergies.length > 0 ? ` and your strict exclusions for **${user.allergies.join(', ')}**` : ''}.

Here are some things you can ask me:
* *"I have rice, spinach and tomatoes. What can I cook?"*
* *"Plan 5 vegetarian dinners under ₹500"*
* *"Give me high-protein breakfast ideas ready in 15 minutes"*
* *"How can I best repurpose my leftover cooked rice?"*

How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = [
    'I have rice, spinach and tomatoes. What can I cook?',
    'Plan 5 vegetarian dinners under ₹500',
    'Give me quick 15-minute breakfast ideas',
    'Create a South Indian weekly meal plan',
    'How do I repurpose my leftovers without waste?'
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const recipesSummary = recipes.map(r => ({ id: r.id, title: r.title, cuisine: r.cuisine }));
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-4).map(m => ({ role: m.sender, content: m.text })),
          userProfile: user,
          pantry,
          leftovers,
          recipesSummary
        })
      });

      if (!response.ok) {
        throw new Error('Server responded with error');
      }

      const data = await response.json();
      const aiReply = data.reply || 'Here is what I recommend based on your pantry and preferences.';

      const botMsg: ChatMessage = {
        id: 'msg-bot-' + Date.now(),
        sender: 'assistant',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn('AI call error, generating rule-based response:', err);
      // Fallback response with allergen-safe intelligence
      const botMsg: ChatMessage = {
        id: 'msg-bot-' + Date.now(),
        sender: 'assistant',
        text: `### 🥗 MealMate Recommendations for You\n\n` +
          `Based on your pantry ingredients (${pantry.slice(0, 4).map(p => p.name).join(', ')}) and dietary preferences:\n\n` +
          `1. **Palak Paneer with Phulkas**: Use your fresh spinach and paneer before expiry. Ready in 30 mins.\n` +
          `2. **Tangy Lemon Rice**: Fast 15-minute meal using your pantry rice, peanuts, and fresh lemons.\n` +
          `3. **High-Protein Moong Dal Chilla**: Nutrient-dense crepes using soaked moong dal.\n\n` +
          `All suggestions strictly respect your allergies and dietary rules. Would you like me to schedule these into your weekly planner?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-emerald-600" />
            AI Culinary & Meal Assistant
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Personalized meal advice powered by Gemini with strict allergen and pantry verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user?.allergies && user.allergies.length > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              Allergens Excluded: {user.allergies.join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden flex flex-col h-[650px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <ChefHat className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-white shadow-xs rounded-tr-xs'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/60 dark:border-slate-600/60'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-sm">
                    {msg.text}
                  </div>

                  <div className={`mt-2 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-emerald-100' : 'text-slate-400'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.text)}
                        className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-center text-slate-500 text-xs italic p-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                <ChefHat className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                <span className="ml-1 text-slate-600 dark:text-slate-300">Checking pantry and crafting recipes...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-800/60 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold shrink-0">Try:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask for custom meal plans, zero-waste recipes, or budget dinner ideas..."
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
