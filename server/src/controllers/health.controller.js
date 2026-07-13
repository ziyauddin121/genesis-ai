/**
 * @desc    API Health Check Controller
 * @route   GET /api/health
 * @access  Public
 */
export const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
  });
};
