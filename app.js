const express = require('express');
const fs = require('fs');
const viewRoutes = require('./routes/viewRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');
const Product = require('./models/productModel'); // Import model Product
const User = require('./models/userModel');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

const app = express();
app.use(expressLayouts);
app.use(express.static('public'));

// Cấu hình EJS
app.set('view engine', 'ejs'); // Sử dụng EJS làm template engine
app.set('views', './views'); // Thư mục chứa các file EJS
// Set default layout
app.set('layout', './layouts/main');

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Kết nối MongoDB và thêm dữ liệu mẫu
connectDB()
  .then(async () => {
    try {
      // Thêm dữ liệu để test
      const countProduct = await Product.countDocuments({});
      if (countProduct === 0) {
        const data = JSON.parse(
          fs.readFileSync('./data/products.json', 'utf-8')
        );
        await Product.insertMany(data);
        console.log('Sample products data inserted');
      }

      const countUser = await User.countDocuments({});
      if (countUser === 0) {
        const data = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
        await User.insertMany(data);
        console.log('Sample users data inserted');
      }
    } catch (err) {
      console.error('Error inserting sample data:', err);
    }
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// Định tuyến
// app.use('/api', productRoutes);
// app.use('/api/users', userRoutes);
app.use('/', viewRoutes);
app.use('/api/product', productRoutes); // Thêm route shop từ productRoutes
app.use('/api/auth', userRoutes);

module.exports = app;
