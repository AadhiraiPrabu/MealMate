import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import { DietaryType, Ingredient, MealType, Recipe } from '../types/mealmate.ts';
import { ChefHat, Plus, Trash2, ArrowLeft, Image, Save } from 'lucide-react';

export const RecipeFormPage: React.FC = () => {
  const { viewParams, recipes, addRecipe, updateRecipe, setCurrentView } = useMealMate();
  const editingId = viewParams?.recipeId;
  const existingRecipe = recipes.find(r => r.id === editingId);

  const [title, setTitle] = useState(existingRecipe?.title || '');
  const [description, setDescription] = useState(existingRecipe?.description || '');
  const [image, setImage] = useState(
    existingRecipe?.image ||
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'
  );
  const [cuisine, setCuisine] = useState(existingRecipe?.cuisine || 'South Indian');
  const [mealTypes, setMealTypes] = useState<MealType[]>(existingRecipe?.mealTypes || ['lunch']);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(existingRecipe?.prepTimeMinutes || 15);
  const [cookTimeMinutes, setCookTimeMinutes] = useState(existingRecipe?.cookTimeMinutes || 20);
  const [servings, setServings] = useState(existingRecipe?.servings || 2);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(
    existingRecipe?.difficulty || 'Easy'
  );
  const [calories, setCalories] = useState(existingRecipe?.nutrition.calories || 320);
  const [protein, setProtein] = useState(existingRecipe?.nutrition.protein || 12);
  const [carbs, setCarbs] = useState(existingRecipe?.nutrition.carbs || 45);
  const [fat, setFat] = useState(existingRecipe?.nutrition.fat || 8);
  const [fiber, setFiber] = useState(existingRecipe?.nutrition.fiber || 5);
  const [dietary, setDietary] = useState<DietaryType[]>(existingRecipe?.dietary || ['vegetarian']);
  const [tagsInput, setTagsInput] = useState(existingRecipe?.tags.join(', ') || 'Healthy, Quick');

  // Dynamic Ingredients List
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    existingRecipe?.ingredients || [
      { id: 'ing-1', name: 'Fresh Vegetables', amount: 200, unit: 'g', category: 'Vegetables', scalable: true, estimatedCost: 25 },
      { id: 'ing-2', name: 'Cooking Oil or Ghee', amount: 1, unit: 'tbsp', category: 'Oils & Condiments', scalable: true, estimatedCost: 10 }
    ]
  );

  // Dynamic Step-by-Step Instructions
  const [instructions, setInstructions] = useState<string[]>(
    existingRecipe?.instructions || [
      'Wash and chop all vegetables into uniform pieces.',
      'Heat oil in a heavy-bottomed pan and sauté aromatics.',
      'Simmer until tender and fragrant. Serve hot.'
    ]
  );

  const [error, setError] = useState<string | null>(null);

  const handleAddIngredient = () => {
    setIngredients(prev => [
      ...prev,
      {
        id: 'ing-' + Date.now(),
        name: '',
        amount: 100,
        unit: 'g',
        category: 'Vegetables',
        scalable: true,
        estimatedCost: 20
      }
    ]);
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateIngredient = (idx: number, field: keyof Ingredient, val: any) => {
    setIngredients(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleAddInstruction = () => {
    setInstructions(prev => [...prev, '']);
  };

  const handleRemoveInstruction = (idx: number) => {
    setInstructions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateInstruction = (idx: number, val: string) => {
    setInstructions(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const toggleMealType = (mt: MealType) => {
    setMealTypes(prev => (prev.includes(mt) ? prev.filter(m => m !== mt) : [...prev, mt]));
  };

  const toggleDietary = (d: DietaryType) => {
    setDietary(prev => (prev.includes(d) ? prev.filter(item => item !== d) : [...prev, d]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a recipe title.');
      return;
    }
    if (ingredients.some(i => !i.name.trim())) {
      setError('All ingredient rows must have a name.');
      return;
    }
    if (instructions.some(s => !s.trim())) {
      setError('All instruction steps must have description text.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const recipeData: Omit<Recipe, 'id' | 'createdAt'> = {
      title,
      description,
      image,
      cuisine,
      mealTypes: mealTypes.length > 0 ? mealTypes : ['lunch'],
      prepTimeMinutes,
      cookTimeMinutes,
      totalTimeMinutes: prepTimeMinutes + cookTimeMinutes,
      servings,
      difficulty,
      nutrition: { calories, protein, carbs, fat, fiber },
      tags,
      dietary,
      allergens: [],
      instructions,
      ingredients
    };

    if (existingRecipe) {
      updateRecipe({ ...recipeData, id: existingRecipe.id, createdAt: existingRecipe.createdAt });
      alert(`Updated "${title}" successfully!`);
      setCurrentView('recipe_detail', { recipeId: existingRecipe.id });
    } else {
      const created = addRecipe(recipeData);
      alert(`Created "${title}" successfully!`);
      setCurrentView('recipe_detail', { recipeId: created.id });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setCurrentView('recipes')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel & Back
        </button>

        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-emerald-600" />
          {existingRecipe ? 'Edit Recipe' : 'Add Custom Recipe'}
        </h1>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Recipe Overview</h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recipe Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Grandma's Coconut Vegetable Stew"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="A comforting coconut and vegetable stew infused with curry leaves and ginger..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cuisine
              </label>
              <input
                type="text"
                value={cuisine}
                onChange={e => setCuisine(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Servings
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={servings}
                onChange={e => setServings(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={e => setImage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            />
          </div>
        </div>

        {/* Dynamic Ingredients */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Scalable Ingredients ({ingredients.length})
            </h2>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-100"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Ingredient
            </button>
          </div>

          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={ing.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={e => handleUpdateIngredient(idx, 'name', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs min-w-36"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Qty"
                  value={ing.amount}
                  onChange={e => handleUpdateIngredient(idx, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs text-center font-semibold"
                />
                <input
                  type="text"
                  placeholder="Unit (g, ml, tbsp)"
                  value={ing.unit}
                  onChange={e => handleUpdateIngredient(idx, 'unit', e.target.value)}
                  className="w-20 px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs"
                />
                <select
                  value={ing.category}
                  onChange={e => handleUpdateIngredient(idx, 'category', e.target.value)}
                  className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Proteins">Proteins</option>
                  <option value="Spices">Spices</option>
                  <option value="Oils & Condiments">Oils</option>
                  <option value="Other">Other</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Instructions */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Step-by-Step Instructions ({instructions.length})
            </h2>
            <button
              type="button"
              onClick={handleAddInstruction}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-100"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Step
            </button>
          </div>

          <div className="space-y-2">
            {instructions.map((stepText, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-6 h-8 flex items-center justify-center font-bold text-xs text-slate-400 shrink-0">
                  {idx + 1}.
                </span>
                <textarea
                  rows={2}
                  value={stepText}
                  onChange={e => handleUpdateInstruction(idx, e.target.value)}
                  placeholder={`Step ${idx + 1} details...`}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Times & Nutrition */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Cooking Times & Nutrition</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Prep Time (min)</label>
              <input
                type="number"
                value={prepTimeMinutes}
                onChange={e => setPrepTimeMinutes(parseInt(e.target.value, 10) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Cook Time (min)</label>
              <input
                type="number"
                value={cookTimeMinutes}
                onChange={e => setCookTimeMinutes(parseInt(e.target.value, 10) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={calories}
                onChange={e => setCalories(parseInt(e.target.value, 10) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Protein (g)</label>
              <input
                type="number"
                value={protein}
                onChange={e => setProtein(parseInt(e.target.value, 10) || 0)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentView('recipes')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {existingRecipe ? 'Save Changes' : 'Publish Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};
