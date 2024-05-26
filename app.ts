// src/app.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import { authRoutes } from './routes/auth.js';
import { bookRoutes } from './routes/books.js';
import dotenv from 'dotenv';

// Configurations
dotenv.config();
const app = express();
app.use(cookieParser());
const PORT= process.env.PORT

//middlewares
app.use(express.json()); 

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

//server
app.listen(PORT, () => {
  console.log(`Server is running on : http://localhost:${PORT}`);
});
