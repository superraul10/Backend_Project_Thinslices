const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/dbConnection');
const path = require('path')
import type { Request, Response } from 'express';


 const handleLogin = async(req: Request,res: Response) =>{

//aici sa fac cu jwt dupa successful login

}

const handleRegister = async(req: Request,res: Response) =>{

const body = (req.body ?? {}) as { username?: string; password?: string }; //oh wow altfel imi dadea eroare trb sa ma obisnuiesc cu ts
const { username, password } = body;
if(!username || !password){
    return res.status(400).json({ message: 'Username and password are required.' });
}

try {
//verific daca exista deja
    const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
        
    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists.' });
    }
} catch (error) {
    console.error('Error occurred while checking user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
}

//criptare cu bcrypt
const hashedPassword = await bcrypt.hash(password, 10);

const { data: newUser, error: newUserError } = await supabase
    .from('users')
    .insert([{ username, password: hashedPassword }])
    .single();

if (newUserError) {
    console.error('Error occurred while creating user:', newUserError);
    return res.status(500).json({ message: 'Internal server error.' });
}

}


module.exports = { handleLogin, handleRegister };
