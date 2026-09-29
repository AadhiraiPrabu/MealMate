import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import { Recipe, DietaryType } from '../types/mealmate.ts';
import {
  BookOpen,
  Search,
  Filter,
  Heart,
  Plus,
  Clock,
  Flame,
  ChefHat,
  Sparkles,
  ArrowUpDown,
  Tag
} from 'lucide-react';

export const RecipeLibraryPage: React.FC = () => {
  const { recipes, favorites, toggleFavorite, setCurrentView, user, addMealToPlan } = useMealMate();

  const [search, setSearch] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [selectedDietary, setSelectedDietary] = useState<string>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [maxTime, setMaxTime] = useState<number>(60);
  const [sortBy, setSortBy] = useState<'rating' | 'time' | 'calories' | 'protein'>('rating');

  const cuisines = ['all', 'South Indian', 'North Indian', 'Mediterranean', 'Western', 'Asian', 'Italian'];

  const filteredRecipes = recipes
    .filter(recipe => {
      // Search term
      const query = search.toLowerCase();
      const matchSearch =
        recipe.title.toLowerCase().includes(query) ||
        recipe.cuisine.toLowerCase().includes(query) ||
        recipe.tags.some(t => t.toLowerCase().includes(query)) ||
        recipe.ingredients.some(i => i.name.toLowerCase().includes(query));

      if (!matchSearch) return false;

      // Meal type
      if (selectedMealType !== 'all' && !recipe.mealTypes.includes(selectedMealType as any)) {
        return false;
      }

      // Dietary
      if (selectedDietary !== 'all' && !recipe.dietary.includes(selectedDietary as any)) {
        return false;
      }

      // Cuisine
      if (selectedCuisine !== 'all' && recipe.cuisine !== selectedCuisine) {
        return false;
      }

      // Time
      if (recipe.totalTimeMinutes > maxTime) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 4.5) - (a.rating || 4.5);
      if (sortBy === 'time') return a.totalTimeMinutes - b.totalTimeMinutes;
      if (sortBy === 'calories') return a.nutrition.calories - b.nutrition.calories;
      if (sortBy === 'protein') return b.nutrition.protein - a.nutrition.protein;
      return 0;
    });

  const handleQuickAddToToday = (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const todayStr = new Date().toISOString().split('T')[0];
    const rec = recipes.find(r => r.id === recipeId);
    const mealType = rec?.mealTypes[0] || 'lunch';
    addMealToPlan(todayStr, mealType, recipeId, user?.householdServings || 2);
    alert(`Added "${rec?.title}" to today's ${mealType}!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-emerald-600" />
            Recipe Library
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Explore authentic recipes with scalable servings and automatic nutrition breakdown
          </p>
        </div>

        <button
          onClick={() => setCurrentView('add_recipe')}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Custom Recipe
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes, ingredients (e.g. spinach, rice, paneer), or tags..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedMealType}
              onChange={e => setSelectedMealType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="all">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="morning_snack">Snacks</option>
            </select>

            <select
              value={selectedDietary}
              onChange={e => setSelectedDietary(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="all">All Diets</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="high-protein">High Protein</option>
              <option value="low-carb">Low Carb</option>
            </select>

            <select
              value={selectedCuisine}
              onChange={e => setSelectedCuisine(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="all">All Cuisines</option>
              <option value="South Indian">South Indian</option>
              <option value="North Indian">North Indian</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Asian">Asian</option>
              <option value="Western">Western</option>
              <option value="Italian">Italian</option>
            </select>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 font-semibold"
              >
                <option value="rating">Top Rated</option>
                <option value="time">Quickest</option>
                <option value="calories">Lowest Calorie</option>
                <option value="protein">Highest Protein</option>
              </select>
            </div>
          </div>
        </div>

        {/* Max Cooking Time Slider */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Max cooking time: <strong className="text-slate-900 dark:text-white">{maxTime} mins</strong></span>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={maxTime}
              onChange={e => setMaxTime(parseInt(e.target.value, 10))}
              className="w-28 sm:w-36 accent-emerald-600 cursor-pointer"
            />
          </div>
          <span>Showing {filteredRecipes.length} of {recipes.length} recipes</span>
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecipes.map(recipe => {
          const isFav = favorites.includes(recipe.id);

          return (
            <div
              key={recipe.id}
              onClick={() => setCurrentView('recipe_detail', { recipeId: recipe.id })}
              className="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden cursor-pointer flex flex-col group"
            >
              {/* Image banner */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-colors ${
                    isFav
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
                  }`}
                  title={isFav ? 'Remove Favorite' : 'Save Favorite'}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                </button>

                <div className="absolute bottom-2.5 left-3 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    {recipe.cuisine}
                  </span>
                  {recipe.isCustom && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600/90 text-white backdrop-blur-xs">
                      Custom
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {recipe.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {recipe.totalTimeMinutes}m
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {recipe.nutrition.calories} kcal
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {recipe.nutrition.protein}g Protein
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-medium text-slate-400">
                      {recipe.servings} Servings
                    </span>
                    <button
                      onClick={e => handleQuickAddToToday(recipe.id, e)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold transition-colors"
                    >
                      + Add to Plan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
