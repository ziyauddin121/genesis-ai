import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Protect all dashboard routes
router.use(protect);

router.route('/')
  .get(getDashboard);

export default router;
