import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import { DietaryType } from '../types/mealmate.ts';
import confetti from 'canvas-confetti';
import {
  ChefHat,
  Users,
  Utensils,
  AlertTriangle,
  Clock,
  DollarSign,
  Calendar,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { user, updateProfile, generateAutoMealPlan, setCurrentView } = useMealMate();

  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState(user?.name || 'Aadhirai');
  const [age, setAge] = useState<number>(user?.age || 28);
  const [gender, setGender] = useState(user?.gender || 'Female');
  const [country, setCountry] = useState(user?.country || 'India');
  const [servings, setServings] = useState<number>(user?.householdServings || 2);

  const [selectedDietary, setSelectedDietary] = useState<DietaryType[]>(
    user?.dietary || ['vegetarian']
  );
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(
    user?.cuisines || ['South Indian', 'North Indian', 'Mediterranean']
  );

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(user?.allergies || []);
  const [customAllergy, setCustomAllergy] = useState('');

  const [mealsPerDay, setMealsPerDay] = useState<number>(user?.mealsPerDay || 4);
  const [maxCookingTime, setMaxCookingTime] = useState<number>(user?.maxCookingTime || 35);
  const [cookingSkill, setCookingSkill] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(
    user?.cookingSkill || 'Intermediate'
  );
  const [appliances, setAppliances] = useState<string[]>(
    user?.appliances || ['Gas Stove', 'Pressure Cooker', 'Mixer Grinder']
  );

  const [budgetPeriod, setBudgetPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [budgetAmount, setBudgetAmount] = useState<number>(user?.budgetAmount || 2500);
  const [currency, setCurrency] = useState<'₹' | '$' | '€' | '£'>('₹');

  const [preferredPrepDays, setPreferredPrepDays] = useState<string[]>(
    user?.preferredPrepDays || ['Sunday', 'Wednesday']
  );
  const [leftoverPreference, setLeftoverPreference] = useState<'Love leftovers' | 'Occasionally' | 'Cook fresh only'>(
    user?.leftoverPreference || 'Love leftovers'
  );

  const dietaryOptions: { id: DietaryType; label: string; desc: string }[] = [
    { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat, poultry, or seafood' },
    { id: 'vegan', label: 'Vegan', desc: '100% plant-based, no dairy/eggs/honey' },
    { id: 'eggetarian', label: 'Eggetarian', desc: 'Vegetarian plus eggs' },
    { id: 'non-vegetarian', label: 'Non-Vegetarian', desc: 'All proteins including poultry & meat' },
    { id: 'pescatarian', label: 'Pescatarian', desc: 'Vegetarian plus fish & seafood' },
    { id: 'jain', label: 'Jain Diet', desc: 'Vegetarian, strictly no root vegetables' },
    { id: 'high-protein', label: 'High-Protein', desc: 'Focus on protein-dense meals' },
    { id: 'low-carb', label: 'Low-Carb', desc: 'Reduced carbohydrates & sugars' }
  ];

  const cuisineOptions = [
    'South Indian',
    'North Indian',
    'Mediterranean',
    'Asian',
    'Western',
    'Italian',
    'Mexican',
    'Thai'
  ];

  const allergyOptions = [
    'peanuts',
    'tree nuts',
    'milk',
    'eggs',
    'soy',
    'wheat/gluten',
    'fish',
    'shellfish',
    'sesame'
  ];

  const applianceOptions = [
    'Gas Stove',
    'Pressure Cooker',
    'Mixer Grinder',
    'Air Fryer',
    'Microwave',
    'Oven',
    'Cast Iron Tawa'
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDietary = (d: DietaryType) => {
    setSelectedDietary(prev =>
      prev.includes(d) ? prev.filter(item => item !== d) : [...prev, d]
    );
  };

  const toggleCuisine = (c: string) => {
    setSelectedCuisines(prev =>
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };

  const toggleAllergy = (a: string) => {
    setSelectedAllergies(prev =>
      prev.includes(a) ? prev.filter(item => item !== a) : [...prev, a]
    );
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !selectedAllergies.includes(customAllergy.trim().toLowerCase())) {
      setSelectedAllergies(prev => [...prev, customAllergy.trim().toLowerCase()]);
      setCustomAllergy('');
    }
  };

  const toggleAppliance = (app: string) => {
    setAppliances(prev =>
      prev.includes(app) ? prev.filter(i => i !== app) : [...prev, app]
    );
  };

  const togglePrepDay = (day: string) => {
    setPreferredPrepDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleFinish = () => {
    updateProfile({
      name,
      age,
      gender,
      country,
      householdServings: servings,
      dietary: selectedDietary.length > 0 ? selectedDietary : ['vegetarian'],
      cuisines: selectedCuisines,
      allergies: selectedAllergies,
      mealsPerDay,
      maxCookingTime,
      cookingSkill,
      appliances,
      budgetPeriod,
      budgetAmount,
      currency,
      preferredPrepDays,
      leftoverPreference,
      onboardingCompleted: true
    });

    // Auto-generate fresh allergy-safe plan for the next 7 days!
    const today = new Date().toISOString().split('T')[0];
    generateAutoMealPlan({
      startDate: today,
      daysCount: 7,
      dietary: selectedDietary,
      allergies: selectedAllergies,
      maxCookingTime
    });

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) { /* ignore */ }

    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-[90vh] py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 dark:border-slate-700">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Dietary & Cuisines'}
              {step === 3 && 'Allergies & Exclusions'}
              {step === 4 && 'Cooking & Budget'}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Tell us about yourself</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                MealMate adapts ingredient quantities and grocery lists based on your household size.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Country / Region
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Gender (Optional)
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center justify-between">
                <span>Number of people being served (Household Size)</span>
                <span className="text-emerald-700 dark:text-emerald-400 text-base">{servings} {servings === 1 ? 'person' : 'people'}</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={servings}
                onChange={e => setServings(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                All recipes and shopping quantities scale up or down automatically based on this.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Dietary & Cuisines */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Food Preferences</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select your dietary lifestyle and cuisines you enjoy. Multiple selections allowed.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                Dietary Pattern
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dietaryOptions.map(option => {
                  const selected = selectedDietary.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleDietary(option.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        selected
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-md mt-0.5 border flex items-center justify-center ${
                        selected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {selected && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{option.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                Favorite Cuisines
              </label>
              <div className="flex flex-wrap gap-2">
                {cuisineOptions.map(c => {
                  const active = selectedCuisines.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCuisine(c)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Allergies */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-1">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Allergies & Exclusions</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                CRITICAL SAFETY: Recipes containing selected allergens will NEVER be recommended or auto-planned.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {allergyOptions.map(allergen => {
                const selected = selectedAllergies.includes(allergen);
                return (
                  <button
                    key={allergen}
                    type="button"
                    onClick={() => toggleAllergy(allergen)}
                    className={`p-3 rounded-xl border text-left text-sm font-semibold capitalize transition-all flex items-center justify-between cursor-pointer ${
                      selected
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span>{allergen}</span>
                    {selected && <Check className="w-4 h-4 text-rose-600" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Other custom allergy or ingredient exclusion:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customAllergy}
                  onChange={e => setCustomAllergy(e.target.value)}
                  placeholder="e.g., mushrooms, bell peppers, cilantro"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomAllergy())}
                />
                <button
                  type="button"
                  onClick={addCustomAllergy}
                  className="px-4 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-sm font-medium hover:opacity-90"
                >
                  Add
                </button>
              </div>

              {selectedAllergies.length === 0 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                  ✓ No allergies currently marked. You can update this anytime.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Cooking & Budget */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cooking & Budget Limits</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Customize your daily meal rhythm, time constraints, and target expenditure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Meals Per Day
                </label>
                <select
                  value={mealsPerDay}
                  onChange={e => setMealsPerDay(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                >
                  <option value={3}>3 Meals (Breakfast, Lunch, Dinner)</option>
                  <option value={4}>4 Meals (Breakfast, Lunch, Evening Snack, Dinner)</option>
                  <option value={5}>5 Meals (Breakfast, Morning Snack, Lunch, Evening Snack, Dinner)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Max Cooking Time (Weekdays)
                </label>
                <select
                  value={maxCookingTime}
                  onChange={e => setMaxCookingTime(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                >
                  <option value={15}>15 minutes (Quick & Easy)</option>
                  <option value={25}>25 minutes (Fast Home Cooking)</option>
                  <option value={35}>35 minutes (Balanced Standard)</option>
                  <option value={60}>60 minutes (Elaborate Cooking)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Budget Currency
                </label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                >
                  <option value="₹">₹ INR (India)</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Budget (Per Week)
                </label>
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={e => setBudgetAmount(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Available Kitchen Appliances
              </label>
              <div className="flex flex-wrap gap-2">
                {applianceOptions.map(app => {
                  const has = appliances.includes(app);
                  return (
                    <button
                      key={app}
                      type="button"
                      onClick={() => toggleAppliance(app)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                        has
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {app}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Leftover Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Love leftovers', 'Occasionally', 'Cook fresh only'] as const).map(pref => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setLeftoverPreference(pref)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                      leftoverPreference === pref
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate My Meal Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
