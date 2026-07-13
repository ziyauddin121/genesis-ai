import { Router } from 'express';
import healthRouter from './health.routes.js';

const router = Router();

// Mount sub-routers
router.use('/', healthRouter);

export default router;
