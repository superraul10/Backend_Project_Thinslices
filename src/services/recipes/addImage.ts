import { addImageToRecipe } from '../../repositories/recipes/recipes.js';
import { AppError } from '../../types/AppError.js';

export const addImage = async (recipeId: number, imageUrl: string) => {
  if (!recipeId) {
    throw new AppError(400, 'Recipe ID is required.');
  }

  const updatedRecipe = await addImageToRecipe(recipeId, imageUrl);

  if (!updatedRecipe) {
    throw new AppError(404, 'Recipe not found.');
  }

  return updatedRecipe;
};
