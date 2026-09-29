import React from 'react';
import { useMealMate } from '../../context/MealMateContext.tsx';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  ShoppingCart,
  User
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, isAuthenticated } = useMealMate();

  if (!isAuthenticated) return null;

  const items = [
    { view: 'dashboard' as const, label: 'Home', icon: LayoutDashboard },
    { view: 'planner' as const, label: 'Planner', icon: Calendar },
    { view: 'recipes' as const, label: 'Recipes', icon: BookOpen },
    { view: 'shopping' as const, label: 'Shopping', icon: ShoppingCart },
    { view: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {items.map(item => {
          const Icon = item.icon;
          const active = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                active
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-full ${active ? 'bg-emerald-50 dark:bg-emerald-950/60' : ''}`}>
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className="text-[11px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
