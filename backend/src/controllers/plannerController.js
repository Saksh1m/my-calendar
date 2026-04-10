import asyncHandler from 'express-async-handler';
import PlannerItem from '../models/PlannerItem.js';

export const getPlannerItems = asyncHandler(async (req, res) => {
  const items = await PlannerItem.find({ user: req.user._id }).sort({ dueDate: 1 });
  res.json(items);
});

export const createPlannerItem = asyncHandler(async (req, res) => {
  const item = await PlannerItem.create({ ...req.body, user: req.user._id });
  res.status(201).json(item);
});

export const updatePlannerItem = asyncHandler(async (req, res) => {
  const item = await PlannerItem.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) {
    res.status(404);
    throw new Error('Planner item not found');
  }
  res.json(item);
});

export const deletePlannerItem = asyncHandler(async (req, res) => {
  const item = await PlannerItem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!item) {
    res.status(404);
    throw new Error('Planner item not found');
  }
  res.json({ message: 'Planner item deleted' });
});
