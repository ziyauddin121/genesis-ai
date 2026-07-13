import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import { protect } from '../middlewares/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(register));
router.post('/login', validate(loginSchema), asyncHandler(login));
router.get('/me', protect, asyncHandler(getMe));
router.post('/logout', protect, asyncHandler(logout));

export default router;
