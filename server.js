const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Import routes
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const newsRoutes = require('./routes/newsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userAccountRoutes = require('./routes/userAccountRoutes');

// Use routes
app.use('/product-categories', productCategoryRoutes);
app.use('/products', productRoutes);
app.use('/news', newsRoutes);
app.use('/orders', orderRoutes);
app.use('/roles', roleRoutes);
app.use('/accounts', userAccountRoutes); // Thêm tuyến đường quản lý account & user

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Máy chủ đang chạy trên http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Không khởi động được máy chủ:', error);
});