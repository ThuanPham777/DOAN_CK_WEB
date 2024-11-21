const User = require('../models/userModel');

exports.getUserByIdService = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error(error);
  }
};

exports.updateUserProfileService = async () => {
  // Implement the logic to update user profile
};
