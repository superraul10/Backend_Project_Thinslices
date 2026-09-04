import { supabase } from '../config/dbConnection.js';
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export const insertImageToDatabase = async (imageData: { url: string; recipeId: number }) =>{

    upload.single('image');    

    const { data: newImage, error: insertImageError } = await supabase
        .from('images')
        .insert([{
            url: imageData.url,
            recipe_id: imageData.recipeId,
        }])
        .select('id, url, recipe_id')
        .single();

    if (insertImageError) {
        console.error('DB error while inserting image:', insertImageError);
        throw new Error('Database error.');
    }

    return newImage;
};