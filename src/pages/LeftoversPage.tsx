import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import { LeftoverItem } from '../types/mealmate.ts';
import {
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  ChefHat,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export const LeftoversPage: React.FC = () => {
  const { leftovers, addLeftover, markLeftoverUsed, deleteLeftover, recipes, setCurrentView } = useMealMate();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('2 cups (~350g)');
  const [expiryDays, setExpiryDays] = useState(2);
  const [reheatingTip, setReheatingTip] = useState('');

  const activeLeftovers = leftovers.filter(l => !l.used);
  const usedLeftovers = leftovers.filter(l => l.used);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const storageDate = new Date().toISOString().split('T')[0];
    const expDate = new Date(Date.now() + expiryDays * 24 * 3600 * 1000).toISOString().split('T')[0];

    addLeftover({
      name: name.trim(),
      quantity,
      storageDate,
      expiryDate: expDate,
      reheatingTip: reheatingTip || 'Keep refrigerated in airtight glass container. Reheat until steaming hot.'
    });

    setName('');
    setAddModalOpen(false);
  };

  // Recipe match suggestions based on active leftovers
  const getSuggestions = (leftoverName: string) => {
    const l = leftoverName.toLowerCase();
    if (l.includes('rice')) {
      return recipes.filter(r => r.id === 'rec-6' || r.id === 'rec-7'); // Lemon rice, Curd rice
    }
    if (l.includes('dal') || l.includes('lentil')) {
      return recipes.filter(r => r.id === 'rec-9' || r.id === 'rec-19'); // Dal tadka / chilla
    }
    if (l.includes('paneer')) {
      return recipes.filter(r => r.id === 'rec-10' || r.id === 'rec-11'); // Paneer dishes
    }
    if (l.includes('chicken')) {
      return recipes.filter(r => r.id === 'rec-14' || r.id === 'rec-15' || r.id === 'rec-31');
    }
    return recipes.slice(0, 2);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <RefreshCw className="w-7 h-7 text-emerald-600" />
            Leftovers Repurposing Hub
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Transform extra cooked food into brand-new meals with zero waste
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          I Have Leftovers
        </button>
      </div>

      {/* Food Safety Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong className="font-bold">Food Safety Best Practices: </strong>
          Always cool cooked food within 2 hours, store in sealed airtight containers below 4°C (40°F), and consume within 2–3 days. Reheat foods until steaming hot throughout (at least 74°C / 165°F) before eating.
        </div>
      </div>

      {/* Active Leftovers */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Active Leftovers in Fridge ({activeLeftovers.length})</span>
        </h2>

        {activeLeftovers.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No active leftovers recorded!
            </p>
            <p className="text-xs text-slate-500">
              Cooked extra rice or curry? Click "I Have Leftovers" to log it and get delicious transformation recipes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeLeftovers.map(item => {
              const matchedRecipes = getSuggestions(item.name);

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => deleteLeftover(item.id)}
                        className="text-slate-400 hover:text-rose-500"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h3>

                    {item.reheatingTip && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-xl">
                        💡 {item.reheatingTip}
                      </p>
                    )}
                  </div>

                  {/* Recipe Transform Ideas */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Repurpose into:
                    </span>
                    <div className="space-y-1.5">
                      {matchedRecipes.map(rec => (
                        <div
                          key={rec.id}
                          onClick={() => setCurrentView('recipe_detail', { recipeId: rec.id })}
                          className="p-2 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <img src={rec.image} alt={rec.title} className="w-8 h-8 rounded-lg object-cover" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.title}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => markLeftoverUsed(item.id)}
                      className="w-full mt-2 py-1.5 rounded-xl border border-emerald-500 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-xs font-bold transition-colors"
                    >
                      ✓ Mark as Used
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Used Leftovers History */}
      {usedLeftovers.length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-500 mb-3">Recently Repurposed Food</h3>
          <div className="space-y-2">
            {usedLeftovers.map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="line-through font-medium">{item.name} ({item.quantity})</span>
                </div>
                <span>Successfully consumed</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Leftover Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Log Leftover Food
            </h3>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Food Item *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Cooked Rice, Dal Tadka, Grilled Veggies"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Quantity
                </label>
                <input
                  type="text"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="e.g. 2 cups (~350g), 4 rotis"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Safe Shelf Life in Fridge (Days)
                </label>
                <select
                  value={expiryDays}
                  onChange={e => setExpiryDays(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                >
                  <option value={1}>1 Day (Consume Tomorrow)</option>
                  <option value={2}>2 Days</option>
                  <option value={3}>3 Days (Maximum standard safety)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reheating or Repurposing Tip (Optional)
                </label>
                <input
                  type="text"
                  value={reheatingTip}
                  onChange={e => setReheatingTip(e.target.value)}
                  placeholder="e.g. Sprinkle water before microwave; mix into parathas"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/20"
                >
                  Save Leftover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
