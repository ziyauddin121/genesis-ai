import { Router } from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  archiveWorkspace,
} from '../controllers/workspace.controller.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createWorkspaceSchema, updateWorkspaceSchema } from '../validations/workspace.validation.js';

const router = Router();

// All workspace routes require authentication
router.use(protect);

router.route('/')
  .post(validate(createWorkspaceSchema), createWorkspace)
  .get(getWorkspaces);

router.route('/:workspaceId')
  .get(getWorkspaceById)
  .patch(validate(updateWorkspaceSchema), updateWorkspace)
  .delete(archiveWorkspace);

export default router;
