import { supabase } from '../config/dbConnection.js';

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
    .single();

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
