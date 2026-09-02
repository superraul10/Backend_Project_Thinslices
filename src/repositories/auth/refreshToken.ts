import { supabase } from '../../config/dbConnection.js';

export const storeRefreshToken = async (userId: string, refreshToken: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ refresh_token: refreshToken })
    .eq('id', userId)
    .select('id')
    .single();

  if (error) {
    console.error('Error storing refresh token:', error);
    throw new Error('Database error while storing refresh token.');
  }

  return data;
};

export const getRefreshToken = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('refresh_token')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error retrieving refresh token:', error);
    throw new Error('Database error while retrieving refresh token.');
  }

  return data?.refresh_token ?? null;
};

export const deleteRefreshToken = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ refresh_token: null })
    .eq('id', userId)
    .select('id')
    .single();

  if (error) {
    console.error('Error deleting refresh token:', error);
    throw new Error('Database error while deleting refresh token.');
  }

  return data;
};
