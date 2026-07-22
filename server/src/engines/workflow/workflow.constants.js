export const WORKFLOW_STATUS = Object.freeze({
  PLANNING: 'planning',
  EXECUTING: 'executing',
  WAITING: 'waiting',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
});

export const STEP_STATUS = Object.freeze({
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
});

export const LOG_LEVEL = Object.freeze({
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
});

export const WORKFLOW_DEFAULTS = Object.freeze({
  PROGRESS: 0,
  CURRENT_STEP: 'Planning Task',
});
