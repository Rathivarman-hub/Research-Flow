import Project from '../models/Project.js';
import User from '../models/User.js';


// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { name, description, domain, repositoryUrl, deadline, researchObjectives } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      domain: domain || 'General Research',
      repositoryUrl: repositoryUrl || '',
      deadline,
      researchObjectives: researchObjectives || [],
      owner: req.user._id,
      teamMembers: [req.user._id], // Owner is a member by default
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all projects for logged user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    // Find projects where user is owner or team member
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { teamMembers: req.user._id }],
    })
      .populate('owner', 'username email avatar role')
      .populate('teamMembers', 'username email avatar role');

    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username email avatar role')
      .populate('teamMembers', 'username email avatar role');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check authorization
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.teamMembers.some((m) => m._id.toString() === req.user._id.toString());

    if (!isOwner && !isMember) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this project' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Check authorization (only owner can edit project metadata)
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this project' });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('owner', 'username email avatar role')
      .populate('teamMembers', 'username email avatar role');

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only owner can delete project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await project.deleteOne();

    res.json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add team member to project
// @route   POST /api/projects/:id/members
// @access  Private
const addTeamMember = async (req, res) => {
  const { email } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Only owner can add members
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to add members' });
    }

    const newMember = await User.findOne({ email });

    if (!newMember) {
      return res.status(404).json({ success: false, message: 'User with this email not found' });
    }

    // Check if already a member
    if (project.teamMembers.includes(newMember._id)) {
      return res.status(400).json({ success: false, message: 'User is already a team member' });
    }

    project.teamMembers.push(newMember._id);
    await project.save();

    const updatedProject = await Project.findById(req.params.id)
      .populate('owner', 'username email avatar role')
      .populate('teamMembers', 'username email avatar role');

    res.json({ success: true, data: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addTeamMember,
};

