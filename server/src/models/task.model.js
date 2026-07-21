import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    status: {
      type: String,
      lowercase: true,
      trim: true,
      enum: {
        values: [
          'pending',
          'planning',
          'waiting',
          'running',
          'completed',
          'failed',
          'cancelled'
        ],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be less than 0'],
      max: [100, 'Progress cannot exceed 100'],
    },
    currentStep: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      lowercase: true,
      trim: true,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// Optimize future dashboard queries and task listing
taskSchema.index({
  owner: 1,
  workspace: 1,
  status: 1,
});

// Optimize workspace dashboard and task history queries
taskSchema.index({
  workspace: 1,
  createdAt: -1,
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
