import { LeftoverItem, MealPlanEntry, PantryItem, ShoppingListItem, UserProfile } from '../types/mealmate.ts';

// Helper to get formatted date string YYYY-MM-DD
export function getOffsetDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Aadhirai',
  email: 'aadhiraiprabuk@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  age: 28,
  gender: 'Female',
  country: 'India',
  householdServings: 2,
  dietary: ['vegetarian'],
  cuisines: ['South Indian', 'North Indian', 'Mediterranean'],
  allergies: [],
  mealsPerDay: 4,
  breakfastPreference: 'Warm South Indian breakfasts (Idli, Dosa, Upma, Pongal)',
  lunchPreference: 'Nourishing rice bowls with dal, sambar, or curries',
  dinnerPreference: 'Light dinners like chapatis with vegetable curry or light salads',
  snackPreference: 'High-protein sprouts, roasted makhana, or fruit yogurts',
  maxCookingTime: 35,
  cookingSkill: 'Intermediate',
  appliances: ['Gas Stove', 'Pressure Cooker', 'Mixer Grinder', 'Air Fryer', 'Oven'],
  budgetPeriod: 'week',
  budgetAmount: 2500,
  currency: '₹',
  preferredPrepDays: ['Sunday', 'Wednesday'],
  leftoverPreference: 'Love leftovers',
  maxRepeatedMeals: 2,
  notifications: {
    breakfastReminder: true,
    lunchReminder: true,
    dinnerReminder: true,
    mealPrepReminder: true,
    groceryReminder: true,
    expiryReminder: true
  },
  onboardingCompleted: true
};

export const DEFAULT_PANTRY_ITEMS: PantryItem[] = [
  {
    id: 'pan-1',
    name: 'Fresh Baby Spinach',
    quantity: 300,
    unit: 'g',
    category: 'Vegetables',
    purchaseDate: getOffsetDateString(-3),
    expiryDate: getOffsetDateString(1), // Expiring tomorrow!
    notes: 'Use in Palak Paneer or dal soon'
  },
  {
    id: 'pan-2',
    name: 'Ripe Red Tomatoes',
    quantity: 1,
    unit: 'kg',
    category: 'Vegetables',
    purchaseDate: getOffsetDateString(-2),
    expiryDate: getOffsetDateString(4),
    notes: 'Crisp and juicy'
  },
  {
    id: 'pan-3',
    name: 'Toor Dal (Pigeon Peas)',
    quantity: 1.5,
    unit: 'kg',
    category: 'Proteins',
    purchaseDate: getOffsetDateString(-14),
    expiryDate: getOffsetDateString(180),
    notes: 'Airtight container'
  },
  {
    id: 'pan-4',
    name: 'Sona Masoori Rice',
    quantity: 5,
    unit: 'kg',
    category: 'Grains',
    purchaseDate: getOffsetDateString(-20),
    expiryDate: getOffsetDateString(300),
    notes: 'Staple'
  },
  {
    id: 'pan-5',
    name: 'Fresh Paneer',
    quantity: 200,
    unit: 'g',
    category: 'Dairy',
    purchaseDate: getOffsetDateString(-1),
    expiryDate: getOffsetDateString(3),
    notes: 'Keep chilled'
  },
  {
    id: 'pan-6',
    name: 'Whole Eggs',
    quantity: 8,
    unit: 'whole',
    category: 'Proteins',
    purchaseDate: getOffsetDateString(-4),
    expiryDate: getOffsetDateString(10),
    notes: 'Farm fresh'
  },
  {
    id: 'pan-7',
    name: 'Pure Desi Ghee',
    quantity: 450,
    unit: 'g',
    category: 'Dairy',
    purchaseDate: getOffsetDateString(-30),
    expiryDate: getOffsetDateString(200),
    notes: 'Organic A2'
  },
  {
    id: 'pan-8',
    name: 'Yellow Moong Dal',
    quantity: 1,
    unit: 'kg',
    category: 'Proteins',
    purchaseDate: getOffsetDateString(-10),
    expiryDate: getOffsetDateString(250),
    notes: 'For Pongal and Chilla'
  },
  {
    id: 'pan-9',
    name: 'Curd / Yogurt',
    quantity: 400,
    unit: 'g',
    category: 'Dairy',
    purchaseDate: getOffsetDateString(-2),
    expiryDate: getOffsetDateString(2),
    notes: 'Expiring soon'
  },
  {
    id: 'pan-10',
    name: 'Rolled Oats',
    quantity: 800,
    unit: 'g',
    category: 'Grains',
    purchaseDate: getOffsetDateString(-15),
    expiryDate: getOffsetDateString(120),
    notes: 'For overnight oats'
  }
];

export const DEFAULT_LEFTOVERS: LeftoverItem[] = [
  {
    id: 'left-1',
    name: 'Steamed Sona Masoori Rice',
    quantity: '2 cups (~350g)',
    storageDate: getOffsetDateString(-1),
    expiryDate: getOffsetDateString(2),
    reheatingTip: 'Perfect for Lemon Rice, Curd Rice, or Quick Fried Rice. Sprinkle 1 tbsp water before microwaving.',
    used: false
  },
  {
    id: 'left-2',
    name: 'Cooked Yellow Dal Tadka',
    quantity: '1.5 cups (~300ml)',
    storageDate: getOffsetDateString(-1),
    expiryDate: getOffsetDateString(1),
    reheatingTip: 'Knead into whole wheat flour to make nutritious Dal Parathas, or simmer with spinach for Dal Palak.',
    used: false
  }
];

export const DEFAULT_MEAL_PLAN: MealPlanEntry[] = [
  // Today
  {
    id: 'plan-1',
    date: getOffsetDateString(0),
    mealType: 'breakfast',
    recipeId: 'rec-1',
    recipeTitle: 'Steamed Idli with Sambar & Coconut Chutney',
    recipeImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'completed',
    calories: 310,
    protein: 9
  },
  {
    id: 'plan-2',
    date: getOffsetDateString(0),
    mealType: 'morning_snack',
    recipeId: 'rec-23',
    recipeTitle: 'Sprouted Green Moong & Pomegranate Salad',
    recipeImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'completed',
    calories: 190,
    protein: 12
  },
  {
    id: 'plan-3',
    date: getOffsetDateString(0),
    mealType: 'lunch',
    recipeId: 'rec-5',
    recipeTitle: 'Authentic Sambar Sadam (Sambar Rice)',
    recipeImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 360,
    protein: 11
  },
  {
    id: 'plan-4',
    date: getOffsetDateString(0),
    mealType: 'evening_snack',
    recipeId: 'rec-24',
    recipeTitle: 'Crunchy Roasted Spiced Foxnuts (Masala Makhana)',
    recipeImage: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 130,
    protein: 4
  },
  {
    id: 'plan-5',
    date: getOffsetDateString(0),
    mealType: 'dinner',
    recipeId: 'rec-11',
    recipeTitle: 'Nutritious Palak Paneer (Spinach Cottage Cheese)',
    recipeImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 320,
    protein: 18
  },

  // Tomorrow (+1)
  {
    id: 'plan-6',
    date: getOffsetDateString(1),
    mealType: 'breakfast',
    recipeId: 'rec-3',
    recipeTitle: 'Hearty Vegetable Semolina Upma',
    recipeImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 260,
    protein: 6
  },
  {
    id: 'plan-7',
    date: getOffsetDateString(1),
    mealType: 'lunch',
    recipeId: 'rec-6',
    recipeTitle: 'Tangy Lemon Rice (Chitranna)',
    recipeImage: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 290,
    protein: 6
  },
  {
    id: 'plan-8',
    date: getOffsetDateString(1),
    mealType: 'dinner',
    recipeId: 'rec-9',
    recipeTitle: 'Phulka Chapati with Homestyle Yellow Dal Tadka',
    recipeImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 340,
    protein: 12
  },

  // Day +2
  {
    id: 'plan-9',
    date: getOffsetDateString(2),
    mealType: 'breakfast',
    recipeId: 'rec-19',
    recipeTitle: 'High-Protein Moong Dal Chilla (Lentil Crepes)',
    recipeImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 280,
    protein: 16
  },
  {
    id: 'plan-10',
    date: getOffsetDateString(2),
    mealType: 'lunch',
    recipeId: 'rec-21',
    recipeTitle: 'Slow-Cooked Punjabi Rajma Masala with Basmati Rice',
    recipeImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 390,
    protein: 15
  },
  {
    id: 'plan-11',
    date: getOffsetDateString(2),
    mealType: 'dinner',
    recipeId: 'rec-7',
    recipeTitle: 'Soothing Temple Style Curd Rice (Thayir Sadam)',
    recipeImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 250,
    protein: 7
  },

  // Day +3
  {
    id: 'plan-12',
    date: getOffsetDateString(3),
    mealType: 'breakfast',
    recipeId: 'rec-4',
    recipeTitle: 'Traditional Ven Pongal with Ghee & Pepper',
    recipeImage: 'https://images.unsplash.com/photo-1630409346824-4f0e7b080087?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 340,
    protein: 10
  },
  {
    id: 'plan-13',
    date: getOffsetDateString(3),
    mealType: 'lunch',
    recipeId: 'rec-30',
    recipeTitle: 'Pepper Cumin Tomato Rasam with Rice & Papad',
    recipeImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 230,
    protein: 5
  },
  {
    id: 'plan-14',
    date: getOffsetDateString(3),
    mealType: 'dinner',
    recipeId: 'rec-10',
    recipeTitle: 'Restaurant Style Paneer Butter Masala',
    recipeImage: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'planned',
    calories: 410,
    protein: 16
  },

  // Yesterday (-1) for Meal History demo
  {
    id: 'plan-15',
    date: getOffsetDateString(-1),
    mealType: 'breakfast',
    recipeId: 'rec-2',
    recipeTitle: 'Crispy Golden Masala Dosa',
    recipeImage: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'completed',
    calories: 380,
    protein: 7
  },
  {
    id: 'plan-16',
    date: getOffsetDateString(-1),
    mealType: 'lunch',
    recipeId: 'rec-8',
    recipeTitle: 'Royal Vegetable Dum Biryani',
    recipeImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'completed',
    calories: 430,
    protein: 9
  },
  {
    id: 'plan-17',
    date: getOffsetDateString(-1),
    mealType: 'dinner',
    recipeId: 'rec-26',
    recipeTitle: 'Classic Spaghetti Aglio e Olio with Garlic & Chili',
    recipeImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
    servings: 2,
    status: 'completed',
    calories: 420,
    protein: 11
  }
];

export const DEFAULT_SHOPPING_LIST: ShoppingListItem[] = [
  { id: 'shop-1', name: 'Fresh Cilantro (Coriander)', quantity: 2, unit: 'bunches', category: 'Vegetables', checked: false, estimatedPrice: 20 },
  { id: 'shop-2', name: 'Raw Peanuts', quantity: 250, unit: 'g', category: 'Proteins', checked: false, estimatedPrice: 40 },
  { id: 'shop-3', name: 'Grated Coconut', quantity: 200, unit: 'g', category: 'Vegetables', checked: true, estimatedPrice: 30 },
  { id: 'shop-4', name: 'Fresh Lemons', quantity: 6, unit: 'whole', category: 'Fruits', checked: false, estimatedPrice: 30 },
  { id: 'shop-5', name: 'Whole Wheat Atta', quantity: 2, unit: 'kg', category: 'Grains', checked: false, estimatedPrice: 90 },
  { id: 'shop-6', name: 'Ginger & Garlic Paste', quantity: 1, unit: 'jar', category: 'Spices', checked: true, estimatedPrice: 45 },
  { id: 'shop-7', name: 'Curry Leaves', quantity: 1, unit: 'pack', category: 'Vegetables', checked: false, estimatedPrice: 10 }
];
