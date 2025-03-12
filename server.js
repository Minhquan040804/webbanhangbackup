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
const orderDetailRoutes = require('./routes/orderDetailRoutes');
const roleRoutes = require('./routes/roleRoutes');
const accountRoutes = require('./routes/accountRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/product-categories', productCategoryRoutes);
app.use('/products', productRoutes);
app.use('/news', newsRoutes);
app.use('/orders', orderRoutes);
app.use('/order-details', orderDetailRoutes);
app.use('/roles', roleRoutes);
app.use('/accounts', accountRoutes);
app.use('/users', userRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Máy chủ đang chạy trên http://localhost:${port}`);
    });
}).catch(error => {
    console.error('❌ Không khởi động được máy chủ:', error);
});