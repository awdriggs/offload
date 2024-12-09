import mongoose from 'mongoose';

// Utility to generate a random string
const generateTriggerWord = (length) => {
  return Array.from({ length }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
};

// Define the schema for the "Agent" collection
const agentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trigger: { type: String, required: true, default: () => generateTriggerWord(10) },
  createdAt: { type: Date, default: Date.now },
});

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;


