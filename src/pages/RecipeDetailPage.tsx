import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import confetti from 'canvas-confetti';
import {
  Clock,
  Flame,
  Heart,
  Plus,
  ArrowLeft,
  Users,
  ShoppingCart,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Edit,
  Sparkles,
  ChefHat,
  Share2
} from 'lucide-react';

export const RecipeDetailPage: React.FC = () => {
  const {
    viewParams,
    recipes,
    favorites,
    toggleFavorite,
    setCurrentView,
    addMealToPlan,
    addShoppingItem,
    user
  } = useMealMate();

  const recipeId = viewParams.recipeId;
  const recipe = recipes.find(r => r.id === recipeId) || recipes[0];

  const [currentServings, setCurrentServings] = useState<number>(recipe?.servings || 2);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [addToPlanModal, setAddToPlanModal] = useState(false);
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [targetSlot, setTargetSlot] = useState<string>('lunch');

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-500">Recipe not found.</p>
        <button
          onClick={() => setCurrentView('recipes')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl"
        >
          Back to Recipes
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(recipe.id);
  const scaleRatio = currentServings / (recipe.servings || 1);

  // Scaled Ingredients
  const scaledIngredients = recipe.ingredients.map(ing => {
    if (ing.scalable === false) {
      return ing;
    }
    const scaledAmount = Math.round((ing.amount * scaleRatio) * 10) / 10;
    return {
      ...ing,
      amount: scaledAmount
    };
  });

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleAddToPlan = () => {
    addMealToPlan(targetDate, targetSlot as any, recipe.id, currentServings);
    setAddToPlanModal(false);
    try {
      confetti({ particleCount: 35, spread: 50 });
    } catch (e) { /* ignore */ }
    alert(`Added "${recipe.title}" to ${targetDate} (${targetSlot})!`);
  };

  const handleAddAllToShoppingList = () => {
    scaledIngredients.forEach(ing => {
      addShoppingItem({
        name: ing.name,
        quantity: ing.amount,
        unit: ing.unit,
        category: ing.category,
        recipeSource: recipe.title,
        estimatedPrice: Math.round((ing.estimatedCost || 20) * scaleRatio)
      });
    });
    alert(`Added ${scaledIngredients.length} ingredients to your Shopping List!`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('recipes')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recipe Library
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(recipe.id)}
            className={`p-2.5 rounded-full border transition-all ${
              isFav
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500'
            }`}
            title="Favorite Recipe"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
          </button>

          {recipe.isCustom && (
            <button
              onClick={() => setCurrentView('edit_recipe', { recipeId: recipe.id })}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Hero Visual Card */}
      <div className="relative rounded-3xl overflow-hidden aspect-16/9 sm:aspect-21/9 shadow-xl bg-slate-900">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
              {recipe.cuisine}
            </span>
            {recipe.dietary.map(d => (
              <span key={d} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-md capitalize">
                {d}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {recipe.title}
          </h1>
          <p className="text-sm text-slate-200 line-clamp-2 max-w-2xl mt-1.5">
            {recipe.description}
          </p>
        </div>
      </div>

      {/* Action CTA Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Serving Scaler */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Servings:
          </span>
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-700">
            <button
              onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
              className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white font-bold flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-extrabold text-slate-900 dark:text-white">
              {currentServings}
            </span>
            <button
              onClick={() => setCurrentServings(currentServings + 1)}
              className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 text-slate-900 dark:text-white font-bold flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
          {scaleRatio !== 1 && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              (Ingredients scaled ×{scaleRatio.toFixed(1)})
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAddToPlanModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Add to Meal Plan
          </button>
          <button
            onClick={handleAddAllToShoppingList}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-purple-600" />
            Add to Grocery List
          </button>
        </div>
      </div>

      {/* Quick Specs & Nutrition Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Total Time</span>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {recipe.totalTimeMinutes}m
          </p>
          <span className="text-[11px] text-slate-400">Prep {recipe.prepTimeMinutes}m • Cook {recipe.cookTimeMinutes}m</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Calories</span>
          <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {Math.round(recipe.nutrition.calories * scaleRatio)} kcal
          </p>
          <span className="text-[11px] text-slate-400">{recipe.nutrition.calories} kcal / serving</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Protein</span>
          <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {Math.round(recipe.nutrition.protein * scaleRatio)}g
          </p>
          <span className="text-[11px] text-slate-400">{recipe.nutrition.protein}g / serving</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500 font-medium">Difficulty</span>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {recipe.difficulty}
          </p>
          <span className="text-[11px] text-slate-400">
            {recipe.difficulty === 'Easy' ? 'Beginner Friendly' : 'Intermediate'}
          </span>
        </div>
      </div>

      {/* Allergen Notice Banner if any */}
      {recipe.allergens.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-300">Allergen Notice: </span>
            <span className="text-amber-800 dark:text-amber-200">
              Contains <strong className="capitalize">{recipe.allergens.join(', ')}</strong>. If you have an allergy, swap with safe alternatives or choose another recipe.
            </span>
          </div>
        </div>
      )}

      {/* Ingredients & Instructions 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Ingredients Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-600" />
              Ingredients
            </h3>
            <span className="text-xs text-slate-500">
              For {currentServings} {currentServings === 1 ? 'person' : 'people'}
            </span>
          </div>

          <div className="space-y-2">
            {scaledIngredients.map(ing => (
              <div
                key={ing.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-semibold text-slate-900 dark:text-white block truncate">
                    {ing.name}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">{ing.category}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {ing.amount} {ing.unit}
                  </span>
                  {ing.estimatedCost && (
                    <span className="block text-[11px] text-slate-400">
                      ~{user?.currency || '₹'}{Math.round(ing.estimatedCost * scaleRatio)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Step-by-Step Instructions
            </h3>
            <span className="text-xs text-slate-500">
              {completedSteps.length} of {recipe.instructions.length} steps checked
            </span>
          </div>

          <div className="space-y-3">
            {recipe.instructions.map((stepText, idx) => {
              const checked = completedSteps.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                    checked
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 opacity-80'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                      checked
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {checked ? '✓' : idx + 1}
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {stepText}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add To Plan Modal */}
      {addToPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Schedule to Meal Plan
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Meal Slot
              </label>
              <select
                value={targetSlot}
                onChange={e => setTargetSlot(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm capitalize"
              >
                <option value="breakfast">Breakfast</option>
                <option value="morning_snack">Morning Snack</option>
                <option value="lunch">Lunch</option>
                <option value="evening_snack">Evening Snack</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setAddToPlanModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToPlan}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20"
              >
                Confirm Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
