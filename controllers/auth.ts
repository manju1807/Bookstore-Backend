//imports
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { db } from '../lib/db.js';

// register controller
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const normalizedRole = role.toString().toUpperCase();
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
        const user = await db.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: normalizedRole,
          }
        });
      res.status(201).json(user);
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// login controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials or no user found!' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 3600000,
    });
    res.json({ success: true, message: 'Login Successful!' });
  } catch (err) {
    res.json({error:err})
  }
} 

//logout controller
export const logout = async (req: Request, res: Response) => {
  try {
    if (req.cookies && req.cookies.token) {
      res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
      });
      res.json({ success: true, message: 'Logout Successful!' });
    } else {
      res.json({ message: 'User not logged in yet!' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while logging out' });
  }
};