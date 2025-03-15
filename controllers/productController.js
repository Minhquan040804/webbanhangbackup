const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const products = await getDB().collection('products').find().toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error });
    }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const product = await getDB().collection('products').findOne({ _id: new ObjectId(id) });
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error });
    }
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const { title, price, price_sale, description, detail, alias, quantity, image, productId, product_categoryId } = req.body;
        
        if (!title || !price || !product_categoryId) {
            return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        }

        if (!ObjectId.isValid(product_categoryId)) {
            return res.status(400).json({ message: 'ID danh mục không hợp lệ' });
        }

        // Kiểm tra danh mục có tồn tại không
        const categoryExists = await getDB().collection('product_categories').findOne({ _id: new ObjectId(product_categoryId) });
        if (!categoryExists) {
            return res.status(400).json({ message: 'Danh mục không tồn tại' });
        }

        const newProduct = {
            title, price, price_sale, description, detail, alias,
            created_at: new Date(),
            quantity, image, productId,
            product_categoryId: new ObjectId(product_categoryId)
        };

        const result = await getDB().collection('products').insertOne(newProduct);
        res.status(201).json({ message: 'Thêm sản phẩm thành công', data: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thêm sản phẩm', error });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const updateData = { ...req.body };

        if (updateData.product_categoryId) {
            if (!ObjectId.isValid(updateData.product_categoryId)) {
                return res.status(400).json({ message: 'ID danh mục không hợp lệ' });
            }

            const categoryExists = await getDB().collection('product_categories').findOne({ _id: new ObjectId(updateData.product_categoryId) });
            if (!categoryExists) {
                return res.status(400).json({ message: 'Danh mục không tồn tại' });
            }
            updateData.product_categoryId = new ObjectId(updateData.product_categoryId);
        }

        const result = await getDB().collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        res.json({ message: 'Cập nhật sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const result = await getDB().collection('products').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
    }
};
