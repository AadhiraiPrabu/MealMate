/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MealMateProvider, useMealMate, AppView } from './context/MealMateContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { MobileBottomNav } from './components/layout/MobileBottomNav.tsx';
import { Footer } from './components/layout/Footer.tsx';

// Pages
import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage, SignupPage, ForgotPasswordPage } from './pages/AuthPages.tsx';
import { OnboardingPage } from './pages/OnboardingPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { MealPlannerPage } from './pages/MealPlannerPage.tsx';
import { RecipeLibraryPage } from './pages/RecipeLibraryPage.tsx';
import { RecipeDetailPage } from './pages/RecipeDetailPage.tsx';
import { RecipeFormPage } from './pages/RecipeFormPage.tsx';
import { ShoppingListPage } from './pages/ShoppingListPage.tsx';
import { PantryPage } from './pages/PantryPage.tsx';
import { LeftoversPage } from './pages/LeftoversPage.tsx';
import { MealPrepPage } from './pages/MealPrepPage.tsx';
import { NutritionDashboardPage } from './pages/NutritionDashboardPage.tsx';
import { BudgetPage } from './pages/BudgetPage.tsx';
import { MealHistoryPage } from './pages/MealHistoryPage.tsx';
import { FavoritesPage } from './pages/FavoritesPage.tsx';
import { AIAssistantPage } from './pages/AIAssistantPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

const AppContent: React.FC = () => {
  const { currentView, isAuthenticated } = useMealMate();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'forgot_password':
        return <ForgotPasswordPage />;
      case 'onboarding':
        return <OnboardingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'planner':
        return <MealPlannerPage />;
      case 'recipes':
        return <RecipeLibraryPage />;
      case 'recipe_detail':
        return <RecipeDetailPage />;
      case 'add_recipe':
      case 'edit_recipe':
        return <RecipeFormPage />;
      case 'shopping':
        return <ShoppingListPage />;
      case 'pantry':
        return <PantryPage />;
      case 'leftovers':
        return <LeftoversPage />;
      case 'meal_prep':
        return <MealPrepPage />;
      case 'nutrition':
        return <NutritionDashboardPage />;
      case 'budget':
        return <BudgetPage />;
      case 'history':
        return <MealHistoryPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'ai_assistant':
        return <AIAssistantPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return isAuthenticated ? <DashboardPage /> : <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors pb-16 xl:pb-0">
      <Navbar />
      <main className="flex-1">
        {renderView()}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <MealMateProvider>
      <AppContent />
    </MealMateProvider>
  );
}
