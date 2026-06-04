import express from 'express';
import { register, login, verify } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyToken, verify);

export default router;
