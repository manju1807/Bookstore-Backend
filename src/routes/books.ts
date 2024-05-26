// src/routes/books.ts
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { deleteBook, editBook, getBookById, getBooks, uploadBooks } from '../controllers/books.js';

//config
const router = Router();

//middlewares
router.use(authMiddleware);

//routes

router.post('/upload', uploadBooks);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', editBook);
router.delete('/:id', deleteBook);


export { router as bookRoutes };
