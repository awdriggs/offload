import Agent from '../models/Agent.js';
import User from '../models/User.js';

// Add a new agent
export const addAgent = async (req, res) => {
  const userId = req.user.id; // Assuming you use a middleware to add user info from the JWT

  try {
    const newAgent = await Agent.create({ user: userId });
    res.status(201).json({ message: 'Agent added', agent: newAgent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all agents for a user
export const getUserAgents = async (req, res) => {
  const userId = req.user.id; // Assuming you use a middleware to add user info from the JWT

  try {
    const agents = await Agent.find({ user: userId });
    res.status(200).json({ agents });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an agent
export const deleteAgent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const agent = await Agent.findOneAndDelete({ _id: id, user: userId });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json({ message: 'Agent deleted', agent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
