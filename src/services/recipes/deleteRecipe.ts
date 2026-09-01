import { deleteRecipeById} from '../../repositories/recipes.js';
import { AppError } from '../../types/AppError.js';

export const removeRecipeById = async (recipeId: number) => {
  if (!recipeId) {
    throw new AppError(400, 'Recipe ID is required.');
  } 
  const deletedRecipe = await deleteRecipeById(recipeId);

  if (!deletedRecipe) {
    throw new AppError(404, 'Recipe not found.');
  }

  return deletedRecipe;
};