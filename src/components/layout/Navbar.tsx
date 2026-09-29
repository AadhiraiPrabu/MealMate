import React, { useState } from 'react';
import { useMealMate, AppView } from '../../context/MealMateContext.tsx';
import {
  Calendar,
  BookOpen,
  ShoppingCart,
  Package,
  Sparkles,
  PieChart,
  DollarSign,
  History,
  Heart,
  ChefHat,
  Moon,
  Sun,
  User,
  LogOut,
  Menu,
  X,
  Plus,
  RefreshCw,
  Clock,
  Layers,
  Settings as SettingsIcon,
  ShieldAlert
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    user,
    isAuthenticated,
    isDemoMode,
    logout,
    darkMode,
    toggleDarkMode,
    resetToDemoData,
    pantry,
    mealPlan
  } = useMealMate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // Compute expiring pantry items count (expires in next 2 days)
  const expiringCount = pantry.filter(item => {
    const exp = new Date(item.expiryDate).getTime();
    const now = new Date().getTime();
    const diffDays = (exp - now) / (1000 * 3600 * 24);
    return diffDays <= 2 && diffDays >= -1;
  }).length;

  const navItems: { view: AppView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: <PieChart className="w-4 h-4" /> },
    { view: 'planner', label: 'Planner', icon: <Calendar className="w-4 h-4" /> },
    { view: 'recipes', label: 'Recipes', icon: <BookOpen className="w-4 h-4" /> },
    { view: 'shopping', label: 'Shopping', icon: <ShoppingCart className="w-4 h-4" /> },
    { view: 'pantry', label: 'Pantry', icon: <Package className="w-4 h-4" />, badge: expiringCount > 0 ? expiringCount : undefined },
    { view: 'leftovers', label: 'Leftovers', icon: <RefreshCw className="w-4 h-4" /> },
    { view: 'meal_prep', label: 'Meal Prep', icon: <Layers className="w-4 h-4" /> },
    { view: 'nutrition', label: 'Nutrition', icon: <PieChart className="w-4 h-4" /> },
    { view: 'budget', label: 'Budget', icon: <DollarSign className="w-4 h-4" /> },
    { view: 'ai_assistant', label: 'AI Assistant', icon: <Sparkles className="w-4 h-4 text-emerald-500" /> }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView(isAuthenticated ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Meal<span className="text-emerald-600 dark:text-emerald-400">Mate</span>
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-600 dark:text-slate-300">
                  Plan • Cook • Nourish
                </span>
              </div>
            </button>

            {/* Demo Mode Badge */}
            {isDemoMode && (
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                Demo Mode
              </span>
            )}
          </div>

          {/* Desktop Nav Items */}
          {isAuthenticated && (
            <nav className="hidden xl:flex items-center space-x-1">
              {navItems.map(item => {
                const active = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => setCurrentView(item.view)}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      active
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Quick Add Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setQuickAddOpen(!quickAddOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add</span>
                  </button>

                  {quickAddOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95">
                      <button
                        onClick={() => {
                          setQuickAddOpen(false);
                          setCurrentView('add_recipe');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5"
                      >
                        <ChefHat className="w-4 h-4 text-emerald-500" />
                        Create New Recipe
                      </button>
                      <button
                        onClick={() => {
                          setQuickAddOpen(false);
                          setCurrentView('pantry');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5"
                      >
                        <Package className="w-4 h-4 text-blue-500" />
                        Add Pantry Item
                      </button>
                      <button
                        onClick={() => {
                          setQuickAddOpen(false);
                          setCurrentView('leftovers');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5"
                      >
                        <RefreshCw className="w-4 h-4 text-amber-500" />
                        Log Leftovers
                      </button>
                      <button
                        onClick={() => {
                          setQuickAddOpen(false);
                          setCurrentView('shopping');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2.5"
                      >
                        <ShoppingCart className="w-4 h-4 text-purple-500" />
                        Add to Grocery List
                      </button>
                    </div>
                  )}
                </div>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:ring-2 hover:ring-emerald-500/30 transition-all"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={user?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentView('profile');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        My Profile
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentView('settings');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                      >
                        <SettingsIcon className="w-4 h-4 text-slate-500" />
                        Preferences & Settings
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentView('favorites');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        Favorite Recipes
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setCurrentView('history');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 flex items-center gap-2"
                      >
                        <History className="w-4 h-4 text-indigo-500" />
                        Meal History
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          resetToDemoData();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset to Sample Demo Data
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('login')}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => setCurrentView('signup')}
                  className="px-3.5 py-1.5 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu hamburger toggle */}
            {isAuthenticated && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile slide-out navigation */}
      {mobileMenuOpen && isAuthenticated && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-1">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3">
            {navItems.map(item => {
              const active = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    setCurrentView(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>MealMate v2.4</span>
            <button
              onClick={() => {
                resetToDemoData();
                setMobileMenuOpen(false);
              }}
              className="text-amber-600 font-medium"
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
