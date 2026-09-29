export type MealType = 'breakfast' | 'morning_snack' | 'lunch' | 'evening_snack' | 'dinner';

export type DietaryType = 
  | 'vegetarian' 
  | 'vegan' 
  | 'eggetarian' 
  | 'non-vegetarian' 
  | 'pescatarian' 
  | 'jain' 
  | 'high-protein' 
  | 'low-carb';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Dairy' | 'Proteins' | 'Spices' | 'Oils & Condiments' | 'Snacks' | 'Other';
  scalable?: boolean;
  allergens?: string[];
  estimatedCost?: number; // Cost in INR default
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cuisine: string;
  mealTypes: MealType[];
  ingredients: Ingredient[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nutrition: NutritionInfo;
  tags: string[];
  dietary: DietaryType[];
  allergens: string[];
  isFavorite?: boolean;
  isCustom?: boolean;
  createdAt?: string;
  rating?: number;
}

export interface MealPlanEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  recipeId: string;
  recipeTitle: string;
  recipeImage?: string;
  servings: number;
  status: 'planned' | 'completed' | 'skipped';
  notes?: string;
  calories?: number;
  protein?: number;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Dairy' | 'Proteins' | 'Spices' | 'Oils & Condiments' | 'Snacks' | 'Other';
  purchaseDate: string;
  expiryDate: string;
  notes?: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  recipeSource?: string;
  estimatedPrice?: number;
  custom?: boolean;
}

export interface LeftoverItem {
  id: string;
  name: string;
  quantity: string;
  storageDate: string;
  expiryDate: string;
  reheatingTip?: string;
  used?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  gender?: string;
  country: string;
  householdServings: number;
  dietary: DietaryType[];
  cuisines: string[];
  allergies: string[];
  mealsPerDay: number;
  breakfastPreference?: string;
  lunchPreference?: string;
  dinnerPreference?: string;
  snackPreference?: string;
  maxCookingTime: number; // in minutes
  cookingSkill: 'Beginner' | 'Intermediate' | 'Advanced';
  appliances: string[];
  budgetPeriod: 'day' | 'week' | 'month';
  budgetAmount: number;
  currency: '₹' | '$' | '€' | '£';
  preferredPrepDays: string[];
  leftoverPreference: 'Love leftovers' | 'Occasionally' | 'Cook fresh only';
  maxRepeatedMeals: number;
  notifications: {
    breakfastReminder: boolean;
    lunchReminder: boolean;
    dinnerReminder: boolean;
    mealPrepReminder: boolean;
    groceryReminder: boolean;
    expiryReminder: boolean;
  };
  onboardingCompleted: boolean;
}

export interface MealHistoryEntry {
  id: string;
  date: string;
  recipeTitle: string;
  mealType: MealType;
  status: 'completed' | 'skipped';
  calories: number;
  cuisine: string;
}
