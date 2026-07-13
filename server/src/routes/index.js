import { Router } from 'express';

const router = Router();

// API Health Check Route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
  });
});

export default router;
