import { getRecipeById, getRecipesByUserId } from '../../repositories/recipes.js';
import { AppError } from '../../types/AppError.js';
import type { RecipeInput } from '../../types/Recipe.js';

export const fetchRecipes = async (userId: number) => {
  if (!userId) {
    throw new AppError(400, 'User ID is required.');
  }

  const recipes = await getRecipesByUserId(userId);


  if (!recipes) {
    throw new AppError(404, 'Recipe not found.');
  }

  return recipes;
};