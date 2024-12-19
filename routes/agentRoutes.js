import express from 'express';
import { trainAgent, getUserAgents, deleteAgent, getAgent } from '../controllers/agentController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Middleware for authentication

const router = express.Router();

router.post('/train', protect, trainAgent); // Add an agent
router.get('/:id', protect, getAgent); // get a single agent
router.get('/', protect, getUserAgents); // Get all agents for the user
router.delete('/:id', protect, deleteAgent); // Delete an agent by ID

export default router;
