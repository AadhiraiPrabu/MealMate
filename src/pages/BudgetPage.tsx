import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import { DollarSign, TrendingDown, RefreshCw, Check, Edit2, ShieldAlert } from 'lucide-react';

export const BudgetPage: React.FC = () => {
  const { user, updateProfile, mealPlan, recipes } = useMealMate();

  const [budgetAmount, setBudgetAmount] = useState<number>(user?.budgetAmount || 2500);
  const [budgetPeriod, setBudgetPeriod] = useState<'day' | 'week' | 'month'>(
    user?.budgetPeriod || 'week'
  );
  const [currency, setCurrency] = useState<'₹' | '$' | '€' | '£'>(user?.currency || '₹');

  // Interactive sample ingredient prices adjuster table
  const [ingredientPrices, setIngredientPrices] = useState([
    { id: 'p1', name: 'Fresh Vegetables (average)', defaultPrice: 30, unit: 'per 250g' },
    { id: 'p2', name: 'Lentils / Toor Dal / Moong Dal', defaultPrice: 25, unit: 'per 100g' },
    { id: 'p3', name: 'Rice / Wheat Flour (Atta)', defaultPrice: 20, unit: 'per 200g' },
    { id: 'p4', name: 'Paneer (Cottage Cheese)', defaultPrice: 90, unit: 'per 250g' },
    { id: 'p5', name: 'Cooking Ghee / Oil', defaultPrice: 15, unit: 'per 2 tbsp' },
    { id: 'p6', name: 'Farm Eggs', defaultPrice: 8, unit: 'per egg' }
  ]);

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Compute 7 days planned meal costs
  const today = new Date().getTime();
  const next7Meals = mealPlan.filter(m => {
    const d = new Date(m.date).getTime();
    return d >= today - 24 * 3600 * 1000 && d <= today + 7 * 24 * 3600 * 1000;
  });

  const totalMealServings = next7Meals.reduce((acc, m) => acc + (m.servings || 2), 0);
  const estimatedCostPerServing = 35; // base benchmark
  const totalWeeklyEstimatedCost = Math.round(totalMealServings * estimatedCostPerServing);
  const costPerMeal = next7Meals.length > 0 ? Math.round(totalWeeklyEstimatedCost / next7Meals.length) : 0;
  const remainingBudget = Math.max(0, budgetAmount - totalWeeklyEstimatedCost);
  const budgetUtilization = Math.round((totalWeeklyEstimatedCost / budgetAmount) * 100);

  const handleSaveBudget = () => {
    updateProfile({
      budgetAmount,
      budgetPeriod,
      currency
    });
    alert('Budget settings updated successfully!');
  };

  const handleUpdatePrice = (id: string) => {
    setIngredientPrices(prev =>
      prev.map(item => (item.id === id ? { ...item, defaultPrice: tempPrice } : item))
    );
    setEditingPriceId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <DollarSign className="w-7 h-7 text-emerald-600" />
            Budget & Cost Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor grocery expenditures and cost per serving in your local currency
          </p>
        </div>
      </div>

      {/* Target Setting Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Set Food Budget Target
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            >
              <option value="₹">₹ INR (India)</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Budget Period
            </label>
            <select
              value={budgetPeriod}
              onChange={e => setBudgetPeriod(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm capitalize"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Amount ({currency})
            </label>
            <input
              type="number"
              value={budgetAmount}
              onChange={e => setBudgetAmount(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-bold"
            />
          </div>
        </div>

        <button
          onClick={handleSaveBudget}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          Save Budget Settings
        </button>
      </div>

      {/* Financial Health Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Estimated 7-Day Cost</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {currency}{totalWeeklyEstimatedCost}
          </p>
          <span className="text-[10px] text-slate-400">For {next7Meals.length} planned meals</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Avg. Cost Per Meal</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {currency}{costPerMeal}
          </p>
          <span className="text-[10px] text-slate-400">All household servings</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Cost Per Serving</span>
          <p className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
            {currency}{estimatedCostPerServing}
          </p>
          <span className="text-[10px] text-slate-400">High-nutrition home cooked</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Budget Remaining</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {currency}{remainingBudget}
          </p>
          <span className="text-[10px] text-slate-400">{budgetUtilization}% spent</span>
        </div>
      </div>

      {/* Manual Ingredient Price Customizer */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Ingredient Benchmark Prices
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize local grocery price baselines to make cost calculations hyper-accurate for your city.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {ingredientPrices.map(item => (
            <div key={item.id} className="py-3 flex items-center justify-between text-sm">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {item.name}
                </span>
                <span className="text-xs text-slate-400">{item.unit}</span>
              </div>

              <div className="flex items-center gap-2">
                {editingPriceId === item.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold">{currency}</span>
                    <input
                      type="number"
                      value={tempPrice}
                      onChange={e => setTempPrice(parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-xs border rounded-lg text-center font-bold"
                    />
                    <button
                      onClick={() => handleUpdatePrice(item.id)}
                      className="p-1 bg-emerald-600 text-white rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {currency}{item.defaultPrice}
                    </span>
                    <button
                      onClick={() => {
                        setEditingPriceId(item.id);
                        setTempPrice(item.defaultPrice);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
