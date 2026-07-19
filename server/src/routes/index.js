import { Router } from 'express';
import healthRouter from './health.routes.js';
import authRouter from './auth.routes.js';
import workspaceRouter from './workspace.routes.js';
import dashboardRouter from './dashboard.routes.js';
import personalAIRouter from './personalAI.routes.js';

const router = Router();

// Mount system, auth, workspace, dashboard and personal-ai routes
router.use('/', healthRouter);
router.use('/auth', authRouter);
router.use('/workspaces', workspaceRouter);
router.use('/dashboard', dashboardRouter);
router.use('/personal-ai', personalAIRouter);

export default router;
