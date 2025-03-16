const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const path = require('path');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
const cors = require("cors");
app.use(cors()); // Cho phép tất cả nguồn truy cập API

app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/accounts', userAccountRoutes);

// Route để mở trang layout_admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/layout_admin.html'));
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Máy chủ đang chạy trên http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Không khởi động được máy chủ:', error);
});