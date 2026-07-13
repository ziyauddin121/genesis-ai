import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';

const router = Router();

// API Health Check Route
router.get('/health', getHealth);

export default router;
