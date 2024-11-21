const Product = require('../models/productModel');
const getProducts = async (filters = {}) => {
  try {
    const filterConditions = {};

    // Price Filter (minPrice and maxPrice)
    if (filters.minPrice || filters.maxPrice) {
      const priceConditions = {};

      if (filters.minPrice) {
        priceConditions.$gte = Number(filters.minPrice); // Giá lớn hơn hoặc bằng minPrice
      }
      if (filters.maxPrice) {
        priceConditions.$lte = Number(filters.maxPrice); // Giá nhỏ hơn hoặc bằng maxPrice
      }

      // Nếu có điều kiện giá, thêm vào filterConditions
      if (Object.keys(priceConditions).length > 0) {
        filterConditions.price = priceConditions;
      }
    }

    // Category Filter
    if (filters.category) {
      filterConditions.category = {
        $in: Array.isArray(filters.category)
          ? filters.category
          : [filters.category],
      };
    }

    // Manufacturer Filter
    if (filters.manufacturer) {
      filterConditions.manufacturer = {
        $in: Array.isArray(filters.manufacturer)
          ? filters.manufacturer
          : [filters.manufacturer],
      };
    }

    // Material Filter
    if (filters.material) {
      filterConditions.material = {
        $in: Array.isArray(filters.material)
          ? filters.material
          : [filters.material],
      };
    }

    // Search Keyword (now part of filters)
    if (filters.search) {
      console.log('search key: ', filters.search);
      filterConditions.$or = [
        { name: { $regex: filters.search, $options: 'i' } }, // Case-insensitive match in 'name'
        { description: { $regex: filters.search, $options: 'i' } }, // Case-insensitive match in 'description'
      ];
    }

    // Sorting (from filters)
    let sortQuery = {};
    if (filters.sort === 'price-asc') {
      sortQuery = { price: 1 };
    } else if (filters.sort === 'price-desc') {
      sortQuery = { price: -1 };
    } else if (filters.sort === 'name-asc') {
      sortQuery = { name: 1 };
    } else if (filters.sort === 'name-desc') {
      sortQuery = { name: -1 };
    } else if (filters.sort === 'createdAt-asc') {
      sortQuery = { createdAt: 1 }; // Old to new
    } else if (filters.sort === 'createdAt-desc') {
      sortQuery = { createdAt: -1 }; // New to old
    }

    // Fetch Products with filters and sorting
    const products = await Product.find(filterConditions).sort(sortQuery);
    return products;
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving products');
  }
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

module.exports = {
  getProducts,
  getProductById,
};
