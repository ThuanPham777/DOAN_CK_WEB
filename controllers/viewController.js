const productController = require('../controllers/productController');
const productService = require('../services/productService');

const categories = [
  { name: 'Sofa', image: '/img/Category/images/01.svg' },
  { name: 'TV Cabinet', image: '/img/Category/images/02.svg' },
  { name: 'Dining', image: '/img/Category/images/03.svg' },
  { name: 'Wordrobe', image: '/img/Category/images/04.svg' },
  { name: 'Bed', image: '/img/Category/images/05.svg' },
  { name: 'Dressing Table', image: '/img/Category/images/06.svg' },
  { name: 'Door', image: '/img/Category/images/07.svg' },
  { name: 'Divan', image: '/img/Category/images/08.svg' },
  { name: 'Office', image: '/img/Category/images/09.svg' },
  { name: 'Kitchen', image: '/img/Category/images/10.svg' },
  { name: 'Lamp', image: '/img/Category/images/11.svg' },
  { name: 'Reading Table', image: '/img/Category/images/12.svg' },
  { name: 'Mattress', image: '/img/Category/images/13.svg' },
  { name: 'Chest Drawers', image: '/img/Category/images/14.svg' },
  { name: 'Windows', image: '/img/Category/images/15.svg' },
  { name: 'Miscellaneous', image: '/img/Category/images/16.svg' },
];

const heroSlider = [
  {
    id: 1,
    title: 'Discover Our Latest Collection',
    subtitle: 'Elevate Your Living Space with Our New Arrivals',
    image: '/img/Hero_Slider/images/01.jpg',
    link: '/new-arrivals',
    buttonText: 'Shop Now',
  },
  {
    id: 2,
    title: 'Summer Sale',
    subtitle: 'Up to 50% Off on Selected Items',
    image: '/img/Hero_Slider/images/02.jpg',
    link: '/sale',
    buttonText: 'Grab the Deal',
  },
  {
    id: 3,
    title: 'Comfort & Style',
    subtitle: 'Experience the Perfect Blend of Comfort and Elegance',
    image: '/img/Hero_Slider/images/03.jpg',
    link: '/comfort-style',
    buttonText: 'Explore Collection',
  },
  {
    id: 4,
    title: 'Outdoor Furniture',
    subtitle: 'Create Your Ideal Outdoor Space',
    image: '/img/Hero_Slider/images/04.jpg',
    link: '/outdoor',
    buttonText: 'Shop Outdoor',
  },
  {
    id: 5,
    title: 'Exclusive Offers',
    subtitle: 'Members-Only Deals and Discounts',
    image: '/img/Hero_Slider/images/05.jpg',
    link: '/exclusive-offers',
    buttonText: 'Become a Member',
  },
];
// Trang chủ
exports.getHome = async (req, res) => {
  const products = await productService.getProducts();
  res.render('Home', { categories, heroSlider, products }); // Render trang Home
};

// Trang About
exports.getAbout = (req, res) => {
  res.render('About', {
    coreValues: [
      {
        title: 'Quality Craftsmanship',
        description:
          'Each piece is carefully crafted by skilled artisans using premium materials.',
      },
      {
        title: 'Timeless Designs',
        description: 'Our furniture blends classic styles with a modern touch.',
      },
      {
        title: 'Sustainable Sourcing',
        description:
          'We source responsibly, with an emphasis on eco-friendly practices.',
      },
    ],
    mission:
      'Our mission is to provide our customers with exceptional furniture pieces that not only elevate their homes but also reflect their personal styles. We strive to offer unique, high-quality products that are both affordable and sustainable.',
    testimonials: [
      {
        quote:
          "I bought a dining table from this shop and couldn't be happier! Excellent quality and beautiful design.",
        author: 'Jane D.',
      },
      {
        quote:
          'Great customer service and a fantastic range of furniture. I highly recommend!',
        author: 'Mark S.',
      },
      {
        quote:
          'The furniture I bought exceeded my expectations. Eco-friendly and stylish!',
        author: 'Sarah L.',
      },
    ],
    teamMembers: [
      {
        name: 'John Doe',
        role: 'Founder & Designer',
        image: '/img/TeamMembers/Member1.jpg',
      },
      {
        name: 'Jane Smith',
        role: 'Head of Sales',
        image: '/img/TeamMembers/Member2.jpg',
      },
      {
        name: 'Emily Brown',
        role: 'Customer Support',
        image: '/img/TeamMembers/Member3.jpg',
      },
    ],
  }); // Render trang About với title
};

exports.getContact = async (req, res) => {
  res.render('contact', { formActionUrl: '/submit-contact-form' });
};
// Trang Login
exports.getLogin = (req, res) => {
  res.render('Auth/Login'); // Render trang Login
};

// Trang Signup
exports.getSignup = (req, res) => {
  res.render('Auth/Signup'); // Render trang Signup
};

// viewController.js
// viewController.js
exports.getAllProducts = async (req, res, next) => {
  try {
    // Lấy bộ lọc từ query string
    const filters = req.query;

    let sortOption = req.query.sort || '';

    // Lấy sản phẩm đã lọc dựa trên bộ lọc
    const products = await productService.getProducts(filters, sortOption); // Truyền filters vào service để lọc sản phẩm

    // Render trang với sản phẩm và bộ lọc
    res.render('Shop/Shop', { products, filters, sortOption: req.query });
  } catch (err) {
    res.status(500).send('Server error'); // Gửi lỗi 500 nếu có lỗi xảy ra
  }
};

// Trang chi tiết sản phẩm
exports.getProductDetail = async (req, res) => {
  try {
    const products = await productService.getProducts();
    const product = await productService.getProductById(req.params.id); // Lấy sản phẩm dựa trên ID
    if (!product) return res.status(404).send('Product not found'); // Xử lý nếu không tìm thấy sản phẩm
    res.render('Shop/ShopDetail', { product, products }); // Render trang chi tiết sản phẩm
  } catch (err) {
    res.status(500).send('Server error'); // Xử lý lỗi server
  }
};
