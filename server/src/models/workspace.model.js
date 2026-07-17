import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Workspace owner is required'],
    },
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      minlength: [2, 'Workspace name must be at least 2 characters long'],
      maxlength: [50, 'Workspace name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: '',
    },
    icon: {
      type: String,
      default: '📁',
    },
    color: {
      type: String,
      default: 'blue',
    },
    isArchived: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to optimize workspace lookup by owner and archival status
workspaceSchema.index({ owner: 1, isArchived: 1 });

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
