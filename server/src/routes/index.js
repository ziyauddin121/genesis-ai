import { Router } from 'express';
import healthRouter from './health.routes.js';
import authRouter from './auth.routes.js';
import workspaceRouter from './workspace.routes.js';
import dashboardRouter from './dashboard.routes.js';
import personalAIRouter from './personalAI.routes.js';
import taskRouter from './task.routes.js';

const router = Router();

// Mount system, auth, workspace, dashboard, personal-ai and task routes
router.use('/', healthRouter);
router.use('/auth', authRouter);
router.use('/workspaces', workspaceRouter);
router.use('/dashboard', dashboardRouter);
router.use('/personal-ai', personalAIRouter);
router.use('/tasks', taskRouter);

export default router;
