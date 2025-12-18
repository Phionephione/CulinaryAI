
import React, { useState } from 'react';
import { Recipe, Ingredient } from '../types';
import { geminiService } from '../geminiService';

interface CookingModeProps {
  recipe: Recipe;
  onClose: () => void;
  onAddToShoppingList: (name: string, quantity: string) => void;
}

const CookingMode: React.FC<CookingModeProps> = ({ recipe, onClose, onAddToShoppingList }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [view, setView] = useState<'ingredients' | 'steps'>('ingredients');
  const [isReading, setIsReading] = useState(false);

  const handleNext = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReadStep = async () => {
    setIsReading(true);
    await geminiService.speakText(recipe.steps[currentStep]);
    setIsReading(false);
  };

  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
      <nav className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
          <i className="fa-solid fa-xmark text-xl text-slate-500"></i>
        </button>
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setView('ingredients')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'ingredients' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
          >
            Checklist
          </button>
          <button 
            onClick={() => setView('steps')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'steps' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'}`}
          >
            Cooking
          </button>
        </div>
        <div className="w-10"></div>
      </nav>

      <div className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          {view === 'ingredients' ? (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-4xl font-black text-slate-900 mb-2">{recipe.title}</h2>
              <p className="text-slate-500 mb-8 flex items-center">
                <i className="fa-solid fa-circle-check text-emerald-500 mr-2"></i>
                Verify your ingredients before you start
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                    <div>
                      <h4 className="font-bold text-xl text-slate-800">{ing.name}</h4>
                      <p className="text-slate-500 font-medium">{ing.quantity}</p>
                    </div>
                    <button 
                      onClick={() => onAddToShoppingList(ing.name, ing.quantity)}
                      className="w-12 h-12 rounded-full border-2 border-slate-200 text-slate-400 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all flex items-center justify-center"
                      title="Add to shopping list"
                    >
                      <i className="fa-solid fa-plus text-lg"></i>
                    </button>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setView('steps')}
                className="w-full mt-12 py-5 bg-emerald-600 text-white rounded-3xl font-black text-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Let's Start Cooking
              </button>
            </div>
          ) : (
            <div className="flex flex-col min-h-[70vh] animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="mb-10 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                  Step {currentStep + 1} of {recipe.steps.length}
                </span>
                <button 
                  onClick={handleReadStep}
                  disabled={isReading}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isReading ? 'bg-slate-100 text-slate-300' : 'bg-orange-100 text-orange-600 hover:scale-110 shadow-lg shadow-orange-100'}`}
                >
                  <i className={`fa-solid ${isReading ? 'fa-volume-high animate-pulse' : 'fa-volume-high'} text-2xl`}></i>
                </button>
              </div>

              <div className="flex-1 flex items-center">
                <p className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                  {recipe.steps[currentStep]}
                </p>
              </div>

              <div className="mt-12 flex space-x-4">
                <button 
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="w-20 h-20 rounded-3xl border-4 border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                  <i className="fa-solid fa-chevron-left text-2xl"></i>
                </button>
                <button 
                  onClick={handleNext}
                  disabled={currentStep === recipe.steps.length - 1}
                  className="flex-1 h-20 rounded-3xl bg-slate-900 text-white flex items-center justify-center space-x-4 font-black text-2xl hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-30"
                >
                  <span>Next Step</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
              
              {currentStep === recipe.steps.length - 1 && (
                <button 
                  onClick={onClose}
                  className="mt-6 w-full py-5 border-4 border-emerald-500 text-emerald-600 rounded-3xl font-black text-xl hover:bg-emerald-50 transition-all flex items-center justify-center space-x-3"
                >
                  <i className="fa-solid fa-check-circle"></i>
                  <span>Finish Recipe</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookingMode;
