import express from 'express';
import { addAgent, getUserAgents, deleteAgent } from '../controllers/agentController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Middleware for authentication

const router = express.Router();

router.post('/', protect, addAgent); // Add an agent
// router.get('/', protect, getUserAgents); // Get all agents for the user
router.get('/', getUserAgents); // Get all agents for the user
router.delete('/:id', protect, deleteAgent); // Delete an agent by ID

export default router;
