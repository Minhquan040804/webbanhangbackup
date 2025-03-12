const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

exports.getAllNews = async (req, res) => {
    try {
        const news = await getDB().collection('news').find().toArray();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy tin tức', error });
    }
};

exports.getNewsById = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const news = await getDB().collection('news').findOne({ _id: new ObjectId(id) });
        if (!news) return res.status(404).json({ message: 'Không tìm thấy tin tức' });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy tin tức', error });
    }
};

exports.createNews = async (req, res) => {
    try {
        const { title, alias, description, detail, image } = req.body;
        if (!title || !alias) return res.status(400).json({ message: 'Thiếu dữ liệu đầu vào' });
        const result = await getDB().collection('news').insertOne({
            title, alias, description, detail, image, created_at: new Date()
        });
        res.status(201).json({ message: 'Thêm tin tức thành công', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo tin tức', error });
    }
};

exports.updateNews = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('news').updateOne(
            { _id: new ObjectId(id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) return res.status(404).json({ message: 'Không tìm thấy tin tức' });
        res.json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật tin tức', error });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const id = String(req.params.id);
        if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'ID không hợp lệ' });
        const result = await getDB().collection('news').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy tin tức' });
        res.json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa tin tức', error });
    }
};