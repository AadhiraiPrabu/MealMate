import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import { PantryItem } from '../types/mealmate.ts';
import {
  Package,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  Search,
  ChefHat,
  Edit2,
  CheckCircle,
  Filter
} from 'lucide-react';

export const PantryPage: React.FC = () => {
  const { pantry, addPantryItem, updatePantryItem, deletePantryItem, setCurrentView } = useMealMate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('kg');
  const [category, setCategory] = useState<PantryItem['category']>('Vegetables');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  const now = new Date().getTime();

  // Helper to calculate days remaining
  const getDaysRemaining = (expStr: string) => {
    const exp = new Date(expStr).getTime();
    return Math.ceil((exp - now) / (1000 * 3600 * 24));
  };

  const expiringSoonItems = pantry.filter(item => {
    const days = getDaysRemaining(item.expiryDate);
    return days <= 2 && days >= 0;
  });

  const expiredItems = pantry.filter(item => {
    return getDaysRemaining(item.expiryDate) < 0;
  });

  const filteredPantry = pantry.filter(item => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));
    if (!matchSearch) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setQuantity(1);
    setUnit('kg');
    setCategory('Vegetables');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setExpiryDate(new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0]);
    setNotes('');
    setAddModalOpen(true);
  };

  const handleOpenEdit = (item: PantryItem) => {
    setEditingItem(item);
    setName(item.name);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setCategory(item.category);
    setPurchaseDate(item.purchaseDate);
    setExpiryDate(item.expiryDate);
    setNotes(item.notes || '');
    setAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updatePantryItem({
        ...editingItem,
        name: name.trim(),
        quantity,
        unit,
        category,
        purchaseDate,
        expiryDate,
        notes
      });
    } else {
      addPantryItem({
        name: name.trim(),
        quantity,
        unit,
        category,
        purchaseDate,
        expiryDate,
        notes
      });
    }
    setAddModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-emerald-600" />
            Pantry Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Keep track of fresh vegetables, grains, and spices to prevent food spoilage
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Pantry Item
        </button>
      </div>

      {/* Spoilage Warnings */}
      {expiringSoonItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-amber-900 dark:text-amber-200">
              Expiring Soon ({expiringSoonItems.length} items):
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {expiringSoonItems.map(item => (
                <span
                  key={item.id}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-semibold flex items-center gap-1.5"
                >
                  <span>{item.name}</span>
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">
                    ({getDaysRemaining(item.expiryDate)}d left)
                  </span>
                </span>
              ))}
            </div>
            <p className="text-amber-700 dark:text-amber-300 mt-2">
              Tip: Use our AI Assistant or recipe filters to discover meals incorporating these items before they expire!
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search pantry ingredients..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
        >
          <option value="all">All Categories</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Grains">Grains</option>
          <option value="Dairy">Dairy</option>
          <option value="Proteins">Proteins</option>
          <option value="Spices">Spices</option>
          <option value="Oils & Condiments">Oils & Condiments</option>
        </select>
      </div>

      {/* Pantry Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPantry.map(item => {
          const daysLeft = getDaysRemaining(item.expiryDate);
          const isExpired = daysLeft < 0;
          const isUrgent = daysLeft >= 0 && daysLeft <= 2;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                isExpired
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  : isUrgent
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isExpired
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200'
                        : isUrgent
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {isExpired
                      ? 'Expired'
                      : isUrgent
                      ? `Expires in ${daysLeft}d`
                      : `${daysLeft} days fresh`}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {item.name}
                </h3>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {item.quantity} {item.unit}
                </p>

                {item.notes && (
                  <p className="text-xs text-slate-500 italic mt-1">{item.notes}</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <button
                  onClick={() => setCurrentView('recipes')}
                  className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  Find Recipes
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    title="Edit item"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deletePantryItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Pantry Item Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingItem ? 'Edit Pantry Item' : 'Add Pantry Item'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ingredient Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sona Masoori Rice, Tomatoes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={quantity}
                    onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="kg, g, pack, L"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Proteins">Proteins</option>
                    <option value="Spices">Spices</option>
                    <option value="Oils & Condiments">Oils & Condiments</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Storage Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. In crisper drawer, airtight bin"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
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
                  {editingItem ? 'Save Updates' : 'Add to Pantry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
