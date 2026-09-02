import { uploadRecipePhoto as uploadToBucket } from '../../repositories/recipes/storage.js';
import { addImage } from './addImage.js';
import { AppError } from '../../types/AppError.js';

type UploadedFile = { buffer: Buffer; mimetype: string; originalname: string };

export const uploadRecipePhoto = async (recipeId: number, file: UploadedFile | undefined) => {
  if (!recipeId) {
    throw new AppError(400, 'Recipe ID is required.');
  }

  if (!file) {
    throw new AppError(400, 'Photo file is required.');
  }

  const photoUrl = await uploadToBucket(recipeId, file);

  return addImage(recipeId, photoUrl);
};
