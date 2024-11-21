const productService = require('../services/productService'); // Service xử lý logic về sản phẩm

// Lấy sản phẩm đã lọc (thực hiện qua AJAX)
const getAllProducts = async (filters = {}) => {
  try {
    const products = await productService.getProducts(filters);
    return products; // Trả về danh sách sản phẩm
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving products'); // Truyền lỗi lên viewController nếu có
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
