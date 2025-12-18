
import React from 'react';
import { Recipe, Difficulty } from '../types';

interface RecipeGridProps {
  recipes: Recipe[];
  onSelectRecipe: (r: Recipe) => void;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, onSelectRecipe }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div 
          key={recipe.id}
          className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
          onClick={() => onSelectRecipe(recipe)}
        >
          <div className="h-48 bg-slate-200 relative overflow-hidden">
             <img 
               src={`https://picsum.photos/seed/${recipe.id}/400/300`} 
               alt={recipe.title} 
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
             />
             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-700">
               {recipe.difficulty}
             </div>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-slate-800 leading-tight">{recipe.title}</h3>
            </div>
            <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
              {recipe.description}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center space-x-4 text-xs font-semibold text-slate-400">
                <span><i className="fa-regular fa-clock mr-1 text-emerald-500"></i> {recipe.prepTime}m</span>
                <span><i className="fa-solid fa-fire mr-1 text-orange-500"></i> {recipe.calories} kcal</span>
              </div>
              <div className="flex -space-x-2">
                {recipe.dietaryTags?.slice(0, 2).map((tag, idx) => (
                   <span key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-500 uppercase">
                     {tag.charAt(0)}
                   </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeGrid;
