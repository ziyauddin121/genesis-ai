import { Router } from 'express';
import healthRouter from './health.routes.js';
import authRouter from './auth.routes.js';
import workspaceRouter from './workspace.routes.js';
import dashboardRouter from './dashboard.routes.js';

const router = Router();

// Mount system, auth, workspace and dashboard routes
router.use('/', healthRouter);
router.use('/auth', authRouter);
router.use('/workspaces', workspaceRouter);
router.use('/dashboard', dashboardRouter);

export default router;
