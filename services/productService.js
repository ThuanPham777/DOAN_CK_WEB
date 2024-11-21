const Product = require('../models/productModel');
const getProducts = async (filters = {}, sortOption = {}) => {
  try {
    const filterConditions = {};

    if (filters.price) {
      const priceRange = filters.price;
      switch (priceRange) {
        case '$0-$100':
          filterConditions.price = { $gte: 0, $lte: 100 };
          break;
        case '$100-$200':
          filterConditions.price = { $gte: 100, $lte: 200 };
          break;
        case '$200-$300':
          filterConditions.price = { $gte: 200, $lte: 300 };
          break;
        case 'over $300':
          filterConditions.price = { $gte: 300 };
          break;
        default:
          break;
      }
    }

    if (filters.category) {
      filterConditions.category = {
        $in: Array.isArray(filters.category)
          ? filters.category
          : [filters.category],
      };
    }

    if (filters.manufacturer) {
      filterConditions.manufacturer = {
        $in: Array.isArray(filters.manufacturer)
          ? filters.manufacturer
          : [filters.manufacturer],
      };
    }

    if (filters.material) {
      filterConditions.material = {
        $in: Array.isArray(filters.material)
          ? filters.material
          : [filters.material],
      };
    }

    let sortQuery = {};
    // Apply sorting based on the 'sort' query parameter
    if (sortOption === 'price-asc') {
      sortQuery = { price: 1 };
    } else if (sortOption === 'price-desc') {
      sortQuery = { price: -1 };
    } else if (sortOption === 'name-asc') {
      sortQuery = { name: 1 };
    } else if (sortOption === 'name-desc') {
      sortQuery = { name: -1 };
    } else if (sortOption === 'createdAt-asc') {
      sortQuery = { createdAt: 1 }; // Old to new
    } else if (sortOption === 'createdAt-desc') {
      sortQuery = { createdAt: -1 }; // New to old
    }

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
