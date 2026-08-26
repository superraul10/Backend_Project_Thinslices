const dotenv = require('dotenv');
dotenv.config(); 

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be defined in the environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
