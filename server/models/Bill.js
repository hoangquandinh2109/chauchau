import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paid: { type: Boolean, default: false }
});

const billSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transferInfo: String,
  participants: [participantSchema]
}, { timestamps: true });

export default mongoose.model('Bill', billSchema);
