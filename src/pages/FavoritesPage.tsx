import React from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import { Heart, Clock, Flame, ChefHat, Plus, ArrowRight } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { recipes, favorites, toggleFavorite, setCurrentView, addMealToPlan, user } = useMealMate();

  const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

  const handleQuickAdd = (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const todayStr = new Date().toISOString().split('T')[0];
    const rec = recipes.find(r => r.id === recipeId);
    const mealType = rec?.mealTypes[0] || 'lunch';
    addMealToPlan(todayStr, mealType, recipeId, user?.householdServings || 2);
    alert(`Added "${rec?.title}" to today's ${mealType}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          Favorite Recipes ({favoriteRecipes.length})
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Your bookmarked culinary dishes ready to schedule anytime
        </p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No favorites saved yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse our recipe library and tap the heart icon on any dish you love.
          </p>
          <button
            onClick={() => setCurrentView('recipes')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Explore Recipe Library
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteRecipes.map(recipe => (
            <div
              key={recipe.id}
              onClick={() => setCurrentView('recipe_detail', { recipeId: recipe.id })}
              className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden cursor-pointer flex flex-col group"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-rose-500 text-white backdrop-blur-md shadow-md"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                <div className="absolute bottom-2.5 left-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white">
                    {recipe.cuisine}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {recipe.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{recipe.nutrition.calories} kcal</span>
                  <button
                    onClick={e => handleQuickAdd(recipe.id, e)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-semibold"
                  >
                    + Add to Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
