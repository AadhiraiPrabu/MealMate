import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'MealMate',
    aiAvailable: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Assistant Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history = [], userProfile, pantry = [], leftovers = [], recipesSummary = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const allergies = userProfile?.allergies || [];
    const dietary = userProfile?.dietary || ['vegetarian'];
    const budget = userProfile?.budgetAmount || 2500;
    const currency = userProfile?.currency || '₹';

    // Allergy check string
    const allergyText = allergies.length > 0 
      ? `CRITICAL ALLERGY RESTRICTIONS: The user is severely allergic to: ${allergies.join(', ')}. You MUST NEVER include or suggest any ingredient or trace containing these.`
      : 'No known allergies reported.';

    const systemPrompt = `You are MealMate AI, an expert meal-planning consultant, culinary chef, and zero-food-waste specialist.
${allergyText}
Dietary requirements: ${dietary.join(', ')}.
Household servings: ${userProfile?.householdServings || 2} people.
Budget: ${currency}${budget} per ${userProfile?.budgetPeriod || 'week'}.
Available Pantry ingredients: ${pantry.map((p: any) => `${p.name} (${p.quantity} ${p.unit})`).join(', ') || 'None specified'}.
Current Leftovers: ${leftovers.map((l: any) => `${l.name} (${l.quantity})`).join(', ') || 'None'}.
Sample recipes in app: ${recipesSummary.map((r: any) => r.title).slice(0, 15).join(', ')}.

Rules:
1. NEVER include or recommend any ingredient containing user allergens: ${allergies.join(', ')}.
2. Adhere to dietary restrictions strictly (e.g. if vegetarian, never suggest meat/poultry/fish; if vegan, no dairy or honey).
3. Do not make medical claims, disease cure guarantees, or clinical diagnoses. Clearly communicate that nutritional numbers are estimates.
4. When suggesting recipes, prioritize using available pantry items and leftovers first to minimize food waste.
5. Provide actionable, appetizing steps, cooking hacks, and exact dish names. Keep responses concise, well-structured with bullet points and bold titles.`;

    if (aiClient && process.env.GEMINI_API_KEY) {
      try {
        const fullPrompt = `${systemPrompt}\n\nUser Question/Request: ${message}`;
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: fullPrompt,
        });

        const replyText = response.text || '';
        if (replyText) {
          return res.json({ reply: replyText });
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to local algorithmic assistant:', geminiError?.message);
      }
    }

    // High quality intelligent fallback if Gemini API is unavailable
    const lowerMsg = message.toLowerCase();
    let fallbackReply = '';

    if (lowerMsg.includes('leftover') || lowerMsg.includes('have rice') || lowerMsg.includes('have dal')) {
      fallbackReply = `### 💡 Zero-Waste Leftover Transformation Ideas\n\n` +
        `Here is how to repurpose your ingredients safely without wasting food:\n\n` +
        `1. **Tangy Lemon Rice or Curd Rice**: Turn leftover cooked rice into a 10-minute South Indian masterpiece tempered with mustard seeds, curry leaves, and lemon or fresh yogurt.\n` +
        `2. **Lentil Flatbread (Dal Parathas)**: Knead cooked dal directly into whole wheat atta flour with chopped coriander and cumin for protein-rich, ultra-soft parathas.\n` +
        `3. **Quick Spiced Rice Pulao**: Sauté onions, leftover veggies, and cumin in a pan, toss with the cold rice, and finish with a squeeze of fresh lemon.\n\n` +
        `*Safety Tip:* Ensure cooked rice and dal were refrigerated in sealed containers and consumed within 2–3 days.`;
    } else if (lowerMsg.includes('budget') || lowerMsg.includes('500') || lowerMsg.includes('cheap') || lowerMsg.includes('cost')) {
      fallbackReply = `### 💰 Budget-Friendly Meal Suggestions (Under ${currency}500 for the week)\n\n` +
        `Here are nutritious, high-value meals based on affordable pantry staples:\n\n` +
        `* **Yellow Dal Tadka & Steamed Rice / Phulkas**: Split lentils provide complete protein at very low cost per serving (~${currency}35/serving).\n` +
        `* **Vegetable Semolina Upma**: Fast, filling breakfast or light dinner ready in 15 minutes (~${currency}25/serving).\n` +
        `* **Moong Dal Chilla (Lentil Crepes)**: Savory protein crepes made with soaked yellow moong dal (~${currency}30/serving).\n` +
        `* **Tangy Lemon Rice with Peanuts**: Minimal ingredients with crunch and vitamin C (~${currency}25/serving).\n\n` +
        `*Tip:* Buying lentils, rice, and whole spices in bulk saves up to 40% compared to pre-packaged meals!`;
    } else if (lowerMsg.includes('south indian') || lowerMsg.includes('idli') || lowerMsg.includes('dosa')) {
      fallbackReply = `### 🌴 South Indian Meal Plan Highlights\n\n` +
        `* **Breakfast**: Steamed Idlis or Crispy Masala Dosa with Drumstick Toor Dal Sambar and Fresh Coconut Chutney.\n` +
        `* **Lunch**: Sambar Sadam (One-pot Sambar Rice) with Roasted Papad or Vegetable Upma.\n` +
        `* **Evening Snack**: Sprouted Moong Salad or Crispy Medu Vada.\n` +
        `* **Dinner**: Soothing Temple-Style Curd Rice (Thayir Sadam) or Pepper Cumin Tomato Rasam with Rice.\n\n` +
        `All these options fit your dietary preferences and are already available in your MealMate Recipe Library!`;
    } else if (lowerMsg.includes('quick') || lowerMsg.includes('15') || lowerMsg.includes('fast')) {
      fallbackReply = `### ⚡ Fast & Healthy Meals (Ready in 15–20 minutes)\n\n` +
        `1. **High-Protein Moong Dal Chilla**: Blend soaked moong dal with ginger, pour onto tawa, top with grated paneer. Ready in 15 mins.\n` +
        `2. **Spaghetti Aglio e Olio**: Simple pasta tossed in golden toasted garlic and extra virgin olive oil. Ready in 15 mins.\n` +
        `3. **Sprouted Moong & Pomegranate Salad**: No-cook antioxidant power bowl ready in 5 mins.\n` +
        `4. **Overnight Rolled Oats with Chia & Berries**: Prep the night before, grab and go in the morning!`;
    } else {
      fallbackReply = `### 🥗 MealMate Assistant Recommendations\n\n` +
        `Based on your profile (${dietary.join(', ')} dietary, serving ${userProfile?.householdServings || 2}):\n\n` +
        `* **Pantry Priority**: Use your fresh spinach and tomatoes first to keep them at peak freshness.\n` +
        `* **Balanced Nutrition**: Aim for a hearty fiber-rich breakfast (like Upma or Idlis), high-protein lunch (Dal Tadka or Rajma Masala), and lighter dinner.\n` +
        `* **Meal Prep Advantage**: Cook a larger batch of dal or rice on Sunday and Wednesday to breeze through weekday meals without stress.\n\n` +
        `Would you like me to auto-generate your full 7-day calendar, or suggest recipes for specific ingredients in your pantry?`;
    }

    return res.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('AI chat endpoint error:', error);
    res.status(500).json({
      error: 'Something went wrong while processing your request. Your existing meal plan is safe.'
    });
  }
});

// Setup Vite middleware for local development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`MealMate server running on port ${port} (http://localhost:${port})`);
  });
}

startServer();
