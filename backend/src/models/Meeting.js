import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    organizer: { type: String, default: '' },
    time: { type: Date, required: true },
    duration: { type: String, default: '30 min' },
    recurring: { type: Boolean, default: false },
    channel: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Meeting', meetingSchema);
