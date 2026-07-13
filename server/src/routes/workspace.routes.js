import { Router } from 'express';
import { getWorkspaces } from '../controllers/workspace.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Protected Workspace Listing Route
router.get('/', protect, getWorkspaces);

export default router;
