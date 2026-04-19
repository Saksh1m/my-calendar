import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, lowercase: true },
    color: { type: String, default: '#858796' },
  },
  { timestamps: true }
);

sourceSchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model('Source', sourceSchema);
