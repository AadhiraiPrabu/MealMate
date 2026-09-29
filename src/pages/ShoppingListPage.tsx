import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import {
  ShoppingCart,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  RefreshCw,
  Printer,
  Sparkles,
  DollarSign,
  Package,
  Layers,
  Edit2,
  Check
} from 'lucide-react';

export const ShoppingListPage: React.FC = () => {
  const {
    shoppingList,
    toggleShoppingItem,
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    clearPurchasedShoppingItems,
    generateShoppingListFromPlan,
    pantry,
    user
  } = useMealMate();

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('units');
  const [newItemCategory, setNewItemCategory] = useState('Vegetables');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(1);

  // Group items by category
  const categories = Array.from(new Set(shoppingList.map(i => i.category || 'Other')));

  const totalItems = shoppingList.length;
  const completedItems = shoppingList.filter(i => i.checked).length;
  const totalEstimatedCost = shoppingList.reduce((acc, i) => acc + (i.estimatedPrice || 25), 0);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addShoppingItem({
      name: newItemName.trim(),
      quantity: newItemQty,
      unit: newItemUnit,
      category: newItemCategory,
      estimatedPrice: 30
    });
    setNewItemName('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-emerald-600" />
            Shopping List
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Auto-generated from your meal plan with your pantry stock deducted
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => generateShoppingListFromPlan()}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync from Meal Plan
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Export
          </button>
        </div>
      </div>

      {/* Summary Metrics & Clean Up */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 font-medium">Grocery Progress</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {completedItems} of {totalItems} Purchased
          </p>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all"
              style={{ width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 font-medium">Estimated Bill Total</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {user?.currency || '₹'}{totalEstimatedCost}
          </p>
          <span className="text-[11px] text-slate-400">Based on standard retail ingredient costs</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Completed Items</span>
            <p className="text-xs text-slate-400 mt-0.5">Clear purchased items to tidy up</p>
          </div>
          <button
            onClick={clearPurchasedShoppingItems}
            disabled={completedItems === 0}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-40 transition-colors"
          >
            Clear Checked ({completedItems})
          </button>
        </div>
      </div>

      {/* Add Custom Grocery Item Form */}
      <form onSubmit={handleAddItem} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap sm:flex-nowrap gap-2 items-center">
        <input
          type="text"
          placeholder="Add custom item (e.g. Sourdough loaf, Almond milk)"
          value={newItemName}
          onChange={e => setNewItemName(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs min-w-44 text-slate-900 dark:text-white"
        />
        <input
          type="number"
          min={0.1}
          step="any"
          value={newItemQty}
          onChange={e => setNewItemQty(parseFloat(e.target.value) || 1)}
          className="w-16 px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs text-center font-bold"
        />
        <input
          type="text"
          placeholder="Unit"
          value={newItemUnit}
          onChange={e => setNewItemUnit(e.target.value)}
          className="w-20 px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs"
        />
        <select
          value={newItemCategory}
          onChange={e => setNewItemCategory(e.target.value)}
          className="px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs"
        >
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Grains">Grains</option>
          <option value="Dairy">Dairy</option>
          <option value="Proteins">Proteins</option>
          <option value="Spices">Spices</option>
          <option value="Oils & Condiments">Oils</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0 cursor-pointer"
        >
          + Add
        </button>
      </form>

      {/* Empty State */}
      {shoppingList.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Your shopping list is clear!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Generate ingredients from your planned meals for the week, or add custom groceries above.
          </p>
          <button
            onClick={() => generateShoppingListFromPlan()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Generate from Meal Plan
          </button>
        </div>
      ) : (
        /* Categorized Shopping Groups */
        <div className="space-y-6">
          {categories.map(category => {
            const itemsInCategory = shoppingList.filter(i => (i.category || 'Other') === category);
            if (itemsInCategory.length === 0) return null;

            return (
              <div key={category} className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    {category} ({itemsInCategory.length})
                  </h3>
                  <span className="text-xs text-slate-400">
                    Est. {user?.currency || '₹'}
                    {itemsInCategory.reduce((acc, i) => acc + (i.estimatedPrice || 20), 0)}
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {itemsInCategory.map(item => (
                    <div
                      key={item.id}
                      className="py-2.5 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => toggleShoppingItem(item.id)}
                          className="shrink-0 text-slate-400 hover:text-emerald-600 focus:outline-none"
                        >
                          {item.checked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950/60" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <span
                            onClick={() => toggleShoppingItem(item.id)}
                            className={`text-sm font-semibold cursor-pointer block truncate ${
                              item.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.recipeSource && (
                            <span className="text-[10px] text-slate-400 block truncate">
                              For: {item.recipeSource}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {editingId === item.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="any"
                              value={editQty}
                              onChange={e => setEditQty(parseFloat(e.target.value) || 1)}
                              className="w-16 px-1.5 py-1 text-xs border rounded-md text-center"
                            />
                            <button
                              onClick={() => {
                                updateShoppingItem({ ...item, quantity: editQty });
                                setEditingId(null);
                              }}
                              className="p-1 bg-emerald-600 text-white rounded-md"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span
                            onClick={() => {
                              setEditingId(item.id);
                              setEditQty(item.quantity);
                            }}
                            className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:underline"
                            title="Click to edit quantity"
                          >
                            {item.quantity} {item.unit}
                          </span>
                        )}

                        <span className="text-xs text-slate-400 w-12 text-right">
                          {user?.currency || '₹'}{item.estimatedPrice || 25}
                        </span>

                        <button
                          onClick={() => deleteShoppingItem(item.id)}
                          className="text-slate-300 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
