const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
} = require('../controllers/productController'); // Import controller

router.get('/', getAllProducts); // Khi truy cập /shop, gọi hàm getAllProducts trong controller
router.get('/:id', getProductById);

module.exports = router;
