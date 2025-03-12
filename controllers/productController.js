const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await getDB().collection('products').find().toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const product = await getDB().collection('products').findOne({ _id: new ObjectId(id) });
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { title, price, price_sale, description, detail, alias, quantity, image, productId, product_categoryId } = req.body;
        if (!title || !price || !productId || !product_categoryId) return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        const result = await getDB().collection('products').insertOne({
            title, price, price_sale, description, detail, alias, created_at: new Date(), quantity, image, productId, product_categoryId
        });
        res.status(201).json({ message: 'Thêm sản phẩm thành công', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo sản phẩm', error });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật sản phẩm', error });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('products').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa sản phẩm', error });
    }
};