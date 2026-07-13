import { Router } from 'express';

const router = Router();

// Health Check Route
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Genesis AI API is healthy and operational',
    timestamp: new Date().toISOString(),
  });
});

export default router;
