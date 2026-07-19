import { Router } from 'express';
import { onboardProfile, getProfile, updateProfile } from '../controllers/personalAI.controller.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { onboardPersonalAISchema, updatePersonalAISchema } from '../validations/personalAI.validation.js';

const router = Router();

// Protect all Personal AI routes
router.use(protect);

// Onboarding route: POST /api/personal-ai/onboard
router.post('/onboard', validate(onboardPersonalAISchema), onboardProfile);

// Core profile routes: GET /api/personal-ai and PATCH /api/personal-ai
router.route('/')
  .get(getProfile)
  .patch(validate(updatePersonalAISchema), updateProfile);

export default router;
