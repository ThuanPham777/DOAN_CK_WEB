const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController'); // Đường dẫn đến viewController
const authController = require('../controllers/authController');

// Route Home
router.get('/', authController.isLoggedIn, viewController.getHome);

// Route About
router.get('/about', authController.isLoggedIn, viewController.getAbout);

router.get('/contact', authController.isLoggedIn, viewController.getContact);

// Route Login
router.get('/login', authController.isLoggedIn, viewController.getLogin);

// Route Signup
router.get('/signup', authController.isLoggedIn, viewController.getSignup);

// Route Shop - Hiển thị danh sách sản phẩm
router.get(
  '/shop',
  authController.isLoggedIn,
  viewController.getAllProductsView
);

// Route Chi tiết sản phẩm
router.get(
  '/shop/:id',
  authController.isLoggedIn,
  viewController.getProductDetail
);

module.exports = router;
