const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

// Lấy tất cả danh mục sản phẩm
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await getDB().collection('product_categories').find().toArray();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục', error });
    }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const category = await getDB().collection('product_categories').findOne({ _id: new ObjectId(id) });
        if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục', error });
    }
};

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
    try {
        const { name, alias, product_categoryId } = req.body;
        if (!name || !alias || !product_categoryId) {
            return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        }

        const result = await getDB().collection('product_categories').insertOne({ name, alias, product_categoryId });
        res.status(201).json({ message: 'Thêm danh mục thành công', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo danh mục', error });
    }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const result = await getDB().collection('product_categories').updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );

        if (result.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

        res.json({ message: 'Cập nhật thành công', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error });
    }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const result = await getDB().collection('product_categories').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

        res.json({ message: 'Xóa thành công', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa danh mục', error });
    }
};
