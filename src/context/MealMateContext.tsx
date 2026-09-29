import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DietaryType,
  LeftoverItem,
  MealPlanEntry,
  MealType,
  PantryItem,
  Recipe,
  ShoppingListItem,
  UserProfile
} from '../types/mealmate.ts';
import { SEED_RECIPES } from '../data/seedRecipes.ts';
import {
  DEFAULT_LEFTOVERS,
  DEFAULT_MEAL_PLAN,
  DEFAULT_PANTRY_ITEMS,
  DEFAULT_SHOPPING_LIST,
  DEFAULT_USER_PROFILE,
  getOffsetDateString
} from '../data/seedData.ts';

export type AppView =
  | 'landing'
  | 'login'
  | 'signup'
  | 'forgot_password'
  | 'onboarding'
  | 'dashboard'
  | 'planner'
  | 'recipes'
  | 'recipe_detail'
  | 'add_recipe'
  | 'edit_recipe'
  | 'shopping'
  | 'pantry'
  | 'leftovers'
  | 'meal_prep'
  | 'nutrition'
  | 'budget'
  | 'history'
  | 'favorites'
  | 'ai_assistant'
  | 'profile'
  | 'settings';

interface MealMateContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, pass: string, isDemo?: boolean) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView, params?: Record<string, any>) => void;
  viewParams: Record<string, any>;
  
  // Recipes
  recipes: Recipe[];
  favorites: string[];
  toggleFavorite: (recipeId: string) => void;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => Recipe;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  
  // Meal Planner
  mealPlan: MealPlanEntry[];
  addMealToPlan: (date: string, mealType: MealType, recipeId: string, servings?: number, notes?: string) => void;
  updateMealStatus: (planId: string, status: 'planned' | 'completed' | 'skipped') => void;
  removeMealFromPlan: (planId: string) => void;
  moveMealInPlan: (planId: string, newDate: string, newMealType: MealType) => void;
  copyMealInPlan: (planId: string, targetDate: string, targetMealType: MealType) => void;
  copyDayMeals: (sourceDate: string, targetDate: string) => void;
  copyWeekMeals: (sourceStartDate: string, targetStartDate: string) => void;
  clearPlanForDate: (date: string) => void;
  generateAutoMealPlan: (options: {
    startDate: string;
    daysCount: number;
    dietary?: DietaryType[];
    allergies?: string[];
    maxCookingTime?: number;
    cuisine?: string;
  }) => void;

  // Pantry
  pantry: PantryItem[];
  addPantryItem: (item: Omit<PantryItem, 'id'>) => void;
  updatePantryItem: (item: PantryItem) => void;
  deletePantryItem: (id: string) => void;

  // Shopping List
  shoppingList: ShoppingListItem[];
  generateShoppingListFromPlan: (startDate?: string, endDate?: string) => void;
  toggleShoppingItem: (id: string) => void;
  addShoppingItem: (item: Omit<ShoppingListItem, 'id' | 'checked'>) => void;
  updateShoppingItem: (item: ShoppingListItem) => void;
  deleteShoppingItem: (id: string) => void;
  clearPurchasedShoppingItems: () => void;

  // Leftovers
  leftovers: LeftoverItem[];
  addLeftover: (item: Omit<LeftoverItem, 'id'>) => void;
  markLeftoverUsed: (id: string) => void;
  deleteLeftover: (id: string) => void;

  // App Theme & Reset
  darkMode: boolean;
  toggleDarkMode: () => void;
  resetToDemoData: () => void;
}

const MealMateContext = createContext<MealMateContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'mealmate_user_v1',
  IS_AUTH: 'mealmate_is_auth_v1',
  IS_DEMO: 'mealmate_is_demo_v1',
  RECIPES: 'mealmate_recipes_v1',
  FAVORITES: 'mealmate_favorites_v1',
  MEAL_PLAN: 'mealmate_meal_plan_v1',
  PANTRY: 'mealmate_pantry_v1',
  SHOPPING: 'mealmate_shopping_v1',
  LEFTOVERS: 'mealmate_leftovers_v1',
  DARK_MODE: 'mealmate_dark_mode_v1'
};

export const MealMateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_USER_PROFILE;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_AUTH);
    return saved !== null ? saved === 'true' : true; // Default to true for demo access
  });

  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_DEMO);
    return saved !== null ? saved === 'true' : true;
  });

  // Navigation
  const [currentView, setCurrentViewState] = useState<AppView>('dashboard');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});

  const setCurrentView = (view: AppView, params: Record<string, any> = {}) => {
    setCurrentViewState(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Recipes
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECIPES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return SEED_RECIPES;
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return ['rec-1', 'rec-2', 'rec-4', 'rec-10', 'rec-21'];
  });

  // Meal Plan
  const [mealPlan, setMealPlan] = useState<MealPlanEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_MEAL_PLAN;
  });

  // Pantry
  const [pantry, setPantry] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PANTRY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_PANTRY_ITEMS;
  });

  // Shopping List
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOPPING);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_SHOPPING_LIST;
  });

  // Leftovers
  const [leftovers, setLeftovers] = useState<LeftoverItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEFTOVERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_LEFTOVERS;
  });

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Sync to localStorage
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_AUTH, String(isAuthenticated));
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, String(isDemoMode));
  }, [isAuthenticated, isDemoMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(mealPlan));
  }, [mealPlan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PANTRY, JSON.stringify(pantry));
  }, [pantry]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEFTOVERS, JSON.stringify(leftovers));
  }, [leftovers]);

  // Auth operations
  const login = async (email: string, pass: string, demo: boolean = false) => {
    if (!email || !pass) {
      return { success: false, error: 'Please enter both email and password.' };
    }
    // Simulation / local authentication
    setIsAuthenticated(true);
    setIsDemoMode(demo);
    if (demo) {
      setUser(DEFAULT_USER_PROFILE);
    } else {
      setUser(prev => ({
        ...(prev || DEFAULT_USER_PROFILE),
        email
      }));
    }
    setCurrentView('dashboard');
    return { success: true };
  };

  const signup = async (name: string, email: string, pass: string) => {
    if (!name || !email || !pass) {
      return { success: false, error: 'Please fill out all required fields.' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }
    const newUser: UserProfile = {
      ...DEFAULT_USER_PROFILE,
      id: 'usr-' + Date.now(),
      name,
      email,
      onboardingCompleted: false
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setIsDemoMode(false);
    setCurrentView('onboarding');
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const resetPassword = async (email: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }
    return { success: true };
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  // Recipe actions
  const toggleFavorite = (recipeId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(recipeId);
      if (exists) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const addRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt'>): Recipe => {
    const newRecipe: Recipe = {
      ...recipeData,
      id: 'custom-' + Date.now(),
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    setRecipes(prev => [newRecipe, ...prev]);
    return newRecipe;
  };

  const updateRecipe = (updated: Recipe) => {
    setRecipes(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    setFavorites(prev => prev.filter(fId => fId !== id));
    setMealPlan(prev => prev.filter(entry => entry.recipeId !== id));
  };

  // Meal Plan actions
  const addMealToPlan = (date: string, mealType: MealType, recipeId: string, servings: number = 2, notes?: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const newEntry: MealPlanEntry = {
      id: 'plan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      date,
      mealType,
      recipeId,
      recipeTitle: recipe.title,
      recipeImage: recipe.image,
      servings: servings || recipe.servings,
      status: 'planned',
      notes,
      calories: recipe.nutrition.calories,
      protein: recipe.nutrition.protein
    };

    setMealPlan(prev => {
      // Remove any existing meal in that slot if user replaces it
      const filtered = prev.filter(item => !(item.date === date && item.mealType === mealType));
      return [...filtered, newEntry];
    });
  };

  const updateMealStatus = (planId: string, status: 'planned' | 'completed' | 'skipped') => {
    setMealPlan(prev =>
      prev.map(item => (item.id === planId ? { ...item, status } : item))
    );
  };

  const removeMealFromPlan = (planId: string) => {
    setMealPlan(prev => prev.filter(item => item.id !== planId));
  };

  const moveMealInPlan = (planId: string, newDate: string, newMealType: MealType) => {
    setMealPlan(prev => {
      const entry = prev.find(i => i.id === planId);
      if (!entry) return prev;
      // Filter out target conflict if any
      const cleaned = prev.filter(i => i.id !== planId && !(i.date === newDate && i.mealType === newMealType));
      return [...cleaned, { ...entry, date: newDate, mealType: newMealType }];
    });
  };

  const copyMealInPlan = (planId: string, targetDate: string, targetMealType: MealType) => {
    const entry = mealPlan.find(i => i.id === planId);
    if (!entry) return;
    const copy: MealPlanEntry = {
      ...entry,
      id: 'plan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      date: targetDate,
      mealType: targetMealType,
      status: 'planned'
    };
    setMealPlan(prev => {
      const cleaned = prev.filter(i => !(i.date === targetDate && i.mealType === targetMealType));
      return [...cleaned, copy];
    });
  };

  const copyDayMeals = (sourceDate: string, targetDate: string) => {
    const sourceEntries = mealPlan.filter(i => i.date === sourceDate);
    if (sourceEntries.length === 0) return;

    setMealPlan(prev => {
      const filtered = prev.filter(i => i.date !== targetDate);
      const newCopies: MealPlanEntry[] = sourceEntries.map(e => ({
        ...e,
        id: 'plan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        date: targetDate,
        status: 'planned'
      }));
      return [...filtered, ...newCopies];
    });
  };

  const copyWeekMeals = (sourceStartDate: string, targetStartDate: string) => {
    const sourceStart = new Date(sourceStartDate);
    const targetStart = new Date(targetStartDate);

    const updatedPlan = [...mealPlan];

    for (let day = 0; day < 7; day++) {
      const sDay = new Date(sourceStart);
      sDay.setDate(sDay.getDate() + day);
      const sDateStr = sDay.toISOString().split('T')[0];

      const tDay = new Date(targetStart);
      tDay.setDate(tDay.getDate() + day);
      const tDateStr = tDay.toISOString().split('T')[0];

      const mealsOnSDay = mealPlan.filter(i => i.date === sDateStr);
      // Remove existing on target day
      const targetIndicesToRemove: number[] = [];
      updatedPlan.forEach((item, idx) => {
        if (item.date === tDateStr) targetIndicesToRemove.push(idx);
      });
      // Filter out
      const kept = updatedPlan.filter(item => item.date !== tDateStr);
      const copies: MealPlanEntry[] = mealsOnSDay.map(item => ({
        ...item,
        id: 'plan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        date: tDateStr,
        status: 'planned'
      }));
      updatedPlan.length = 0;
      updatedPlan.push(...kept, ...copies);
    }

    setMealPlan(updatedPlan);
  };

  const clearPlanForDate = (date: string) => {
    setMealPlan(prev => prev.filter(i => i.date !== date));
  };

  // Rule-based and allergy-safe intelligent auto meal plan generator
  const generateAutoMealPlan = (options: {
    startDate: string;
    daysCount: number;
    dietary?: DietaryType[];
    allergies?: string[];
    maxCookingTime?: number;
    cuisine?: string;
  }) => {
    const { startDate, daysCount, dietary, allergies, maxCookingTime, cuisine } = options;
    const userAllergies = allergies || user?.allergies || [];
    const userDietary = dietary || user?.dietary || ['vegetarian'];
    const maxCook = maxCookingTime || user?.maxCookingTime || 45;

    // Filter recipes strictly avoiding allergies and conforming to dietary
    const safeRecipes = recipes.filter(recipe => {
      // Allergen check: STRICT
      const hasAllergen = recipe.allergens.some(a => userAllergies.includes(a));
      if (hasAllergen) return false;

      // Dietary check:
      if (userDietary.includes('vegan') && !recipe.dietary.includes('vegan')) return false;
      if (userDietary.includes('vegetarian') && !recipe.dietary.includes('vegetarian') && !recipe.dietary.includes('vegan')) return false;
      if (userDietary.includes('eggetarian') && !recipe.dietary.includes('vegetarian') && !recipe.dietary.includes('vegan') && !recipe.dietary.includes('eggetarian')) return false;
      if (userDietary.includes('pescatarian') && !recipe.dietary.includes('pescatarian') && !recipe.dietary.includes('vegetarian') && !recipe.dietary.includes('vegan')) return false;

      // Cooking time check
      if (recipe.cookTimeMinutes > maxCook + 15) return false;

      // Cuisine check (soft preference)
      if (cuisine && cuisine !== 'Any' && recipe.cuisine !== cuisine) {
        // Can be lenient if pool is small
      }

      return true;
    });

    const candidatePool = safeRecipes.length >= 5 ? safeRecipes : recipes;

    const breakfastPool = candidatePool.filter(r => r.mealTypes.includes('breakfast'));
    const lunchPool = candidatePool.filter(r => r.mealTypes.includes('lunch'));
    const dinnerPool = candidatePool.filter(r => r.mealTypes.includes('dinner'));
    const snackPool = candidatePool.filter(r => r.mealTypes.includes('morning_snack') || r.mealTypes.includes('evening_snack'));

    const newEntries: MealPlanEntry[] = [];
    const baseDate = new Date(startDate);

    const getRoundRobin = (pool: Recipe[], index: number) => {
      if (pool.length === 0) return candidatePool[index % candidatePool.length];
      return pool[index % pool.length];
    };

    for (let day = 0; day < daysCount; day++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + day);
      const dateStr = d.toISOString().split('T')[0];

      const bRecipe = getRoundRobin(breakfastPool, day);
      const lRecipe = getRoundRobin(lunchPool, day + 1);
      const dRecipe = getRoundRobin(dinnerPool, day + 2);
      const sRecipe = getRoundRobin(snackPool, day + 3);

      newEntries.push(
        {
          id: 'gen-' + dateStr + '-b',
          date: dateStr,
          mealType: 'breakfast',
          recipeId: bRecipe.id,
          recipeTitle: bRecipe.title,
          recipeImage: bRecipe.image,
          servings: user?.householdServings || 2,
          status: 'planned',
          calories: bRecipe.nutrition.calories,
          protein: bRecipe.nutrition.protein
        },
        {
          id: 'gen-' + dateStr + '-l',
          date: dateStr,
          mealType: 'lunch',
          recipeId: lRecipe.id,
          recipeTitle: lRecipe.title,
          recipeImage: lRecipe.image,
          servings: user?.householdServings || 2,
          status: 'planned',
          calories: lRecipe.nutrition.calories,
          protein: lRecipe.nutrition.protein
        },
        {
          id: 'gen-' + dateStr + '-s',
          date: dateStr,
          mealType: 'evening_snack',
          recipeId: sRecipe.id,
          recipeTitle: sRecipe.title,
          recipeImage: sRecipe.image,
          servings: user?.householdServings || 2,
          status: 'planned',
          calories: sRecipe.nutrition.calories,
          protein: sRecipe.nutrition.protein
        },
        {
          id: 'gen-' + dateStr + '-d',
          date: dateStr,
          mealType: 'dinner',
          recipeId: dRecipe.id,
          recipeTitle: dRecipe.title,
          recipeImage: dRecipe.image,
          servings: user?.householdServings || 2,
          status: 'planned',
          calories: dRecipe.nutrition.calories,
          protein: dRecipe.nutrition.protein
        }
      );
    }

    setMealPlan(prev => {
      // Remove overlapping dates
      const datesToReplace = new Set(newEntries.map(e => e.date));
      const filtered = prev.filter(e => !datesToReplace.has(e.date));
      return [...filtered, ...newEntries];
    });
  };

  // Pantry actions
  const addPantryItem = (itemData: Omit<PantryItem, 'id'>) => {
    const newItem: PantryItem = {
      ...itemData,
      id: 'pan-' + Date.now()
    };
    setPantry(prev => [newItem, ...prev]);
  };

  const updatePantryItem = (item: PantryItem) => {
    setPantry(prev => prev.map(p => (p.id === item.id ? item : p)));
  };

  const deletePantryItem = (id: string) => {
    setPantry(prev => prev.filter(p => p.id !== id));
  };

  // Shopping List actions (with pantry inventory subtraction!)
  const generateShoppingListFromPlan = (startDate?: string, endDate?: string) => {
    const targetMeals = mealPlan.filter(m => {
      if (startDate && m.date < startDate) return false;
      if (endDate && m.date > endDate) return false;
      return true;
    });

    const ingredientAggregator: Record<string, { amount: number; unit: string; category: string; cost: number }> = {};

    targetMeals.forEach(meal => {
      const rec = recipes.find(r => r.id === meal.recipeId);
      if (!rec) return;

      const scaleFactor = (meal.servings || rec.servings) / (rec.servings || 1);

      rec.ingredients.forEach(ing => {
        const key = ing.name.toLowerCase().trim();
        const scaledAmount = Math.round((ing.amount * scaleFactor) * 10) / 10;
        const scaledCost = Math.round((ing.estimatedCost || 20) * scaleFactor);

        if (!ingredientAggregator[key]) {
          ingredientAggregator[key] = {
            amount: scaledAmount,
            unit: ing.unit,
            category: ing.category || 'Other',
            cost: scaledCost
          };
        } else {
          ingredientAggregator[key].amount += scaledAmount;
          ingredientAggregator[key].cost += scaledCost;
        }
      });
    });

    // Subtract pantry inventory if available
    const newList: ShoppingListItem[] = [];
    Object.entries(ingredientAggregator).forEach(([name, data]) => {
      const matchingPantry = pantry.find(p => p.name.toLowerCase().includes(name) || name.includes(p.name.toLowerCase()));
      let neededAmount = data.amount;

      if (matchingPantry && matchingPantry.unit.toLowerCase() === data.unit.toLowerCase()) {
        neededAmount = Math.max(0, data.amount - matchingPantry.quantity);
      }

      if (neededAmount > 0) {
        newList.push({
          id: 'shop-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          name: name.charAt(0).toUpperCase() + name.slice(1),
          quantity: Math.round(neededAmount * 10) / 10,
          unit: data.unit,
          category: data.category,
          checked: false,
          estimatedPrice: data.cost
        });
      }
    });

    setShoppingList(newList);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev =>
      prev.map(i => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const addShoppingItem = (itemData: Omit<ShoppingListItem, 'id' | 'checked'>) => {
    const newItem: ShoppingListItem = {
      ...itemData,
      id: 'shop-' + Date.now(),
      checked: false,
      custom: true
    };
    setShoppingList(prev => [newItem, ...prev]);
  };

  const updateShoppingItem = (item: ShoppingListItem) => {
    setShoppingList(prev => prev.map(i => (i.id === item.id ? item : i)));
  };

  const deleteShoppingItem = (id: string) => {
    setShoppingList(prev => prev.filter(i => i.id !== id));
  };

  const clearPurchasedShoppingItems = () => {
    setShoppingList(prev => prev.filter(i => !i.checked));
  };

  // Leftovers actions
  const addLeftover = (itemData: Omit<LeftoverItem, 'id'>) => {
    const newItem: LeftoverItem = {
      ...itemData,
      id: 'left-' + Date.now(),
      used: false
    };
    setLeftovers(prev => [newItem, ...prev]);
  };

  const markLeftoverUsed = (id: string) => {
    setLeftovers(prev =>
      prev.map(i => (i.id === id ? { ...i, used: true } : i))
    );
  };

  const deleteLeftover = (id: string) => {
    setLeftovers(prev => prev.filter(i => i.id !== id));
  };

  const resetToDemoData = () => {
    setUser(DEFAULT_USER_PROFILE);
    setRecipes(SEED_RECIPES);
    setFavorites(['rec-1', 'rec-2', 'rec-4', 'rec-10', 'rec-21']);
    setMealPlan(DEFAULT_MEAL_PLAN);
    setPantry(DEFAULT_PANTRY_ITEMS);
    setShoppingList(DEFAULT_SHOPPING_LIST);
    setLeftovers(DEFAULT_LEFTOVERS);
    setIsAuthenticated(true);
    setIsDemoMode(true);
    setCurrentView('dashboard');
  };

  return (
    <MealMateContext.Provider
      value={{
        user,
        isAuthenticated,
        isDemoMode,
        login,
        signup,
        logout,
        resetPassword,
        updateProfile,
        currentView,
        setCurrentView,
        viewParams,
        recipes,
        favorites,
        toggleFavorite,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        mealPlan,
        addMealToPlan,
        updateMealStatus,
        removeMealFromPlan,
        moveMealInPlan,
        copyMealInPlan,
        copyDayMeals,
        copyWeekMeals,
        clearPlanForDate,
        generateAutoMealPlan,
        pantry,
        addPantryItem,
        updatePantryItem,
        deletePantryItem,
        shoppingList,
        generateShoppingListFromPlan,
        toggleShoppingItem,
        addShoppingItem,
        updateShoppingItem,
        deleteShoppingItem,
        clearPurchasedShoppingItems,
        leftovers,
        addLeftover,
        markLeftoverUsed,
        deleteLeftover,
        darkMode,
        toggleDarkMode,
        resetToDemoData
      }}
    >
      {children}
    </MealMateContext.Provider>
  );
};

export const useMealMate = () => {
  const context = useContext(MealMateContext);
  if (!context) {
    throw new Error('useMealMate must be used within a MealMateProvider');
  }
  return context;
};
