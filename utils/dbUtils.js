import User from '../models/User.js';
 
export const getUsernameById = async (userId) => {
  try {
    const user = await User.findById(userId, 'username'); // Only fetch the username field
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    // console.log(user);
    return user.username;
  } catch (error) {
    throw new Error(`Error fetching username: ${error.message}`);
  }
}; 
