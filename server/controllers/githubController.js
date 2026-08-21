import Repository from '../models/Repository.js';
import Project from '../models/Project.js';


// @desc    Connect a GitHub repository to a project
// @route   POST /api/github/connect/:projectId
// @access  Private
const connectGithubRepo = async (req, res) => {
  const { projectId } = req.params;
  const { repositoryUrl } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Parse repo name from URL
    let repoName = 'research-codebase';
    try {
      const parts = repositoryUrl.replace(/\/$/, '').split('/');
      if (parts.length >= 2) {
        repoName = `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
      }
    } catch (e) {
      // Keep default
    }

    // Generate rich mock data
    const contributors = [
      { name: req.user.username, avatarUrl: req.user.avatar, contributions: 42 },
      { name: 'Dr. Alice Carter', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', contributions: 28 },
      { name: 'Marcus Sterling', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', contributions: 19 },
      { name: 'Elena Rostova', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80', contributions: 12 },
    ];

    const commits = [
      { sha: '8c9d2f1a', message: 'refactor(model): optimize convolutional forward pass memory layout', author: req.user.username, date: new Date(Date.now() - 1000 * 60 * 60 * 2) },
      { sha: '6f8e7a4b', message: 'test(pipeline): append assertion tests for genome loader limits', author: 'Dr. Alice Carter', date: new Date(Date.now() - 1000 * 60 * 60 * 18) },
      { sha: '5d4c3b2a', message: 'docs(readme): structure multi-node environment setup guides', author: req.user.username, date: new Date(Date.now() - 1000 * 60 * 60 * 48) },
      { sha: '4b3a291f', message: 'feat(data): implement pandas chunk processor for heavy CSV imports', author: 'Marcus Sterling', date: new Date(Date.now() - 1000 * 60 * 60 * 72) },
      { sha: '3a291f8c', message: 'fix(core): seed RNG parameters globally to enforce reproducibility', author: 'Dr. Alice Carter', date: new Date(Date.now() - 1000 * 60 * 60 * 120) },
      { sha: '291f8c7e', message: 'chore(docker): construct requirements pipeline and multi-stage builds', author: 'Elena Rostova', date: new Date(Date.now() - 1000 * 60 * 60 * 160) },
      { sha: '1f8c7e6d', message: 'init: bootstrap basic research repository and directory skeleton', author: req.user.username, date: new Date(Date.now() - 1000 * 60 * 60 * 240) },
    ];

    const weeklyContributions = [
      { week: 'W10', commits: 5 },
      { week: 'W11', commits: 8 },
      { week: 'W12', commits: 14 },
      { week: 'W13', commits: 6 },
      { week: 'W14', commits: 11 },
      { week: 'W15', commits: 18 },
      { week: 'W16', commits: 25 },
      { week: 'W17', commits: 12 },
    ];

    // Remove existing repo metadata if exists
    await Repository.deleteOne({ project: projectId });

    const repository = await Repository.create({
      project: projectId,
      repoName,
      repoUrl: repositoryUrl,
      stars: Math.floor(Math.random() * 25) + 3,
      forks: Math.floor(Math.random() * 8) + 1,
      commits,
      contributors,
      weeklyContributions,
    });

    // Update project repo link
    project.repositoryUrl = repositoryUrl;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'GitHub repository linked successfully',
      data: repository,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get repository details
// @route   GET /api/github/details/:projectId
// @access  Private
const getRepoDetails = async (req, res) => {
  const { projectId } = req.params;

  try {
    const repository = await Repository.findOne({ project: projectId });
    if (!repository) {
      return res.status(404).json({ success: false, message: 'No repository linked to this project' });
    }

    res.json({ success: true, data: repository });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get repository analytics (PRs, issues, activity)
// @route   GET /api/github/analytics/:projectId
// @access  Private
const getRepoAnalytics = async (req, res) => {
  const { projectId } = req.params;

  try {
    const repo = await Repository.findOne({ project: projectId });
    if (!repo) {
      return res.status(404).json({ success: false, message: 'No repository linked to this project' });
    }

    // Mock analytical outputs for visualization
    const prs = [
      { id: 1, title: 'feat: add deep clustering validation metric', state: 'open', author: 'Dr. Alice Carter', date: '2026-08-15' },
      { id: 2, title: 'fix: patch cuda memory leak in epoch loops', state: 'merged', author: req.user.username, date: '2026-08-12' },
      { id: 3, title: 'docs: write api tutorials in docs directory', state: 'merged', author: 'Elena Rostova', date: '2026-08-08' },
    ];

    const issues = [
      { id: 1, title: 'Inconsistent results when using batch size > 64', state: 'open', severity: 'High', author: 'Marcus Sterling' },
      { id: 2, title: 'Missing requirements in python setup script', state: 'closed', severity: 'Medium', author: 'Elena Rostova' },
      { id: 3, title: 'Docker container crashes on GPU memory alloc', state: 'open', severity: 'Critical', author: 'Dr. Alice Carter' },
    ];

    // Weekly contribution trends (e.g. documentation, code, tests)
    const categoryBreakdown = {
      codeChanges: 65,
      testing: 20,
      documentation: 15,
    };

    res.json({
      success: true,
      data: {
        repoName: repo.repoName,
        stars: repo.stars,
        forks: repo.forks,
        commitsCount: repo.commits.length,
        pullRequests: prs,
        issues: issues,
        weeklyContributions: repo.weeklyContributions,
        categoryBreakdown,
        healthScore: 82, // Repository health score
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  connectGithubRepo,
  getRepoDetails,
  getRepoAnalytics,
};

