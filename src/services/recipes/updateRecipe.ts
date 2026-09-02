import { updateRecipeById } from '../../repositories/recipes/recipes.js';
import { AppError } from '../../types/AppError.js';
import type { RecipeUpdateInput } from '../../types/recipes/Recipe.js';

export const updateRecipe = async (recipeId: number, input: RecipeUpdateInput) => {
  if (!recipeId) {
    throw new AppError(400, 'Recipe ID is required.');
  }

  const updatedRecipe = await updateRecipeById(recipeId, input);

  if (!updatedRecipe) {
    throw new AppError(404, 'Recipe not found.');
  }

  return updatedRecipe;
};
