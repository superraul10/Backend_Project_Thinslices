const { supabase } = require('../config/dbConnection');
const bcrypt = require('bcrypt');


const returnUserByUsername = async (username: string) => {
  const normalizedUsername = username.trim().toLowerCase();

  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('id, username, password')
    .eq('username', normalizedUsername)
    .maybeSingle();

  if (existingUserError) {
    console.error('DB error while checking user:', existingUserError);
    throw new Error('Database error.');
  }

  return existingUser;
};


const insertUser = async (username: string, password: string) => {
  const normalizedUsername = username.trim().toLowerCase();

  const { data: newUser, error: insertUserError } = await supabase
    .from('users')
    .insert([{ username: normalizedUsername, password: password }])
    .select('id, username')
    .single();

  if (insertUserError) {
    console.error('DB error while inserting user:', insertUserError);
    throw new Error('Database error.');
  }

  return newUser;
}
module.exports = { returnUserByUsername, insertUser };
