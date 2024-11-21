const productService = require('../services/productService'); // Service xử lý logic về sản phẩm

// Lấy sản phẩm đã lọc (thực hiện qua AJAX)
const getAllProducts = async (filters = {}, page = 1, limit = 6) => {
  try {
    const { products, totalPages } = await productService.getProducts(
      filters,
      page,
      limit
    );
    return { products, totalPages }; // Trả về sản phẩm và tổng số trang
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving products');
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
