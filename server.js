const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Import routes
const productCategoryRoutes = require('./routes/productCategoryRoutes');

// Sử dụng routes
app.use('/product-categories', productCategoryRoutes);

// Kết nối DB và chạy server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('❌ Failed to start server:', error);
});
