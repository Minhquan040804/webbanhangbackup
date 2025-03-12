const { ObjectId } = require('mongodb');
const getDB = require('../db');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await getDB().collection('products').find().toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const product = await getDB().collection('products').findOne({ _id: new ObjectId(id) });
        if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { title, price, price_sale, description, detail, alias, quantity, image, productId, product_categoryId } = req.body;
        if (!title || !price || !product_categoryId) return res.status(400).json({ message: 'Thiếu dữ liệu' });

        // Kiểm tra danh mục có tồn tại không
        const category = await getDB().collection('product_categories').findOne({ _id: new ObjectId(String(product_categoryId)) });
        if (!category) return res.status(400).json({ message: 'Danh mục không tồn tại' });

        const newProduct = {
            title,
            price,
            price_sale: price_sale || 0,
            description: description || '',
            detail: detail || '',
            alias,
            quantity: quantity || 0,
            image: image || '',
            productId: productId || '',
            product_categoryId: new (String(product_categoryId)),
            created_at: new Date()
        };

        const result = await getDB().collection('products').insertOne(newProduct);
        res.status(201).json({ message: 'Thêm sản phẩm thành công', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const { title, price, price_sale, description, detail, alias, quantity, image, product_categoryId } = req.body;

        // Nếu có truyền product_categoryId thì kiểm tra danh mục có tồn tại không
        if (product_categoryId) {
            const category = await getDB().collection('product_categories').findOne({ _id: new ObjectId(String(product_categoryId)) });
            if (!category) return res.status(400).json({ message: 'Danh mục không tồn tại' });
        }

        const updateFields = {
            ...(title && { title }),
            ...(price && { price }),
            ...(price_sale !== undefined && { price_sale }),
            ...(description && { description }),
            ...(detail && { detail }),
            ...(alias && { alias }),
            ...(quantity !== undefined && { quantity }),
            ...(image && { image }),
            ...(product_categoryId && { product_categoryId: new ObjectId(String(product_categoryId)) })
        };

        const result = await getDB().collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });

        res.json({ message: 'Cập nhật sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const result = await getDB().collection('products').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
