import mongoose from 'mongoose';

const personalAISchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User association is required'],
    },
    name: {
      type: String,
      required: [true, 'AI Name is required'], 
      trim: true,
      minlength: [2, 'AI Name must be at least 2 characters long'],
      maxlength: [50, 'AI Name cannot exceed 50 characters'],
      default: 'Genesis',
    },
    avatar: {
      type: String,
      default: '🤖',
    },
    personality: {
      tone: {
        type: String,
        enum: {
          values: ['professional', 'friendly', 'casual', 'creative'],
          message: '{VALUE} is not a valid personality tone',
        },
        default: 'professional',
      },
      responseStyle: {
        type: String,
        enum: {
          values: ['concise', 'balanced', 'detailed'],
          message: '{VALUE} is not a valid response style',
        },
        default: 'concise',
      },
    },
    language: {
      type: String,
      enum: {
        values: ['english', 'hindi', 'hinglish'],
        message: '{VALUE} is not a valid language',
      },
      default: 'english',
    },
    customInstructions: {
      type: String,
      default: '',
      maxlength: [1000, 'Custom instructions cannot exceed 1000 characters'],
    },
    preferredProvider: {
      type: String,
      enum: {
        values: ['gemini', 'openai'],
        message: '{VALUE} is not a valid preferred provider',
      },
      default: 'gemini',
    },
    preferredModel: {
      type: String,
      default: 'gemini-1.5-flash',
    },
    settings: {
      planningEnabled: {
        type: Boolean,
        default: true,
      },
      confirmationsEnabled: {
        type: Boolean,
        default: true,
      },
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index to guarantee one Personal AI profile per user
personalAISchema.index({ user: 1 }, { unique: true });

const PersonalAI = mongoose.model('PersonalAI', personalAISchema);

export default PersonalAI;
