import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    type: {
      type: String,
      enum: ['Assessment', 'Reproducibility'],
      required: true,
    },
    documentationScore: {
      type: Number,
      default: 0,
    },
    testingScore: {
      type: Number,
      default: 0,
    },
    gitScore: {
      type: Number,
      default: 0,
    },
    collaborationScore: {
      type: Number,
      default: 0,
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    reproducibilityReport: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Report', reportSchema);

