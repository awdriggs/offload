import User from '../models/User.js';

export const status = async (req, res) => {
  // const { id, status, output } = req.body;
  
  console.log(req.body);

  return res.status(201).json({ message: 'received' });
}
