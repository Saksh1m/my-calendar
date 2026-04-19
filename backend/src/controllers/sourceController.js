import asyncHandler from 'express-async-handler';
import Source from '../models/Source.js';
import Task from '../models/Task.js';

export const getSources = asyncHandler(async (req, res) => {
  const sources = await Source.find({ user: req.user._id }).sort({ createdAt: 1 });
  res.json(sources);
});

export const createSource = asyncHandler(async (req, res) => {
  const { name, color } = req.body;
  if (!name || !name.trim()) {
    res.status(400);
    throw new Error('Source name is required');
  }
  const cleanName = name.trim().toLowerCase();
  const exists = await Source.findOne({ user: req.user._id, name: cleanName });
  if (exists) {
    res.status(400);
    throw new Error('A source with that name already exists');
  }
  const source = await Source.create({
    user: req.user._id,
    name: cleanName,
    color: color || '#858796',
  });
  res.status(201).json(source);
});

export const deleteSource = asyncHandler(async (req, res) => {
  const source = await Source.findOne({ _id: req.params.id, user: req.user._id });
  if (!source) {
    res.status(404);
    throw new Error('Source not found');
  }
  const inUse = await Task.countDocuments({ user: req.user._id, source: source.name });
  if (inUse > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete "${source.name}" — ${inUse} task${inUse !== 1 ? 's' : ''} still use this source. Reassign or delete those tasks first.`
    );
  }
  await source.deleteOne();
  res.json({ message: 'Source deleted' });
});
