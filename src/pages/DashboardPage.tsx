import React from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import confetti from 'canvas-confetti';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  ChefHat,
  Package,
  ShoppingCart,
  Layers,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    user,
    mealPlan,
    recipes,
    pantry,
    leftovers,
    setCurrentView,
    updateMealStatus,
    generateShoppingListFromPlan
  } = useMealMate();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDateObj = new Date();
  const dateFormatted = todayDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  // Today's Meals
  const todayMeals = mealPlan.filter(m => m.date === todayStr);

  const mealOrder = ['breakfast', 'morning_snack', 'lunch', 'evening_snack', 'dinner'] as const;
  const sortedTodayMeals = [...todayMeals].sort((a, b) => {
    return mealOrder.indexOf(a.mealType as any) - mealOrder.indexOf(b.mealType as any);
  });

  // Calculate today's stats
  const completedToday = todayMeals.filter(m => m.status === 'completed').length;
  const totalToday = todayMeals.length;
  const percentComplete = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const totalCaloriesToday = todayMeals.reduce((acc, m) => acc + (m.calories || 300), 0);
  const totalProteinToday = todayMeals.reduce((acc, m) => acc + (m.protein || 10), 0);

  // Weekly Stats (next 7 days from today)
  const next7DaysMeals = mealPlan.filter(m => {
    const d = new Date(m.date).getTime();
    const t = todayDateObj.getTime() - (24 * 3600 * 1000);
    const end = t + (8 * 24 * 3600 * 1000);
    return d >= t && d <= end;
  });

  const weeklyCompleted = next7DaysMeals.filter(m => m.status === 'completed').length;
  const weeklyEstimatedCost = Math.round(next7DaysMeals.length * 65); // estimated ~₹65 / meal

  // Expiring pantry items (within 48 hours)
  const expiringPantry = pantry.filter(item => {
    const exp = new Date(item.expiryDate).getTime();
    const now = new Date().getTime();
    const diffDays = (exp - now) / (1000 * 3600 * 24);
    return diffDays <= 2 && diffDays >= -1;
  });

  // Active leftovers
  const activeLeftovers = leftovers.filter(l => !l.used);

  const handleToggleComplete = (planId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'planned' : 'completed';
    updateMealStatus(planId, newStatus);
    if (newStatus === 'completed') {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) { /* ignore */ }
    }
  };

  const getMealTypeLabel = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Breakfast';
      case 'morning_snack': return 'Morning Snack';
      case 'lunch': return 'Lunch';
      case 'evening_snack': return 'Evening Snack';
      case 'dinner': return 'Dinner';
      default: return type;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 backdrop-blur-xs text-emerald-100 border border-emerald-400/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>{dateFormatted}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Chef'}! Let's nourish well today.
          </h1>
          <p className="text-sm text-emerald-100/90 max-w-xl">
            {percentComplete === 100
              ? 'Awesome job! All planned meals for today are completed.'
              : `${completedToday} of ${totalToday} meals tracked so far today. You are making great progress!`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => setCurrentView('planner')}
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 text-sm font-bold shadow-md hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            Plan My Week
          </button>
          <button
            onClick={() => setCurrentView('ai_assistant')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/40 hover:bg-emerald-500/60 text-white text-sm font-semibold backdrop-blur-xs border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Ask MealMate AI
          </button>
        </div>
      </div>

      {/* Smart Suggestions & Alerts Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {expiringPantry.length > 0 ? (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Pantry Expiry Alert
              </h4>
              <p className="text-sm text-amber-900 dark:text-amber-200 font-medium truncate">
                {expiringPantry[0].name} expires soon!
              </p>
              <button
                onClick={() => setCurrentView('pantry')}
                className="text-xs text-amber-700 dark:text-amber-400 font-semibold hover:underline mt-1 inline-flex items-center gap-1"
              >
                View in Pantry <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Pantry Status Healthy
              </h4>
              <p className="text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                No items approaching expiry today.
              </p>
            </div>
          </div>
        )}

        {activeLeftovers.length > 0 ? (
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                Zero Waste Opportunity
              </h4>
              <p className="text-sm text-blue-900 dark:text-blue-200 font-medium truncate">
                You have {activeLeftovers[0].name} in the fridge.
              </p>
              <button
                onClick={() => setCurrentView('leftovers')}
                className="text-xs text-blue-700 dark:text-blue-400 font-semibold hover:underline mt-1 inline-flex items-center gap-1"
              >
                Repurpose with recipes <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-700 text-white shrink-0">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Fresh Batch Ready
              </h4>
              <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                All leftovers cleared out nicely.
              </p>
            </div>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
              Grocery Auto-Sync
            </h4>
            <p className="text-sm text-purple-900 dark:text-purple-200 font-medium">
              List ready with pantry deducted.
            </p>
            <button
              onClick={() => {
                generateShoppingListFromPlan();
                setCurrentView('shopping');
              }}
              className="text-xs text-purple-700 dark:text-purple-400 font-semibold hover:underline mt-1 inline-flex items-center gap-1"
            >
              Open Shopping List <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Meals + Quick Actions + Weekly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Meals (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Today's Meals</h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                {completedToday}/{totalToday} Done
              </span>
            </div>
            <button
              onClick={() => setCurrentView('planner')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Full Calendar <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {sortedTodayMeals.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No meals planned for today</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Pick a couple of quick dishes from our recipe library or let MealMate auto-generate a balanced plan.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('planner')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Plan Today's Meals
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTodayMeals.map(meal => {
                const recipe = recipes.find(r => r.id === meal.recipeId);
                const isCompleted = meal.status === 'completed';

                return (
                  <div
                    key={meal.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-90'
                        : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700 shadow-xs hover:border-emerald-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        onClick={() => handleToggleComplete(meal.id, meal.status)}
                        className="shrink-0 text-slate-400 hover:text-emerald-600 transition-colors focus:outline-none"
                        title={isCompleted ? 'Mark as Planned' : 'Mark as Eaten'}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100 dark:fill-emerald-950/60" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300 hover:text-emerald-500" />
                        )}
                      </button>

                      {meal.recipeImage && (
                        <img
                          src={meal.recipeImage}
                          alt={meal.recipeTitle}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                            {getMealTypeLabel(meal.mealType)}
                          </span>
                          <span className="text-xs text-slate-400">• {meal.servings} {meal.servings === 1 ? 'serving' : 'servings'}</span>
                        </div>
                        <h4
                          onClick={() => recipe && setCurrentView('recipe_detail', { recipeId: recipe.id })}
                          className={`text-base font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-emerald-600 transition-colors ${
                            isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : ''
                          }`}
                        >
                          {meal.recipeTitle}
                        </h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{meal.calories || recipe?.nutrition.calories || 320} kcal</span>
                          <span>{meal.protein || recipe?.nutrition.protein || 12}g Protein</span>
                          {recipe?.totalTimeMinutes && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {recipe.totalTimeMinutes}m
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => recipe && setCurrentView('recipe_detail', { recipeId: recipe.id })}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        Recipe Steps
                      </button>
                      <button
                        onClick={() => handleToggleComplete(meal.id, meal.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isCompleted
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {isCompleted ? 'Completed' : 'Mark Eaten'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions + Weekly Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Nutrition Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Today's Nutrition
              </h3>
              <button
                onClick={() => setCurrentView('nutrition')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Dashboard
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                <span className="block text-2xl font-black text-amber-700 dark:text-amber-300">{totalCaloriesToday}</span>
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-200 uppercase">Est. Calories</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <span className="block text-2xl font-black text-emerald-700 dark:text-emerald-300">{totalProteinToday}g</span>
                <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 uppercase">Protein</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center">
              *All nutrition numbers are algorithmic estimates based on standardized ingredient portions.
            </p>
          </div>

          {/* Quick Actions Panel */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Actions</h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentView('planner')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 text-slate-700 dark:text-slate-200 text-left transition-all border border-slate-200/80 dark:border-slate-700 flex flex-col gap-1 text-xs font-semibold"
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Plan Meals</span>
              </button>

              <button
                onClick={() => setCurrentView('add_recipe')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 text-slate-700 dark:text-slate-200 text-left transition-all border border-slate-200/80 dark:border-slate-700 flex flex-col gap-1 text-xs font-semibold"
              >
                <ChefHat className="w-4 h-4 text-teal-600" />
                <span>Add Recipe</span>
              </button>

              <button
                onClick={() => setCurrentView('shopping')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 text-slate-700 dark:text-slate-200 text-left transition-all border border-slate-200/80 dark:border-slate-700 flex flex-col gap-1 text-xs font-semibold"
              >
                <ShoppingCart className="w-4 h-4 text-purple-600" />
                <span>Shopping List</span>
              </button>

              <button
                onClick={() => setCurrentView('pantry')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 text-slate-700 dark:text-slate-200 text-left transition-all border border-slate-200/80 dark:border-slate-700 flex flex-col gap-1 text-xs font-semibold"
              >
                <Package className="w-4 h-4 text-blue-600" />
                <span>Pantry Log</span>
              </button>

              <button
                onClick={() => setCurrentView('leftovers')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 text-slate-700 dark:text-slate-200 text-left transition-all border border-slate-200/80 dark:border-slate-700 flex flex-col gap-1 text-xs font-semibold"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Leftovers</span>
              </button>

              <button
                onClick={() => setCurrentView('meal_prep')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 text-slate-700 dark:text-slate-200 text-left transition-all border border-slate-200/80 dark:border-slate-700 flex flex-col gap-1 text-xs font-semibold"
              >
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Meal Prep Mode</span>
              </button>
            </div>
          </div>

          {/* Weekly Summary Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Summary</h3>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                <span>Planned Meals (7 Days)</span>
                <span className="font-bold text-slate-900 dark:text-white">{next7DaysMeals.length} meals</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                <span>Completed This Week</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{weeklyCompleted} meals</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                <span>Estimated Grocery Cost</span>
                <span className="font-bold text-slate-900 dark:text-white">{user?.currency || '₹'}{weeklyEstimatedCost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Budget Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Under Budget ({user?.currency || '₹'}{user?.budgetAmount || 2500})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
