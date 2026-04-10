import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';

export const getTasks = asyncHandler(async (req, res) => {
  const { source, priority, completed } = req.query;
  const filter = { user: req.user._id };
  if (source) filter.source = source;
  if (priority) filter.priority = priority;
  if (completed !== undefined) filter.completed = completed === 'true';
  const tasks = await Task.find(filter).sort({ deadline: 1 });
  res.json(tasks);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json(task);
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, user: req.user._id });
  res.status(201).json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json({ message: 'Task deleted' });
});

export const toggleTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});
