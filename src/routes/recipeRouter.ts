import express from 'express';
import { handleAddRecipe, handleGetRecipeById, handleGetRecipes } from '../controllers/recipeController.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/', verifyJWT, handleAddRecipe);

router.get('/', verifyJWT, handleGetRecipes);

router.get('/:id', verifyJWT, handleGetRecipeById);

export default router;
