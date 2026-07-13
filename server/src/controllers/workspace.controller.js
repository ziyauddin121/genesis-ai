/**
 * @desc    Get user workspace projects listing
 * @route   GET /api/workspaces
 * @access  Private (Mock Public)
 */
export const getWorkspaces = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Workspaces retrieved successfully (Placeholder)',
      data: [],
    });
  } catch (error) {
    next(error);
  }
};
