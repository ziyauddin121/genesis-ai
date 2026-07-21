import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';
import { protect } from '../middlewares/auth.js';
import { validate, validateParams } from '../middlewares/validate.js';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../validations/task.validation.js';

const router = Router();

// All task routes require authentication
router.use(protect);

router.route('/')
  .post(validate(createTaskSchema), createTask)
  .get(getTasks);

router.route('/:taskId')
  .all(validateParams(taskIdSchema))
  .get(getTaskById)
  .patch(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;
