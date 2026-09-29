import React, { useState } from 'react';
import { useMealMate } from '../context/MealMateContext.tsx';
import { User, Mail, Globe, Users, Heart, ShieldCheck, Edit, Settings as SettingsIcon } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, setCurrentView, logout } = useMealMate();

  const [name, setName] = useState(user?.name || 'Aadhirai');
  const [householdServings, setHouseholdServings] = useState(user?.householdServings || 2);
  const [country, setCountry] = useState(user?.country || 'India');
  const [avatar, setAvatar] = useState(
    user?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      householdServings,
      country,
      avatar
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <User className="w-7 h-7 text-emerald-600" />
            My Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal details and household preferences
          </p>
        </div>

        <button
          onClick={() => setCurrentView('settings')}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5"
        >
          <SettingsIcon className="w-4 h-4" />
          Settings & Allergies
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-md"
          />
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {user?.dietary.map(d => (
                <span key={d} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 capitalize">
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold">
            ✓ Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Household Servings
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={householdServings}
                onChange={e => setHouseholdServings(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Avatar Photo URL
              </label>
              <input
                type="url"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>

            <button
              type="button"
              onClick={logout}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
