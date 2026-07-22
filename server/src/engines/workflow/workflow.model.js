import mongoose from 'mongoose';
import {
  WORKFLOW_STATUS,
  STEP_STATUS,
  LOG_LEVEL,
  WORKFLOW_DEFAULTS,
} from './workflow.constants.js';

const workflowStepSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Step id is required'],
    },
    name: {
      type: String,
      required: [true, 'Step name is required'],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(STEP_STATUS),
        message: '{VALUE} is not a valid step status',
      },
      default: STEP_STATUS.PENDING,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    _id: false,
  }
);

const workflowLogSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: {
        values: Object.values(LOG_LEVEL),
        message: '{VALUE} is not a valid log level',
      },
      default: LOG_LEVEL.INFO,
    },
    message: {
      type: String,
      required: [true, 'Log message is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const workflowSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task is required'],
      unique: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(WORKFLOW_STATUS),
        message: '{VALUE} is not a valid workflow status',
      },
      default: WORKFLOW_STATUS.PLANNING,
    },
    progress: {
      type: Number,
      default: WORKFLOW_DEFAULTS.PROGRESS,
      min: [0, 'Progress cannot be less than 0'],
      max: [100, 'Progress cannot exceed 100'],
    },
    currentStep: {
      type: String,
      default: WORKFLOW_DEFAULTS.CURRENT_STEP,
    },
    steps: {
      type: [workflowStepSchema],
      default: [],
    },
    logs: {
      type: [workflowLogSchema],
      default: [],
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Workflow = mongoose.model('Workflow', workflowSchema);

export default Workflow;
