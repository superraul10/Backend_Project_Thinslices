import { supabase } from '../../config/dbConnection.js';
import type { RecipeUpdateInput } from '../../types/recipes/Recipe.js';

export const insertRecipe = async (recipe: {
  title: string;
  userId: number;
  ingredients: string[];
  steps: string;
  prepTime: string;
  photoUrl?: string;
}) => {
  const { data: newRecipe, error: insertRecipeError } = await supabase
    .from('recipes')
    .insert([{
      title: recipe.title,
      user_id: recipe.userId,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      prep_time: recipe.prepTime,
      photo_url: recipe.photoUrl ?? null,
    }])
    .select('id, title')
    .single();

  if (insertRecipeError) {
    console.error('DB error while inserting recipe:', insertRecipeError);
    throw new Error('Database error.');
  }

  return newRecipe;
};

export const getRecipeById = async (recipeId: number) => {
  const { data: recipe, error: getRecipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)
    .maybeSingle();

  if (getRecipeError) {
    console.error('DB error while fetching recipe:', getRecipeError);
    throw new Error('Database error.');
  }

  return recipe;
};

export const getRecipesByUserId = async (userId: number) => {
  const {data: recipes, error: getRecipesError } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId);

  if (getRecipesError) {
    console.error('DB error while fetching recipes by user ID:', getRecipesError);
    throw new Error('Database error.');
  }

  return recipes;
};

export const updateRecipeById = async (recipeId: number, updates: RecipeUpdateInput) => {
  const updatePayload: Record<string, unknown> = {};
  if (updates.title !== undefined) updatePayload.title = updates.title;
  if (updates.ingredients !== undefined) updatePayload.ingredients = updates.ingredients;
  if (updates.steps !== undefined) updatePayload.steps = updates.steps;
  if (updates.prepTime !== undefined) updatePayload.prep_time = updates.prepTime;
  if (updates.photoUrl !== undefined) updatePayload.photo_url = updates.photoUrl;

  const { data: updatedRecipe, error: updateRecipeError } = await supabase
    .from('recipes')
    .update(updatePayload)
    .eq('id', recipeId)
    .select('*')
    .maybeSingle();

  if (updateRecipeError) {
    console.error('DB error while updating recipe:', updateRecipeError);
    throw new Error('Database error.');
  }

  return updatedRecipe;
};

export const deleteRecipeById = async (recipeId: number) => {
  const { data: recipe, error: getRecipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', recipeId)
    .maybeSingle();

  if (getRecipeError) {
    console.error('DB error while fetching recipe:', getRecipeError);
    throw new Error('Database error.');
  }

  if (!recipe) {
    return null; // Recipe not found
  }

  const { error: deleteRecipeError } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId);

  if (deleteRecipeError) {
    console.error('DB error while deleting recipe:', deleteRecipeError);
    throw new Error('Database error.');
  }

  return recipe;  
};

export const addImageToRecipe = async (recipeId: number, imageUrl: string) => {
  const { data: updatedRecipe, error: updateRecipeError } = await supabase
    .from('recipes')
    .update({ photo_url: imageUrl })
    .eq('id', recipeId)
    .select('*')
    .maybeSingle();

  if (updateRecipeError) {
    console.error('DB error while adding image to recipe:', updateRecipeError);
    throw new Error('Database error.');
  }

  return updatedRecipe;
};

