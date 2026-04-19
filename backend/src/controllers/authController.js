import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Source from '../models/Source.js';

const DEFAULT_SOURCES = [
  { name: 'college', color: '#4e73df' },
  { name: 'internship', color: '#1cc88a' },
  { name: 'personal', color: '#f6c23e' },
];

async function ensureDefaultSources(userId) {
  const count = await Source.countDocuments({ user: userId });
  if (count === 0) {
    await Source.insertMany(DEFAULT_SOURCES.map((s) => ({ ...s, user: userId })));
  }
}

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('All fields required');
  }
  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });
  await ensureDefaultSources(user._id);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    await ensureDefaultSources(user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

export const getPreferences = asyncHandler(async (req, res) => {
  res.json({
    emailReminders: req.user.emailReminders,
    reminderEmail: req.user.reminderEmail,
    reminderLeadMinutes: req.user.reminderLeadMinutes,
  });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const { emailReminders, reminderEmail, reminderLeadMinutes } = req.body;
  const user = await User.findById(req.user._id);
  if (emailReminders !== undefined) user.emailReminders = !!emailReminders;
  if (reminderEmail !== undefined) user.reminderEmail = reminderEmail;
  if (reminderLeadMinutes !== undefined) user.reminderLeadMinutes = Number(reminderLeadMinutes);
  await user.save();
  res.json({
    emailReminders: user.emailReminders,
    reminderEmail: user.reminderEmail,
    reminderLeadMinutes: user.reminderLeadMinutes,
  });
});
