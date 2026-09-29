import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import {
  History,
  CheckCircle2,
  XCircle,
  Calendar,
  Flame,
  Award,
  Filter,
  ChefHat
} from 'lucide-react';

export const MealHistoryPage: React.FC = () => {
  const { mealPlan, recipes, setCurrentView } = useMealMate();
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'skipped'>('all');

  const historyMeals = mealPlan.filter(m => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const completedCount = mealPlan.filter(m => m.status === 'completed').length;
  const skippedCount = mealPlan.filter(m => m.status === 'skipped').length;
  const completionRate = mealPlan.length > 0 ? Math.round((completedCount / mealPlan.length) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <History className="w-7 h-7 text-emerald-600" />
            Meal Tracking History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review past meals, consistency habits, and most-cooked favorites
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600'
            }`}
          >
            All ({mealPlan.length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'completed' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilterStatus('skipped')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterStatus === 'skipped' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600'
            }`}
          >
            Skipped ({skippedCount})
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Consistency Rate</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {completionRate}%
          </p>
          <span className="text-[11px] text-slate-400">{completedCount} meals adhered to</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Favorite Cuisine</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            South Indian
          </p>
          <span className="text-[11px] text-slate-400">Most prepared in your log</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Home Cooking Streak</span>
          <p className="text-2xl font-black text-amber-500 mt-1">
            5 Days 🔥
          </p>
          <span className="text-[11px] text-slate-400">Consistent wholesome eating</span>
        </div>
      </div>

      {/* History Log List */}
      <div className="space-y-3">
        {historyMeals.map(meal => {
          const recipe = recipes.find(r => r.id === meal.recipeId);
          const isDone = meal.status === 'completed';
          const isSkip = meal.status === 'skipped';

          return (
            <div
              key={meal.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : isSkip ? (
                    <XCircle className="w-5 h-5 text-rose-500" />
                  ) : (
                    <Calendar className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">{meal.date}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      {meal.mealType.replace('_', ' ')}
                    </span>
                  </div>
                  <h4
                    onClick={() => recipe && setCurrentView('recipe_detail', { recipeId: recipe.id })}
                    className="text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-emerald-600 transition-colors"
                  >
                    {meal.recipeTitle}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {meal.calories || 320} kcal • {meal.protein || 10}g Protein • {meal.servings} Servings
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                  isDone
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    : isSkip
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {meal.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
