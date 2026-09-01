import type { Request, Response } from 'express';
import { addRecipe } from '../services/recipes/addRecipe.js';
import { AppError } from '../types/AppError.js';
import type { RecipeInput } from '../types/Recipe.js';
import { fetchRecipeById } from '../services/recipes/getRecipeById.js';
import { fetchRecipes } from '../services/recipes/getRecipes.js';
import { removeRecipeById } from '../services/recipes/deleteRecipe.js';
import { updateRecipe } from '../services/recipes/updateRecipe.js';

const handleAddRecipe = async (req: Request, res: Response) => {
  const body = (req.body ?? {}) as RecipeInput;

  try {
    const newRecipe = await addRecipe(req.user?.id, body);
    return res.status(201).json({ message: 'Recipe created successfully.', recipe: newRecipe });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error('Unexpected error while adding recipe:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const handleGetRecipeById = async (req: Request, res: Response) => {
  const recipeId = parseInt(req.params.id as string, 10);

  try {
    const recipe = await fetchRecipeById(recipeId);
    return res.status(200).json({ recipe });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error('Unexpected error while fetching recipe:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const handleGetRecipes = async (req: Request, res: Response) => { 
    const userId = req.user?.id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const recipes = await fetchRecipes(userId);
        return res.status(200).json({ recipes });
    } catch (err) {
        if (err instanceof AppError) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error('Unexpected error while fetching recipes:', err);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const handleDeleteRecipe = async (req: Request, res: Response) => {
  const recipeId = parseInt(req.params.id as string, 10);

  try {
    const deletedRecipe = await removeRecipeById(recipeId);
    return res.status(200).json({ message: 'Recipe deleted successfully.', recipe: deletedRecipe });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error('Unexpected error while deleting recipe:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const handleUpdateRecipe = async (req: Request, res: Response) => {
  const recipeId = parseInt(req.params.id as string, 10);
  const body = (req.body ?? {}) as RecipeInput;

  try {
    const updatedRecipe = await updateRecipe(recipeId, body);
    return res.status(200).json({ message: 'Recipe updated successfully.', recipe: updatedRecipe });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error('Unexpected error while updating recipe:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export { handleAddRecipe, handleGetRecipeById, handleGetRecipes, handleDeleteRecipe, handleUpdateRecipe };

