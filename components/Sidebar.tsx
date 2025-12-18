
import React from 'react';
import { DietaryRestriction } from '../types';

interface SidebarProps {
  currentDietary: DietaryRestriction;
  onDietaryChange: (d: DietaryRestriction) => void;
  activeTab: 'fridge' | 'recipes' | 'shopping';
  setActiveTab: (tab: 'fridge' | 'recipes' | 'shopping') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentDietary, onDietaryChange, activeTab, setActiveTab }) => {
  const dietaryOptions: { label: string; value: DietaryRestriction }[] = [
    { label: 'None', value: 'none' },
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Keto', value: 'keto' },
    { label: 'Paleo', value: 'paleo' },
    { label: 'Gluten-Free', value: 'gluten-free' },
  ];

  const NavItem = ({ icon, label, tab }: { icon: string; label: string; tab: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === tab 
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <i className={`fa-solid ${icon} w-6`}></i>
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-100 p-6 flex flex-col h-auto md:h-screen sticky top-0 z-40">
      <div className="space-y-2 flex-grow">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Menu</p>
        <NavItem icon="fa-refrigerator" label="My Fridge" tab="fridge" />
        <NavItem icon="fa-utensils" label="Recipes" tab="recipes" />
        <NavItem icon="fa-cart-shopping" label="Shopping List" tab="shopping" />

        <div className="mt-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Dietary Filters</p>
          <div className="space-y-1">
            {dietaryOptions.map((opt) => (
              <label 
                key={opt.value}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentDietary === opt.value ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="radio" 
                  name="dietary" 
                  className="hidden" 
                  checked={currentDietary === opt.value}
                  onChange={() => onDietaryChange(opt.value)}
                />
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  currentDietary === opt.value ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                }`}>
                  {currentDietary === opt.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </span>
                <span className="text-sm font-medium">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status</p>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            <i className="fa-solid fa-cloud-bolt text-emerald-500 mr-2"></i>
            Gemini Flash Active
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
