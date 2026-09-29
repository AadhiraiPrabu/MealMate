import React from 'react';
import { useMealMate } from '../../context/MealMateContext.tsx';
import { ChefHat, ShieldCheck, Heart, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, resetToDemoData } = useMealMate();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-24 xl:pb-12 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                Meal<span className="text-emerald-600 dark:text-emerald-400">Mate</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Smart meal planning, recipe scaling, grocery automation, and pantry intelligence to eliminate food waste and eat healthier.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Plan</span> → <span>Cook</span> → <span>Eat</span> → <span>Track</span> → <span>Improve</span>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Planning & Food
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => setCurrentView('planner')} className="hover:text-emerald-600 transition-colors">
                  Weekly Meal Planner
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('recipes')} className="hover:text-emerald-600 transition-colors">
                  Recipe Library (32+ Dishes)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('shopping')} className="hover:text-emerald-600 transition-colors">
                  Automated Grocery List
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('meal_prep')} className="hover:text-emerald-600 transition-colors">
                  Batch Meal Prep Mode
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Kitchen Intelligence
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => setCurrentView('pantry')} className="hover:text-emerald-600 transition-colors">
                  Pantry Inventory & Expiry
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('leftovers')} className="hover:text-emerald-600 transition-colors">
                  Leftovers Repurposing
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('nutrition')} className="hover:text-emerald-600 transition-colors">
                  Nutrition & Macro Balance
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('budget')} className="hover:text-emerald-600 transition-colors">
                  Cost & Budget Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('ai_assistant')} className="hover:text-emerald-600 transition-colors">
                  Gemini AI Culinary Assistant
                </button>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Transparency */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Health & Safety Notice
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Nutritional values shown are computational estimates based on ingredient databases. MealMate is not a medical device and does not diagnose or treat medical conditions. Always verify allergies and follow local safe food-handling standards.
            </p>
            <button
              onClick={resetToDemoData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Sample Demo State
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} MealMate. Built for healthy living and zero food waste.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('settings')} className="hover:underline">
              Preferences & Allergies
            </button>
            <span>•</span>
            <button onClick={() => setCurrentView('landing')} className="hover:underline">
              About MealMate
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
