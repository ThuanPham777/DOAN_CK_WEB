const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and send a token to the client
const createSendTokenRequest = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

// Signup service
exports.signupService = async (req) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  return newUser;
};

// Login service
exports.loginService = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  //if (!user) return { error: 'Incorrect email or password', user: null };

  const correct = await user.correctPassword(password, user.password);
  if (!correct) return { error: 'Incorrect email or password', user: null };

  return { error: null, user };
};

// Logout service
exports.logoutService = (res) => {
  // Clear the cookie by setting a dummy token with immediate expiration
  res.cookie('jwt', 'logged-out', {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true,
  });
};

// verify the token
exports.verifyToken = async (token) => {
  try {
    // Sử dụng async/await trực tiếp với jwt.verify
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new AppError('Invalid or expired token', 401);
  }
};

exports.checkPasswordChanged = (user, tokenIssuedAt) => {
  if (user.changedPasswordAfter(tokenIssuedAt)) {
    throw new AppError(
      'User recently changed password! Please log in again',
      401
    );
  }
};

// Export token generator for reuse if needed
exports.createSendTokenRequest = createSendTokenRequest;
