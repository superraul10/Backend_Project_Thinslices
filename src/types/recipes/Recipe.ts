import { z } from 'zod';

export const recipeInputSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  steps: z.string().min(1, { message: 'Description is required' }),
  ingredients: z.array(z.string()).min(1, { message: 'At least one ingredient is required' }),
  prepTime: z.string().min(1, { message: 'Prep time is required' }),
  photoUrl: z.string().url({ message: 'Image URL must be a valid URL' }).optional(),
});

export const recipeUpdateSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).optional(),
  steps: z.string().min(1, { message: 'Description is required' }).optional(),
  ingredients: z.array(z.string()).min(1, { message: 'At least one ingredient is required' }).optional(),
  prepTime: z.string().min(1, { message: 'Prep time is required' }).optional(),
  photoUrl: z.string().url({ message: 'Image URL must be a valid URL' }).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided to update.',
});

export const recipeImageSchema = z.object({
  imageUrl: z.string().url({ message: 'Image URL must be a valid URL' }),
});

export type RecipeInput = z.infer<typeof recipeInputSchema>;
export type RecipeUpdateInput = z.infer<typeof recipeUpdateSchema>;
export type RecipeImageInput = z.infer<typeof recipeImageSchema>;
