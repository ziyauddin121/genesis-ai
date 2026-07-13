import { Router } from 'express';
import healthRouter from './health.routes.js';
import authRouter from './auth.routes.js';
import workspaceRouter from './workspace.routes.js';

const router = Router();

// Mount system, auth and workspace routes
router.use('/', healthRouter);
router.use('/auth', authRouter);
router.use('/workspaces', workspaceRouter);

export default router;
