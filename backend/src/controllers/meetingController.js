import asyncHandler from 'express-async-handler';
import Meeting from '../models/Meeting.js';

export const getMeetings = asyncHandler(async (req, res) => {
  const meetings = await Meeting.find({ user: req.user._id }).sort({ time: 1 });
  res.json(meetings);
});

export const createMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.create({ ...req.body, user: req.user._id });
  res.status(201).json(meeting);
});

export const updateMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }
  res.json(meeting);
});

export const deleteMeeting = asyncHandler(async (req, res) => {
  const meeting = await Meeting.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }
  res.json({ message: 'Meeting deleted' });
});
