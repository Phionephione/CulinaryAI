
import React from 'react';
import { ShoppingItem } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, onRemove, onClear }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Grocery List</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Don't forget the essentials!</p>
        </div>
        {items.length > 0 && (
          <button 
            onClick={onClear}
            className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-50">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold">
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
                  <p className="text-slate-400 text-sm">{item.quantity}</p>
                </div>
              </div>
              <button 
                onClick={() => onRemove(item.id)}
                className="w-10 h-10 rounded-full hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all flex items-center justify-center"
              >
                <i className="fa-solid fa-trash-can text-sm"></i>
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <i className="fa-solid fa-cart-arrow-down text-3xl"></i>
            </div>
            <h3 className="text-slate-500 font-bold">Your list is currently empty</h3>
            <p className="text-slate-400 text-sm mt-1">Add missing ingredients directly from recipe steps.</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {items.length} {items.length === 1 ? 'Item' : 'Items'} Ready to buy
        </p>
      </div>
    </div>
  );
};

export default ShoppingList;
