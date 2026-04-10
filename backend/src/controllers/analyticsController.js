import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';

export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const tasks = await Task.find({ user: userId });

  const sourceDistribution = ['college', 'internship', 'personal', 'other'].map((s) => ({
    name: s,
    value: tasks.filter((t) => t.source === s).length,
  }));

  const priorityDistribution = ['high', 'medium', 'low'].map((p) => ({
    name: p,
    value: tasks.filter((t) => t.priority === p).length,
  }));

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyProgress = days.map((day, i) => {
    const dayStart = new Date(startOfWeek);
    dayStart.setDate(startOfWeek.getDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    return {
      day,
      added: tasks.filter((t) => t.createdAt >= dayStart && t.createdAt < dayEnd).length,
      completed: tasks.filter(
        (t) => t.completed && t.updatedAt >= dayStart && t.updatedAt < dayEnd
      ).length,
    };
  });

  res.json({
    totals: {
      total: tasks.length,
      completed: tasks.filter((t) => t.completed).length,
      pending: tasks.filter((t) => !t.completed).length,
    },
    sourceDistribution,
    priorityDistribution,
    weeklyProgress,
  });
});
