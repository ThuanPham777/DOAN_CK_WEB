const { getUserByIdService } = require('../services/userService');

exports.getUserById = async (req, res) => {
  const { id } = req.params; // Extract user ID from the route parameters

  try {
    // Call the service function to get the user by ID
    const user = await getUserByIdService(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the user data as response
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
