import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import {
  PieChart,
  Flame,
  Activity,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const NutritionDashboardPage: React.FC = () => {
  const { mealPlan, recipes, user } = useMealMate();

  const [timeframe, setTimeframe] = useState<'today' | 'week'>('today');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = mealPlan.filter(m => m.date === todayStr);

  const calculateMacroTotals = (meals: typeof mealPlan) => {
    let cal = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;
    let fiber = 0;

    meals.forEach(m => {
      const rec = recipes.find(r => r.id === m.recipeId);
      if (rec) {
        cal += rec.nutrition.calories;
        protein += rec.nutrition.protein;
        carbs += rec.nutrition.carbs;
        fat += rec.nutrition.fat;
        fiber += rec.nutrition.fiber;
      } else {
        cal += m.calories || 300;
        protein += m.protein || 10;
        carbs += 40;
        fat += 10;
        fiber += 4;
      }
    });

    return { cal, protein, carbs, fat, fiber };
  };

  const todayPlannedTotals = calculateMacroTotals(todayMeals);
  const todayCompletedMeals = todayMeals.filter(m => m.status === 'completed');
  const todayCompletedTotals = calculateMacroTotals(todayCompletedMeals);

  // Targets (Standard adult maintenance target)
  const targetCalories = 2000;
  const targetProtein = 65; // g
  const targetCarbs = 250; // g
  const targetFat = 65; // g
  const targetFiber = 30; // g

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <PieChart className="w-7 h-7 text-emerald-600" />
            Nutrition Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Macro balance, calorie estimates, and planned vs. completed intake
          </p>
        </div>

        {/* Timeframe switch */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => setTimeframe('today')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              timeframe === 'today' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600'
            }`}
          >
            Today's Totals
          </button>
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              timeframe === 'week' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600'
            }`}
          >
            Weekly Averages
          </button>
        </div>
      </div>

      {/* Transparency Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Transparency Notice:</strong> All nutritional figures (calories, protein, carbohydrates, fats, and fiber) are mathematical approximations calculated from standard food composition databases. They do not constitute certified medical diagnosis or clinical dietetics. Consult a licensed dietitian for medical dietary therapies.
        </p>
      </div>

      {/* Big Macro Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Calories</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {todayCompletedTotals.cal}
          </p>
          <span className="text-[10px] text-slate-400">of {todayPlannedTotals.cal || targetCalories} kcal</span>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-amber-500"
              style={{ width: `${Math.min(100, (todayCompletedTotals.cal / (todayPlannedTotals.cal || targetCalories)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Protein</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {todayCompletedTotals.protein}g
          </p>
          <span className="text-[10px] text-slate-400">Target ~{targetProtein}g</span>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-emerald-600"
              style={{ width: `${Math.min(100, (todayCompletedTotals.protein / targetProtein) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Carbs</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {todayCompletedTotals.carbs}g
          </p>
          <span className="text-[10px] text-slate-400">Target ~{targetCarbs}g</span>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${Math.min(100, (todayCompletedTotals.carbs / targetCarbs) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Fat</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {todayCompletedTotals.fat}g
          </p>
          <span className="text-[10px] text-slate-400">Target ~{targetFat}g</span>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-purple-500"
              style={{ width: `${Math.min(100, (todayCompletedTotals.fat / targetFat) * 100)}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Fiber</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {todayCompletedTotals.fiber}g
          </p>
          <span className="text-[10px] text-slate-400">Target ~{targetFiber}g</span>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-teal-500"
              style={{ width: `${Math.min(100, (todayCompletedTotals.fiber / targetFiber) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Planned vs Completed Breakdown */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Today's Planned vs. Completed Comparison
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span>Calories Tracked: {todayCompletedTotals.cal} / {todayPlannedTotals.cal} kcal</span>
              <span className="text-emerald-600">
                {todayPlannedTotals.cal > 0 ? Math.round((todayCompletedTotals.cal / todayPlannedTotals.cal) * 100) : 0}% of plan
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${todayPlannedTotals.cal > 0 ? Math.min(100, (todayCompletedTotals.cal / todayPlannedTotals.cal) * 100) : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span>Protein Consumed: {todayCompletedTotals.protein} / {todayPlannedTotals.protein}g</span>
              <span className="text-emerald-600">
                {todayPlannedTotals.protein > 0 ? Math.round((todayCompletedTotals.protein / todayPlannedTotals.protein) * 100) : 0}% of plan
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${todayPlannedTotals.protein > 0 ? Math.min(100, (todayCompletedTotals.protein / todayPlannedTotals.protein) * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
