import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Calendar,
  ChefHat,
  ArrowRight,
  ShieldAlert,
  Flame
} from 'lucide-react';

export const MealPrepPage: React.FC = () => {
  const { mealPlan, recipes, user, setCurrentView } = useMealMate();
  const [prepDays, setPrepDays] = useState<3 | 5 | 7>(3);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDateObj = new Date();

  // Target meals within prep window
  const prepTargetMeals = mealPlan.filter(m => {
    const mDate = new Date(m.date).getTime();
    const start = todayDateObj.getTime() - 24 * 3600 * 1000;
    const end = start + (prepDays * 24 * 3600 * 1000);
    return mDate >= start && mDate <= end;
  });

  // Extract unique recipes to prep
  const recipeIds = Array.from(new Set(prepTargetMeals.map(m => m.recipeId)));
  const prepRecipes = recipeIds
    .map(id => recipes.find(r => r.id === id))
    .filter(Boolean) as typeof recipes;

  // Consolidated batch ingredients
  const batchIngredients: Record<string, { amount: number; unit: string; category: string }> = {};
  prepRecipes.forEach(rec => {
    rec.ingredients.forEach(ing => {
      const key = ing.name.toLowerCase().trim();
      if (!batchIngredients[key]) {
        batchIngredients[key] = { amount: ing.amount, unit: ing.unit, category: ing.category };
      } else {
        batchIngredients[key].amount += ing.amount;
      }
    });
  });

  const workflowSequence = [
    {
      title: 'Phase 1: Grains, Legumes & Slow Boiling (30 mins)',
      description: 'Rinse rice, lentils (toor dal, moong dal), or quinoa. Start your pressure cookers or large pots first so they cook hands-free.',
      items: ['Pressure cook Toor Dal & Moong Dal with turmeric', 'Boil Basmati / Sona Masoori Rice', 'Soak chickpeas or rajma if prepping for late week']
    },
    {
      title: 'Phase 2: Vegetable Washing & Batch Chopping (20 mins)',
      description: 'Uniformly dice onions, tomatoes, ginger, and garlic. Cube paneer or chop green vegetables (spinach, beans, carrots).',
      items: ['Chop base onions, tomatoes, and ginger-garlic paste', 'Blanch spinach leaves and ice-shock for bright green purees', 'Cut paneer/tofu into even cubes']
    },
    {
      title: 'Phase 3: Base Sauces & Sautéing (25 mins)',
      description: 'Prepare a multi-use onion-tomato bhuna masala base or sambar broth that powers 2-3 different curries simultaneously.',
      items: ['Sauté onion-tomato masala in a wide kadai', 'Simmer sambar broth with tamarind and drumsticks', 'Roast dry spices (makhana / cumin)']
    },
    {
      title: 'Phase 4: Cooling, Portioning & Safe Refrigeration (15 mins)',
      description: 'Allow all warm cooked foods to reach room temperature within 1-2 hours before sealing in designated glass containers.',
      items: ['Portion meals into airtight glass meal-prep boxes', 'Label with prep date and planned consumption day', 'Store at or below 4°C (40°F) in refrigerator']
    }
  ];

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-emerald-600" />
            Batch Meal Prep Mode
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cook in coordinated batches, save 4+ hours per week, and have fresh meals ready to reheat
          </p>
        </div>

        {/* Days selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => setPrepDays(3)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              prepDays === 3 ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600'
            }`}
          >
            Prep 3 Days
          </button>
          <button
            onClick={() => setPrepDays(5)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              prepDays === 5 ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600'
            }`}
          >
            Prep 5 Days
          </button>
          <button
            onClick={() => setPrepDays(7)}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              prepDays === 7 ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600'
            }`}
          >
            Prep 7 Days
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>Food Safety & Storage Guidelines:</strong> Cooked lentils, rice, and vegetable curries keep safely in the refrigerator for 3–4 days in sealed glass containers. For meals planned for Day 5 to 7, freeze individual portions immediately after cooling and thaw in the refrigerator overnight before heating. Always follow local food-safety standards.
        </p>
      </div>

      {/* Dishes to Prep */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recipes to Batch-Cook ({prepRecipes.length} dishes for {prepDays} days)
          </h2>
          <span className="text-xs text-slate-500">{prepTargetMeals.length} total planned meals</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prepRecipes.map(recipe => (
            <div
              key={recipe.id}
              onClick={() => setCurrentView('recipe_detail', { recipeId: recipe.id })}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 shadow-xs transition-all flex items-center gap-3 cursor-pointer group"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {recipe.cuisine}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600">
                  {recipe.title}
                </h4>
                <p className="text-xs text-slate-500">
                  {recipe.totalTimeMinutes}m • {recipe.servings} Servings
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sequenced Cooking Timeline Workflow */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          Optimal Preparation Sequence (Under 90 Minutes Total)
        </h2>

        <div className="space-y-4">
          {workflowSequence.map((phase, idx) => {
            const isDone = completedSteps.includes(idx);

            return (
              <div
                key={idx}
                className={`p-5 rounded-3xl border transition-all ${
                  isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 opacity-80'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <h3 className={`text-base font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {phase.title}
                  </h3>
                  <button
                    onClick={() => toggleStep(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isDone ? '✓ Completed' : 'Mark Done'}
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {phase.description}
                </p>

                <ul className="mt-3 space-y-1.5">
                  {phase.items.map((it, i) => (
                    <li key={i} className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consolidated Batch Grocery Ingredients */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Consolidated Prep Ingredients Required
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {Object.entries(batchIngredients).map(([name, data]) => (
            <div key={name} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs">
              <span className="block font-semibold capitalize text-slate-800 dark:text-slate-200 truncate">{name}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{data.amount} {data.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
