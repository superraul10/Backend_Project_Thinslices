import express from 'express';
import { handleAddRecipe, handleGetRecipeById, handleGetRecipes, handleDeleteRecipe, handleUpdateRecipe } from '../controllers/recipeController.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/', verifyJWT, handleAddRecipe);

router.get('/', verifyJWT, handleGetRecipes);

router.get('/:id', verifyJWT, handleGetRecipeById);

router.patch('/:id', verifyJWT, handleUpdateRecipe);

router.delete('/:id', verifyJWT, handleDeleteRecipe);

export default router;
