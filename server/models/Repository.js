import mongoose from 'mongoose';

const commitSchema = new mongoose.Schema({
  sha: String,
  message: String,
  author: String,
  date: Date,
});

const contributorSchema = new mongoose.Schema({
  name: String,
  avatarUrl: String,
  contributions: Number,
});

const weeklyContributionSchema = new mongoose.Schema({
  week: String, // e.g. "Week 1", "2026-W34"
  commits: Number,
});

const repositorySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    repoName: {
      type: String,
      required: true,
    },
    repoUrl: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    commits: [commitSchema],
    contributors: [contributorSchema],
    weeklyContributions: [weeklyContributionSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Repository', repositorySchema);

