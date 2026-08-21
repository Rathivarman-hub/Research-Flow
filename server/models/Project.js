import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a project name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a project description'],
    },
    domain: {
      type: String,
      required: [true, 'Please add a research domain'],
      default: 'General Research',
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    repositoryUrl: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
    },
    researchObjectives: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Planning', 'Active', 'Review', 'Completed'],
      default: 'Planning',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    maturityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    maturityLevel: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze',
    },
    healthScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Project', projectSchema);

