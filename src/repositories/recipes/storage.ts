import { supabase } from '../../config/dbConnection.js';

const BUCKET_NAME = 'Recipe_Backend';

export const uploadRecipePhoto = async (
  recipeId: number,
  file: { buffer: Buffer; mimetype: string; originalname: string }
) => {
  const filePath = `${recipeId}/${Date.now()}-${file.originalname}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: true });

  if (uploadError) {
    console.error('Storage error while uploading recipe photo:', uploadError);
    throw new Error('Storage error.');
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return data.publicUrl;
};
