import { insertRecipe } from '../../repositories/recipes/recipes.js';
import { AppError } from '../../types/AppError.js';
import type { RecipeInput } from '../../types/recipes/Recipe.js';

export const addRecipe = async (userId: number | undefined, input: RecipeInput) => {
  if (!userId) {
    throw new AppError(401, 'Authentication required.');
  }

  const { title, ingredients, steps, prepTime, photoUrl } = input;

  const newRecipe = await insertRecipe({
    title,
    userId,
    ingredients,
    steps,
    prepTime,
    ...(photoUrl !== undefined ? { photoUrl } : {}),
  });

  if (!newRecipe) {
    throw new AppError(500, 'Internal server error.');
  }

  return newRecipe;
};
