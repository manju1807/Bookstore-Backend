//imports
import { login, logout, register } from '../controllers/auth.js';
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';

//configs
const router = Router();

//middlewares


/* 
Route: /register
Method: POST
*/
router.post('/register', register);

/* 
Route: /login
Method: POST
*/

router.post('/login', authMiddleware, login);

/* 
Route: /logout
Method: GET
*/
router.get('/logout', logout);

export { router as authRoutes };
