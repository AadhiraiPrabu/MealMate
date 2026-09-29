import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import { DietaryType } from '../types/mealmate.ts';
import {
  Settings as SettingsIcon,
  AlertTriangle,
  Bell,
  Moon,
  Sun,
  Shield,
  Download,
  Trash2,
  RefreshCw,
  Check
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    user,
    updateProfile,
    darkMode,
    toggleDarkMode,
    resetToDemoData,
    recipes,
    mealPlan,
    pantry,
    shoppingList,
    leftovers
  } = useMealMate();

  const [dietary, setDietary] = useState<DietaryType[]>(user?.dietary || ['vegetarian']);
  const [allergies, setAllergies] = useState<string[]>(user?.allergies || []);
  const [customAllergy, setCustomAllergy] = useState('');
  const [notifications, setNotifications] = useState(
    user?.notifications || {
      breakfastReminder: true,
      lunchReminder: true,
      dinnerReminder: true,
      mealPrepReminder: true,
      groceryReminder: true,
      expiryReminder: true
    }
  );
  const [saved, setSaved] = useState(false);

  const allergyList = [
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

  const dietaryList: DietaryType[] = [
    'vegetarian',
    'vegan',
    'eggetarian',
    'non-vegetarian',
    'pescatarian',
    'jain',
    'high-protein',
    'low-carb'
  ];

  const toggleAllergy = (a: string) => {
    setAllergies(prev =>
      prev.includes(a) ? prev.filter(item => item !== a) : [...prev, a]
    );
  };

  const addCustom = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim().toLowerCase())) {
      setAllergies(prev => [...prev, customAllergy.trim().toLowerCase()]);
      setCustomAllergy('');
    }
  };

  const toggleDiet = (d: DietaryType) => {
    setDietary(prev => (prev.includes(d) ? prev.filter(i => i !== d) : [...prev, d]));
  };

  const handleSave = () => {
    updateProfile({
      dietary,
      allergies,
      notifications
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const exportAllData = () => {
    const data = {
      user,
      recipes,
      mealPlan,
      pantry,
      shoppingList,
      leftovers,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mealmate-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-emerald-600" />
            Preferences & Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Control allergies, dietary profiles, reminders, appearance, and data privacy
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
        >
          Save All Changes
        </button>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold">
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Allergies & Exclusions Editor */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-rose-600">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Allergens & Exclusions (Strict Filter)
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          Recipes and meal recommendations matching these allergens are completely excluded from auto-planning and AI suggestions.
        </p>

        <div className="flex flex-wrap gap-2">
          {allergyList.map(a => {
            const has = allergies.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => toggleAllergy(a)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                  has
                    ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {has && '✓ '}
                {a}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 max-w-md pt-2">
          <input
            type="text"
            value={customAllergy}
            onChange={e => setCustomAllergy(e.target.value)}
            placeholder="Add custom exclusion (e.g. mushrooms)..."
            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs"
          />
          <button
            type="button"
            onClick={addCustom}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-xl"
          >
            Add
          </button>
        </div>
      </div>

      {/* Dietary Choices */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Dietary Preferences
        </h2>
        <div className="flex flex-wrap gap-2">
          {dietaryList.map(d => {
            const active = dietary.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDiet(d)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {active && '✓ '}
                {d}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Reminders */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Daily Reminders & Alerts
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { key: 'breakfastReminder' as const, label: 'Breakfast reminder (8:00 AM)' },
            { key: 'lunchReminder' as const, label: 'Lunch reminder (1:00 PM)' },
            { key: 'dinnerReminder' as const, label: 'Dinner reminder (7:30 PM)' },
            { key: 'mealPrepReminder' as const, label: 'Weekend batch meal prep reminder' },
            { key: 'groceryReminder' as const, label: 'Grocery restock alert' },
            { key: 'expiryReminder' as const, label: 'Pantry ingredients expiring in 48h' }
          ].map(rem => (
            <label key={rem.key} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications[rem.key]}
                onChange={e =>
                  setNotifications(prev => ({ ...prev, [rem.key]: e.target.checked }))
                }
                className="w-4 h-4 accent-emerald-600 rounded-sm"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{rem.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Theme & Data Management */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Appearance & Data Controls
        </h2>

        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              Color Theme
            </span>
            <span className="text-xs text-slate-500">Toggle between Light and Dark interface mode</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
          <div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
              Export Backup
            </span>
            <span className="text-xs text-slate-500">Download complete meal plans, recipes, and pantry as JSON</span>
          </div>
          <button
            onClick={exportAllData}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400 block">
              Reset Demo State
            </span>
            <span className="text-xs text-slate-500">Restore default sample recipes, weekly plan, and pantry</span>
          </div>
          <button
            onClick={() => {
              if (confirm('Reset all meal plans and pantry items to fresh sample demo data?')) {
                resetToDemoData();
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            Reset State
          </button>
        </div>
      </div>
    </div>
  );
};
