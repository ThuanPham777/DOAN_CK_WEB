const productService = require('../services/productService'); // Service xử lý logic về sản phẩm

// Lấy sản phẩm đã lọc (thực hiện qua AJAX)
const getAllProducts = async (req, res) => {
  const filters = req.query; // Nhận các bộ lọc từ query parameters

  try {
    // Sử dụng productService để lấy các sản phẩm đã lọc
    const products = await productService.getProducts(filters);

    // Trả về dữ liệu sản phẩm dưới dạng JSON
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy thông tin sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productService.getProductById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};
