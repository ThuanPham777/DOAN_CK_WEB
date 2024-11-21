const {
  signupService,
  loginService,
  createSendTokenRequest,
  logoutService,
  verifyToken,
  checkPasswordChanged,
} = require('../services/authService');
const { getUserByIdService } = require('../services/userService');
const AppError = require('../utils/appError');
const { promisify } = require('util'); // Import promisify
const jwt = require('jsonwebtoken'); // Import jsonwebtoken

exports.signup = async (req, res, next) => {
  try {
    // Delegate to signupService to handle the logic
    const newUser = await signupService(req);

    // Send token and response
    createSendTokenRequest(newUser, 201, res);
  } catch (error) {
    console.error('Error in signup:', error);
    next(new AppError('Failed to sign up. Please try again later.', 500));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  try {
    // Delegate to loginService to handle authentication
    const { error, user } = await loginService(email, password);

    if (error) {
      return next(new AppError(error, 401));
    }

    // Send token and response
    createSendTokenRequest(user, 200, res);
  } catch (error) {
    console.error('Error in login:', error);
    next(new AppError('Failed to login. Please try again later.', 500));
  }
};

exports.logout = (req, res) => {
  try {
    // Call the logoutService to clear the cookie
    logoutService(res);

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log out. Please try again later.',
    });
  }
};

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  //1) Getting token and checking if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Verify the token using the service function
  const decoded = await verifyToken(token);
  console.log(decoded);
  console.log('decoded', decoded.id);

  // 3) Check if user exists
  const currentUser = await getUserByIdService(decoded.id);

  // 4) Check if the user changed their password after the token was issued
  checkPasswordChanged(currentUser, decoded.iat);

  // Grant access to the protected route
  req.user = currentUser;

  res.locals.user = currentUser;
  console.log(currentUser);
  next();
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      console.log('Decoded JWT:', decoded);

      // 2) Check if user still exists
      const currentUser = await getUserByIdService(decoded.id);
      console.log('Fetched User:', currentUser);

      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      console.log('User is logged in:', currentUser);

      return next();
    } catch (err) {
      console.error('Error during JWT verification:', err);
      return next();
    }
  }
  next();
};
