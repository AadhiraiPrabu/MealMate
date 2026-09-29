import React from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import {
  Calendar,
  Sparkles,
  ShoppingCart,
  Package,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Heart,
  ChefHat,
  Leaf,
  Layers,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, login } = useMealMate();

  const handleStartPlanning = () => {
    setCurrentView('planner');
  };

  const handleExploreRecipes = () => {
    setCurrentView('recipes');
  };

  const handleQuickDemo = () => {
    login('demo@mealmate.com', 'demo123', true);
  };

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-emerald-600" />,
      title: 'Visual Weekly Calendar',
      desc: 'Organize Breakfast, Morning Snack, Lunch, Evening Snack, and Dinner in an intuitive drag-and-drop weekly planner.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      title: 'AI Culinary Assistant',
      desc: 'Ask Gemini AI to design custom meal plans under a budget, or find recipes for ingredients already in your pantry.'
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-purple-600" />,
      title: 'Automated Smart Grocery',
      desc: 'Generate grocery lists automatically from your meal plan, smartly subtracting ingredients you already own in your pantry.'
    },
    {
      icon: <Package className="w-6 h-6 text-blue-600" />,
      title: 'Pantry & Expiry Watch',
      desc: 'Track inventory, get timely alerts before ingredients spoil, and eliminate household food waste permanently.'
    },
    {
      icon: <Layers className="w-6 h-6 text-indigo-600" />,
      title: 'Batch Meal Prep Mode',
      desc: 'Consolidate 3, 5, or 7-day cooking sessions with sequenced timelines and safe food storage recommendations.'
    },
    {
      icon: <TrendingDown className="w-6 h-6 text-emerald-600" />,
      title: 'Cost & Nutrition Tracking',
      desc: 'Track daily calories, macros, and grocery expenditure in your local currency with custom budget limits.'
    }
  ];

  const faqs = [
    {
      q: 'How does MealMate handle food allergies and dietary choices?',
      a: 'During onboarding, you specify strict allergies (such as peanuts, gluten, eggs, dairy, or shellfish) and dietary preferences (such as Vegetarian, Vegan, Eggetarian, South Indian, etc.). MealMate strictly filters out recipes with matching allergens across auto-planner and AI suggestions.'
    },
    {
      q: 'Can MealMate scale recipes for different family sizes?',
      a: 'Yes! Every recipe in MealMate includes an interactive serving scaler that calculates exact proportional ingredient amounts and updates grocery shopping lists automatically.'
    },
    {
      q: 'Does it work offline or as a mobile app?',
      a: 'MealMate is fully responsive and configured as a Progressive Web App (PWA) with persistent local storage. Your plans and pantry remain intact across browser refreshes and restarts.'
    },
    {
      q: 'How does leftover management work?',
      a: 'Simply tap "I Have Leftovers" to log extra cooked rice, dal, or veggies. MealMate suggests delicious recipes like Lemon Rice, Curd Rice, or Dal Parathas to repurpose them with zero waste.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>The All-In-One Kitchen Intelligence App</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                Plan smarter. <br />
                Eat better. <br />
                <span className="text-emerald-600 dark:text-emerald-400">Waste less.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                MealMate helps you plan wholesome weekly meals, organize recipes, manage groceries, repurpose leftovers, and make the most of what you already have in your kitchen.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={handleStartPlanning}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Start Planning</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleExploreRecipes}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-base border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer"
                >
                  Explore Recipes (32+)
                </button>
                <button
                  onClick={handleQuickDemo}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 border border-amber-300/70 dark:border-amber-800 text-sm font-semibold transition-all cursor-pointer"
                >
                  One-Click Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>32+ Authentic Indian & Global Recipes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Strict Allergy Safety</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Zero Food Waste Tracker</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual / Interactive Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-2xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Today's Meal Plan</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    95% Target Met
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&auto=format&fit=crop&q=80"
                      alt="Idli"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Breakfast</span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-300">310 kcal</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">Steamed Idli with Sambar</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">9g Protein • 20 mins</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&auto=format&fit=crop&q=80"
                      alt="Sambar Rice"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">Lunch</span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-300">360 kcal</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">Sambar Sadam (One-pot)</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">11g Protein • High-Fiber</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&auto=format&fit=crop&q=80"
                      alt="Palak Paneer"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase">Dinner</span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-300">320 kcal</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">Palak Paneer & Phulkas</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">18g Protein • Iron Rich</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Est. Day Cost: ₹145</span>
                  <button
                    onClick={handleStartPlanning}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    Open Live Planner <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Core Capabilities Grid */}
      <section className="py-20 bg-white dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Three Pillars of Effortless Kitchen Living
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              From intelligent calorie-balanced schedules to automated grocery runs and zero-waste pantry audits, MealMate has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: AI Planning */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between group space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                    Powered by Gemini AI
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white pt-1">
                    AI Planning
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Create customized, balanced weekly meal schedules in seconds. The AI plans around your dietary goals, budget limits, and available time while enforcing strict zero-tolerance allergy safety.
                  </p>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Strict Allergen Shield:</strong> Automatically filters out peanuts, gluten, dairy, shellfish, and custom allergens.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Targeted Diets:</strong> Vegetarian, Vegan, Eggetarian, Jain, High-Protein, Low-Carb, and South/North Indian cuisines.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Conversational Chef:</strong> Ask "Plan 5 dinners under ₹500" or "What can I cook with eggs and spinach?".</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200/70 dark:border-slate-700">
                <button
                  onClick={() => setCurrentView('ai_assistant')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 font-semibold text-xs border border-slate-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Chat with AI Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Column 2: Smart Shopping */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:shadow-xl hover:border-purple-500/50 transition-all flex flex-col justify-between group space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform">
                  <ShoppingCart className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800/60">
                    Inventory-Aware Groceries
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white pt-1">
                    Smart Shopping
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Say goodbye to forgotten items and duplicate purchases. MealMate aggregates all ingredients from your calendar plan and automatically subtracts whatever you already have in stock.
                  </p>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Pantry Inventory Deduction:</strong> Never buy extra tomatoes or rice if your pantry already has them.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Categorized Aisles:</strong> Auto-grouped into Vegetables, Grains, Dairy, Proteins, and Spices for fast store trips.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Bill Estimator:</strong> See your estimated checkout cost in your local currency (₹, $, €, £) before you step out.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200/70 dark:border-slate-700">
                <button
                  onClick={() => setCurrentView('shopping')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-700 font-semibold text-xs border border-slate-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Smart Shopping</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Column 3: Pantry Management */}
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between group space-y-6">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                  <Package className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                    Zero Food Waste
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white pt-1">
                    Pantry Management
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Track shelf-life, get color-coded alerts 48 hours before items spoil, and repurpose leftovers like cooked rice and dal into appetizing new meals instead of tossing them away.
                  </p>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Proactive Expiry Radar:</strong> Color-coded badges highlight vegetables and dairy nearing expiration.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>"I Have Leftovers" Hub:</strong> Turn extra cooked rice into Lemon Rice or Curd Rice; knead dal into Parathas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Batch Meal Prep Mode:</strong> Synchronized 90-minute timelines for 3, 5, or 7-day cooking sessions.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200/70 dark:border-slate-700">
                <button
                  onClick={() => setCurrentView('pantry')}
                  className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 font-semibold text-xs border border-slate-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Manage Pantry & Leftovers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-white dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
              Everything You Need In One Product
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Designed for effortless, healthy everyday cooking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:shadow-lg transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-xs">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy / How It Works */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              The 5-Step MealMate Cycle
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              A continuous, rewarding loop that saves hours each week and reduces grocery costs by up to 30%.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Plan', desc: 'Choose balanced recipes or auto-generate your week with allergy validation.' },
              { step: '02', title: 'Cook', desc: 'Step-by-step instructions with automatic serving size scaling.' },
              { step: '03', title: 'Eat', desc: 'Enjoy delicious, nutrient-dense home-cooked dishes tailored to your taste.' },
              { step: '04', title: 'Track', desc: 'Mark completed meals, monitor calorie estimates, and track pantry inventory.' },
              { step: '05', title: 'Improve', desc: 'Repurpose leftovers into fresh meals and optimize grocery spending.' }
            ].map(item => (
              <div
                key={item.step}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-2 relative"
              >
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{item.step}</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-bold">Ready to take control of your kitchen?</h3>
            <p className="text-emerald-100 mt-2 max-w-xl mx-auto text-sm sm:text-base">
              Try MealMate right now. Explore 32+ recipes, generate your weekly meal plan, and manage groceries without friction.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={handleStartPlanning}
                className="px-6 py-3 rounded-xl bg-white text-emerald-700 font-bold hover:bg-slate-100 shadow-md transition-all cursor-pointer"
              >
                Get Started Free
              </button>
              <button
                onClick={handleQuickDemo}
                className="px-6 py-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-800 text-white font-semibold transition-all cursor-pointer"
              >
                Launch Demo Mode
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
