import mongoose from 'mongoose';

const plannerItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    bucket: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    assignedTo: { type: String, default: 'You' },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('PlannerItem', plannerItemSchema);
