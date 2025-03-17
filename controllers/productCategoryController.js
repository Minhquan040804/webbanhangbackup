const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const slugify = require('slugify');


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
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const category = await getDB().collection('product_categories').findOne({ _id: new ObjectId(id) });
        if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh mục', error });
    }
};

// Thêm danh mục mới (kiểm tra trùng tên)
exports.createCategory = async (req, res) => {
    try {
        const { name, alias } = req.body;
        if (!name) return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào: name' });

        // Tạo alias tự động nếu không có hoặc rỗng
        const computedAlias = (!alias || alias.trim() === '') 
                              ? slugify(name, { lower: true, strict: false, locale: 'vi' }) 
                              : alias;

        const db = getDB();
        
        // Kiểm tra xem danh mục đã tồn tại chưa (theo tên)
        const existingCategory = await db.collection('product_categories').findOne({ name });
        if (existingCategory) return res.status(400).json({ message: 'Danh mục đã tồn tại' });

        const result = await db.collection('product_categories').insertOne({ name, alias: computedAlias });
        res.status(201).json({ message: 'Thêm danh mục thành công', data: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo danh mục', error });
    }
};


// Cập nhật danh mục (kiểm tra trùng tên)
exports.updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const { name, alias } = req.body;
        if (!name) return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào: name' });

        // Tạo alias tự động nếu không có hoặc rỗng
        const computedAlias = (!alias || alias.trim() === '') 
                              ? slugify(name, { lower: true, strict: false, locale: 'vi' }) 
                              : alias;

        const db = getDB();

        // Kiểm tra xem danh mục có tồn tại không
        const existingCategory = await db.collection('product_categories').findOne({ _id: new ObjectId(id) });
        if (!existingCategory) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

        // Kiểm tra xem tên danh mục đã tồn tại chưa (trừ chính nó)
        const duplicateCategory = await db.collection('product_categories').findOne({ 
            name, 
            _id: { $ne: new ObjectId(id) } 
        });
        if (duplicateCategory) return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });

        await db.collection('product_categories').updateOne(
            { _id: new ObjectId(id) },
            { $set: { name, alias: computedAlias } }
        );

        res.json({ message: 'Cập nhật danh mục thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error });
    }
};


// Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });

        const result = await getDB().collection('product_categories').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa danh mục', error });
    }
};
