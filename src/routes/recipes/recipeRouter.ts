import express from 'express';
import { handleAddRecipe, handleGetRecipeById, handleGetRecipes, handleDeleteRecipe, handleUpdateRecipe, handleAddImage, handleUploadRecipePhoto } from '../../controllers/recipes/recipeController.js';
import { verifyJWT } from '../../middleware/auth/verifyJWT.js';
import { validate } from '../../middleware/zodValidator.js';
import { uploadPhoto } from '../../middleware/recipes/upload.js';
import { recipeInputSchema, recipeUpdateSchema, recipeImageSchema } from '../../types/recipes/Recipe.js';

const router = express.Router();

router.post('/', verifyJWT, validate(recipeInputSchema), handleAddRecipe);

router.get('/', verifyJWT, handleGetRecipes);

router.get('/:id', verifyJWT, handleGetRecipeById);

router.patch('/:id', verifyJWT, validate(recipeUpdateSchema), handleUpdateRecipe);

router.delete('/:id', verifyJWT, handleDeleteRecipe);

router.post('/:id/images', verifyJWT, validate(recipeImageSchema), handleAddImage);

router.post('/:id/photo', verifyJWT, uploadPhoto, handleUploadRecipePhoto);

export default router;
