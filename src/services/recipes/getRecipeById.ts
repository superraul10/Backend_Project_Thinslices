import { getRecipeById } from '../../repositories/recipes.js';
import { AppError } from '../../types/AppError.js';
import type { RecipeInput } from '../../types/Recipe.js';

export const fetchRecipeById = async (recipeId: number) => {
  if (!recipeId) {
    throw new AppError(400, 'Recipe ID is required.');
  }

  const recipe = await getRecipeById(recipeId);

  if (!recipe) {
    throw new AppError(404, 'Recipe not found.');
  }

  return recipe;
};