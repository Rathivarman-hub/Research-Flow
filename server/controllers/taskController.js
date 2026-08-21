import Task from '../models/Task.js';
import Project from '../models/Project.js';


// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, project, assignedTo, deadline, sprint, priority } = req.body;

  try {
    // Check if project exists and user is a member
    const proj = await Project.findById(project);
    if (!proj) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!proj.teamMembers.includes(req.user._id) && proj.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to add tasks to this project' });
    }

    const task = await Task.create({
      title,
      description: description || '',
      project,
      assignedTo: assignedTo || null,
      deadline: deadline || null,
      sprint: sprint || 'Sprint 1',
      priority: priority || 'Medium',
      status: 'Todo',
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'username email avatar role');

    res.status(201).json({ success: true, data: populatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const proj = await Project.findById(req.params.projectId);
    if (!proj) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'username email avatar role')
      .populate('comments.user', 'username email avatar role');

    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a task status or details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check project access
    const proj = await Project.findById(task.project);
    if (!proj.teamMembers.includes(req.user._id) && proj.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('assignedTo', 'username email avatar role')
      .populate('comments.user', 'username email avatar role');

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const proj = await Project.findById(task.project);
    if (proj.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only project owner can delete tasks' });
    }

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
const addTaskComment = async (req, res) => {
  const { text } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.comments.push({
      user: req.user._id,
      text,
    });

    await task.save();

    const updatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email avatar role')
      .populate('comments.user', 'username email avatar role');

    res.json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  addTaskComment,
};

