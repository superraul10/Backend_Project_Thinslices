import { updateRecipeById } from '../../repositories/recipes.js';
import { AppError } from '../../types/AppError.js';
import type { RecipeInput } from '../../types/Recipe.js';

export const updateRecipe = async (recipeId: number, input: RecipeInput) => {
  if (!recipeId) {
    throw new AppError(400, 'Recipe ID is required.');
  }

  const hasUpdate = Object.values(input).some((value) => value !== undefined);
  if (!hasUpdate) {
    throw new AppError(400, 'At least one field must be provided to update.');
  }

  const updatedRecipe = await updateRecipeById(recipeId, input);

  if (!updatedRecipe) {
    throw new AppError(404, 'Recipe not found.');
  }

  return updatedRecipe;
};
