import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import { MealPlanEntry, MealType, Recipe } from '../types/mealmate.ts';
import confetti from 'canvas-confetti';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  MoveRight,
  Search,
  Filter,
  ArrowRight,
  RotateCcw,
  Check
} from 'lucide-react';

export const MealPlannerPage: React.FC = () => {
  const {
    user,
    mealPlan,
    recipes,
    addMealToPlan,
    removeMealFromPlan,
    updateMealStatus,
    moveMealInPlan,
    copyMealInPlan,
    copyDayMeals,
    copyWeekMeals,
    clearPlanForDate,
    generateAutoMealPlan,
    setCurrentView
  } = useMealMate();

  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Add Meal Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; mealType: MealType } | null>(null);
  const [recipeSearch, setRecipeSearch] = useState('');
  const [selectedMealTypeFilter, setSelectedMealTypeFilter] = useState<string>('all');
  const [selectedServings, setSelectedServings] = useState<number>(user?.householdServings || 2);

  // Generate Plan Modal State
  const [genModalOpen, setGenModalOpen] = useState(false);
  const [genDaysCount, setGenDaysCount] = useState(7);
  const [genCuisine, setGenCuisine] = useState('Any');

  // Copy Day / Move Meal Modal State
  const [moveModalData, setMoveModalData] = useState<{ planId: string; currentMealType: MealType; currentDate: string } | null>(null);
  const [targetMoveDate, setTargetMoveDate] = useState('');
  const [targetMoveSlot, setTargetMoveSlot] = useState<MealType>('lunch');

  // Calculate week days based on currentDate
  const getWeekDates = (base: Date): Date[] => {
    const d = new Date(base);
    const day = d.getDay();
    // Normalize to Monday as start of week
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push(nextDay);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);

  const prevPeriod = () => {
    const next = new Date(currentDate);
    if (viewMode === 'day') next.setDate(next.getDate() - 1);
    else if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else next.setMonth(next.getMonth() - 1);
    setCurrentDate(next);
  };

  const nextPeriod = () => {
    const next = new Date(currentDate);
    if (viewMode === 'day') next.setDate(next.getDate() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const mealSlots: { type: MealType; label: string; time: string }[] = [
    { type: 'breakfast', label: 'Breakfast', time: '8:00 AM' },
    { type: 'morning_snack', label: 'Morning Snack', time: '11:00 AM' },
    { type: 'lunch', label: 'Lunch', time: '1:00 PM' },
    { type: 'evening_snack', label: 'Evening Snack', time: '5:00 PM' },
    { type: 'dinner', label: 'Dinner', time: '8:00 PM' }
  ];

  const handleOpenAdd = (dateStr: string, mealType: MealType) => {
    setSelectedSlot({ date: dateStr, mealType });
    setRecipeSearch('');
    setSelectedMealTypeFilter(mealType);
    setSelectedServings(user?.householdServings || 2);
    setAddModalOpen(true);
  };

  const handleSelectRecipe = (recipeId: string) => {
    if (!selectedSlot) return;
    addMealToPlan(selectedSlot.date, selectedSlot.mealType, recipeId, selectedServings);
    setAddModalOpen(false);
  };

  const handleToggleComplete = (planId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'planned' : 'completed';
    updateMealStatus(planId, newStatus);
    if (newStatus === 'completed') {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch (e) { /* ignore */ }
    }
  };

  const handleToggleSkip = (planId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'skipped' ? 'planned' : 'skipped';
    updateMealStatus(planId, newStatus);
  };

  const handleRunAutoPlan = () => {
    const start = weekDates[0].toISOString().split('T')[0];
    generateAutoMealPlan({
      startDate: start,
      daysCount: genDaysCount,
      cuisine: genCuisine
    });
    setGenModalOpen(false);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 }
      });
    } catch (e) { /* ignore */ }
  };

  // Filter recipes for Add Modal
  const filteredRecipes = recipes.filter(r => {
    // Allergy exclusion
    if (user?.allergies && user.allergies.some(a => r.allergens.includes(a))) {
      return false;
    }
    // Search query
    const matchSearch =
      r.title.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(recipeSearch.toLowerCase()) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(recipeSearch.toLowerCase()));

    // Meal type
    if (selectedMealTypeFilter !== 'all' && !r.mealTypes.includes(selectedMealTypeFilter as any)) {
      return false;
    }

    return matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-emerald-600" />
            Meal Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Plan, customize, and track your daily nutrition with ease
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'day' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'week' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'month' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Month
            </button>
          </div>

          <button
            onClick={() => setGenModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Auto-Generate Plan
          </button>
        </div>
      </div>

      {/* Date Range Navigation Toolbar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={prevPeriod}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          >
            Today
          </button>
          <button
            onClick={nextPeriod}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            title="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          {viewMode === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          {viewMode === 'week' && (
            <span>
              {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              const nextMon = new Date(weekDates[0]);
              nextMon.setDate(nextMon.getDate() + 7);
              copyWeekMeals(weekDates[0].toISOString().split('T')[0], nextMon.toISOString().split('T')[0]);
              alert('Copied this entire week to next week successfully!');
            }}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
            Duplicate Week
          </button>
        </div>
      </div>

      {/* VIEW: WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3.5">
          {weekDates.map((dayDate, dayIdx) => {
            const dateStr = dayDate.toISOString().split('T')[0];
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const dayMeals = mealPlan.filter(m => m.date === dateStr);

            return (
              <div
                key={dateStr}
                className={`flex flex-col rounded-2xl border transition-all ${
                  isToday
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700/80 shadow-xs'
                }`}
              >
                {/* Day Header */}
                <div className={`p-3 border-b flex items-center justify-between ${
                  isToday
                    ? 'bg-emerald-600 text-white rounded-t-xl'
                    : 'border-slate-100 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-800/60 rounded-t-xl'
                }`}>
                  <div>
                    <span className={`block text-xs font-bold uppercase tracking-wider ${
                      isToday ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {dayDate.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className={`text-base font-extrabold ${isToday ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {dayDate.getDate()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const target = prompt('Enter target date (YYYY-MM-DD) to copy meals to:', dateStr);
                        if (target && target !== dateStr) copyDayMeals(dateStr, target);
                      }}
                      title="Copy this day's meals"
                      className={`p-1 rounded-md transition-colors ${
                        isToday ? 'text-emerald-100 hover:bg-emerald-700' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {dayMeals.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm(`Clear all meals for ${dayDate.toLocaleDateString('en-US', { weekday: 'short' })}?`)) {
                            clearPlanForDate(dateStr);
                          }
                        }}
                        title="Clear day"
                        className={`p-1 rounded-md transition-colors ${
                          isToday ? 'text-emerald-100 hover:bg-emerald-700' : 'text-slate-400 hover:text-rose-600'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Meal Slots in Day Column */}
                <div className="p-2 space-y-2 flex-1 flex flex-col justify-between">
                  {mealSlots.map(slot => {
                    const meal = dayMeals.find(m => m.mealType === slot.type);
                    const recipe = meal ? recipes.find(r => r.id === meal.recipeId) : null;
                    const isCompleted = meal?.status === 'completed';
                    const isSkipped = meal?.status === 'skipped';

                    return (
                      <div
                        key={slot.type}
                        className={`p-2 rounded-xl border text-xs transition-all relative group ${
                          meal
                            ? isCompleted
                              ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-80'
                              : isSkipped
                              ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 opacity-70'
                              : 'bg-white dark:bg-slate-700/60 border-slate-200 dark:border-slate-600/70 shadow-xs hover:border-emerald-500'
                            : 'border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-400/80 bg-slate-50/30 dark:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {slot.label}
                          </span>
                          {meal && (
                            <span className="text-[9px] text-slate-400">
                              {meal.calories || 320} kcal
                            </span>
                          )}
                        </div>

                        {meal ? (
                          <div className="space-y-1.5">
                            <p
                              onClick={() => recipe && setCurrentView('recipe_detail', { recipeId: recipe.id })}
                              className={`font-semibold line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors ${
                                isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                              }`}
                            >
                              {meal.recipeTitle}
                            </p>

                            {/* Card action pills */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50 text-[10px]">
                              <button
                                onClick={() => handleToggleComplete(meal.id, meal.status)}
                                className={`px-1.5 py-0.5 rounded-md font-medium transition-colors ${
                                  isCompleted
                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                    : 'text-slate-500 hover:text-emerald-600'
                                }`}
                              >
                                {isCompleted ? '✓ Done' : 'Eat'}
                              </button>

                              <button
                                onClick={() => handleToggleSkip(meal.id, meal.status)}
                                className={`px-1.5 py-0.5 rounded-md font-medium transition-colors ${
                                  isSkipped
                                    ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                                    : 'text-slate-400 hover:text-rose-600'
                                }`}
                              >
                                Skip
                              </button>

                              <button
                                onClick={() => removeMealFromPlan(meal.id)}
                                title="Remove meal"
                                className="text-slate-400 hover:text-rose-600 p-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenAdd(dateStr, slot.type)}
                            className="w-full py-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: DAY VIEW */}
      {viewMode === 'day' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>

            <div className="space-y-3">
              {mealSlots.map(slot => {
                const dateStr = currentDate.toISOString().split('T')[0];
                const meal = mealPlan.find(m => m.date === dateStr && m.mealType === slot.type);
                const recipe = meal ? recipes.find(r => r.id === meal.recipeId) : null;
                const isCompleted = meal?.status === 'completed';

                return (
                  <div
                    key={slot.type}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      meal
                        ? 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-700'
                        : 'border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-20 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {slot.label}
                      </div>

                      {meal ? (
                        <div className="flex items-center gap-3">
                          {meal.recipeImage && (
                            <img
                              src={meal.recipeImage}
                              alt={meal.recipeTitle}
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          )}
                          <div>
                            <p
                              onClick={() => recipe && setCurrentView('recipe_detail', { recipeId: recipe.id })}
                              className={`text-sm font-bold cursor-pointer hover:text-emerald-600 ${
                                isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {meal.recipeTitle}
                            </p>
                            <p className="text-xs text-slate-500">
                              {meal.calories || 320} kcal • {meal.protein || 10}g Protein • {meal.servings} servings
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No meal assigned</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {meal ? (
                        <>
                          <button
                            onClick={() => handleToggleComplete(meal.id, meal.status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white'
                            }`}
                          >
                            {isCompleted ? 'Completed' : 'Mark Eaten'}
                          </button>
                          <button
                            onClick={() => removeMealFromPlan(meal.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenAdd(dateStr, slot.type)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1 hover:bg-emerald-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Dish
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase py-2">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => {
              const d = new Date(currentDate);
              d.setDate(i + 1);
              const dateStr = d.toISOString().split('T')[0];
              const meals = mealPlan.filter(m => m.date === dateStr);
              return (
                <div
                  key={i}
                  onClick={() => {
                    setCurrentDate(d);
                    setViewMode('day');
                  }}
                  className="min-h-24 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition-all cursor-pointer flex flex-col justify-between"
                >
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{i + 1}</span>
                  <div className="space-y-0.5">
                    {meals.slice(0, 2).map(m => (
                      <span key={m.id} className="block text-[10px] truncate bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded-sm">
                        {m.recipeTitle}
                      </span>
                    ))}
                    {meals.length > 2 && (
                      <span className="text-[9px] text-slate-400">+{meals.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD RECIPE TO SLOT MODAL */}
      {addModalOpen && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                  Add Meal to {selectedSlot.mealType.replace('_', ' ')}
                </h3>
                <p className="text-xs text-slate-500">{selectedSlot.date}</p>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Search and Filters */}
            <div className="pt-4 pb-2 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={recipeSearch}
                  onChange={e => setRecipeSearch(e.target.value)}
                  placeholder="Search recipes by name, ingredient, cuisine..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Meal Type:</span>
                  <select
                    value={selectedMealTypeFilter}
                    onChange={e => setSelectedMealTypeFilter(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  >
                    <option value="all">All Types</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="morning_snack">Snack</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Servings:</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={selectedServings}
                    onChange={e => setSelectedServings(parseInt(e.target.value, 10) || 1)}
                    className="w-14 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-center font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Recipe List */}
            <div className="overflow-y-auto space-y-2.5 py-3 flex-1">
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500">
                  No recipes found matching your filters.
                </div>
              ) : (
                filteredRecipes.map(recipe => (
                  <div
                    key={recipe.id}
                    onClick={() => handleSelectRecipe(recipe.id)}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600">
                          {recipe.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span>{recipe.cuisine}</span>
                          <span>•</span>
                          <span>{recipe.nutrition.calories} kcal</span>
                          <span>•</span>
                          <span>{recipe.totalTimeMinutes}m</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 group-hover:bg-emerald-700 text-white text-xs font-semibold shrink-0"
                    >
                      Select
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* AUTO-GENERATE MODAL */}
      {genModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Auto-Generate Meal Plan
              </h3>
              <button onClick={() => setGenModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              MealMate will generate a balanced, nutritious plan strictly respecting your dietary choices ({user?.dietary.join(', ')}) and zero allergens.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Plan Duration
                </label>
                <select
                  value={genDaysCount}
                  onChange={e => setGenDaysCount(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                >
                  <option value={3}>Next 3 Days</option>
                  <option value={5}>Next 5 Days (Work Week)</option>
                  <option value={7}>Full 7 Days (Complete Week)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cuisine Focus
                </label>
                <select
                  value={genCuisine}
                  onChange={e => setGenCuisine(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                >
                  <option value="Any">Balanced Variety (All Cuisines)</option>
                  <option value="South Indian">South Indian Special</option>
                  <option value="North Indian">North Indian Delights</option>
                  <option value="Mediterranean">Mediterranean Clean</option>
                  <option value="Asian">Asian Wok & Curries</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setGenModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRunAutoPlan}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20"
              >
                Generate Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
