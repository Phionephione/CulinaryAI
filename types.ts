
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  prepTime: number; // in minutes
  calories: number;
  ingredients: Ingredient[];
  steps: string[];
  dietaryTags: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  addedAt: number;
}

export type DietaryRestriction = 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'gluten-free' | 'none';
