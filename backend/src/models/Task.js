import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    source: {
      type: String,
      enum: ['college', 'internship', 'personal', 'other'],
      default: 'personal',
    },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    completed: { type: Boolean, default: false },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Task', taskSchema);
