const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const path = require('path');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

app.use(express.json());
const cors = require("cors");
app.use(cors({
    origin: "*", // Chấp nhận mọi domain (Dùng khi test)
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public/views/admin')));

// Import routes
const productCategoryRoutes = require('./routes/productCategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const newsRoutes = require('./routes/newsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userAccountRoutes = require('./routes/userAccountRoutes');

// Use routes
app.use('/api/product-categories', productCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/accounts', userAccountRoutes);

// Route để mở trang layout_admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/views/layout_admin.html'));
});

/// Route cho layout_user với trang chủ mặc định là home
app.get('/', (req, res) => {
    res.render('layout_user', {
        title: 'Trang Chủ',
        page: 'customer/home/index',
        cssFiles: ['styles.css']
    });
});

// Route cho trang home
app.get('/home', (req, res) => {
    res.render('layout_user', {
        title: 'Trang Chủ',
        page: 'customer/home/index',
        cssFiles: ['styles.css']
    });
});

app.get('/product', (req, res) => {
    res.render('layout_user', { 
        title: 'Sản Phẩm', 
        page: 'customer/product/index',
        cssFiles: ['styles.css', 'product.css']  // Sử dụng cả hai file CSS
    });
});

app.get('/news', (req, res) => {
    res.render('layout_user', { 
        title: 'Tin tức', 
        page: 'customer/news/index',
        cssFiles: ['styles.css', 'news.css']  // Sử dụng cả hai file CSS
    });
});

app.get('/cart', (req, res) => {
    res.render('layout_user', { 
        title: 'Giỏ hàng', 
        page: 'customer/cart/index',
        cssFiles: ['styles.css', 'cart.css']  // Sử dụng cả hai file CSS
    });
});

app.get('/contact', (req, res) => {
    res.render('layout_user', { 
        title: 'Liên hệ', 
        page: 'customer/contact/index',
        cssFiles: ['styles.css', 'contact.css']  // Sử dụng cả hai file CSS
    });
});

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Máy chủ đang chạy trên http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Không khởi động được máy chủ:', error);
});