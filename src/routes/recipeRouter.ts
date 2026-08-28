import express from 'express';
import { handleAddRecipe, handleGetRecipeById } from '../controllers/recipeController.js';
import { verifyJWT } from '../middleware/verifyJWT.js';

const router = express.Router();

router.post('/', verifyJWT, handleAddRecipe);

router.get('/:id', verifyJWT, handleGetRecipeById);

export default router;
