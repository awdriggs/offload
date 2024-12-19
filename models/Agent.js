import mongoose from 'mongoose';

// Utility to generate a random string
const generateTriggerWord = (length) => {
  return Array.from({ length }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('');
};

// Define the schema for the "Agent" collection
// need a place for the trained image url
const agentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trigger: { type: String, required: true, default: () => generateTriggerWord(10) },
  modelName: { type: String, required: true },
  modelDesc: { type: String, required: true },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Validate the URL using a regular expression
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlRegex.test(value);
      },
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Agent = mongoose.model('Agent', agentSchema);

export default Agent;


