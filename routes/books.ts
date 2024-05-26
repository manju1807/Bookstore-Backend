// src/routes/books.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { uploadBooks } from '../controllers/books.js';

//config
const router = Router();

//middlewares
router.use(authMiddleware);

//routes

/* 
Route: /upload
Method: POST
*/
router.post('/upload', uploadBooks);



export { router as bookRoutes };
