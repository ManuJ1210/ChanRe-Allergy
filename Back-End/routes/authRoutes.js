import express from 'express';
import { register, login, forgotPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// ✅ Forgot password route
router.post('/forgot-password', forgotPassword);

export default router;
