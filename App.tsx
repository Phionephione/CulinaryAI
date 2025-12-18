
import React, { useState, useEffect, useCallback } from 'react';
import { geminiService } from './geminiService';
import { Recipe, DietaryRestriction, ShoppingItem, Difficulty } from './types';
import Sidebar from './components/Sidebar';
import CameraCapture from './components/CameraCapture';
import RecipeGrid from './components/RecipeGrid';
import CookingMode from './components/CookingMode';
import ShoppingList from './components/ShoppingList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'fridge' | 'recipes' | 'shopping'>('fridge');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [dietary, setDietary] = useState<DietaryRestriction>('none');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

  const handleImageCapture = async (base64: string) => {
    setIsAnalyzing(true);
    const detected = await geminiService.analyzeFridgeImage(base64);
    setIngredients(detected);
    setIsAnalyzing(false);
    setActiveTab('recipes');
  };

  const fetchRecipes = useCallback(async () => {
    if (ingredients.length === 0) return;
    setIsAnalyzing(true);
    const suggested = await geminiService.generateRecipes(ingredients, dietary);
    setRecipes(suggested);
    setIsAnalyzing(false);
  }, [ingredients, dietary]);

  useEffect(() => {
    if (ingredients.length > 0) {
      fetchRecipes();
    }
  }, [ingredients, dietary, fetchRecipes]);

  const addToShoppingList = (name: string, quantity: string) => {
    const newItem: ShoppingItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      quantity,
      addedAt: Date.now()
    };
    setShoppingList(prev => [...prev, newItem]);
  };

  const removeFromShoppingList = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar 
        currentDietary={dietary} 
        onDietaryChange={setDietary} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">CulinaryAI</h1>
            <p className="text-slate-500">Your intelligent fridge companion</p>
          </div>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">AI Kitchen Ready</span>
          </div>
        </header>

        {isAnalyzing && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-sm">
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 animate-spin">
                <i className="fa-solid fa-circle-notch text-3xl"></i>
              </div>
              <h2 className="text-xl font-bold mb-2">Analyzing your Fridge...</h2>
              <p className="text-slate-500">Our AI is identifying ingredients to suggest the perfect meal for you.</p>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {activeTab === 'fridge' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-4">Upload a Photo of your Fridge</h3>
                <CameraCapture onCapture={handleImageCapture} />
              </div>
              
              {ingredients.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-semibold mb-4">Ingredients Detected</h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ing, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                        {ing}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => setIngredients([])}
                    className="mt-6 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    <i className="fa-solid fa-trash-can mr-2"></i> Clear and try again
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recipes' && (
            <div className="space-y-6">
              {recipes.length > 0 ? (
                <RecipeGrid 
                  recipes={recipes} 
                  onSelectRecipe={setSelectedRecipe} 
                />
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                  <div className="text-slate-300 mb-4">
                    <i className="fa-solid fa-bowl-food text-6xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700">No recipes yet</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2">Upload a fridge photo to see some culinary magic happen!</p>
                  <button 
                    onClick={() => setActiveTab('fridge')}
                    className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Go to Fridge
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shopping' && (
            <ShoppingList 
              items={shoppingList} 
              onRemove={removeFromShoppingList}
              onClear={() => setShoppingList([])}
            />
          )}
        </div>
      </main>

      {selectedRecipe && (
        <CookingMode 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
          onAddToShoppingList={addToShoppingList}
        />
      )}
    </div>
  );
};

export default App;
